package com.ecommerce.ventas_service.repository;

import com.ecommerce.ventas_service.model.VentaLog;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaLogRepository extends ReactiveMongoRepository<VentaLog, String> {
}