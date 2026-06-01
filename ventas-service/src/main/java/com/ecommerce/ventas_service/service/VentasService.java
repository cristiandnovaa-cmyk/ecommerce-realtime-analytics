package com.ecommerce.ventas_service.service;

import com.ecommerce.ventas_service.model.Venta;
import com.ecommerce.ventas_service.model.VentaLog;
import com.ecommerce.ventas_service.repository.VentaRepository;
import com.ecommerce.ventas_service.repository.VentaLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.time.LocalDateTime;
import java.util.function.Function;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class VentasService {

    private final VentaRepository ventaRepository;
    private final VentaLogRepository ventaLogRepository;
    // Orientado a mensajes los microservicios se comunican mediante llamadas de HTTP reactivas con WebClient 4 Principio
    private final WebClient webClient = WebClient.create("http://localhost:8082");

    // Función para calcular impuesto (19% IVA) - programación funcional
    private final Function<Double, Double> calcularImpuesto = 
        precioBase -> precioBase * 0.19;

    // Función para calcular descuento - programación funcional
    private final Function<Double, Double> calcularDescuento = 
        precioBase -> precioBase * 0.10;
// No bloquea el hilo esperando la base de datos primer principio de la Programcion Reactiva : Responsivo
    public Flux<Venta> obtenerTodas() {
        return ventaRepository.findAll();
    }

    public Mono<Venta> obtenerPorId(Long id) {
        return ventaRepository.findById(id);
    }

    public Mono<Venta> registrarVenta(Venta venta) {
        double precioBase = venta.getPrecioUnitario() * venta.getCantidad();
        double impuesto = calcularImpuesto.apply(precioBase);
        double descuento = calcularDescuento.apply(precioBase);
        double total = precioBase + impuesto - descuento;

        venta.setImpuesto(impuesto);
        venta.setDescuento(descuento);
        venta.setTotal(total);
        venta.setFecha(LocalDateTime.now());

        return ventaRepository.save(venta)
            .flatMap(ventaGuardada -> {
                // Guardar log en MongoDB
                VentaLog log = new VentaLog();
                log.setProducto(ventaGuardada.getProducto());
                log.setCantidad(ventaGuardada.getCantidad());
                log.setTotal(ventaGuardada.getTotal());
                log.setEstado("COMPLETADA");
                log.setFecha(LocalDateTime.now());

                // Buscar producto en inventario por nombre y reducir stock
                Mono<Void> actualizarInventario = webClient.get()
                    .uri("/inventario")
                    .retrieve()
                    .bodyToFlux(Map.class)
                    .filter(p -> ventaGuardada.getProducto().equalsIgnoreCase((String) p.get("nombre")))
                    .next()
                    .flatMap(producto -> {
                        String idProducto = (String) producto.get("id");
                        return webClient.put()
                            .uri("/inventario/" + idProducto + "/stock?cantidad=" + ventaGuardada.getCantidad())
                            .retrieve()
                            .bodyToMono(Void.class);
                    })
// Si algo falla el sistema lo maneja sin caerse este es el segundo principio de la Programacion Reactiva : Resiliente                    
                    .onErrorResume(e -> Mono.empty());

                return ventaLogRepository.save(log)
                    .then(actualizarInventario)
                    .thenReturn(ventaGuardada);
            });
    }

    public Mono<Void> eliminarVenta(Long id) {
        return ventaRepository.deleteById(id);
    }

    public Flux<Map<String, Object>> ventasPorProducto() {
        // Usando el Flux el sistema procesa los datos a medida que llegan no todos de golpe este es el tercer principio de la Programacion Reactiva : Elasticidad
        return ventaRepository.findAll()
            .groupBy(v -> v.getProducto())
            .flatMap(group -> group.reduce(0.0, (acc, venta) -> acc + venta.getTotal())
                .map(total -> {
                    Map<String, Object> resultado = new HashMap<>();
                    resultado.put("producto", group.key());
                    resultado.put("totalVentas", total);
                    return resultado;
                }));
    }

    public Flux<VentaLog> obtenerLogs() {
        return ventaLogRepository.findAll();
    }
}