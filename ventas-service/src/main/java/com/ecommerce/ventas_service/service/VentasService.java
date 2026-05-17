package com.ecommerce.ventas_service.service;

import com.ecommerce.ventas_service.model.Venta;
import com.ecommerce.ventas_service.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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

    // Función para calcular impuesto (19% IVA) - programación funcional
    private final Function<Double, Double> calcularImpuesto = 
        precioBase -> precioBase * 0.19;

    // Función para calcular descuento - programación funcional
    private final Function<Double, Double> calcularDescuento = 
        precioBase -> precioBase * 0.10;

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

        return ventaRepository.save(venta);
    }

    public Mono<Void> eliminarVenta(Long id) {
        return ventaRepository.deleteById(id);
    }

    public Flux<Map<String, Object>> ventasPorProducto() {
        return ventaRepository.findAll()
            .groupBy(Venta::getProducto)
            .flatMap(group -> group.reduce(0.0, (acc, venta) -> acc + venta.getTotal())
                .map(total -> {
                    Map<String, Object> resultado = new HashMap<>();
                    resultado.put("producto", group.key());
                    resultado.put("totalVentas", total);
                    return resultado;
                }));
    }
}