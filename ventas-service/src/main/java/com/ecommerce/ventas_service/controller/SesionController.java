package com.ecommerce.ventas_service.controller;

import com.ecommerce.ventas_service.model.SesionUsuario;
import com.ecommerce.ventas_service.service.SesionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.Map;

@RestController
@RequestMapping("/sesiones")
@RequiredArgsConstructor
public class SesionController {

    private final SesionService sesionService;

    @PostMapping("/iniciar")
    public Mono<SesionUsuario> iniciarSesion(@RequestBody Map<String, String> body) {
        return sesionService.iniciarSesion(
            body.get("usuario"),
            body.get("rol")
        );
    }

    @PutMapping("/{id}/accion")
    public Mono<SesionUsuario> registrarAccion(
        @PathVariable String id,
        @RequestBody Map<String, String> body) {
        return sesionService.registrarAccion(id, body.get("accion"));
    }

    @PutMapping("/{id}/cerrar")
    public Mono<SesionUsuario> cerrarSesion(@PathVariable String id) {
        return sesionService.cerrarSesion(id);
    }

    @GetMapping
    public Flux<SesionUsuario> obtenerSesiones() {
        return sesionService.obtenerSesiones();
    }
}