import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    id: 1,
    tag: "Oferta de la semana",
    title: "Aceite de Oliva\nExtra Virgen",
    desc: "Prensado en frío, directo del productor. 20% de descuento.",
    badge: "−20%",
    bg: "#2D4A22",
    accent: "#A8C572",
    img: "🫒",
  },
  {
    id: 2,
    tag: "Nuevo ingreso",
    title: "Miel Orgánica\nde Montaña",
    desc: "Recolectada artesanalmente. Sin conservantes ni aditivos.",
    badge: "NUEVO",
    bg: "#5C3A00",
    accent: "#F5B731",
    img: "🍯",
  },
  {
    id: 3,
    tag: "Pack especial",
    title: "Box Gourmet\nde Temporada",
    desc: "Selección premium de 12 productos artesanales.",
    badge: "−30%",
    bg: "#3A1A2E",
    accent: "#D08BC5",
    img: "🧺",
  },
];

const CATEGORIES = [
  { icon: "🥩", name: "Carnes & Embutidos" },
  { icon: "🧀", name: "Lácteos & Quesos" },
  { icon: "🫙", name: "Conservas" },
  { icon: "🍷", name: "Bebidas" },
  { icon: "🍞", name: "Panadería" },
  { icon: "🌿", name: "Orgánicos" },
];

const PRODUCTS = [
  { id: 1, name: "Queso Manchego Curado", price: 12990, unit: "300g", rating: 4.8, reviews: 124, emoji: "🧀", badge: "Favorito", badgeColor: "#A8C572" },
  { id: 2, name: "Jamón Serrano 18 meses", price: 18500, unit: "200g", rating: 4.9, reviews: 87, emoji: "🥩", badge: "Premium", badgeColor: "#D08BC5" },
  { id: 3, name: "Mermelada de Frambuesa", price: 5990, unit: "400g", rating: 4.6, reviews: 203, emoji: "🍓", badge: null, badgeColor: null },
  { id: 4, name: "Aceite de Oliva EVOO", price: 9490, unit: "500ml", rating: 4.9, reviews: 311, emoji: "🫒", badge: "−20%", badgeColor: "#F5B731" },
  { id: 5, name: "Vino Tinto Reserva", price: 14990, unit: "750ml", rating: 4.7, reviews: 156, emoji: "🍷", badge: null, badgeColor: null },
  { id: 6, name: "Miel Orgánica Pura", price: 7990, unit: "500g", rating: 4.8, reviews: 98, emoji: "🍯", badge: "Nuevo", badgeColor: "#F5B731" },
];

function Stars({ rating }) {
  return (
    <span style={{ color: "#F5B731", fontSize: 13 }}>
      {"★".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "½" : ""}
      <span style={{ color: "#ccc", marginLeft: 4, fontSize: 12 }}>{rating} ({PRODUCTS.find(p => p.rating === rating)?.reviews ?? ""})</span>
    </span>
  );
}

