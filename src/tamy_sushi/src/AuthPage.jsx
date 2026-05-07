import { useState } from "react";

// ── SERVICIOS API ─────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const authApi = {
  login: (data) =>
    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  register: (data) =>
    fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
function InputField({ label, type = "text", id, value, onChange, error, placeholder, icon }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 7 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>
            {icon}
          </span>
        )}
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: `12px ${isPassword ? "44px" : "14px"} 12px ${icon ? "42px" : "14px"}`,
            borderRadius: 12,
            border: `1.5px solid ${error ? "#dc2626" : "#E8E4D9"}`,
            background: "#FAF8F3",
            fontSize: 14,
            fontFamily: "'Nunito Sans', sans-serif",
            color: "#1a1a1a",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = error ? "#dc2626" : "#2D4A22")}
          onBlur={(e) => (e.target.style.borderColor = error ? "#dc2626" : "#E8E4D9")}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#aaa" }}
          >
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 5, fontWeight: 600 }}>{error}</p>}
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginForm({ onSwitch, onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email inválido";
    if (!form.password) errs.password = "La contraseña es obligatoria";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");
    try {
      const res = await authApi.login(form);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        onSuccess?.(res.user);
      } else {
        setApiError(res.message ?? "Error al iniciar sesión.");
      }
    } catch {
      setApiError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <InputField
        label="Correo electrónico" id="email" type="email" icon="✉️"
        value={form.email} onChange={set("email")}
        placeholder="tu@correo.cl" error={errors.email}
      />
      <InputField
        label="Contraseña" id="password" type="password" icon="🔒"
        value={form.password} onChange={set("password")}
        placeholder="••••••••" error={errors.password}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22, marginTop: -8 }}>
        <a href="#" style={{ fontSize: 13, color: "#2D4A22", fontWeight: 700, textDecoration: "none" }}>
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {apiError && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 18 }}>
          <p style={{ color: "#991b1b", fontSize: 13, fontWeight: 600 }}>⚠️ {apiError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%", background: loading ? "#7a9e6a" : "#2D4A22",
          color: "#fff", border: "none", borderRadius: 14,
          padding: "14px", fontWeight: 700, fontSize: 15,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Nunito Sans', sans-serif",
          transition: "background 0.2s", marginBottom: 16,
        }}
      >
        {loading ? "Ingresando..." : "Ingresar →"}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: "#E8E4D9" }} />
        <span style={{ fontSize: 12, color: "#aaa" }}>o continúa con</span>
        <div style={{ flex: 1, height: 1, background: "#E8E4D9" }} />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {[["Google", "🌐"], ["Facebook", "📘"]].map(([name, icon]) => (
          <button key={name} type="button" style={{
            flex: 1, background: "#fff", border: "1.5px solid #E8E4D9",
            borderRadius: 12, padding: "11px", fontWeight: 700, fontSize: 13,
            cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#444"
          }}>
            {icon} {name}
          </button>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 14, color: "#666" }}>
        ¿No tienes cuenta?{" "}
        <button type="button" onClick={onSwitch} style={{ background: "none", border: "none", color: "#2D4A22", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif" }}>
          Regístrate gratis
        </button>
      </p>
    </form>
  );
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
function RegisterForm({ onSwitch, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "El nombre es obligatorio";
    if (!form.email) errs.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email inválido";
    if (!form.password) errs.password = "La contraseña es obligatoria";
    else if (form.password.length < 8) errs.password = "Mínimo 8 caracteres";
    if (form.password !== form.password_confirmation) errs.password_confirmation = "Las contraseñas no coinciden";
    return errs;
  };

  const strength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLabel = ["", "Débil", "Regular", "Buena", "Fuerte"];
  const strengthColor = ["", "#dc2626", "#F5B731", "#2D4A22", "#166534"];
  const s = strength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");
    try {
      const res = await authApi.register(form);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        onSuccess?.(res.user);
      } else {
        setApiError(res.message ?? "Error al registrar cuenta.");
      }
    } catch {
      setApiError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <InputField
        label="Nombre completo" id="name" icon="👤"
        value={form.name} onChange={set("name")}
        placeholder="María José Torres" error={errors.name}
      />
      <InputField
        label="Correo electrónico" id="reg-email" type="email" icon="✉️"
        value={form.email} onChange={set("email")}
        placeholder="tu@correo.cl" error={errors.email}
      />
      <InputField
        label="Teléfono (opcional)" id="phone" icon="📱"
        value={form.phone} onChange={set("phone")}
        placeholder="+56 9 1234 5678"
      />
      <InputField
        label="Contraseña" id="reg-password" type="password" icon="🔒"
        value={form.password} onChange={set("password")}
        placeholder="Mínimo 8 caracteres" error={errors.password}
      />

      {/* Password strength */}
      {form.password.length > 0 && (
        <div style={{ marginTop: -10, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= s ? strengthColor[s] : "#E8E4D9", transition: "background 0.3s" }} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: strengthColor[s], fontWeight: 600 }}>
            Contraseña {strengthLabel[s]}
          </p>
        </div>
      )}

      <InputField
        label="Confirmar contraseña" id="confirm" type="password" icon="🔒"
        value={form.password_confirmation} onChange={set("password_confirmation")}
        placeholder="Repite tu contraseña" error={errors.password_confirmation}
      />

      {apiError && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 18 }}>
          <p style={{ color: "#991b1b", fontSize: 13, fontWeight: 600 }}>⚠️ {apiError}</p>
        </div>
      )}

      <div style={{ background: "#F0EDE4", borderRadius: 10, padding: "10px 14px", marginBottom: 18 }}>
        <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
          Al registrarte aceptas nuestros{" "}
          <a href="#" style={{ color: "#2D4A22", fontWeight: 700 }}>Términos de servicio</a>
          {" "}y nuestra{" "}
          <a href="#" style={{ color: "#2D4A22", fontWeight: 700 }}>Política de privacidad</a>.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%", background: loading ? "#7a9e6a" : "#2D4A22",
          color: "#fff", border: "none", borderRadius: 14,
          padding: "14px", fontWeight: 700, fontSize: 15,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Nunito Sans', sans-serif",
          transition: "background 0.2s", marginBottom: 20,
        }}
      >
        {loading ? "Creando cuenta..." : "Crear cuenta gratuita →"}
      </button>

      <p style={{ textAlign: "center", fontSize: 14, color: "#666" }}>
        ¿Ya tienes cuenta?{" "}
        <button type="button" onClick={onSwitch} style={{ background: "none", border: "none", color: "#2D4A22", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif" }}>
          Inicia sesión
        </button>
      </p>
    </form>
  );
}

