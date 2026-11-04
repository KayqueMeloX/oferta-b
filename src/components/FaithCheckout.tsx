import { useState } from "react";
import { PAYMENT_LINKS } from "../config/payment";

// ─── Plan definitions ─────────────────────────────────────────────────────────

const PLANS: Record<string, {
  id: string; name: string; price: number;
  tag: string; description: string;
  includes: string[]; badge?: string;
}> = {
  "27": {
    id: "seed-27",
    name: "Seed of Faith",
    price: 27,
    tag: "Starter",
    description: "Begin your faith journey with the core blueprint and your personalized script.",
    badge: undefined,
    includes: [
      "Faith & Abundance Blueprint (21-Day Program)",
      "Your Personalized Manifestation Script",
      "Access to Members Area",
      "Email Support",
    ],
  },
  "47": {
    id: "seed-47",
    name: "Roots of Faith",
    price: 47,
    tag: "Most Popular",
    description: "Deepen your roots with bonus materials and audio prayers.",
    badge: "⭐ MOST POPULAR",
    includes: [
      "Everything in Seed of Faith",
      "777 Biblical Affirmations",
      "Sacred Morning Ritual",
      "4 Prayer Audio Tracks",
      "Priority Email Support",
    ],
  },
  "77": {
    id: "seed-77",
    name: "Harvest of Faith",
    price: 77,
    tag: "Best Value",
    description: "The complete harvest — every tool you need to walk in divine abundance.",
    badge: "🏆 BEST VALUE",
    includes: [
      "Everything in Roots of Faith",
      "Miracle Journal (Digital)",
      "Prophetic Wealth Code",
      "Weekly Group Prayer (Zoom)",
      "VIP Email Support",
    ],
  },
  "100": {
    id: "seed-100",
    name: "Legacy of Faith",
    price: 100,
    tag: "Complete",
    description: "Leave a legacy. The ultimate package with lifetime access to all content.",
    badge: "👑 COMPLETE",
    includes: [
      "Everything in Harvest of Faith",
      "Lifetime Access to All Updates",
      "1-on-1 Faith Coaching Session",
      "Private Community Access",
      "Legacy Certificate of Faith",
    ],
  },
};

// ─── Checkout component ────────────────────────────────────────────────────────

export function FaithCheckout() {
  const [planKey, setPlanKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("plan");
      if (p && PLANS[p]) return p;
    }
    return "27";
  });

  const plan = PLANS[planKey] ?? PLANS["27"];
  const [loading, setLoading] = useState(false);

  function handleBuy() {
    setLoading(true);

    const link = PAYMENT_LINKS[plan.id];
    if (link && !link.includes("CONFIGURE_SEU_LINK_AQUI")) {
      window.location.href = link;
    } else {
      setTimeout(() => {
        alert("Payment link not configured yet in src/config/payment.ts");
        setLoading(false);
      }, 500);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1200 50%, #0a0a0a 100%)",
      fontFamily: "sans-serif",
      padding: "40px 16px 60px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg, #c9a84c, #f0d080)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px", fontSize: 28,
          boxShadow: "0 0 30px rgba(201,168,76,0.35)",
        }}>✨</div>
        <h1 style={{ color: "#c9a84c", fontSize: 22, margin: 0, fontFamily: "'Playfair Display', serif" }}>
          Plan Faith
        </h1>
        <p style={{ color: "#6b5a2a", fontSize: 12, margin: "4px 0 0" }}>
          Secure Checkout
        </p>
      </div>

      {/* Main card */}
      <div style={{
        width: "100%", maxWidth: 480,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,168,76,0.25)",
        borderRadius: 24, overflow: "hidden",
      }}>
        {/* Plan header */}
        <div style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.06))",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
          padding: "24px 24px 20px",
        }}>
          {plan.badge && (
            <div style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #c9a84c, #f0d080)",
              color: "#1a1200", fontSize: 11, fontWeight: 700,
              padding: "4px 12px", borderRadius: 20, marginBottom: 12,
              letterSpacing: 0.5,
            }}>
              {plan.badge}
            </div>
          )}
          <h2 style={{
            color: "#f0d080", fontSize: 24, margin: "0 0 4px",
            fontFamily: "'Playfair Display', serif",
          }}>
            {plan.name}
          </h2>
          <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>
            {plan.description}
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ color: "#f0d080", fontSize: 42, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
              ${plan.price}
            </span>
            <span style={{ color: "#6b5a2a", fontSize: 14 }}>one-time</span>
          </div>
        </div>

        {/* What's included */}
        <div style={{ padding: "20px 24px" }}>
          <p style={{ color: "#8a7a5a", fontSize: 12, fontWeight: 700, letterSpacing: 1, margin: "0 0 12px", textTransform: "uppercase" }}>
            What's included:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {plan.includes.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: "#c9a84c", fontSize: 16, flexShrink: 0, lineHeight: 1.4 }}>✓</span>
                <span style={{ color: "#d4c4a0", fontSize: 14, lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleBuy}
            disabled={loading}
            style={{
              width: "100%", padding: "18px", borderRadius: 50, border: "none",
              background: loading ? "#6b5a2a" : "linear-gradient(135deg, #c9a84c 0%, #f0d080 50%, #c9a84c 100%)",
              color: "#1a1200", fontWeight: 700, fontSize: 18, cursor: loading ? "wait" : "pointer",
              fontFamily: "'Playfair Display', serif",
              boxShadow: loading ? "none" : "0 4px 30px rgba(201,168,76,0.4)",
              transition: "all 0.3s",
            }}
          >
            {loading ? "Redirecting to payment..." : `Claim My ${plan.name} — $${plan.price}`}
          </button>

          {/* Trust badges */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 20, marginTop: 18, flexWrap: "wrap",
          }}>
            {["🔒 Secure Checkout", "✅ 30-Day Guarantee", "⚡ Instant Access"].map(b => (
              <span key={b} style={{ color: "#6b5a2a", fontSize: 11 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Switch plan */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <p style={{ color: "#8a7a5a", fontSize: 13, marginBottom: 10, fontWeight: 500 }}>Want a different plan?</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {Object.entries(PLANS).map(([key, p]) => {
            const isSelected = key === planKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPlanKey(key);
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.set("plan", key);
                    window.history.replaceState({}, "", url.toString());
                  }
                }}
                style={{
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(201,168,76,0.35), rgba(240,208,128,0.2))"
                    : "rgba(255,255,255,0.05)",
                  border: `1.5px solid ${isSelected ? "#f0d080" : "rgba(255,255,255,0.12)"}`,
                  color: isSelected ? "#f0d080" : "#a89b80",
                  boxShadow: isSelected ? "0 0 16px rgba(201,168,76,0.35)" : "none",
                  transform: isSelected ? "scale(1.04)" : "scale(1)",
                  transition: "all 0.15s ease",
                  outline: "none",
                }}
              >
                {p.tag} — ${p.price}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer links */}
      <div style={{ marginTop: 32, display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/terms", label: "Terms of Service" },
          { href: "/refund", label: "Refund Policy" },
          { href: "/support", label: "Support" },
        ].map(l => (
          <a key={l.href} href={l.href} style={{ color: "#4a4a4a", fontSize: 11, textDecoration: "none" }}>
            {l.label}
          </a>
        ))}
      </div>
      <p style={{ color: "#2a2a2a", fontSize: 10, marginTop: 12, textAlign: "center" }}>
        © {new Date().getFullYear()} FAKKO SOLUTIONS LLC · support.fakko.solutions@gmail.com
      </p>
    </div>
  );
}
