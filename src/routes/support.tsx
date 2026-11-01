import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [{ title: "Support | Plan Faith" }],
  }),
  component: SupportPage,
});

const EMAIL = "support.fakko.solutions@gmail.com";
const COMPANY = "FAKKO SOLUTIONS LLC";

function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Open mailto with pre-filled subject/body
    const subject = encodeURIComponent(`Plan Faith Support Request from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", fontFamily: "sans-serif", padding: "48px 20px 80px",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <a href="/offer" style={{ color: "#c9a84c", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 32 }}>← Back</a>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, borderBottom: "1px solid rgba(201,168,76,0.2)", paddingBottom: 24 }}>
          <span style={{ fontSize: 28 }}>✨</span>
          <span style={{ color: "#c9a84c", fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>Plan Faith</span>
        </div>

        <h1 style={{ color: "#f0d080", fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 8 }}>Support</h1>
        <p style={{ color: "#6b5a2a", fontSize: 14, marginBottom: 36, lineHeight: 1.6 }}>
          We're here to help. Fill out the form below or email us directly at{" "}
          <a href={`mailto:${EMAIL}`} style={{ color: "#c9a84c" }}>{EMAIL}</a> and we'll respond within 24 hours.
        </p>

        {/* Common questions */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ color: "#c9a84c", fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 16 }}>
            Common Questions
          </h2>
          {[
            { q: "How do I access my content?", a: `Go to /faith-app and enter the email you used at checkout. You'll receive a magic code to log in.` },
            { q: "I didn't receive my login code.", a: "Check your spam/junk folder. If still missing, email us and we'll send it manually." },
            { q: "How do I request a refund?", a: "Email us within 30 days of purchase. We honor all refund requests, no questions asked." },
            { q: "Can I share my access with others?", a: "Your account is personal and non-transferable per our Terms of Service." },
          ].map((item, i) => (
            <details key={i} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, marginBottom: 10, overflow: "hidden",
            }}>
              <summary style={{
                color: "#d4c4a0", padding: "14px 16px", cursor: "pointer", fontSize: 14, fontWeight: 600,
              }}>
                {item.q}
              </summary>
              <p style={{ color: "#8a7a5a", padding: "0 16px 14px", margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>

        {/* Contact form */}
        <h2 style={{ color: "#c9a84c", fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 16 }}>
          Send a Message
        </h2>
        {sent ? (
          <div style={{
            background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: 16, padding: "24px", textAlign: "center",
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
            <p style={{ color: "#4ade80", fontFamily: "'Playfair Display', serif", fontSize: 18, margin: 0 }}>
              Your email client should have opened!
            </p>
            <p style={{ color: "#6b5a2a", fontSize: 13, marginTop: 8 }}>
              If it didn't, email us directly at <a href={`mailto:${EMAIL}`} style={{ color: "#c9a84c" }}>{EMAIL}</a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Your Name", value: name, set: setName, type: "text", placeholder: "John Smith" },
              { label: "Your Email", value: email, set: setEmail, type: "email", placeholder: "you@example.com" },
            ].map(f => (
              <div key={f.label}>
                <label style={{ color: "#8a7a5a", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                  {f.label}
                </label>
                <input
                  type={f.type} value={f.value} onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder} required
                  style={{
                    width: "100%", padding: "14px 16px", borderRadius: 12,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.2)",
                    color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "sans-serif",
                  }}
                />
              </div>
            ))}
            <div>
              <label style={{ color: "#8a7a5a", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                Message
              </label>
              <textarea
                value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Describe your issue or question..." required rows={5}
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12, resize: "vertical",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.2)",
                  color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "sans-serif",
                }}
              />
            </div>
            <button type="submit" style={{
              padding: "16px", borderRadius: 50, border: "none",
              background: "linear-gradient(135deg, #c9a84c, #f0d080)",
              color: "#1a1200", fontWeight: 700, fontSize: 16, cursor: "pointer",
              fontFamily: "'Playfair Display', serif",
            }}>
              Send Message →
            </button>
          </form>
        )}

        <div style={{ marginTop: 60, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
          <p style={{ color: "#4a4a4a", fontSize: 12, textAlign: "center" }}>© {new Date().getFullYear()} {COMPANY} · {EMAIL}</p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            {[{href:"/privacy",label:"Privacy Policy"},{href:"/terms",label:"Terms of Service"},{href:"/refund",label:"Refund Policy"},{href:"/support",label:"Support"}].map(l=>(
              <a key={l.href} href={l.href} style={{ color: "#4a4a4a", fontSize: 11, textDecoration: "none" }}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
