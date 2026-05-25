import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function App() {
  const [ventas, setVentas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({ productoId: "", cantidad: "" });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    obtenerVentas();
    obtenerInventario();
  }, []);

  const obtenerVentas = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/ventas`);
      setVentas(respuesta.data);
    } catch (error) { console.log(error); }
  };

  const obtenerInventario = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/inventario`);
      setInventario(respuesta.data);
    } catch (error) { console.log(error); }
  };

  const crearVenta = async () => {
    setError("");
    setExito("");

    if (!nuevaVenta.productoId || !nuevaVenta.cantidad) {
      setError("Por favor selecciona un producto e ingresa la cantidad.");
      return;
    }

    const productoSeleccionado = inventario.find(p => p.id === nuevaVenta.productoId);

    if (!productoSeleccionado) {
      setError("Producto no encontrado.");
      return;
    }

    if (productoSeleccionado.stock < parseInt(nuevaVenta.cantidad)) {
      setError(`Stock insuficiente. Solo hay ${productoSeleccionado.stock} unidades disponibles.`);
      return;
    }

    try {
      await axios.post(`${API_URL}/ventas`, {
        producto: productoSeleccionado.nombre,
        cantidad: parseInt(nuevaVenta.cantidad),
        precioUnitario: productoSeleccionado.precio
      });
      setNuevaVenta({ productoId: "", cantidad: "" });
      setExito("Venta registrada exitosamente.");
      obtenerVentas();
      obtenerInventario();
    } catch (error) {
      setError("Error al registrar la venta.");
    }
  };

  const eliminarVenta = async (venta) => {
    try {
      const productoEnInventario = inventario.find(
        p => p.nombre.toLowerCase() === venta.producto.toLowerCase()
      );
      if (productoEnInventario) {
        await axios.put(
          `${API_URL}/inventario/${productoEnInventario.id}/stock?cantidad=${-venta.cantidad}`
        );
      }
      await axios.delete(`${API_URL}/ventas/${venta.id}`);
      obtenerVentas();
      obtenerInventario();
    } catch (error) { console.log(error); }
  };

  const agregarStock = async (id, stockActual) => {
    try {
      await axios.put(`${API_URL}/inventario/${id}/stock?cantidad=-1`);
      setInventario(inventario.map((p) => p.id === id ? { ...p, stock: stockActual + 1 } : p));
    } catch (error) { console.log(error); }
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`${API_URL}/inventario/${id}`);
      setInventario(inventario.filter(p => p.id !== id));
    } catch (error) { console.log(error); }
  };

  const productoSeleccionado = inventario.find(p => p.id === nuevaVenta.productoId);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", background: "#e5e7eb", minHeight: "100vh" }}>
      <h1 style={{ color: "#2563eb", textAlign: "center", marginBottom: "30px" }}>Dashboard Ecommerce</h1>

      <div style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "30px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2>Registrar Venta</h2>
        {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>{error}</div>}
        {exito && <div style={{ background: "#dcfce7", color: "#15803d", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>{exito}</div>}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
          <select
            value={nuevaVenta.productoId}
            onChange={(e) => setNuevaVenta({ ...nuevaVenta, productoId: e.target.value })}
            style={{ padding: "10px", minWidth: "200px", borderRadius: "5px", border: "1px solid #ccc" }}>
            <option value="">Selecciona un producto</option>
            {inventario.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} — ${p.precio?.toLocaleString()} (Stock: {p.stock})
              </option>
            ))}
          </select>
          <input type="number" placeholder="Cantidad" value={nuevaVenta.cantidad}
            onChange={(e) => setNuevaVenta({ ...nuevaVenta, cantidad: e.target.value })}
            style={{ padding: "10px", width: "100px", borderRadius: "5px", border: "1px solid #ccc" }} />
          {productoSeleccionado && (
            <div style={{ padding: "10px", background: "#f0fdf4", borderRadius: "5px", color: "#15803d" }}>
              Precio unitario: <strong>${productoSeleccionado.precio?.toLocaleString()}</strong>
            </div>
          )}
          <button onClick={crearVenta}
            style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Registrar
          </button>
        </div>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "30px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2>Ventas</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ background: "#2563eb", color: "white" }}>
              <th style={{ padding: "10px" }}>ID</th>
              <th style={{ padding: "10px" }}>Producto</th>
              <th style={{ padding: "10px" }}>Cantidad</th>
              <th style={{ padding: "10px" }}>Precio Unit.</th>
              <th style={{ padding: "10px" }}>Impuesto</th>
              <th style={{ padding: "10px" }}>Descuento</th>
              <th style={{ padding: "10px" }}>Total</th>
              <th style={{ padding: "10px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr key={index} style={{ background: index % 2 === 0 ? "#f9fafb" : "white" }}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{venta.id}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{venta.producto}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{venta.cantidad}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>${venta.precioUnitario?.toLocaleString()}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>${venta.impuesto?.toLocaleString()}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>${venta.descuento?.toLocaleString()}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>${venta.total?.toLocaleString()}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  <button onClick={() => eliminarVenta(venta)}
                    style={{ padding: "6px 12px", background: "#dc2626", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Eliminar
                  </button>
                </td>
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
              <th style={{ padding: "10px" }}>Producto</th>
              <th style={{ padding: "10px" }}>Precio</th>
              <th style={{ padding: "10px" }}>Stock</th>
              <th style={{ padding: "10px" }}>Categoría</th>
              <th style={{ padding: "10px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((producto, index) => (
              <tr key={index} style={{ background: index % 2 === 0 ? "#f9fafb" : "white" }}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{producto.nombre}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>${producto.precio?.toLocaleString()}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  <span style={{ color: producto.stock <= 2 ? "#b91c1c" : "#15803d", fontWeight: "bold" }}>
                    {producto.stock}
                  </span>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{producto.categoria}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  <button onClick={() => agregarStock(producto.id, producto.stock)}
                    style={{ padding: "6px 12px", background: "#16a34a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "5px" }}>
                    + Stock
                  </button>
                  <button onClick={() => eliminarProducto(producto.id)}
                    style={{ padding: "6px 12px", background: "#dc2626", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Eliminar
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