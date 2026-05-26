import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const UNILIBRE_RED = "#C8102E";
const UNILIBRE_DARK = "#000000";

const USUARIOS = [
  { usuario: "vendedor1", password: "venta123", rol: "vendedor" },
  { usuario: "cliente1",  password: "cliente123", rol: "cliente" },
];

const styles = {
  app: { padding: "24px", fontFamily: "'Segoe UI', sans-serif", background: "#0a0f1e", minHeight: "100vh", color: "#e2e8f0" },
  loginWrap: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a0f1e" },
  loginCard: { background: "#1a2235", padding: "40px", borderRadius: "16px", border: `2px solid ${UNILIBRE_RED}`, boxShadow: "0 4px 30px rgba(200,16,46,0.3)", width: "360px" },
  loginTitle: { textAlign: "center", color: "white", fontSize: "22px", fontWeight: "700", marginBottom: "6px" },
  loginSub: { textAlign: "center", color: "#64748b", fontSize: "13px", marginBottom: "24px" },
  loginLabel: { display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "6px", marginTop: "16px" },
  header: { textAlign: "center", marginBottom: "32px", background: `linear-gradient(135deg, ${UNILIBRE_DARK}, #1a0000)`, padding: "24px", borderRadius: "16px", border: `2px solid ${UNILIBRE_RED}`, boxShadow: "0 4px 20px rgba(200,16,46,0.3)" },
  headerTop: { display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" },
  escudo: { width: "80px", height: "80px", objectFit: "contain" },
  headerText: { textAlign: "left" },
  university: { fontSize: "13px", color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", margin: 0 },
  title: { fontSize: "26px", fontWeight: "700", color: "white", margin: "4px 0" },
  subtitle: { color: "#94a3b8", fontSize: "13px", margin: 0 },
  badge: { background: UNILIBRE_RED, color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", display: "inline-block", marginTop: "8px" },
  rolBadge: (rol) => ({ background: rol === "vendedor" ? "#22c55e" : "#3b82f6", color: rol === "vendedor" ? "#0f172a" : "white", padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", display: "inline-block", marginLeft: "10px" }),
  card: { background: "#1a2235", padding: "24px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", border: "1px solid #1e3a5f" },
  cardTitle: { fontSize: "17px", fontWeight: "600", color: "white", marginBottom: "16px", marginTop: 0, borderBottom: `2px solid ${UNILIBRE_RED}`, paddingBottom: "10px", display: "flex", alignItems: "center", gap: "8px" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0a0f1e", color: "#e2e8f0", minWidth: "140px", fontSize: "14px" },
  select: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0a0f1e", color: "#e2e8f0", minWidth: "200px", fontSize: "14px" },
  btnPrimary: { padding: "10px 20px", background: UNILIBRE_RED, color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  btnSuccess: { padding: "10px 20px", background: "#22c55e", color: "#0f172a", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  btnDanger: { padding: "6px 12px", background: UNILIBRE_RED, color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  btnStock: { padding: "6px 12px", background: "#22c55e", color: "#0f172a", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", marginRight: "6px", fontWeight: "600" },
  btnLogout: { padding: "8px 16px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
  btnFactura: { padding: "6px 14px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", marginRight: "6px" },
  alertError: { background: "#450a0a", color: "#fca5a5", padding: "10px 14px", borderRadius: "8px", marginBottom: "12px", border: `1px solid ${UNILIBRE_RED}`, fontSize: "14px" },
  alertSuccess: { background: "#052e16", color: "#86efac", padding: "10px 14px", borderRadius: "8px", marginBottom: "12px", border: "1px solid #22c55e", fontSize: "14px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "8px", fontSize: "14px" },
  th: { padding: "12px 10px", background: UNILIBRE_DARK, color: "white", textAlign: "left", fontWeight: "600", borderBottom: `2px solid ${UNILIBRE_RED}` },
  tdEven: { padding: "10px", border: "1px solid #1a2235", background: "#1a2235" },
  tdOdd: { padding: "10px", border: "1px solid #1a2235", background: "#111827" },
  priceTag: { background: "#0a0f1e", color: "#60a5fa", padding: "8px 14px", borderRadius: "8px", fontSize: "14px", border: "1px solid #1e3a5f" },
  formRow: { display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard: { background: "#1a2235", padding: "20px", borderRadius: "12px", border: `1px solid ${UNILIBRE_RED}`, textAlign: "center" },
  statValue: { fontSize: "28px", fontWeight: "700", color: UNILIBRE_RED },
  statLabel: { fontSize: "13px", color: "#64748b", marginTop: "4px" },
  footer: { textAlign: "center", color: "#334155", fontSize: "12px", marginTop: "32px", paddingTop: "16px", borderTop: "1px solid #1e3a5f" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalBox: { background: "white", color: "#111", borderRadius: "12px", padding: "40px", width: "480px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  modalTitle: { textAlign: "center", fontSize: "20px", fontWeight: "700", marginBottom: "4px", color: UNILIBRE_RED },
  modalSub: { textAlign: "center", fontSize: "12px", color: "#64748b", marginBottom: "24px" },
  facturaRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: "14px" },
  facturaTotal: { display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: "16px", fontWeight: "700", color: UNILIBRE_RED, borderTop: "2px solid " + UNILIBRE_RED, marginTop: "8px" },
  modalBtns: { display: "flex", gap: "10px", marginTop: "24px", justifyContent: "center" },
};

// ── Modal Factura ──
function ModalFactura({ venta, onClose }) {
  if (!venta) return null;

  const fecha = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  const hora  = new Date().toLocaleTimeString("es-CO");
  const nroFactura = `FAC-${venta.id?.toString().slice(-6).toUpperCase() || "000000"}`;

  const descargarPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(200, 16, 46);
    doc.rect(0, 0, 210, 36, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("E-Commerce Analytics", 14, 16);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Universidad Libre de Colombia", 14, 25);
    doc.text(`Factura N°: ${nroFactura}`, 14, 32);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("FACTURA DE VENTA", 14, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 14, 58);
    doc.text(`Hora: ${hora}`, 14, 64);
    doc.text(`N° Factura: ${nroFactura}`, 14, 70);
    doc.setDrawColor(200, 16, 46);
    doc.setLineWidth(0.5);
    doc.line(14, 76, 196, 76);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Detalle de la compra", 14, 84);
    const filas = [
      ["Producto",        venta.producto],
      ["Cantidad",        String(venta.cantidad)],
      ["Precio unitario", `$${venta.precioUnitario?.toLocaleString()}`],
      ["Impuesto",        `$${venta.impuesto?.toLocaleString()}`],
      ["Descuento",       `$${venta.descuento?.toLocaleString()}`],
    ];
    let y = 92;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    filas.forEach(([label, valor], i) => {
      if (i % 2 === 0) { doc.setFillColor(245, 245, 245); doc.rect(14, y - 4, 182, 8, "F"); }
      doc.setTextColor(80, 80, 80); doc.text(label, 18, y + 1);
      doc.setTextColor(30, 30, 30); doc.text(valor, 140, y + 1);
      y += 10;
    });
    doc.setFillColor(200, 16, 46);
    doc.rect(14, y, 182, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL", 18, y + 8);
    doc.text(`$${venta.total?.toLocaleString()}`, 140, y + 8);
    y += 24;
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Gracias por su compra.", 105, y, { align: "center" });
    doc.text("Universidad Libre de Colombia — Proyecto de Programación 2026", 105, y + 6, { align: "center" });
    doc.save(`factura-${nroFactura}.pdf`);
  };

  const imprimir = () => window.print();

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div style={{ background: UNILIBRE_RED, color: "white", padding: "6px 18px", borderRadius: "20px", display: "inline-block", fontSize: "12px", fontWeight: "600" }}>
            {nroFactura}
          </div>
        </div>
        <p style={styles.modalTitle}>Factura de Venta</p>
        <p style={styles.modalSub}>Universidad Libre de Colombia<br />{fecha} — {hora}</p>
        <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "16px", marginBottom: "8px" }}>
          <div style={styles.facturaRow}><span style={{ color: "#64748b" }}>Producto</span><strong>{venta.producto}</strong></div>
          <div style={styles.facturaRow}><span style={{ color: "#64748b" }}>Cantidad</span><span>{venta.cantidad}</span></div>
          <div style={styles.facturaRow}><span style={{ color: "#64748b" }}>Precio unitario</span><span>${venta.precioUnitario?.toLocaleString()}</span></div>
          <div style={styles.facturaRow}><span style={{ color: "#64748b" }}>Impuesto</span><span>${venta.impuesto?.toLocaleString()}</span></div>
          <div style={styles.facturaRow}><span style={{ color: "#64748b" }}>Descuento</span><span>${venta.descuento?.toLocaleString()}</span></div>
          <div style={styles.facturaTotal}><span>TOTAL</span><span>${venta.total?.toLocaleString()}</span></div>
        </div>
        <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8" }}>Gracias por su compra 🎉</p>
        <div style={styles.modalBtns}>
          <button onClick={descargarPDF} style={{ ...styles.btnPrimary, fontSize: "13px" }}>⬇️ Descargar PDF</button>
          <button onClick={imprimir}     style={{ ...styles.btnFactura, padding: "10px 20px" }}>🖨️ Imprimir</button>
          <button onClick={onClose}      style={{ ...styles.btnLogout, padding: "10px 20px" }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// ── Login ──
function Login({ onLogin }) {
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [errorLogin, setErrorLogin] = useState("");

  const handleLogin = () => {
    const encontrado = USUARIOS.find(u => u.usuario === form.usuario && u.password === form.password);
    if (encontrado) onLogin(encontrado);
    else setErrorLogin("Usuario o contraseña incorrectos.");
  };

  return (
    <div style={styles.loginWrap}>
      <div style={styles.loginCard}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src="https://www.unilibre.edu.co/wp-content/uploads/2026/03/Escudo-Unilibre.png"
            alt="Escudo" style={{ width: "64px", marginBottom: "12px" }}
            onError={(e) => e.target.style.display = "none"} />
        </div>
        <p style={styles.loginTitle}>🛒 E-Commerce Analytics</p>
        <p style={styles.loginSub}>Universidad Libre de Colombia</p>
        {errorLogin && <div style={styles.alertError}>{errorLogin}</div>}
        <label style={styles.loginLabel}>Usuario</label>
        <input type="text" placeholder="Ej: vendedor1" value={form.usuario}
          onChange={(e) => setForm({ ...form, usuario: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ ...styles.input, width: "100%", boxSizing: "border-box" }} />
        <label style={styles.loginLabel}>Contraseña</label>
        <input type="password" placeholder="••••••••" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ ...styles.input, width: "100%", boxSizing: "border-box" }} />
        <button onClick={handleLogin} style={{ ...styles.btnPrimary, width: "100%", marginTop: "24px", padding: "12px" }}>
          Iniciar Sesión
        </button>
        <div style={{ marginTop: "20px", background: "#0a0f1e", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "#64748b" }}>
          <div style={{ marginBottom: "4px" }}>🟢 <strong style={{ color: "#94a3b8" }}>vendedor1</strong> / venta123 — Acceso completo</div>
          <div>🔵 <strong style={{ color: "#94a3b8" }}>cliente1</strong> / cliente123 — Solo compras</div>
        </div>
      </div>
    </div>
  );
}

// ── App principal ──
function App() {
  const [sesion, setSesion] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({ productoId: "", cantidad: "" });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "", stock: "", categoria: "", categoriaCustom: "" });
  const [errorProducto, setErrorProducto] = useState("");
  const [exitoProducto, setExitoProducto] = useState("");
  const [facturaVenta, setFacturaVenta] = useState(null);

  useEffect(() => { if (sesion) { obtenerVentas(); obtenerInventario(); } }, [sesion]);

  const obtenerVentas     = async () => { try { const r = await axios.get(`${API_URL}/ventas`);     setVentas(r.data);    } catch (e) { console.log(e); } };
  const obtenerInventario = async () => { try { const r = await axios.get(`${API_URL}/inventario`); setInventario(r.data); } catch (e) { console.log(e); } };

  const formatearPrecio = (valor) => valor.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // ── Helper: muestra mensaje y lo borra tras 3 segundos ──
  const mostrarMensaje = (setter, mensaje) => {
    setter(mensaje);
    setTimeout(() => setter(""), 3000);
  };

  const crearVenta = async () => {
    setError(""); setExito("");
    if (!nuevaVenta.productoId || !nuevaVenta.cantidad) { mostrarMensaje(setError, "Selecciona un producto e ingresa la cantidad."); return; }
    const cantidad = parseInt(nuevaVenta.cantidad);
    if (isNaN(cantidad) || cantidad <= 0) { mostrarMensaje(setError, "La cantidad debe ser un número mayor a 0."); return; }
    const p = inventario.find(p => p.id === nuevaVenta.productoId);
    if (!p) { mostrarMensaje(setError, "Producto no encontrado."); return; }
    if (p.stock < cantidad) { mostrarMensaje(setError, `Stock insuficiente. Solo hay ${p.stock} unidades disponibles.`); return; }
    try {
      const respuesta = await axios.post(`${API_URL}/ventas`, { producto: p.nombre, cantidad, precioUnitario: p.precio });
      setNuevaVenta({ productoId: "", cantidad: "" });
      mostrarMensaje(setExito, "✅ Venta registrada. Puedes descargar tu factura.");
      await obtenerVentas();
      await obtenerInventario();
      setFacturaVenta(respuesta.data);
    } catch (e) { mostrarMensaje(setError, "Error al registrar la venta."); }
  };

  const eliminarVenta = async (venta) => {
    try {
      const p = inventario.find(p => p.nombre.toLowerCase() === venta.producto.toLowerCase());
      if (p) await axios.put(`${API_URL}/inventario/${p.id}/stock?cantidad=${-venta.cantidad}`);
      await axios.delete(`${API_URL}/ventas/${venta.id}`);
      obtenerVentas(); obtenerInventario();
    } catch (e) { console.log(e); }
  };

  const agregarStock = async (id) => {
    try { await axios.put(`${API_URL}/inventario/${id}/stock?cantidad=1`); obtenerInventario(); } catch (e) { console.log(e); }
  };

  const eliminarProducto = async (id) => {
    try { await axios.delete(`${API_URL}/inventario/${id}`); setInventario(inventario.filter(p => p.id !== id)); } catch (e) { console.log(e); }
  };

  const crearProducto = async () => {
    setErrorProducto(""); setExitoProducto("");
    const categoriaFinal = nuevoProducto.categoria === "__nueva__" ? nuevoProducto.categoriaCustom : nuevoProducto.categoria;
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock || !categoriaFinal) { mostrarMensaje(setErrorProducto, "Completa todos los campos."); return; }
    if (parseInt(nuevoProducto.stock) <= 0) { mostrarMensaje(setErrorProducto, "El stock inicial debe ser mayor a 0."); return; }
    const nombreGuardado = nuevoProducto.nombre;
    try {
      await axios.post(`${API_URL}/inventario`, {
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio.replace(/\./g, "")),
        stock: parseInt(nuevoProducto.stock),
        categoria: categoriaFinal
      });
      setNuevoProducto({ nombre: "", precio: "", stock: "", categoria: "", categoriaCustom: "" });
      mostrarMensaje(setExitoProducto, `✅ Producto "${nombreGuardado}" agregado.`);
      await obtenerInventario();
    } catch (e) { mostrarMensaje(setErrorProducto, "Error al crear el producto."); }
  };

  const categoriasExistentes = [...new Set(inventario.map(p => p.categoria).filter(Boolean))];
  const productoSeleccionado = inventario.find(p => p.id === nuevaVenta.productoId);
  const totalVentas    = ventas.reduce((acc, v) => acc + (v.total || 0), 0);
  const totalProductos = inventario.reduce((acc, p) => acc + p.stock, 0);
  const esVendedor = sesion?.rol === "vendedor";
  const esCliente  = sesion?.rol === "cliente";

  if (!sesion) return <Login onLogin={setSesion} />;

  // ─────────────────────────────────────────
  // VISTA CLIENTE
  // ─────────────────────────────────────────
  if (esCliente) return (
    <div style={styles.app}>
      {facturaVenta && <ModalFactura venta={facturaVenta} onClose={() => setFacturaVenta(null)} />}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <img src="https://www.unilibre.edu.co/wp-content/uploads/2026/03/Escudo-Unilibre.png"
            alt="Escudo" style={styles.escudo} onError={(e) => e.target.style.display = "none"} />
          <div style={{ ...styles.headerText, flex: 1 }}>
            <p style={styles.university}>Universidad Libre de Colombia</p>
            <h1 style={styles.title}>🛒 Tienda E-Commerce</h1>
            <p style={styles.subtitle}>Bienvenido, realiza tu compra</p>
            <span style={styles.badge}>Programación — 2026</span>
            <span style={styles.rolBadge("cliente")}>🔵 {sesion.usuario} (cliente)</span>
          </div>
          <button onClick={() => setSesion(null)} style={styles.btnLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🏪 Productos Disponibles</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          {inventario.map((producto, i) => (
            <div key={i} style={{ background: "#0a0f1e", borderRadius: "10px", padding: "16px", border: `1px solid ${producto.stock === 0 ? "#450a0a" : "#1e3a5f"}` }}>
              <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>{producto.categoria}</div>
              <div style={{ fontWeight: "700", fontSize: "16px", color: "white", marginBottom: "8px" }}>{producto.nombre}</div>
              <div style={{ color: "#60a5fa", fontWeight: "600", fontSize: "15px", marginBottom: "8px" }}>${producto.precio?.toLocaleString()}</div>
              <div style={{ fontSize: "12px", color: producto.stock === 0 ? "#fca5a5" : producto.stock <= 2 ? "#fbbf24" : "#86efac" }}>
                {producto.stock === 0 ? "❌ Agotado" : producto.stock <= 2 ? `⚠️ Últimas ${producto.stock} unidades` : `✅ ${producto.stock} disponibles`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🧾 Realizar Compra</h2>
        {error && <div style={styles.alertError}>{error}</div>}
        {exito && <div style={styles.alertSuccess}>{exito}</div>}
        <div style={styles.formRow}>
          <select value={nuevaVenta.productoId}
            onChange={(e) => setNuevaVenta({ ...nuevaVenta, productoId: e.target.value })} style={styles.select}>
            <option value="">Selecciona un producto</option>
            {inventario.filter(p => p.stock > 0).map(p => (
              <option key={p.id} value={p.id}>{p.nombre} — ${p.precio?.toLocaleString()} (Stock: {p.stock})</option>
            ))}
          </select>
          <input type="number" placeholder="Cantidad" value={nuevaVenta.cantidad} min="1"
            onChange={(e) => setNuevaVenta({ ...nuevaVenta, cantidad: e.target.value })}
            style={{ ...styles.input, width: "100px" }} />
          {productoSeleccionado && (
            <div style={styles.priceTag}>Precio: <strong>${productoSeleccionado.precio?.toLocaleString()}</strong></div>
          )}
          <button onClick={crearVenta} style={styles.btnPrimary}>Comprar</button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📋 Mis Compras</h2>
        <table style={styles.table}>
          <thead>
            <tr>{["Producto","Cantidad","Precio Unit.","Total","Factura"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr key={index}>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>{venta.producto}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>{venta.cantidad}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>${venta.precioUnitario?.toLocaleString()}</td>
                <td style={{ ...(index % 2 === 0 ? styles.tdEven : styles.tdOdd), color: UNILIBRE_RED, fontWeight: "bold" }}>${venta.total?.toLocaleString()}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>
                  <button onClick={() => setFacturaVenta(venta)} style={styles.btnFactura}>📄 Ver factura</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.footer}>Universidad Libre de Colombia — Proyecto de Programación 2026</div>
    </div>
  );

  // ─────────────────────────────────────────
  // VISTA VENDEDOR
  // ─────────────────────────────────────────
  return (
    <div style={styles.app}>
      {facturaVenta && <ModalFactura venta={facturaVenta} onClose={() => setFacturaVenta(null)} />}

      <div style={styles.header}>
        <div style={styles.headerTop}>
          <img src="https://www.unilibre.edu.co/wp-content/uploads/2026/03/Escudo-Unilibre.png"
            alt="Escudo" style={styles.escudo} onError={(e) => e.target.style.display = "none"} />
          <div style={{ ...styles.headerText, flex: 1 }}>
            <p style={styles.university}>Universidad Libre de Colombia</p>
            <h1 style={styles.title}>🛒 E-Commerce Analytics</h1>
            <p style={styles.subtitle}>Sistema de ventas en tiempo real con microservicios</p>
            <span style={styles.badge}>Programación — 2026</span>
            <span style={styles.rolBadge(sesion.rol)}>🟢 {sesion.usuario} (vendedor)</span>
          </div>
          <button onClick={() => setSesion(null)} style={styles.btnLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}><div style={styles.statValue}>{ventas.length}</div><div style={styles.statLabel}>Total Ventas</div></div>
        <div style={styles.statCard}><div style={styles.statValue}>${totalVentas.toLocaleString()}</div><div style={styles.statLabel}>Ingresos Totales</div></div>
        <div style={styles.statCard}><div style={styles.statValue}>{totalProductos}</div><div style={styles.statLabel}>Unidades en Stock</div></div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>➕ Agregar Producto al Inventario</h2>
        {errorProducto && <div style={styles.alertError}>{errorProducto}</div>}
        {exitoProducto && <div style={styles.alertSuccess}>{exitoProducto}</div>}
        <div style={styles.formRow}>
          <input type="text" placeholder="Nombre del producto" value={nuevoProducto.nombre}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} style={styles.input} />
          <input type="text" placeholder="Precio (ej: 1.000.000)" value={nuevoProducto.precio}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: formatearPrecio(e.target.value) })}
            style={{ ...styles.input, minWidth: "160px" }} />
          <input type="number" placeholder="Stock inicial" value={nuevoProducto.stock} min="1"
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
            style={{ ...styles.input, minWidth: "110px" }} />
          <select value={nuevoProducto.categoria}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value, categoriaCustom: "" })} style={styles.select}>
            <option value="">Selecciona categoría</option>
            {categoriasExistentes.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            <option value="__nueva__">+ Nueva categoría...</option>
          </select>
          {nuevoProducto.categoria === "__nueva__" && (
            <input type="text" placeholder="Nueva categoría" value={nuevoProducto.categoriaCustom}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoriaCustom: e.target.value })} style={styles.input} />
          )}
          <button onClick={crearProducto} style={styles.btnSuccess}>Agregar</button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🧾 Registrar Venta</h2>
        {error  && <div style={styles.alertError}>{error}</div>}
        {exito  && <div style={styles.alertSuccess}>{exito}</div>}
        <div style={styles.formRow}>
          <select value={nuevaVenta.productoId}
            onChange={(e) => setNuevaVenta({ ...nuevaVenta, productoId: e.target.value })} style={styles.select}>
            <option value="">Selecciona un producto</option>
            {inventario.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} — ${p.precio?.toLocaleString()} (Stock: {p.stock})</option>
            ))}
          </select>
          <input type="number" placeholder="Cantidad" value={nuevaVenta.cantidad} min="1"
            onChange={(e) => setNuevaVenta({ ...nuevaVenta, cantidad: e.target.value })}
            style={{ ...styles.input, width: "100px" }} />
          {productoSeleccionado && (
            <div style={styles.priceTag}>Precio: <strong>${productoSeleccionado.precio?.toLocaleString()}</strong></div>
          )}
          <button onClick={crearVenta} style={styles.btnPrimary}>Registrar Venta</button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📊 Ventas Registradas</h2>
        <table style={styles.table}>
          <thead>
            <tr>{["ID","Producto","Cantidad","Precio Unit.","Impuesto","Descuento","Total","Acciones"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr key={index}>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>{venta.id}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>{venta.producto}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>{venta.cantidad}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>${venta.precioUnitario?.toLocaleString()}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>${venta.impuesto?.toLocaleString()}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>${venta.descuento?.toLocaleString()}</td>
                <td style={{ ...(index % 2 === 0 ? styles.tdEven : styles.tdOdd), color: UNILIBRE_RED, fontWeight: "bold" }}>${venta.total?.toLocaleString()}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>
                  <button onClick={() => setFacturaVenta(venta)} style={styles.btnFactura}>📄 Factura</button>
                  <button onClick={() => eliminarVenta(venta)} style={styles.btnDanger}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ ...styles.card, height: "380px" }}>
        <h2 style={styles.cardTitle}>📈 Gráfica de Ventas por Producto</h2>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={ventas}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="producto" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ background: "#1a2235", border: `1px solid ${UNILIBRE_RED}`, color: "#e2e8f0" }} />
            <Bar dataKey="cantidad" fill={UNILIBRE_RED} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📦 Inventario</h2>
        <table style={styles.table}>
          <thead>
            <tr>{["Producto","Precio","Stock","Categoría","Acciones"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {inventario.map((producto, index) => (
              <tr key={index}>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>{producto.nombre}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>${producto.precio?.toLocaleString()}</td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>
                  <span style={{ color: producto.stock <= 2 ? UNILIBRE_RED : "#22c55e", fontWeight: "bold" }}>
                    {producto.stock} {producto.stock <= 2 ? "⚠️" : ""}
                  </span>
                </td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>
                  <span style={{ background: UNILIBRE_DARK, padding: "3px 10px", borderRadius: "20px", fontSize: "12px", color: "white", border: `1px solid ${UNILIBRE_RED}` }}>
                    {producto.categoria}
                  </span>
                </td>
                <td style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>
                  <button onClick={() => agregarStock(producto.id)} style={styles.btnStock}>+ Stock</button>
                  <button onClick={() => eliminarProducto(producto.id)} style={styles.btnDanger}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.footer}>Universidad Libre de Colombia — Proyecto de Programación 2026</div>
    </div>
  );
}

export default App;