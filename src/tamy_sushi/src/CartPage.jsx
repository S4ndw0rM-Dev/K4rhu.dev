import { useState } from "react";

const INITIAL_CART = [
  { id: 1, name: "Aceite de Oliva Extra Virgen", variant: "500ml", price: 9490, qty: 2, emoji: "🫒", brand: "Finca Los Olivos", stock: 18 },
  { id: 2, name: "Queso Manchego Curado", variant: "300g", price: 12990, qty: 1, emoji: "🧀", brand: "Quesos del Valle", stock: 12 },
  { id: 3, name: "Miel Orgánica de Montaña", variant: "500g", price: 7990, qty: 3, emoji: "🍯", brand: "Apícola Sur", stock: 25 },
];

const SUGGESTED = [
  { id: 10, name: "Vinagre Balsámico", price: 7490, emoji: "🍶", rating: 4.8 },
  { id: 11, name: "Sal de Mar Artesanal", price: 3990, emoji: "🧂", rating: 4.6 },
  { id: 12, name: "Mermelada Frambuesa", price: 5990, emoji: "🍓", rating: 4.9 },
];

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Envío estándar", desc: "3–5 días hábiles", price: 0, badge: "Gratis" },
  { id: "express", label: "Envío express", desc: "24–48 horas", price: 3990, badge: null },
  { id: "same", label: "Mismo día", desc: "Solo RM, antes de las 12:00", price: 6990, badge: "Rápido" },
];

