import { useState } from "react";

const PRODUCT = {
  id: 4,
  name: "Aceite de Oliva Extra Virgen",
  brand: "Finca Los Olivos",
  price: 9490,
  unit: "500ml",
  rating: 4.9,
  reviews: 311,
  sold: 1240,
  stock: 18,
  images: ["🫒", "🌿", "🍃", "🏺"],
  description:
    "Aceite de oliva de primera presión en frío, elaborado con aceitunas arbequinas cosechadas en su punto óptimo de maduración. Su sabor es frutado, con notas de almendra verde y un toque picante al final. Ideal para ensaladas, pastas y para usar en crudo.",
  highlights: [
    "Primera presión en frío",
    "Acidez máxima 0.2%",
    "Sin aditivos ni conservantes",
    "Certificado orgánico",
    "Origen: Valle del Maipo, Chile",
  ],
  nutrition: [
    { label: "Energía", value: "900 kcal" },
    { label: "Grasas totales", value: "100g" },
    { label: "Grasas saturadas", value: "14g" },
    { label: "Grasas monoinsaturadas", value: "73g" },
    { label: "Grasas poliinsaturadas", value: "11g" },
    { label: "Sodio", value: "0mg" },
  ],
  variants: [
    { label: "250ml", price: 5490 },
    { label: "500ml", price: 9490 },
    { label: "1L", price: 16990 },
    { label: "Pack x3", price: 24990 },
  ],
};

const REVIEWS = [
  { id: 1, name: "María José T.", avatar: "MJ", rating: 5, date: "hace 3 días", title: "Increíble calidad", body: "El mejor aceite que he comprado en Chile. Se nota la diferencia, el sabor es fresco y frutado.", verified: true },
  { id: 2, name: "Rodrigo A.", avatar: "RA", rating: 5, date: "hace 1 semana", title: "Llegó perfecto y rápido", body: "El envío llegó en menos de 48 horas, bien embalado. El aceite es excelente, ya pedí la segunda botella.", verified: true },
  { id: 3, name: "Valentina C.", avatar: "VC", rating: 4, date: "hace 2 semanas", title: "Muy bueno, pero caro", body: "La calidad es indudable y el sabor es muy superior al aceite normal. Vale la pena el precio.", verified: false },
];

const RELATED = [
  { id: 1, name: "Aceite de Oliva Suave 1L", price: 13990, emoji: "🫙", rating: 4.7 },
  { id: 2, name: "Vinagre Balsámico Artesanal", price: 7490, emoji: "🍶", rating: 4.8 },
  { id: 3, name: "Sal de Mar Artesanal", price: 3990, emoji: "🧂", rating: 4.6 },
  { id: 4, name: "Hierbas Mediterráneas", price: 4990, emoji: "🌿", rating: 4.9 },
];

function Stars({ rating, size = 16 }) {
  return (
    <span style={{ color: "#F5B731", fontSize: size }}>
      {"★".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 && <span style={{ opacity: 0.5 }}>★</span>}
    </span>
  );
}

function RatingBar({ label, value, total }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 13, color: "#666", minWidth: 32 }}>{label} ★</span>
      <div style={{ flex: 1, background: "#E8E4D9", borderRadius: 4, height: 7, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: "#F5B731", height: "100%", borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 12, color: "#999", minWidth: 24 }}>{value}</span>
    </div>
  );
}

