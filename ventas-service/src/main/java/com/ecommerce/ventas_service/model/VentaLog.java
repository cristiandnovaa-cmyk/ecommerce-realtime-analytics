package com.ecommerce.ventas_service.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ventas_log")
public class VentaLog {
    @Id
    private String id;
    private String producto;
    private int cantidad;
    private double total;
    private String estado;
    private LocalDateTime fecha;
}