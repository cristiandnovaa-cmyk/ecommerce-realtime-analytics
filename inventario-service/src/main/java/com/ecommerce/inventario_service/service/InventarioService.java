package com.ecommerce.inventario_service.service;

import com.ecommerce.inventario_service.model.Producto;
import com.ecommerce.inventario_service.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class InventarioService {

    private final ProductoRepository productoRepository;

    private final Function<Double, Double> aplicarDescuento =
        precio -> precio * 0.90;

    public Flux<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    public Mono<Producto> obtenerPorId(String id) {
        return productoRepository.findById(id);
    }

    public Mono<Producto> guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public Mono<Producto> actualizarStock(String id, int cantidad) {
        return productoRepository.findById(id)
            .flatMap(producto -> {
                producto.setStock(producto.getStock() + cantidad); // ← corregido: + en lugar de -
                return productoRepository.save(producto);
            });
    }

    public Mono<Producto> aplicarDescuento(String id, double porcentaje) {
        return productoRepository.findById(id)
            .flatMap(producto -> {
                Function<Double, Double> descuento = precio -> precio * (1 - porcentaje / 100);
                producto.setPrecio(descuento.apply(producto.getPrecio()));
                return productoRepository.save(producto);
            });
    }

    public Mono<Void> eliminarProducto(String id) {
        return productoRepository.deleteById(id);
    }
}