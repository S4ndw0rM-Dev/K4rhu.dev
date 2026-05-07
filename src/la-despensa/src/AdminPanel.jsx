import { useState } from "react";

// ── DATA ────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Ventas hoy", value: "$184.320", delta: "+12%", up: true, icon: "💰" },
  { label: "Pedidos hoy", value: "24", delta: "+5", up: true, icon: "📦" },
  { label: "Clientes activos", value: "1.284", delta: "+3%", up: true, icon: "👥" },
  { label: "Ticket promedio", value: "$34.190", delta: "-2%", up: false, icon: "🧾" },
];

const ORDERS = [
  { id: "#0421", customer: "María José Torres", products: "Aceite EVOO × 2, Queso × 1", total: 31970, status: "enviado", date: "hace 10 min", avatar: "MJ" },
  { id: "#0420", customer: "Rodrigo Alvarado", products: "Miel × 3, Mermelada × 2", total: 35920, status: "preparando", date: "hace 32 min", avatar: "RA" },
  { id: "#0419", customer: "Valentina Cárdenas", products: "Pack Gourmet × 1", total: 24990, status: "pendiente", date: "hace 1 hr", avatar: "VC" },
  { id: "#0418", customer: "Felipe Moreno", products: "Vinagre × 1, Sal × 2", total: 15470, status: "entregado", date: "hace 2 hrs", avatar: "FM" },
  { id: "#0417", customer: "Camila Vega", products: "Aceite EVOO × 1, Miel × 1", total: 17480, status: "entregado", date: "hace 3 hrs", avatar: "CV" },
  { id: "#0416", customer: "Andrés Muñoz", products: "Jamón × 2, Queso × 2", total: 63960, status: "cancelado", date: "hace 4 hrs", avatar: "AM" },
];

const PRODUCTS = [
  { id: 1, name: "Aceite de Oliva Extra Virgen", category: "Aceites", price: 9490, stock: 18, sold: 1240, emoji: "🫒", status: "activo" },
  { id: 2, name: "Queso Manchego Curado", category: "Lácteos", price: 12990, stock: 5, sold: 892, emoji: "🧀", status: "stock bajo" },
  { id: 3, name: "Miel Orgánica de Montaña", category: "Dulces", price: 7990, stock: 42, sold: 654, emoji: "🍯", status: "activo" },
  { id: 4, name: "Jamón Serrano 18 meses", category: "Embutidos", price: 18500, stock: 0, sold: 421, emoji: "🥩", status: "agotado" },
  { id: 5, name: "Mermelada de Frambuesa", category: "Conservas", price: 5990, stock: 67, sold: 1102, emoji: "🍓", status: "activo" },
  { id: 6, name: "Vinagre Balsámico", category: "Aceites", price: 7490, stock: 23, sold: 318, emoji: "🍶", status: "activo" },
];

const WEEKLY = [
  { day: "Lun", sales: 98000, orders: 14 },
  { day: "Mar", sales: 142000, orders: 19 },
  { day: "Mié", sales: 87000, orders: 11 },
  { day: "Jue", sales: 201000, orders: 27 },
  { day: "Vie", sales: 176000, orders: 23 },
  { day: "Sáb", sales: 224000, orders: 31 },
  { day: "Hoy", sales: 184320, orders: 24 },
];

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "orders", label: "Pedidos", icon: "📦" },
  { key: "products", label: "Productos", icon: "🛒" },
  { key: "customers", label: "Clientes", icon: "👥" },
  { key: "stats", label: "Estadísticas", icon: "📈" },
  { key: "settings", label: "Configuración", icon: "⚙️" },
];

const STATUS_CONFIG = {
  pendiente:  { label: "Pendiente",  bg: "#FFF3CD", color: "#92400e" },
  preparando: { label: "Preparando", bg: "#DBEAFE", color: "#1e40af" },
  enviado:    { label: "Enviado",    bg: "#D1FAE5", color: "#065f46" },
  entregado:  { label: "Entregado",  bg: "#E8F5E1", color: "#166534" },
  cancelado:  { label: "Cancelado",  bg: "#FEE2E2", color: "#991b1b" },
};

// ── COMPONENTS ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: "#F3F4F6", color: "#374151" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  );
}

