Write-Host "Iniciando E-Commerce Real-Time Analytics..." -ForegroundColor Cyan

# Levantar ventas-service
Write-Host "Levantando ventas-service en puerto 8081..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ventas-service'; ./mvnw spring-boot:run"

# Esperar 5 segundos
Start-Sleep -Seconds 5

# Levantar inventario-service
Write-Host "Levantando inventario-service en puerto 8082..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\inventario-service'; ./mvnw spring-boot:run"

# Esperar 5 segundos
Start-Sleep -Seconds 5

# Levantar gateway
Write-Host "Levantando gateway en puerto 8080..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\gateway'; mvn spring-boot:run"

# Esperar 10 segundos
Start-Sleep -Seconds 10

# Levantar frontend
Write-Host "Levantando frontend en puerto 3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend\dashboard'; npm start"

Write-Host "Todo iniciado. Abre http://localhost:3000 en tu navegador." -ForegroundColor Cyan