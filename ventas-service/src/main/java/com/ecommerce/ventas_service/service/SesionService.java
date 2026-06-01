package com.ecommerce.ventas_service.service;

import com.ecommerce.ventas_service.model.SesionUsuario;
import com.ecommerce.ventas_service.repository.SesionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SesionService {

    private final SesionRepository sesionRepository;

    public Mono<SesionUsuario> iniciarSesion(String usuario, String rol) {
        SesionUsuario sesion = new SesionUsuario();
        sesion.setUsuario(usuario);
        sesion.setRol(rol);
        sesion.setFechaIngreso(LocalDateTime.now());
        return sesionRepository.save(sesion);
    }

    public Mono<SesionUsuario> registrarAccion(String sesionId, String accion) {
        return sesionRepository.findById(sesionId)
            .flatMap(sesion -> {
                sesion.getAccionesRealizadas().add(accion);
                return sesionRepository.save(sesion);
            });
    }

    public Mono<SesionUsuario> cerrarSesion(String sesionId) {
        return sesionRepository.findById(sesionId)
            .flatMap(sesion -> {
                sesion.setFechaCierre(LocalDateTime.now());
                return sesionRepository.save(sesion);
            });
    }

    public Flux<SesionUsuario> obtenerSesiones() {
        return sesionRepository.findAll();
    }
}