function CartToast({ item, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 9999,
      background: "#1a2e12", color: "#fff", borderRadius: 14,
      padding: "14px 22px", display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      animation: "slideUp 0.3s ease",
      fontSize: 15, fontFamily: "'Lora', serif"
    }}>
      <span style={{ fontSize: 22 }}>{item.emoji}</span>
      <div>
        <div style={{ fontWeight: 600 }}>{item.name}</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>Agregado al carrito ✓</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const goSlide = (i) => {
    clearInterval(intervalRef.current);
    setSlide(i);
    intervalRef.current = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4500);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setToast(product);
  };

  const totalItems = cart.reduce((a, i) => a + i.qty, 0);
  const currentSlide = SLIDES[slide];

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: "#FAF8F3", minHeight: "100vh", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important; }
        .add-btn:hover { background: #2D4A22 !important; color: #fff !important; }
        .cat-item:hover { background: #fff !important; box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
        .nav-link:hover { color: #2D4A22; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(250,248,243,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E8E4D9",
        padding: "0 5%", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 68
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 28 }}>🌿</span>
          <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 22, color: "#2D4A22", letterSpacing: -0.5 }}>
            TonyRolls
          </span>
        </div>

        <div style={{ display: "flex", gap: 32, fontSize: 15, fontWeight: 600 }}>
          {["Inicio", "Productos", "Categorías", "Ofertas", "Nosotros"].map(link => (
            <a key={link} href="#" className="nav-link"
              style={{ color: "#444", textDecoration: "none", transition: "color 0.2s" }}>
              {link}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>🔍</button>
          <button style={{
            position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 20
          }}>
            🛒
            {totalItems > 0 && (
              <span style={{
                position: "absolute", top: -6, right: -8,
                background: "#2D4A22", color: "#fff",
                borderRadius: "50%", width: 18, height: 18,
                fontSize: 11, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{totalItems}</span>
            )}
          </button>
          <button style={{
            background: "#2D4A22", color: "#fff", border: "none",
            borderRadius: 24, padding: "8px 20px", fontWeight: 700, fontSize: 14,
            cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif"
          }}>
            Ingresar
          </button>
        </div>
      </nav>

      {/* HERO SLIDER */}
      <div style={{
        background: currentSlide.bg,
        transition: "background 0.6s ease",
        padding: "0 5%",
        minHeight: 480,
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)",
          fontSize: 200, opacity: 0.12, userSelect: "none", pointerEvents: "none",
          animation: "fadeIn 0.5s ease"
        }}>
          {currentSlide.img}
        </div>

        <div style={{ maxWidth: 600, position: "relative", zIndex: 2, animation: "fadeIn 0.5s ease" }} key={slide}>
          <div style={{
            display: "inline-block",
            background: currentSlide.accent, color: "#1a1a1a",
            borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", marginBottom: 16
          }}>
            {currentSlide.tag}
          </div>

          <h1 style={{
            fontFamily: "'Lora', serif", fontWeight: 700,
            fontSize: "clamp(36px, 5vw, 62px)",
            color: "#fff", lineHeight: 1.15, marginBottom: 16,
            whiteSpace: "pre-line"
          }}>
            {currentSlide.title}
          </h1>

          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 18, marginBottom: 32, maxWidth: 440 }}>
            {currentSlide.desc}
          </p>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button style={{
              background: currentSlide.accent, color: "#1a1a1a",
              border: "none", borderRadius: 28, padding: "14px 32px",
              fontWeight: 700, fontSize: 16, cursor: "pointer",
              fontFamily: "'Nunito Sans', sans-serif"
            }}>
              Ver oferta →
            </button>
            <span style={{
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 28, padding: "14px 24px", fontWeight: 700, fontSize: 18
            }}>
              {currentSlide.badge}
            </span>
          </div>
        </div>

        {/* Dots */}
        <div style={{
          position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 8
        }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goSlide(i)} style={{
              width: i === slide ? 28 : 8, height: 8,
              borderRadius: 4, border: "none", cursor: "pointer",
              background: i === slide ? currentSlide.accent : "rgba(255,255,255,0.35)",
              transition: "all 0.3s ease", padding: 0
            }} />
          ))}
        </div>

        {/* Arrows */}
        <button onClick={() => goSlide((slide - 1 + SLIDES.length) % SLIDES.length)} style={{
          position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff", borderRadius: "50%", width: 44, height: 44,
          fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
        }}>‹</button>
        <button onClick={() => goSlide((slide + 1) % SLIDES.length)} style={{
          position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff", borderRadius: "50%", width: 44, height: 44,
          fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
        }}>›</button>
      </div>

      {/* CATEGORÍAS */}
      <div style={{ padding: "60px 5%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 30, fontWeight: 700, color: "#1a1a1a" }}>
            Explora por categoría
          </h2>
          <a href="#" style={{ color: "#2D4A22", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Ver todas →
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="cat-item" style={{
              background: "#F0EDE4", borderRadius: 16, padding: "24px 16px",
              textAlign: "center", cursor: "pointer",
              transition: "all 0.25s ease", border: "1px solid #E8E4D9"
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{cat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#444" }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BANNER INFO */}
      <div style={{ background: "#2D4A22", padding: "40px 5%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 32 }}>
        {[
          { icon: "🚚", title: "Envío gratis", desc: "En pedidos sobre $25.000" },
          { icon: "🌱", title: "100% orgánico", desc: "Productos naturales y certificados" },
          { icon: "🤝", title: "Productor directo", desc: "Sin intermediarios" },
          { icon: "🔄", title: "Devolución fácil", desc: "30 días garantía" },
        ].map(item => (
          <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 32 }}>{item.icon}</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{item.title}</div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCTOS DESTACADOS */}
      <div style={{ padding: "60px 5%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 30, fontWeight: 700 }}>Productos destacados</h2>
            <p style={{ color: "#777", marginTop: 6 }}>Selección de nuestros mejores productos artesanales</p>
          </div>
          <a href="#" style={{ color: "#2D4A22", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Ver catálogo completo →
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 24 }}>
          {PRODUCTS.map(product => (
            <div key={product.id} className="product-card" style={{
              background: "#fff", borderRadius: 18,
              border: "1px solid #E8E4D9",
              overflow: "hidden", transition: "all 0.3s ease",
              cursor: "pointer"
            }}>
              <div style={{
                background: "#FAF8F3", padding: "32px 24px",
                textAlign: "center", position: "relative"
              }}>
                <span style={{ fontSize: 72 }}>{product.emoji}</span>
                {product.badge && (
                  <span style={{
                    position: "absolute", top: 12, right: 12,
                    background: product.badgeColor, color: "#1a1a1a",
                    fontSize: 11, fontWeight: 700, padding: "3px 10px",
                    borderRadius: 20, letterSpacing: 0.5
                  }}>{product.badge}</span>
                )}
              </div>
              <div style={{ padding: "16px 20px 20px" }}>
                <p style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  {product.unit}
                </p>
                <h3 style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>
                  {product.name}
                </h3>
                <div style={{ marginBottom: 14 }}>
                  <span style={{ color: "#F5B731", fontSize: 13 }}>{"★".repeat(Math.floor(product.rating))}</span>
                  <span style={{ color: "#bbb", fontSize: 12, marginLeft: 4 }}>
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: 19, color: "#1a1a1a" }}>
                    ${product.price.toLocaleString("es-CL")}
                  </span>
                  <button className="add-btn" onClick={() => addToCart(product)} style={{
                    background: "#F0EDE4", color: "#2D4A22",
                    border: "none", borderRadius: 20, padding: "8px 16px",
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    transition: "all 0.2s ease", fontFamily: "'Nunito Sans', sans-serif"
                  }}>
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#1a2e12", color: "#fff", padding: "50px 5% 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🌿</span>
              <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 20 }}>TonyRolls</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7 }}>
              CoM3 RoLLs :) es tu tienda online de productos gourmet artesanales. Conecta con productores locales y disfruta de lo mejor de la gastronomía en tu hogar.
            </p>
          </div>
          {[
            { title: "Empresa", links: ["Quiénes somos", "Productores", "Blog", "Sustentabilidad"] },
            { title: "Ayuda", links: ["Envíos", "Devoluciones", "FAQ", "Contacto"] },
            { title: "Legal", links: ["Términos", "Privacidad", "Cookies"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14, letterSpacing: 0.5 }}>{col.title}</h4>
              {col.links.map(link => (
                <div key={link} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: 14 }}>{link}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          © 2026 TonyRolls · Todos los derechos reservados
        </div>
      </footer>

      {toast && <CartToast item={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
