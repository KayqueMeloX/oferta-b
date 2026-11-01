import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Privacy Policy | Plan Faith" }],
  }),
  component: PrivacyPage,
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

function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <P>
        {COMPANY} ("we," "us," or "our") operates the Plan Faith platform. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.
      </P>

      <H2>1. Information We Collect</H2>
      <P>We collect information you provide directly to us, such as your name and email address when you create an account, make a purchase, or contact us for support.</P>
      <P>We may also collect usage data automatically, including IP address, browser type, pages visited, and time spent on our platform.</P>

      <H2>2. How We Use Your Information</H2>
      <P>We use your information to: provide and improve our services; process transactions and send related information; send promotional communications (with your consent); respond to comments and questions; and comply with legal obligations.</P>

      <H2>3. Information Sharing</H2>
      <P>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist in operating our platform, subject to confidentiality agreements.</P>

      <H2>4. Data Security</H2>
      <P>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</P>

      <H2>5. Cookies</H2>
      <P>We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences.</P>

      <H2>6. Your Rights</H2>
      <P>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at {EMAIL}.</P>

      <H2>7. Children's Privacy</H2>
      <P>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.</P>

      <H2>8. Changes to This Policy</H2>
      <P>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</P>

      <H2>9. Contact Us</H2>
      <P>If you have questions about this Privacy Policy, please contact us at <a href={`mailto:${EMAIL}`} style={{ color: "#c9a84c" }}>{EMAIL}</a>.</P>
    </LegalShell>
  );
}