// ── SUCCESS ───────────────────────────────────────────────────────────────────
function SuccessScreen({ user, onContinue }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0", animation: "popIn 0.5s ease" }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
        ¡Bienvenido, {user.name.split(" ")[0]}!
      </h2>
      <p style={{ color: "#777", fontSize: 15, marginBottom: 28 }}>
        Tu cuenta está lista. Ya puedes empezar a comprar.
      </p>
      <button
        onClick={onContinue}
        style={{
          background: "#2D4A22", color: "#fff", border: "none",
          borderRadius: 14, padding: "14px 36px", fontWeight: 700,
          fontSize: 15, cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif",
        }}
      >
        Ir a la tienda →
      </button>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register" | "success"
  const [user, setUser] = useState(null);

  const handleSuccess = (u) => {
    setUser(u);
    setMode("success");
  };

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: "#FAF8F3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { 0%{transform:scale(0.9);opacity:0} 60%{transform:scale(1.03)} 100%{transform:scale(1);opacity:1} }
        input::placeholder { color: #bbb; }
      `}</style>

      {/* Navbar mínimo */}
      <nav style={{ background: "rgba(250,248,243,0.97)", borderBottom: "1px solid #E8E4D9", padding: "0 5%", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 20 }}>🌿</span>
          <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 18, color: "#2D4A22" }}>La Despensa</span>
        </div>
        <a href="#" style={{ fontSize: 13, color: "#777", textDecoration: "none", fontWeight: 600 }}>← Volver a la tienda</a>
      </nav>

      {/* Contenido principal */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 58px)" }}>

        {/* Panel izquierdo — decorativo */}
        <div style={{
          background: "linear-gradient(160deg, #1a2e12 0%, #2D4A22 60%, #3d6b2e 100%)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "60px 10%", position: "relative", overflow: "hidden"
        }}>
          {/* Fondo decorativo */}
          <div style={{ position: "absolute", top: -40, right: -40, fontSize: 220, opacity: 0.06, userSelect: "none" }}>🌿</div>
          <div style={{ position: "absolute", bottom: -20, left: -20, fontSize: 160, opacity: 0.06, userSelect: "none" }}>🫒</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>🌿</div>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: 38, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
              Lo mejor del<br />campo, en tu mesa
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
              Productos artesanales y orgánicos, directamente de productores locales a tu hogar.
            </p>

            {/* Beneficios */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["🚚", "Envío gratis sobre $25.000"],
                ["🌱", "100% productos orgánicos certificados"],
                ["🤝", "Directo del productor, sin intermediarios"],
                ["🔄", "Devolución gratuita en 30 días"],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20, width: 32 }}>{icon}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ marginTop: 40, padding: "16px 18px", background: "rgba(255,255,255,0.1)", borderRadius: 14, backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex" }}>
                  {["MJ", "RA", "VC", "FM"].map((a, i) => (
                    <div key={a} style={{ width: 32, height: 32, borderRadius: "50%", background: "#A8C572", border: "2px solid #2D4A22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#1a2e12", marginLeft: i ? -8 : 0 }}>{a}</div>
                  ))}
                </div>
                <div>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>+1.284 clientes activos</p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>⭐⭐⭐⭐⭐ 4.9/5 en reseñas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 8%" }}>
          <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.4s ease" }}>

            {mode !== "success" && (
              <>
                {/* Toggle tabs */}
                <div style={{ display: "flex", background: "#F0EDE4", borderRadius: 14, padding: 4, marginBottom: 32 }}>
                  {[["login", "Iniciar sesión"], ["register", "Crear cuenta"]].map(([key, label]) => (
                    <button key={key} onClick={() => setMode(key)} style={{
                      flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                      border: "none", fontSize: 14, fontWeight: 700,
                      background: mode === key ? "#fff" : "transparent",
                      color: mode === key ? "#2D4A22" : "#999",
                      fontFamily: "'Nunito Sans', sans-serif",
                      boxShadow: mode === key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                      transition: "all 0.2s",
                    }}>
                      {label}
                    </button>
                  ))}
                </div>

                <h2 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700, marginBottom: 6, color: "#1a1a1a" }}>
                  {mode === "login" ? "Bienvenido de vuelta 👋" : "Crea tu cuenta 🌿"}
                </h2>
                <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>
                  {mode === "login"
                    ? "Ingresa con tu email y contraseña."
                    : "Regístrate gratis y empieza a comprar."}
                </p>
              </>
            )}

            {mode === "login" && (
              <LoginForm onSwitch={() => setMode("register")} onSuccess={handleSuccess} />
            )}
            {mode === "register" && (
              <RegisterForm onSwitch={() => setMode("login")} onSuccess={handleSuccess} />
            )}
            {mode === "success" && (
              <SuccessScreen user={user} onContinue={() => window.location.href = "/"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
