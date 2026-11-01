import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [{ title: "Refund Policy | Plan Faith" }],
  }),
  component: RefundPage,
});

const COMPANY = "FAKKO SOLUTIONS LLC";
const EMAIL = "support.fakko.solutions@gmail.com";

function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#d4c4a0",
      fontFamily: "sans-serif", padding: "48px 20px 80px",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/offer" style={{ color: "#c9a84c", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 32 }}>← Back</a>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, borderBottom: "1px solid rgba(201,168,76,0.2)", paddingBottom: 24 }}>
          <span style={{ fontSize: 28 }}>✨</span>
          <span style={{ color: "#c9a84c", fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>Plan Faith</span>
        </div>
        <h1 style={{ color: "#f0d080", fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 8 }}>{title}</h1>
        <p style={{ color: "#6b5a2a", fontSize: 13, marginBottom: 36 }}>
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <div style={{ lineHeight: 1.8, fontSize: 15 }}>{children}</div>
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
function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ color: "#c9a84c", fontFamily: "'Playfair Display', serif", fontSize: 20, margin: "32px 0 12px" }}>{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ color: "#a09070", marginBottom: 16 }}>{children}</p>;
}

function RefundPage() {
  return (
    <LegalShell title="Refund Policy">
      <div style={{
        background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
        border: "1px solid rgba(201,168,76,0.3)", borderRadius: 16, padding: "20px 24px", marginBottom: 32,
      }}>
        <p style={{ color: "#f0d080", fontSize: 18, fontFamily: "'Playfair Display', serif", margin: "0 0 6px", fontWeight: 700 }}>
          ✅ 30-Day Money-Back Guarantee
        </p>
        <p style={{ color: "#a09070", margin: 0, fontSize: 14 }}>
          We stand behind every product we offer. If you're not satisfied for any reason within 30 days of purchase, we'll refund you completely — no questions asked.
        </p>
      </div>

      <H2>How to Request a Refund</H2>
      <P>To request a refund, simply email us at <a href={`mailto:${EMAIL}`} style={{ color: "#c9a84c" }}>{EMAIL}</a> within 30 days of your purchase date. Include your order confirmation or the email address used at checkout.</P>
      <P>We process all refund requests within 3–5 business days. The refund will be credited back to your original payment method.</P>

      <H2>Eligibility</H2>
      <P>Refund requests must be submitted within 30 calendar days of the original purchase date. All digital products are eligible for a full refund within this window.</P>

      <H2>After Your Refund</H2>
      <P>Upon processing your refund, your access to the members area and all associated content will be revoked. Downloaded materials should be deleted in accordance with our Terms of Service.</P>

      <H2>Contact Us</H2>
      <P>Questions about refunds? We're here to help. Email us at <a href={`mailto:${EMAIL}`} style={{ color: "#c9a84c" }}>{EMAIL}</a> and we'll respond within 24 hours.</P>
    </LegalShell>
  );
}
