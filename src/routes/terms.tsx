import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms of Service | Plan Faith" }],
  }),
  component: TermsPage,
});

const COMPANY = "FAKKO SOLUTIONS LLC";
const EMAIL = "support.fakko.solutions@gmail.com";

function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#d4c4a0",
      fontFamily: "sans-serif",
      padding: "48px 20px 80px",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/offer" style={{ color: "#c9a84c", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 32 }}>
          ← Back
        </a>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginBottom: 40,
          borderBottom: "1px solid rgba(201,168,76,0.2)", paddingBottom: 24,
        }}>
          <span style={{ fontSize: 28 }}>✨</span>
          <span style={{ color: "#c9a84c", fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>
            Plan Faith
          </span>
        </div>
        <h1 style={{ color: "#f0d080", fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 8 }}>
          {title}
        </h1>
        <p style={{ color: "#6b5a2a", fontSize: 13, marginBottom: 36 }}>
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <div style={{ lineHeight: 1.8, fontSize: 15 }}>
          {children}
        </div>
        <div style={{ marginTop: 60, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
          <p style={{ color: "#4a4a4a", fontSize: 12, textAlign: "center" }}>
            © {new Date().getFullYear()} {COMPANY} · {EMAIL}
          </p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            {[
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
              { href: "/refund", label: "Refund Policy" },
              { href: "/support", label: "Support" },
            ].map(l => (
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

function TermsPage() {
  return (
    <LegalShell title="Terms of Service">
      <P>
        Please read these Terms of Service carefully before using the Plan Faith platform operated by {COMPANY}. By accessing or using our service, you agree to be bound by these terms.
      </P>

      <H2>1. Acceptance of Terms</H2>
      <P>By purchasing or accessing Plan Faith content, you confirm that you are at least 18 years of age and agree to comply with these Terms of Service.</P>

      <H2>2. Digital Products & Access</H2>
      <P>Plan Faith offers digital products, including courses, audio content, and written materials. Upon purchase, you receive a personal, non-transferable license to access the purchased content through our members area.</P>
      <P>You may not share, reproduce, distribute, or resell any purchased content without prior written permission from {COMPANY}.</P>

      <H2>3. Payment</H2>
      <P>All prices are listed in US dollars. Payments are processed securely through our payment partners. By completing a purchase, you authorize the charge to your selected payment method.</P>

      <H2>4. Refunds</H2>
      <P>We offer a 30-day money-back guarantee on all purchases. Please see our <a href="/refund" style={{ color: "#c9a84c" }}>Refund Policy</a> for full details.</P>

      <H2>5. Disclaimer of Warranties</H2>
      <P>Plan Faith content is provided for inspirational and educational purposes only. Results are not guaranteed. Spiritual growth, financial outcomes, and personal transformation vary by individual and depend on your own efforts and circumstances.</P>

      <H2>6. Limitation of Liability</H2>
      <P>{COMPANY} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform or content.</P>

      <H2>7. Intellectual Property</H2>
      <P>All content, branding, and materials on the Plan Faith platform are the intellectual property of {COMPANY} or its licensors. Unauthorized use is strictly prohibited.</P>

      <H2>8. Modifications</H2>
      <P>We reserve the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the updated Terms.</P>

      <H2>9. Governing Law</H2>
      <P>These Terms shall be governed by the laws of the United States. Any disputes shall be resolved through binding arbitration.</P>

      <H2>10. Contact</H2>
      <P>Questions about these Terms? Contact us at <a href={`mailto:${EMAIL}`} style={{ color: "#c9a84c" }}>{EMAIL}</a>.</P>
    </LegalShell>
  );
}
