import { useState, useRef, useEffect } from "react";

// ─── Icons (inline SVG to avoid package deps) ────────────────────────────────

function IconHome({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 2} width={22} height={22}>
      <path d="M3 9.75L12 3l9 6.75V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.75z" />
      <path d="M9 22V12h6v10" strokeWidth={active ? 0 : 2} fill={active ? "none" : "none"} />
      {active && <path d="M9 22V12h6v10" fill="#1a1a1a" />}
    </svg>
  );
}

function IconLibrary({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} width={22} height={22}>
      <rect x="3" y="3" width="7" height="18" rx="1" />
      <rect x="14" y="3" width="7" height="18" rx="1" />
    </svg>
  );
}

function IconAudio({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} width={22} height={22}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" fill={active ? "#1a1a1a" : "none"} />
    </svg>
  );
}

function IconPray({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} width={22} height={22}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "home" | "library" | "audio" | "pray";

interface Session {
  email: string;
  plan: string;
}

// ─── Audio tracks ─────────────────────────────────────────────────────────────

const AUDIO_TRACKS = [
  {
    id: 1,
    title: "Morning Prayer of Faith",
    duration: "8:32",
    description: "Start your day aligned with divine purpose",
    src: "https://plan-faith.com/__l5e/assets-v1/audio-morning-prayer/morning-prayer.mp3",
  },
  {
    id: 2,
    title: "Abundance Activation",
    duration: "12:15",
    description: "Open your spirit to receive God's blessings",
    src: "https://plan-faith.com/__l5e/assets-v1/audio-abundance/abundance-activation.mp3",
  },
  {
    id: 3,
    title: "Deep Sleep & Protection",
    duration: "22:48",
    description: "Rest in the protection of divine love",
    src: "https://plan-faith.com/__l5e/assets-v1/audio-sleep/deep-sleep-protection.mp3",
  },
  {
    id: 4,
    title: "Faith Declaration",
    duration: "6:04",
    description: "Speak life and abundance into existence",
    src: "https://plan-faith.com/__l5e/assets-v1/audio-declaration/faith-declaration.mp3",
  },
];

// ─── Library items ─────────────────────────────────────────────────────────────

const LIBRARY_ITEMS = [
  {
    id: 1,
    title: "Faith & Abundance Blueprint",
    subtitle: "Complete 21-Day Program",
    icon: "📖",
    locked: false,
    badge: "FREE",
    badgeColor: "#c9a84c",
    href: "#",
  },
  {
    id: 2,
    title: "Your Personalized Manifestation Script",
    subtitle: "Based on your quiz answers",
    icon: "✨",
    locked: false,
    badge: "INCLUDED",
    badgeColor: "#c9a84c",
    href: "#",
  },
  {
    id: 3,
    title: "777 Biblical Affirmations",
    subtitle: "Daily declarations for wealth & health",
    icon: "📜",
    locked: false,
    badge: "BONUS",
    badgeColor: "#8b5cf6",
    href: "#",
  },
  {
    id: 4,
    title: "Sacred Morning Ritual",
    subtitle: "5-minute routine that changes everything",
    icon: "🌅",
    locked: false,
    badge: "BONUS",
    badgeColor: "#8b5cf6",
    href: "#",
  },
  {
    id: 5,
    title: "Miracle Journal (Digital)",
    subtitle: "Track God's faithfulness daily",
    icon: "📓",
    locked: true,
    badge: "UPGRADE",
    badgeColor: "#64748b",
    href: "/offer",
  },
  {
    id: 6,
    title: "Prophetic Wealth Code",
    subtitle: "Unlock hidden biblical principles of abundance",
    icon: "🔐",
    locked: true,
    badge: "UPGRADE",
    badgeColor: "#64748b",
    href: "/offer",
  },
];

// ─── Prayer declarations ───────────────────────────────────────────────────────

const DECLARATIONS = [
  "I declare that I walk in divine favor and every door that was closed is now open.",
  "I am blessed and highly favored. Abundance flows to me from every direction.",
  "God's plan for my life is good, full of hope and a future beyond what I can imagine.",
  "I release every burden, every fear, every doubt. My faith is my shield.",
  "I attract blessings, opportunities, and miracles. Today, something amazing happens for me.",
  "I speak life over my family, my finances, and my future. In Jesus' name, Amen.",
];

// ─── Gate / Login Screen ───────────────────────────────────────────────────────

function GateScreen({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Enter a valid email."); return; }
    setError("");
    setLoading(true);
    // Simulate sending code
    setTimeout(() => { setLoading(false); setStep("code"); }, 1200);
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 4) { setError("Enter the code you received."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const session: Session = { email, plan: "seed-27" };
      localStorage.setItem("faith_app_session", JSON.stringify(session));
      setLoading(false);
      onLogin(session);
    }, 1000);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1200 50%, #0a0a0a 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Playfair Display', serif",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, #c9a84c, #f0d080)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 0 40px rgba(201,168,76,0.4)",
          fontSize: 36,
        }}>✨</div>
        <h1 style={{ color: "#c9a84c", fontSize: 28, margin: 0, fontWeight: 700 }}>
          Plan Faith
        </h1>
        <p style={{ color: "#8a7a5a", margin: "8px 0 0", fontSize: 14, fontFamily: "sans-serif" }}>
          Members Area — Access your content
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,168,76,0.25)",
        borderRadius: 20,
        padding: "36px 28px",
        width: "100%",
        maxWidth: 380,
        backdropFilter: "blur(12px)",
      }}>
        {step === "email" ? (
          <form onSubmit={handleSendCode}>
            <h2 style={{ color: "#fff", fontSize: 20, margin: "0 0 8px", textAlign: "center" }}>
              Enter your email
            </h2>
            <p style={{ color: "#8a7a5a", fontSize: 13, textAlign: "center", margin: "0 0 24px", fontFamily: "sans-serif" }}>
              We'll send you a magic code to access your content.
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,168,76,0.3)",
                color: "#fff", fontSize: 16, outline: "none",
                fontFamily: "sans-serif", boxSizing: "border-box", marginBottom: 8,
              }}
            />
            {error && <p style={{ color: "#f87171", fontSize: 13, margin: "4px 0 8px", fontFamily: "sans-serif" }}>{error}</p>}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "15px", borderRadius: 12, border: "none",
              background: loading ? "#6b5a2a" : "linear-gradient(135deg, #c9a84c, #f0d080)",
              color: "#1a1200", fontWeight: 700, fontSize: 16, cursor: loading ? "wait" : "pointer",
              marginTop: 8, fontFamily: "'Playfair Display', serif",
            }}>
              {loading ? "Sending..." : "Send My Code →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <h2 style={{ color: "#fff", fontSize: 20, margin: "0 0 8px", textAlign: "center" }}>
              Check your inbox
            </h2>
            <p style={{ color: "#8a7a5a", fontSize: 13, textAlign: "center", margin: "0 0 24px", fontFamily: "sans-serif" }}>
              We sent a code to <strong style={{ color: "#c9a84c" }}>{email}</strong>. Enter it below.
            </p>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,168,76,0.3)",
                color: "#fff", fontSize: 24, outline: "none", textAlign: "center",
                letterSpacing: 8, fontFamily: "monospace", boxSizing: "border-box", marginBottom: 8,
              }}
            />
            {error && <p style={{ color: "#f87171", fontSize: 13, margin: "4px 0 8px", fontFamily: "sans-serif" }}>{error}</p>}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "15px", borderRadius: 12, border: "none",
              background: loading ? "#6b5a2a" : "linear-gradient(135deg, #c9a84c, #f0d080)",
              color: "#1a1200", fontWeight: 700, fontSize: 16, cursor: loading ? "wait" : "pointer",
              marginTop: 8, fontFamily: "'Playfair Display', serif",
            }}>
              {loading ? "Verifying..." : "Access My Content →"}
            </button>
            <button type="button" onClick={() => setStep("email")} style={{
              background: "none", border: "none", color: "#8a7a5a", fontSize: 13,
              cursor: "pointer", width: "100%", marginTop: 12, fontFamily: "sans-serif",
            }}>
              ← Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({ session }: { session: Session }) {
  const firstName = session.email.split("@")[0].split(".")[0];
  const capitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const stats = [
    { label: "Day Streak", value: "1", icon: "🔥" },
    { label: "Declarations", value: "0", icon: "📜" },
    { label: "Minutes Listened", value: "0", icon: "🎵" },
  ];

  const journey = [
    { title: "Complete the Quiz", done: true, emoji: "✅" },
    { title: "Watch the Welcome Video", done: false, emoji: "🎬" },
    { title: "Read Your Manifestation Script", done: false, emoji: "✨" },
    { title: "First Morning Declaration", done: false, emoji: "🌅" },
    { title: "First Audio Prayer", done: false, emoji: "🎵" },
  ];

  return (
    <div style={{ padding: "24px 20px 100px" }}>
      {/* Welcome */}
      <div style={{
        background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
        border: "1px solid rgba(201,168,76,0.3)",
        borderRadius: 20, padding: "24px 20px", marginBottom: 24,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
        <h2 style={{ color: "#f0d080", fontSize: 22, margin: "0 0 8px", fontFamily: "'Playfair Display', serif" }}>
          Welcome, {capitalized}!
        </h2>
        <p style={{ color: "#c9a84c", fontSize: 14, margin: 0, fontFamily: "sans-serif", lineHeight: 1.5 }}>
          Your faith journey has begun. God's plan for your life is unfolding — one step at a time.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: 14, padding: "16px 8px", textAlign: "center",
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ color: "#f0d080", fontSize: 22, fontWeight: 700, fontFamily: "sans-serif" }}>{s.value}</div>
            <div style={{ color: "#8a7a5a", fontSize: 11, fontFamily: "sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Journey checklist */}
      <h3 style={{ color: "#c9a84c", fontSize: 16, margin: "0 0 14px", fontFamily: "'Playfair Display', serif" }}>
        Your Faith Journey
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {journey.map((j, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            background: j.done ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${j.done ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 14, padding: "14px 16px",
          }}>
            <span style={{ fontSize: 20 }}>{j.emoji}</span>
            <span style={{
              color: j.done ? "#f0d080" : "#8a7a5a",
              fontSize: 14, fontFamily: "sans-serif",
              textDecoration: j.done ? "line-through" : "none",
              opacity: j.done ? 0.8 : 1,
            }}>{j.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Library Tab ──────────────────────────────────────────────────────────────

function LibraryTab() {
  return (
    <div style={{ padding: "24px 20px 100px" }}>
      <h2 style={{ color: "#c9a84c", fontSize: 22, margin: "0 0 6px", fontFamily: "'Playfair Display', serif" }}>
        Your Library
      </h2>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 24px", fontFamily: "sans-serif" }}>
        All your digital materials, ready to access.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {LIBRARY_ITEMS.map(item => (
          <div key={item.id} style={{
            position: "relative",
            background: item.locked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${item.locked ? "rgba(255,255,255,0.08)" : "rgba(201,168,76,0.25)"}`,
            borderRadius: 16, padding: "18px 16px",
            display: "flex", alignItems: "center", gap: 16,
            opacity: item.locked ? 0.6 : 1,
            cursor: item.locked ? "default" : "pointer",
            overflow: "hidden",
          }}>
            <span style={{ fontSize: 32 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ color: item.locked ? "#8a7a5a" : "#f0d080", fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                  {item.title}
                </span>
                <span style={{
                  background: item.badgeColor, color: "#fff",
                  fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                  fontFamily: "sans-serif", letterSpacing: 0.5,
                }}>
                  {item.badge}
                </span>
              </div>
              <div style={{ color: "#8a7a5a", fontSize: 12, fontFamily: "sans-serif" }}>{item.subtitle}</div>
            </div>
            {item.locked ? (
              <span style={{ fontSize: 20 }}>🔒</span>
            ) : (
              <span style={{ color: "#c9a84c", fontSize: 20 }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Upgrade CTA */}
      <div style={{
        marginTop: 28, background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
        border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20, padding: "24px 20px", textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔓</div>
        <h3 style={{ color: "#f0d080", fontSize: 18, margin: "0 0 8px", fontFamily: "'Playfair Display', serif" }}>
          Unlock Everything
        </h3>
        <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 18px", fontFamily: "sans-serif", lineHeight: 1.5 }}>
          Upgrade your Seed of Faith to access the Miracle Journal, Prophetic Wealth Code, and more premium content.
        </p>
        <a href="/offer" style={{
          display: "inline-block", padding: "14px 28px", borderRadius: 50,
          background: "linear-gradient(135deg, #c9a84c, #f0d080)",
          color: "#1a1200", fontWeight: 700, fontSize: 15, textDecoration: "none",
          fontFamily: "'Playfair Display', serif",
        }}>
          See Upgrade Options →
        </a>
      </div>
    </div>
  );
}

// ─── Audio Tab ────────────────────────────────────────────────────────────────

function AudioTab() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState(AUDIO_TRACKS[0]);

  function playTrack(track: typeof AUDIO_TRACKS[0]) {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(track.src);
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    });
    audio.addEventListener("ended", () => setPlaying(null));
    audio.play().catch(() => {
      // Fallback: show message if audio fails to load (CDN issue)
    });
    audioRef.current = audio;
    setPlaying(track.id);
    setCurrentTrack(track);
    setProgress(0);
  }

  function stopAudio() {
    audioRef.current?.pause();
    setPlaying(null);
    setProgress(0);
  }

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return (
    <div style={{ padding: "24px 20px 100px" }}>
      <h2 style={{ color: "#c9a84c", fontSize: 22, margin: "0 0 6px", fontFamily: "'Playfair Display', serif" }}>
        Prayer Audios
      </h2>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 24px", fontFamily: "sans-serif" }}>
        Spirit-led audio prayers to transform your atmosphere.
      </p>

      {/* Now Playing bar */}
      {playing !== null && (
        <div style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))",
          border: "1px solid rgba(201,168,76,0.4)",
          borderRadius: 16, padding: "16px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ color: "#f0d080", fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                {currentTrack.title}
              </div>
              <div style={{ color: "#8a7a5a", fontSize: 12, fontFamily: "sans-serif" }}>Now Playing ♪</div>
            </div>
            <button onClick={stopAudio} style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
              fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            }}>■</button>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 4 }}>
            <div style={{
              background: "linear-gradient(90deg, #c9a84c, #f0d080)",
              height: "100%", borderRadius: 4, width: `${progress}%`, transition: "width 0.5s",
            }} />
          </div>
        </div>
      )}

      {/* Track list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {AUDIO_TRACKS.map(track => (
          <div key={track.id} style={{
            background: playing === track.id ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${playing === track.id ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 16, padding: "16px",
            display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
          }} onClick={() => playing === track.id ? stopAudio() : playTrack(track)}>
            {/* Play button */}
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: playing === track.id
                ? "linear-gradient(135deg, #c9a84c, #f0d080)"
                : "rgba(201,168,76,0.2)",
              border: "1px solid rgba(201,168,76,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: playing === track.id ? "#1a1200" : "#c9a84c", fontSize: 16,
            }}>
              {playing === track.id ? "❚❚" : "▶"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#f0d080", fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 3 }}>
                {track.title}
              </div>
              <div style={{ color: "#8a7a5a", fontSize: 12, fontFamily: "sans-serif" }}>{track.description}</div>
            </div>
            <div style={{ color: "#8a7a5a", fontSize: 12, fontFamily: "sans-serif", flexShrink: 0 }}>{track.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pray Tab ─────────────────────────────────────────────────────────────────

function PrayTab() {
  const [journalText, setJournalText] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("faith_journal") ?? "" : ""
  );
  const [saved, setSaved] = useState(false);
  const [activeDecl, setActiveDecl] = useState<number | null>(null);

  function saveJournal() {
    localStorage.setItem("faith_journal", journalText);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: "24px 20px 100px" }}>
      {/* Declarations */}
      <h2 style={{ color: "#c9a84c", fontSize: 22, margin: "0 0 6px", fontFamily: "'Playfair Display', serif" }}>
        Daily Declarations
      </h2>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 20px", fontFamily: "sans-serif" }}>
        Tap a declaration to speak it aloud. Declare it, believe it, receive it.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
        {DECLARATIONS.map((decl, i) => (
          <div key={i} onClick={() => setActiveDecl(activeDecl === i ? null : i)} style={{
            background: activeDecl === i ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${activeDecl === i ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 14, padding: "16px",
            cursor: "pointer", transition: "all 0.2s",
          }}>
            <p style={{
              color: activeDecl === i ? "#f0d080" : "#c9a84c",
              fontSize: activeDecl === i ? 16 : 14,
              margin: 0, fontFamily: "'Playfair Display', serif",
              lineHeight: 1.6, fontStyle: "italic",
            }}>
              "{decl}"
            </p>
          </div>
        ))}
      </div>

      {/* Journal */}
      <h2 style={{ color: "#c9a84c", fontSize: 22, margin: "0 0 6px", fontFamily: "'Playfair Display', serif" }}>
        Faith Journal
      </h2>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 16px", fontFamily: "sans-serif" }}>
        Write your prayers, gratitude, and testimonies. God sees every word.
      </p>
      <textarea
        value={journalText}
        onChange={e => setJournalText(e.target.value)}
        placeholder="Today I'm grateful for... / Lord, I ask for... / I believe that..."
        rows={8}
        style={{
          width: "100%", padding: "16px", borderRadius: 14, boxSizing: "border-box",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.25)",
          color: "#f0d080", fontSize: 15, outline: "none", resize: "vertical",
          fontFamily: "'Playfair Display', serif", lineHeight: 1.7,
        }}
      />
      <button onClick={saveJournal} style={{
        marginTop: 12, padding: "14px 28px", borderRadius: 50, border: "none",
        background: saved ? "#4ade80" : "linear-gradient(135deg, #c9a84c, #f0d080)",
        color: saved ? "#fff" : "#1a1200", fontWeight: 700, fontSize: 15, cursor: "pointer",
        fontFamily: "'Playfair Display', serif", transition: "all 0.3s",
      }}>
        {saved ? "✓ Saved!" : "Save Journal Entry"}
      </button>
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "library", label: "Library" },
    { id: "audio", label: "Audio" },
    { id: "pray", label: "Pray" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(10,10,10,0.96)", backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(201,168,76,0.2)",
      display: "flex", justifyContent: "space-around",
      padding: "10px 0 max(10px, env(safe-area-inset-bottom))",
      zIndex: 1000,
    }}>
      {items.map(item => {
        const active = tab === item.id;
        return (
          <button key={item.id} onClick={() => setTab(item.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: active ? "#c9a84c" : "#4a4a4a",
            padding: "4px 16px", minWidth: 60, transition: "color 0.2s",
          }}>
            {item.id === "home" && <IconHome active={active} />}
            {item.id === "library" && <IconLibrary active={active} />}
            {item.id === "audio" && <IconAudio active={active} />}
            {item.id === "pray" && <IconPray active={active} />}
            <span style={{ fontSize: 10, fontFamily: "sans-serif", fontWeight: active ? 700 : 400 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function FaithApp() {
  const [session, setSession] = useState<Session | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("faith_app_session");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [tab, setTab] = useState<Tab>("home");

  if (!session) {
    return <GateScreen onLogin={setSession} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0a0a0a 0%, #0f0e00 100%)",
      color: "#fff",
    }}>
      {/* Top header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>✨</span>
          <span style={{ color: "#c9a84c", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18 }}>
            Plan Faith
          </span>
        </div>
        <button onClick={() => {
          localStorage.removeItem("faith_app_session");
          setSession(null);
        }} style={{
          background: "none", border: "none", color: "#4a4a4a",
          fontSize: 12, cursor: "pointer", fontFamily: "sans-serif",
        }}>
          Sign out
        </button>
      </div>

      {/* Tab content */}
      {tab === "home" && <HomeTab session={session} />}
      {tab === "library" && <LibraryTab />}
      {tab === "audio" && <AudioTab />}
      {tab === "pray" && <PrayTab />}

      {/* Bottom nav */}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