export default function CartPage() {
  const [cart, setCart] = useState(INITIAL_CART);
  const [shipping, setShipping] = useState("standard");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [suggested, setSuggested] = useState(SUGGESTED);

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item =>
      item.id === id
        ? { ...item, qty: Math.max(1, Math.min(item.stock, item.qty + delta)) }
        : item
    ));
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "DESPENSA10") {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponError(true);
      setCouponApplied(false);
    }
  };

  const addSuggested = (item) => {
    setCart(prev => [...prev, { ...item, variant: "Unidad", qty: 1, brand: "La Despensa", stock: 10 }]);
    setSuggested(prev => prev.filter(s => s.id !== item.id));
  };

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shippingCost = SHIPPING_OPTIONS.find(s => s.id === shipping)?.price ?? 0;
  const total = subtotal - discount + shippingCost;
  const freeShippingThreshold = 25000;
  const remaining = freeShippingThreshold - subtotal;

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: "#FAF8F3", minHeight: "100vh", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .remove-btn:hover { color: #dc2626 !important; }
        .suggest-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
        .shipping-opt:hover { border-color: #2D4A22 !important; }
        input:focus { outline: 2px solid #2D4A22; outline-offset: 2px; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: "rgba(250,248,243,0.97)", borderBottom: "1px solid #E8E4D9", padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🌿</span>
          <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 18, color: "#2D4A22" }}>La Despensa</span>
        </div>
        <div style={{ display: "flex", gap: 10, fontSize: 13, color: "#888", alignItems: "center" }}>
          <a href="#" style={{ color: "#888", textDecoration: "none" }}>Inicio</a>
          <span>›</span>
          <span style={{ color: "#2D4A22", fontWeight: 600 }}>Mi Carrito</span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 18, cursor: "pointer" }}>🛒</span>
            <span style={{ position: "absolute", top: -6, right: -8, background: "#2D4A22", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {cart.reduce((a, i) => a + i.qty, 0)}
            </span>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 5%" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 700 }}>
            Mi Carrito
            <span style={{ fontSize: 18, color: "#999", fontWeight: 400, marginLeft: 12 }}>
              ({cart.reduce((a, i) => a + i.qty, 0)} productos)
            </span>
          </h1>
          <a href="#" style={{ color: "#2D4A22", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>← Seguir comprando</a>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 26, marginBottom: 12 }}>Tu carrito está vacío</h2>
            <p style={{ color: "#888", marginBottom: 28 }}>Agrega productos desde nuestro catálogo</p>
            <button style={{ background: "#2D4A22", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif" }}>
              Ver productos →
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }}>

            {/* LEFT COLUMN */}
            <div>

              {/* FREE SHIPPING PROGRESS */}
              {remaining > 0 ? (
                <div style={{ background: "#FFF8E8", border: "1px solid #F5D78E", borderRadius: 14, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, animation: "slideIn 0.4s ease" }}>
                  <span style={{ fontSize: 22 }}>🚚</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", marginBottom: 6 }}>
                      Agrega <strong>${remaining.toLocaleString("es-CL")}</strong> más para envío gratis
                    </p>
                    <div style={{ background: "#F5D78E", borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`, background: "#F5B731", height: "100%", borderRadius: 4, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>
                    ${subtotal.toLocaleString("es-CL")} / $25.000
                  </span>
                </div>
              ) : (
                <div style={{ background: "#E8F5E1", border: "1px solid #A8D5B5", borderRadius: 14, padding: "12px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, animation: "slideIn 0.4s ease" }}>
                  <span style={{ fontSize: 20 }}>✅</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#166534" }}>¡Tienes envío gratis en este pedido!</span>
                </div>
              )}

              {/* CART ITEMS */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ background: "#fff", borderRadius: 18, border: "1px solid #E8E4D9", padding: "18px 22px", display: "flex", gap: 18, alignItems: "center", animation: "fadeUp 0.4s ease" }}>
                    {/* Product image */}
                    <div style={{ width: 80, height: 80, background: "#F0EDE4", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, flexShrink: 0 }}>
                      {item.emoji}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, color: "#2D4A22", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{item.brand}</p>
                      <h3 style={{ fontFamily: "'Lora', serif", fontSize: 16, fontWeight: 600, marginBottom: 3, lineHeight: 1.3 }}>{item.name}</h3>
                      <p style={{ fontSize: 12, color: "#999", marginBottom: 0 }}>Formato: {item.variant}</p>
                    </div>

                    {/* Qty control */}
                    <div style={{ display: "flex", alignItems: "center", border: "2px solid #E8E4D9", borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ width: 36, height: 36, background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#444", fontWeight: 700 }}>−</button>
                      <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontSize: 15 }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ width: 36, height: 36, background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#444", fontWeight: 700 }}>+</button>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: "right", flexShrink: 0, minWidth: 90 }}>
                      <p style={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a" }}>
                        ${(item.price * item.qty).toLocaleString("es-CL")}
                      </p>
                      <p style={{ fontSize: 12, color: "#aaa" }}>${item.price.toLocaleString("es-CL")} c/u</p>
                    </div>

                    {/* Remove */}
                    <button className="remove-btn" onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#ccc", transition: "color 0.2s", padding: "4px", flexShrink: 0 }}>✕</button>
                  </div>
                ))}
              </div>

              {/* SHIPPING OPTIONS */}
              <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E8E4D9", padding: "22px 24px", marginBottom: 32 }}>
                <h3 style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Tipo de envío</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {SHIPPING_OPTIONS.map(opt => (
                    <label key={opt.id} className="shipping-opt" onClick={() => setShipping(opt.id)} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 18px", borderRadius: 12, cursor: "pointer",
                      border: `2px solid ${shipping === opt.id ? "#2D4A22" : "#E8E4D9"}`,
                      background: shipping === opt.id ? "#E8F5E1" : "#fff",
                      transition: "all 0.2s"
                    }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${shipping === opt.id ? "#2D4A22" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {shipping === opt.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2D4A22" }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</span>
                          {opt.badge && <span style={{ background: opt.badge === "Gratis" ? "#E8F5E1" : "#FFF3CD", color: opt.badge === "Gratis" ? "#166534" : "#92400e", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{opt.badge}</span>}
                        </div>
                        <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{opt.desc}</p>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: opt.price === 0 ? "#2D4A22" : "#1a1a1a" }}>
                        {opt.price === 0 ? "Gratis" : `$${opt.price.toLocaleString("es-CL")}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SUGGESTED */}
              {suggested.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Quizás también te interese</h3>
                  <div style={{ display: "flex", gap: 14 }}>
                    {suggested.map(item => (
                      <div key={item.id} className="suggest-card" style={{ flex: 1, background: "#fff", borderRadius: 14, border: "1px solid #E8E4D9", padding: "16px", textAlign: "center", cursor: "pointer", transition: "all 0.25s" }}>
                        <div style={{ fontSize: 40, marginBottom: 8 }}>{item.emoji}</div>
                        <p style={{ fontFamily: "'Lora', serif", fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{item.name}</p>
                        <p style={{ fontSize: 12, color: "#F5B731", marginBottom: 10 }}>★ {item.rating}</p>
                        <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>${item.price.toLocaleString("es-CL")}</p>
                        <button onClick={() => addSuggested(item)} style={{ background: "#2D4A22", color: "#fff", border: "none", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", width: "100%" }}>
                          + Agregar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN — SUMMARY */}
            <div style={{ position: "sticky", top: 80 }}>
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E8E4D9", overflow: "hidden" }}>
                <div style={{ background: "#2D4A22", padding: "18px 22px" }}>
                  <h2 style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>Resumen del pedido</h2>
                </div>

                <div style={{ padding: "20px 22px" }}>
                  {/* Line items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid #F0EDE4" }}>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, color: "#555", flex: 1, marginRight: 8 }}>
                          {item.emoji} {item.name} <span style={{ color: "#aaa" }}>×{item.qty}</span>
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>${(item.price * item.qty).toLocaleString("es-CL")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal row */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 14, color: "#666" }}>Subtotal</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>${subtotal.toLocaleString("es-CL")}</span>
                  </div>

                  {/* Discount */}
                  {couponApplied && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 14, color: "#2D4A22", fontWeight: 600 }}>Descuento (10%)</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#2D4A22" }}>−${discount.toLocaleString("es-CL")}</span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                    <span style={{ fontSize: 14, color: "#666" }}>Envío</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: shippingCost === 0 ? "#2D4A22" : "#1a1a1a" }}>
                      {shippingCost === 0 ? "Gratis" : `$${shippingCost.toLocaleString("es-CL")}`}
                    </span>
                  </div>

                  {/* Coupon */}
                  <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #F0EDE4" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Código de descuento</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        value={coupon}
                        onChange={e => { setCoupon(e.target.value); setCouponError(false); }}
                        placeholder="Ej: DESPENSA10"
                        disabled={couponApplied}
                        style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${couponError ? "#dc2626" : couponApplied ? "#2D4A22" : "#E8E4D9"}`, fontSize: 13, fontFamily: "'Nunito Sans', sans-serif", background: couponApplied ? "#E8F5E1" : "#fff", color: "#1a1a1a" }}
                      />
                      <button onClick={applyCoupon} disabled={couponApplied} style={{ background: couponApplied ? "#E8F5E1" : "#2D4A22", color: couponApplied ? "#2D4A22" : "#fff", border: "none", borderRadius: 10, padding: "10px 14px", fontWeight: 700, fontSize: 13, cursor: couponApplied ? "default" : "pointer", fontFamily: "'Nunito Sans', sans-serif", flexShrink: 0 }}>
                        {couponApplied ? "✓" : "Aplicar"}
                      </button>
                    </div>
                    {couponError && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>Código inválido. Prueba con DESPENSA10</p>}
                    {couponApplied && <p style={{ fontSize: 12, color: "#2D4A22", marginTop: 6, fontWeight: 600 }}>✓ Código aplicado — 10% de descuento</p>}
                  </div>

                  {/* Total */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
                    <span style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700 }}>Total</span>
                    <span style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "#2D4A22" }}>
                      ${total.toLocaleString("es-CL")}
                    </span>
                  </div>

                  <button style={{ width: "100%", background: "#2D4A22", color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", marginBottom: 10, letterSpacing: 0.3 }}>
                    Ir al checkout →
                  </button>
                  <button style={{ width: "100%", background: "#F0EDE4", color: "#2D4A22", border: "2px solid #2D4A22", borderRadius: 14, padding: "13px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif" }}>
                    ← Seguir comprando
                  </button>

                  {/* Trust badges */}
                  <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 20 }}>
                    {[["🔒", "Pago seguro"], ["🏦", "Webpay"], ["📦", "Despacho garantizado"]].map(([icon, label]) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 18 }}>{icon}</div>
                        <div style={{ fontSize: 10, color: "#aaa", marginTop: 3 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer style={{ background: "#1a2e12", color: "#fff", padding: "20px 5%", textAlign: "center", marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 5 }}>
          <span>🌿</span>
          <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 15 }}>La Despensa</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>© 2025 La Despensa · Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
