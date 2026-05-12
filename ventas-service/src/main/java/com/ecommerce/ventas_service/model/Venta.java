package com.ecommerce.ventas_service.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("ventas")
public class Venta {

    @Id
    private Long id;
    private String producto;
    private int cantidad;
    private double precioUnitario;
    private double impuesto;
    private double descuento;
    private double total;
    private LocalDateTime fecha;
}