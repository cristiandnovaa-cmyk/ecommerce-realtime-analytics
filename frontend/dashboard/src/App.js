import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function App() {
  const [ventas, setVentas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({ producto: "", cantidad: "", precioUnitario: "" });

  useEffect(() => {
    obtenerVentas();
    obtenerInventario();
  }, []);

  const obtenerVentas = async () => {
    try {
      const respuesta = await axios.get(\/ventas);
      setVentas(respuesta.data);
    } catch (error) { console.log(error); }
  };

  const obtenerInventario = async () => {
    try {
      const respuesta = await axios.get(\/inventario);
      setInventario(respuesta.data);
    } catch (error) { console.log(error); }
  };

  const crearVenta = async () => {
    try {
      await axios.post(\/ventas, {
        producto: nuevaVenta.producto,
        cantidad: parseInt(nuevaVenta.cantidad),
        precioUnitario: parseFloat(nuevaVenta.precioUnitario)
      });
      setNuevaVenta({ producto: "", cantidad: "", precioUnitario: "" });
      obtenerVentas();
    } catch (error) { console.log(error); }
  };

  const actualizarStock = async (id, stockActual) => {
    try {
      const nuevoStock = stockActual + 1;
      await axios.put(\/inventario/\/stock, { stock: nuevoStock });
      setInventario(inventario.map((p) => p.id === id ? { ...p, stock: nuevoStock } : p));
    } catch (error) { console.log(error); }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", background: "#e5e7eb", minHeight: "100vh" }}>
      <h1 style={{ color: "#2563eb", textAlign: "center", marginBottom: "30px" }}>Dashboard Ecommerce</h1>

      <div style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "30px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2>Registrar Venta</h2>
        <input type="text" placeholder="Producto" value={nuevaVenta.producto}
          onChange={(e) => setNuevaVenta({ ...nuevaVenta, producto: e.target.value })}
          style={{ padding: "10px", marginRight: "10px", marginTop: "10px" }} />
        <input type="number" placeholder="Cantidad" value={nuevaVenta.cantidad}
          onChange={(e) => setNuevaVenta({ ...nuevaVenta, cantidad: e.target.value })}
          style={{ padding: "10px", marginRight: "10px", marginTop: "10px" }} />
        <input type="number" placeholder="Precio unitario" value={nuevaVenta.precioUnitario}
          onChange={(e) => setNuevaVenta({ ...nuevaVenta, precioUnitario: e.target.value })}
          style={{ padding: "10px", marginRight: "10px", marginTop: "10px" }} />
        <button onClick={crearVenta}
          style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Registrar
        </button>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "30px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2>Ventas</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ background: "#2563eb", color: "white" }}>
              <th style={{ padding: "10px" }}>ID</th>
              <th style={{ padding: "10px" }}>Producto</th>
              <th style={{ padding: "10px" }}>Cantidad</th>
              <th style={{ padding: "10px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{venta.id}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{venta.producto}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{venta.cantidad}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{venta.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "30px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", height: "400px" }}>
        <h2>Grafica de Ventas</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ventas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="producto" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2>Inventario</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ background: "#16a34a", color: "white" }}>
              <th style={{ padding: "10px" }}>ID</th>
              <th style={{ padding: "10px" }}>Producto</th>
              <th style={{ padding: "10px" }}>Stock</th>
              <th style={{ padding: "10px" }}>Accion</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((producto, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{producto.id}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{producto.nombre}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{producto.stock}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  <button onClick={() => actualizarStock(producto.id, producto.stock)}
                    style={{ padding: "8px 15px", background: "#16a34a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    + Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
