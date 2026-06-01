package com.ecommerce.ventas_service.repository;

import com.ecommerce.ventas_service.model.SesionUsuario;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SesionRepository extends ReactiveMongoRepository<SesionUsuario, String> {
}