function MiniChart({ data }) {
  const max = Math.max(...data.map(d => d.sales));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, padding: "0 4px" }}>
      {data.map((d, i) => {
        const h = Math.round((d.sales / max) * 80);
        const isLast = i === data.length - 1;
        return (
          <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div
              title={`$${d.sales.toLocaleString("es-CL")}`}
              style={{
                width: "100%", height: h,
                background: isLast ? "#A8C572" : "rgba(168,197,114,0.35)",
                borderRadius: "4px 4px 0 0",
                transition: "height 0.5s ease",
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: 9, color: isLast ? "#A8C572" : "#888", fontWeight: isLast ? 700 : 400 }}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── VIEWS ─────────────────────────────────────────────────────────────────────
function DashboardView() {
  const maxSales = Math.max(...WEEKLY.map(d => d.sales));
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: "#1E2A1A", border: "1px solid #2D4A22", borderRadius: 16, padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "#7a9e6a", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>{s.label}</span>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "#f0f0f0", marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.up ? "#A8C572" : "#f87171", fontWeight: 600 }}>
              {s.up ? "▲" : "▼"} {s.delta} vs ayer
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 28 }}>
        {/* Weekly sales */}
        <div style={{ background: "#1E2A1A", border: "1px solid #2D4A22", borderRadius: 16, padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Lora', serif", fontSize: 17, color: "#f0f0f0", fontWeight: 700 }}>Ventas esta semana</h3>
            <span style={{ fontSize: 12, color: "#7a9e6a", fontWeight: 600 }}>$1.212.320 total</span>
          </div>
          <MiniChart data={WEEKLY} />
        </div>

        {/* Category breakdown */}
        <div style={{ background: "#1E2A1A", border: "1px solid #2D4A22", borderRadius: 16, padding: "22px 24px" }}>
          <h3 style={{ fontFamily: "'Lora', serif", fontSize: 17, color: "#f0f0f0", fontWeight: 700, marginBottom: 18 }}>Por categoría</h3>
          {[
            { cat: "Aceites", pct: 38, color: "#A8C572" },
            { cat: "Lácteos", pct: 24, color: "#F5B731" },
            { cat: "Conservas", pct: 19, color: "#D08BC5" },
            { cat: "Embutidos", pct: 12, color: "#7EC8C8" },
            { cat: "Otros", pct: 7, color: "#888" },
          ].map(item => (
            <div key={item.cat} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#ccc" }}>{item.cat}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.pct}%</span>
              </div>
              <div style={{ background: "#2D4A22", borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div style={{ width: `${item.pct}%`, background: item.color, height: "100%", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ background: "#1E2A1A", border: "1px solid #2D4A22", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #2D4A22", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "'Lora', serif", fontSize: 17, color: "#f0f0f0", fontWeight: 700 }}>Pedidos recientes</h3>
          <span style={{ fontSize: 12, color: "#A8C572", fontWeight: 700, cursor: "pointer" }}>Ver todos →</span>
        </div>
        <div>
          {ORDERS.slice(0, 4).map((order, i) => (
            <div key={order.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderBottom: i < 3 ? "1px solid rgba(45,74,34,0.4)" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2D4A22", color: "#A8C572", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{order.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0", marginBottom: 2 }}>{order.customer}</p>
                <p style={{ fontSize: 11, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.products}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#A8C572", marginBottom: 4 }}>${order.total.toLocaleString("es-CL")}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersView() {
  const [filter, setFilter] = useState("todos");
  const statuses = ["todos", "pendiente", "preparando", "enviado", "entregado", "cancelado"];
  const filtered = filter === "todos" ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 700,
            border: `1.5px solid ${filter === s ? "#A8C572" : "#2D4A22"}`,
            background: filter === s ? "#A8C572" : "transparent",
            color: filter === s ? "#1a2e12" : "#7a9e6a",
            fontFamily: "'Nunito Sans', sans-serif", textTransform: "capitalize", transition: "all 0.2s"
          }}>
            {s === "todos" ? `Todos (${ORDERS.length})` : STATUS_CONFIG[s]?.label ?? s}
          </button>
        ))}
      </div>

      <div style={{ background: "#1E2A1A", border: "1px solid #2D4A22", borderRadius: 16, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1.4fr 100px 100px 80px", gap: 0, padding: "12px 24px", borderBottom: "1px solid #2D4A22" }}>
          {["ID", "Cliente", "Productos", "Total", "Estado", "Fecha"].map(h => (
            <span key={h} style={{ fontSize: 11, color: "#7a9e6a", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</span>
          ))}
        </div>

        {filtered.map((order, i) => (
          <div key={order.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1.4fr 100px 100px 80px", gap: 0, padding: "14px 24px", borderBottom: i < filtered.length - 1 ? "1px solid rgba(45,74,34,0.3)" : "none", alignItems: "center", cursor: "pointer" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#A8C572" }}>{order.id}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#2D4A22", color: "#A8C572", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10 }}>{order.avatar}</div>
              <span style={{ fontSize: 13, color: "#e0e0e0" }}>{order.customer}</span>
            </div>
            <span style={{ fontSize: 12, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.products}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0" }}>${order.total.toLocaleString("es-CL")}</span>
            <StatusBadge status={order.status} />
            <span style={{ fontSize: 11, color: "#666" }}>{order.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsView() {
  const [search, setSearch] = useState("");
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: "1.5px solid #2D4A22", background: "#1E2A1A", color: "#f0f0f0", fontSize: 13, fontFamily: "'Nunito Sans', sans-serif" }}
        />
        <button style={{ background: "#A8C572", color: "#1a2e12", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif" }}>
          + Nuevo producto
        </button>
      </div>

      <div style={{ background: "#1E2A1A", border: "1px solid #2D4A22", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 110px 90px 80px 100px 80px", gap: 0, padding: "12px 24px", borderBottom: "1px solid #2D4A22" }}>
          {["", "Producto", "Categoría", "Precio", "Stock", "Vendidos", "Estado"].map(h => (
            <span key={h} style={{ fontSize: 11, color: "#7a9e6a", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</span>
          ))}
        </div>

        {filtered.map((p, i) => (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "48px 1fr 110px 90px 80px 100px 80px", gap: 0, padding: "14px 24px", borderBottom: i < filtered.length - 1 ? "1px solid rgba(45,74,34,0.3)" : "none", alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>{p.emoji}</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0", marginBottom: 2 }}>{p.name}</p>
            </div>
            <span style={{ fontSize: 12, color: "#888" }}>{p.category}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#A8C572" }}>${p.price.toLocaleString("es-CL")}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: p.stock === 0 ? "#f87171" : p.stock < 10 ? "#F5B731" : "#A8C572" }}>
              {p.stock === 0 ? "0" : p.stock}
            </span>
            <span style={{ fontSize: 13, color: "#ccc" }}>{p.sold.toLocaleString("es-CL")}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
              background: p.status === "activo" ? "#1a3a1a" : p.status === "stock bajo" ? "#3a2a00" : "#3a1a1a",
              color: p.status === "activo" ? "#A8C572" : p.status === "stock bajo" ? "#F5B731" : "#f87171",
              border: `1px solid ${p.status === "activo" ? "#2D4A22" : p.status === "stock bajo" ? "#7a5a00" : "#7a1a1a"}`
            }}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsView() {
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {[
          { title: "Ingresos del mes", value: "$3.842.180", sub: "Mayo 2025", color: "#A8C572" },
          { title: "Pedidos del mes", value: "512", sub: "+18% vs abril", color: "#F5B731" },
          { title: "Clientes nuevos", value: "87", sub: "Este mes", color: "#D08BC5" },
          { title: "Tasa de conversión", value: "3.4%", sub: "Visitas → Compras", color: "#7EC8C8" },
        ].map(s => (
          <div key={s.title} style={{ background: "#1E2A1A", border: "1px solid #2D4A22", borderRadius: 16, padding: "22px 24px" }}>
            <p style={{ fontSize: 11, color: "#7a9e6a", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 10 }}>{s.title}</p>
            <p style={{ fontFamily: "'Lora', serif", fontSize: 34, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: "#888" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#1E2A1A", border: "1px solid #2D4A22", borderRadius: 16, padding: "22px 24px" }}>
        <h3 style={{ fontFamily: "'Lora', serif", fontSize: 17, color: "#f0f0f0", fontWeight: 700, marginBottom: 20 }}>Ventas últimos 7 días</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
          {WEEKLY.map((d, i) => {
            const max = Math.max(...WEEKLY.map(x => x.sales));
            const h = Math.round((d.sales / max) * 120);
            const isLast = i === WEEKLY.length - 1;
            return (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, color: "#7a9e6a", fontWeight: 700 }}>${Math.round(d.sales / 1000)}k</span>
                <div style={{ width: "100%", height: h, background: isLast ? "#A8C572" : "rgba(168,197,114,0.3)", borderRadius: "6px 6px 0 0", transition: "height 0.5s ease" }} />
                <span style={{ fontSize: 10, color: isLast ? "#A8C572" : "#666", fontWeight: isLast ? 700 : 400 }}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const viewMap = {
    dashboard: <DashboardView />,
    orders: <OrdersView />,
    products: <ProductsView />,
    stats: <StatsView />,
    customers: (
      <div style={{ color: "#7a9e6a", textAlign: "center", padding: "80px 0", animation: "fadeUp 0.4s ease" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
        <p style={{ fontFamily: "'Lora', serif", fontSize: 22, color: "#f0f0f0", marginBottom: 8 }}>Gestión de Clientes</p>
        <p style={{ fontSize: 14, color: "#888" }}>Próximamente — en construcción</p>
      </div>
    ),
    settings: (
      <div style={{ color: "#7a9e6a", textAlign: "center", padding: "80px 0", animation: "fadeUp 0.4s ease" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
        <p style={{ fontFamily: "'Lora', serif", fontSize: 22, color: "#f0f0f0", marginBottom: 8 }}>Configuración</p>
        <p style={{ fontSize: 14, color: "#888" }}>Próximamente — en construcción</p>
      </div>
    ),
  };

  const pageTitles = {
    dashboard: "Dashboard",
    orders: "Pedidos",
    products: "Productos",
    customers: "Clientes",
    stats: "Estadísticas",
    settings: "Configuración",
  };

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: "#111A0D", minHeight: "100vh", color: "#f0f0f0", display: "flex" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: #4a6a3a; }
        input:focus { outline: 1.5px solid #A8C572; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: "#0D1509", borderRight: "1px solid #1E2A1A", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1E2A1A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>🌿</span>
            <div>
              <p style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 16, color: "#f0f0f0", lineHeight: 1.1 }}>La Despensa</p>
              <p style={{ fontSize: 10, color: "#4a6a3a", letterSpacing: 1, textTransform: "uppercase" }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.key} onClick={() => setActiveNav(item.key)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10, cursor: "pointer",
              border: "none", width: "100%", textAlign: "left",
              background: activeNav === item.key ? "#1E2A1A" : "transparent",
              color: activeNav === item.key ? "#A8C572" : "#7a9e6a",
              fontSize: 14, fontWeight: activeNav === item.key ? 700 : 500,
              fontFamily: "'Nunito Sans', sans-serif",
              transition: "all 0.2s",
              borderLeft: `3px solid ${activeNav === item.key ? "#A8C572" : "transparent"}`,
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1E2A1A", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2D4A22", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#A8C572", flexShrink: 0 }}>OS</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>El Oso</p>
            <p style={{ fontSize: 10, color: "#4a6a3a" }}>Administrador</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ background: "#0D1509", borderBottom: "1px solid #1E2A1A", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700, color: "#f0f0f0" }}>{pageTitles[activeNav]}</h1>
            <p style={{ fontSize: 11, color: "#4a6a3a" }}>Miércoles, 6 de mayo 2025</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <span style={{ fontSize: 18, cursor: "pointer" }}>🔔</span>
              <span style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, background: "#A8C572", borderRadius: "50%", border: "1.5px solid #0D1509" }} />
            </div>
            <div style={{ width: 1, height: 24, background: "#1E2A1A" }} />
            <span style={{ fontSize: 12, color: "#7a9e6a", fontWeight: 600 }}>🌐 Ver tienda</span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px", overflow: "auto" }}>
          {viewMap[activeNav]}
        </main>
      </div>
    </div>
  );
}
