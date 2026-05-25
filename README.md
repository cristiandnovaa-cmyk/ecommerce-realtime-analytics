# E-Commerce Real-Time Analytics

Proyecto de microservicios para procesamiento de ventas en tiempo real con programación funcional y reactiva.

## Tecnologías
- Java 17 + Spring WebFlux (programación reactiva)
- MySQL (base de datos relacional para ventas)
- MongoDB (base de datos NoSQL para inventario y logs)
- Spring Cloud Gateway (API Gateway)
- React + Recharts (dashboard frontend)

## Estructura del proyecto
- `ventas-service` — Microservicio de ventas (puerto 8081)
- `inventario-service` — Microservicio de inventario (puerto 8082)
- `gateway` — API Gateway (puerto 8080)
- `frontend/dashboard` — Dashboard React (puerto 3000)

## Requisitos previos
- Java 17
- Maven
- MySQL 8 corriendo en puerto 3306
- MongoDB corriendo en puerto 27017
- Node.js y npm

## Pasos para correr el proyecto

### 1. Base de datos MySQL
```sql
CREATE DATABASE ventasdb;
```

### 2. Levantar ventas-service
```bash
cd ventas-service
./mvnw spring-boot:run
```

### 3. Levantar inventario-service
```bash
cd inventario-service
./mvnw spring-boot:run
```

### 4. Levantar gateway
```bash
cd gateway
mvn spring-boot:run
```

### 5. Levantar frontend
```bash
cd frontend/dashboard
npm install
npm start
```

### 6. Abrir el dashboard
Ir a http://localhost:3000

## Endpoints principales

### Ventas (puerto 8081)
- `GET /ventas` — listar ventas
- `POST /ventas` — registrar venta (calcula impuesto 19% y descuento 10%)
- `DELETE /ventas/{id}` — eliminar venta
- `GET /ventas/analytics/por-producto` — analytics por producto
- `GET /ventas/logs` — logs en MongoDB

### Inventario (puerto 8082)
- `GET /inventario` — listar productos
- `POST /inventario` — agregar producto
- `PUT /inventario/{id}/stock?cantidad=X` — actualizar stock
- `PUT /inventario/{id}/descuento?porcentaje=X` — aplicar descuento
- `DELETE /inventario/{id}` — eliminar producto

## Integrantes
- Persona 1: Microservicio de Ventas
- Persona 2: Microservicio de Inventario
- Persona 3: Gateway + Docker
- Persona 4: Frontend Dashboard