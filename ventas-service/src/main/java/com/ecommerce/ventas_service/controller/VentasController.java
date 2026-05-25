package com.ecommerce.ventas_service.controller;

import com.ecommerce.ventas_service.model.Venta;
import com.ecommerce.ventas_service.model.VentaLog;
import com.ecommerce.ventas_service.service.VentasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.Map;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
public class VentasController {

    private final VentasService ventasService;

    @GetMapping
    public Flux<Venta> obtenerTodas() {
        return ventasService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public Mono<Venta> obtenerPorId(@PathVariable Long id) {
        return ventasService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Venta> registrarVenta(@RequestBody Venta venta) {
        return ventasService.registrarVenta(venta);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> eliminarVenta(@PathVariable Long id) {
        return ventasService.eliminarVenta(id);
    }

    @GetMapping("/analytics/por-producto")
    public Flux<Map<String, Object>> ventasPorProducto() {
        return ventasService.ventasPorProducto();
    }

    @GetMapping("/logs")
    public Flux<VentaLog> obtenerLogs() {
        return ventasService.obtenerLogs();
    }
}