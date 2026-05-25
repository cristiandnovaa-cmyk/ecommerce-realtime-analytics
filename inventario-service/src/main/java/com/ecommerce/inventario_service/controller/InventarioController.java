package com.ecommerce.inventario_service.controller;

import com.ecommerce.inventario_service.model.Producto;
import com.ecommerce.inventario_service.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/inventario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventarioController {

    private final InventarioService inventarioService;

    @GetMapping
    public Flux<Producto> obtenerTodos() {
        return inventarioService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Mono<Producto> obtenerPorId(@PathVariable String id) {
        return inventarioService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Producto> guardarProducto(@RequestBody Producto producto) {
        return inventarioService.guardarProducto(producto);
    }

    @PutMapping("/{id}/stock")
    public Mono<Producto> actualizarStock(@PathVariable String id, @RequestParam int cantidad) {
        return inventarioService.actualizarStock(id, cantidad);
    }

    @PutMapping("/{id}/descuento")
    public Mono<Producto> aplicarDescuento(@PathVariable String id, @RequestParam double porcentaje) {
        return inventarioService.aplicarDescuento(id, porcentaje);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> eliminarProducto(@PathVariable String id) {
        return inventarioService.eliminarProducto(id);
    }
}