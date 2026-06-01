package com.ecommerce.ventas_service.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sesiones")
public class SesionUsuario {
    @Id
    private String id;
    private String usuario;
    private String rol;
    private LocalDateTime fechaIngreso;
    private LocalDateTime fechaCierre;
    private List<String> accionesRealizadas = new ArrayList<>();
}