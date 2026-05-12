package com.ecommerce.ventas_service.repository;

import com.ecommerce.ventas_service.model.Venta;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaRepository extends ReactiveCrudRepository<Venta, Long> {
}