export default function ProductPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeVariant, setActiveVariant] = useState(1);
  const [activeTab, setActiveTab] = useState("descripcion");
  const [wishlist, setWishlist] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  const price = PRODUCT.variants[activeVariant].price;

  const handleAddToCart = () => {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: "#FAF8F3", minHeight: "100vh", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes popIn { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .thumb:hover { border-color: #2D4A22 !important; }
        .variant-btn:hover { border-color: #2D4A22 !important; }
        .related-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
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
          <a href="#" style={{ color: "#888", textDecoration: "none" }}>Aceites & Conservas</a>
          <span>›</span>
          <span style={{ color: "#2D4A22", fontWeight: 600 }}>Aceite de Oliva Extra Virgen</span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 18, cursor: "pointer" }}>🔍</span>
          <span style={{ fontSize: 18, cursor: "pointer" }}>🛒</span>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 5%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>

        {/* IMAGES */}
        <div style={{ animation: "fadeUp 0.5s ease" }}>
          <div style={{ background: "#F0EDE4", borderRadius: 24, aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 160, position: "relative", marginBottom: 14, border: "1px solid #E8E4D9" }}>
            <span key={activeImage} style={{ animation: "popIn 0.4s ease", userSelect: "none" }}>
              {PRODUCT.images[activeImage]}
            </span>
            <div style={{ position: "absolute", top: 16, left: 16, background: "#F5B731", color: "#1a1a1a", fontWeight: 700, fontSize: 13, borderRadius: 8, padding: "4px 12px" }}>−20%</div>
            <button onClick={() => setWishlist(!wishlist)} style={{ position: "absolute", top: 16, right: 16, background: "#fff", border: "1px solid #E8E4D9", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {wishlist ? "❤️" : "🤍"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {PRODUCT.images.map((img, i) => (
              <button key={i} className="thumb" onClick={() => setActiveImage(i)} style={{ flex: 1, aspectRatio: "1/1", background: "#F0EDE4", border: `2px solid ${i === activeImage ? "#2D4A22" : "#E8E4D9"}`, borderRadius: 12, cursor: "pointer", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}>
                {img}
              </button>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div style={{ animation: "fadeUp 0.5s ease 0.1s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: "#2D4A22", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{PRODUCT.brand}</span>
            <span style={{ background: "#E8F5E1", color: "#2D4A22", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>✓ Orgánico</span>
            <span style={{ background: "#FFF3CD", color: "#856404", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>🏆 Más vendido</span>
          </div>

          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginBottom: 12 }}>{PRODUCT.name}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Stars rating={PRODUCT.rating} size={18} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>{PRODUCT.rating}</span>
            <span style={{ fontSize: 13, color: "#888" }}>({PRODUCT.reviews} reseñas)</span>
            <span style={{ color: "#E8E4D9" }}>|</span>
            <span style={{ fontSize: 13, color: "#888" }}>{PRODUCT.sold.toLocaleString("es-CL")} vendidos</span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24, padding: "16px 0", borderTop: "1px solid #E8E4D9", borderBottom: "1px solid #E8E4D9" }}>
            <span style={{ fontFamily: "'Lora', serif", fontSize: 38, fontWeight: 700, color: "#2D4A22" }}>${price.toLocaleString("es-CL")}</span>
            <span style={{ fontSize: 18, color: "#bbb", textDecoration: "line-through" }}>${Math.round(price / 0.8).toLocaleString("es-CL")}</span>
            <span style={{ background: "#F5B731", color: "#1a1a1a", fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
              Ahorras ${(Math.round(price / 0.8) - price).toLocaleString("es-CL")}
            </span>
          </div>

          {/* Variants */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#444", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Formato</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {PRODUCT.variants.map((v, i) => (
                <button key={i} className="variant-btn" onClick={() => setActiveVariant(i)} style={{ padding: "9px 18px", borderRadius: 10, cursor: "pointer", border: `2px solid ${i === activeVariant ? "#2D4A22" : "#E8E4D9"}`, background: i === activeVariant ? "#E8F5E1" : "#fff", color: i === activeVariant ? "#2D4A22" : "#555", fontWeight: 700, fontSize: 13, transition: "all 0.2s", fontFamily: "'Nunito Sans', sans-serif" }}>
                  {v.label}
                  <div style={{ fontSize: 11, fontWeight: 400, color: i === activeVariant ? "#2D4A22" : "#999" }}>${v.price.toLocaleString("es-CL")}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5B731" }} />
            <span style={{ fontSize: 13, color: "#b45309", fontWeight: 600 }}>¡Solo quedan {PRODUCT.stock} unidades!</span>
          </div>

          {/* Qty + Cart */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", border: "2px solid #E8E4D9", borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 50, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#444", fontWeight: 700 }}>−</button>
              <span style={{ width: 40, textAlign: "center", fontWeight: 700, fontSize: 17 }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(PRODUCT.stock, q + 1))} style={{ width: 44, height: 50, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#444", fontWeight: 700 }}>+</button>
            </div>
            <button onClick={handleAddToCart} style={{ flex: 1, background: cartAdded ? "#52B788" : "#2D4A22", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", transition: "background 0.3s ease", padding: "0 20px" }}>
              {cartAdded ? "✓ Agregado al carrito" : `🛒 Agregar · $${(price * qty).toLocaleString("es-CL")}`}
            </button>
          </div>

          <button style={{ width: "100%", background: "#F0EDE4", color: "#2D4A22", border: "2px solid #2D4A22", borderRadius: 12, fontWeight: 700, fontSize: 15, padding: "13px", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", marginBottom: 22 }}>
            ⚡ Comprar ahora
          </button>

          {/* Delivery */}
          <div style={{ background: "#F0EDE4", borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[["🚚", "Envío gratis en pedidos sobre $25.000"], ["📦", "Despacho en 24–48 hrs hábiles"], ["🔄", "Devolución gratuita en 30 días"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 17 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#555" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ maxWidth: 1200, margin: "0 auto 60px", padding: "0 5%" }}>
        <div style={{ display: "flex", borderBottom: "2px solid #E8E4D9", marginBottom: 32 }}>
          {[["descripcion", "Descripción"], ["nutricional", "Info Nutricional"], ["resenas", `Reseñas (${PRODUCT.reviews})`]].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{ padding: "14px 28px", fontSize: 15, fontWeight: 700, color: activeTab === key ? "#2D4A22" : "#999", borderBottom: `2px solid ${activeTab === key ? "#2D4A22" : "transparent"}`, marginBottom: -2, border: "none", background: "none", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", transition: "color 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === "descripcion" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, animation: "fadeUp 0.3s ease" }}>
            <div>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#444", marginBottom: 28 }}>{PRODUCT.description}</p>
              <h3 style={{ fontFamily: "'Lora', serif", fontSize: 20, marginBottom: 16 }}>Características</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {PRODUCT.highlights.map(h => (
                  <li key={h} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "#444" }}>
                    <span style={{ width: 22, height: 22, background: "#E8F5E1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#2D4A22", flexShrink: 0 }}>✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: "#F0EDE4", borderRadius: 20, padding: "28px 24px" }}>
              <h3 style={{ fontFamily: "'Lora', serif", fontSize: 20, marginBottom: 16 }}>Cómo usarlo</h3>
              {[["🥗", "Ensaladas", "Perfecto para aderezar en crudo"], ["🍝", "Pastas", "Añade un hilo al finalizar"], ["🍞", "Pan artesanal", "Para mojar y disfrutar"], ["🐟", "Pescados", "Realza sabores del mar"]].map(([icon, tip, desc]) => (
                <div key={tip} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "center" }}>
                  <span style={{ fontSize: 26 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{tip}</div>
                    <div style={{ fontSize: 13, color: "#777" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nutricional" && (
          <div style={{ maxWidth: 520, animation: "fadeUp 0.3s ease" }}>
            <div style={{ background: "#fff", border: "2px solid #E8E4D9", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ background: "#2D4A22", color: "#fff", padding: "16px 24px" }}>
                <h3 style={{ fontFamily: "'Lora', serif", fontSize: 20 }}>Información Nutricional</h3>
                <p style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Por 100ml</p>
              </div>
              <div style={{ padding: "0 24px" }}>
                {PRODUCT.nutrition.map((item, i) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "13px 0", borderBottom: i < PRODUCT.nutrition.length - 1 ? "1px solid #F0EDE4" : "none" }}>
                    <span style={{ fontSize: 15, color: "#444" }}>{item.label}</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "resenas" && (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48, animation: "fadeUp 0.3s ease" }}>
            <div>
              <div style={{ textAlign: "center", background: "#F0EDE4", borderRadius: 20, padding: "28px 24px", marginBottom: 20 }}>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 60, fontWeight: 700, lineHeight: 1 }}>{PRODUCT.rating}</div>
                <Stars rating={PRODUCT.rating} size={22} />
                <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>({PRODUCT.reviews} reseñas)</div>
              </div>
              <RatingBar label="5" value={248} total={311} />
              <RatingBar label="4" value={43} total={311} />
              <RatingBar label="3" value={12} total={311} />
              <RatingBar label="2" value={5} total={311} />
              <RatingBar label="1" value={3} total={311} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {REVIEWS.map(r => (
                <div key={r.id} style={{ background: "#fff", border: "1px solid #E8E4D9", borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#2D4A22", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>{r.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                        {r.verified && <span style={{ background: "#E8F5E1", color: "#2D4A22", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>✓ Verificado</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>{r.date}</div>
                    </div>
                    <Stars rating={r.rating} size={14} />
                  </div>
                  <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{r.title}</h4>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RELATED */}
      <div style={{ background: "#F0EDE4", padding: "48px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700, marginBottom: 24 }}>También te puede gustar</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {RELATED.map(p => (
              <div key={p.id} className="related-card" style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8E4D9", overflow: "hidden", transition: "all 0.3s ease", cursor: "pointer" }}>
                <div style={{ background: "#FAF8F3", padding: "24px", textAlign: "center", fontSize: 52 }}>{p.emoji}</div>
                <div style={{ padding: "12px 14px 16px" }}>
                  <h4 style={{ fontFamily: "'Lora', serif", fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{p.name}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>${p.price.toLocaleString("es-CL")}</span>
                    <span style={{ color: "#F5B731", fontSize: 12 }}>★ {p.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ background: "#1a2e12", color: "#fff", padding: "22px 5%", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
          <span>🌿</span>
          <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 16 }}>La Despensa</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>© 2025 La Despensa · Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
