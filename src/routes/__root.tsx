import "../lib/patch-translate-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { captureAndStoreUtms } from "../lib/tracking";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "A Message From Archangel Michael | Plan Faith" },
      {
        name: "description",
        content:
          "Take the guided faith journey with Archangel Michael and receive your personalized inspirational Manifestation Script.",
      },
      {
        property: "og:title",
        content: "A Message From Archangel Michael | Plan Faith",
      },
      {
        property: "og:description",
        content:
          "Take the guided faith journey with Archangel Michael and receive your personalized inspirational Manifestation Script.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://scripts.converteai.net" },
      { rel: "preconnect", href: "https://cdn.converteai.net" },
      { rel: "preconnect", href: "https://images.converteai.net" },
      { rel: "preconnect", href: "https://cdn.utmify.com.br" },
      { rel: "preconnect", href: "https://connect.facebook.net" },
      { rel: "dns-prefetch", href: "https://scripts.converteai.net" },
      { rel: "dns-prefetch", href: "https://cdn.converteai.net" },
      { rel: "dns-prefetch", href: "https://images.converteai.net" },
      { rel: "dns-prefetch", href: "https://cdn.utmify.com.br" },
      { rel: "dns-prefetch", href: "https://connect.facebook.net" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Utmify Official Script */}
        <script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-subids=""
          async
          defer
        />
        {/* Meta Pixel Official with Strict Single-PageView Guard */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;var _pv=false;n=f.fbq=function(){
if((arguments[0]==='track'||arguments[0]==='trackCustom')&&arguments[1]==='PageView'){
if(_pv)return;_pv=true;
}
n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq.disablePushState=true;
fbq('set','autoConfig',false,'29015918781408333');
fbq('init','29015918781408333');
fbq('track','PageView');`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function PrivateDevNav({
  isMinimized,
  onToggleMinimize,
}: {
  isMinimized: boolean;
  onToggleMinimize: () => void;
}) {
  const { location } = useRouterState();
  const currentPath = location.pathname;

  const pages = [
    { path: "/", label: "🏠 Intro" },
    { path: "/quiz", label: "🎯 Quiz" },
    { path: "/offer", label: "💰 Oferta" },
    { path: "/faith-app", label: "📱 Membros" },
    { path: "/support", label: "💬 Suporte" },
  ];

  const handleUnlockFullApp = () => {
    try {
      const fullSession = {
        email: "admin@godjesus.lovable.app",
        name: "Admin Master",
        plan: "seed-100",
      };
      localStorage.setItem("faith_app_session", JSON.stringify(fullSession));
      window.location.href = "/faith-app?success=true";
    } catch {}
  };

  const handleLockApp = () => {
    try {
      localStorage.removeItem("faith_app_session");
      window.location.href = "/faith-app";
    } catch {}
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={onToggleMinimize}
        title="Open Developer Navigation Bar"
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 99999,
          background: "linear-gradient(135deg, #c9a84c, #f0d080)",
          color: "#1a1200",
          border: "1px solid rgba(0,0,0,0.3)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
          borderRadius: 24,
          padding: "8px 14px",
          fontSize: 12,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "transform 0.15s ease",
        }}
      >
        <span>🛠️</span>
        <span>DEV NAV</span>
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: "rgba(10, 8, 4, 0.96)",
        backdropFilter: "blur(14px)",
        borderBottom: "1.5px solid rgba(243, 195, 78, 0.5)",
        boxShadow: "0 4px 25px rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        padding: "6px 12px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span
          style={{
            background: "linear-gradient(135deg, #c9a84c, #f0d080)",
            color: "#1a1200",
            fontSize: 10,
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: 10,
            letterSpacing: 0.8,
            fontFamily: "monospace",
          }}
        >
          🛠️ DEV NAV
        </span>

        {pages.map(({ path, label }) => {
          const active = currentPath === path;
          return (
            <Link
              key={path}
              to={path}
              style={{
                padding: "4px 10px",
                borderRadius: 16,
                fontSize: 11,
                fontWeight: active ? 700 : 500,
                textDecoration: "none",
                background: active
                  ? "linear-gradient(135deg, #c9a84c, #f0d080)"
                  : "rgba(255,255,255,0.08)",
                color: active ? "#1a1200" : "#d4c4a0",
                border: active
                  ? "1px solid #f0d080"
                  : "1px solid rgba(255,255,255,0.12)",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleUnlockFullApp}
          title="Instant unlock all content in /faith-app"
          style={{
            background: "rgba(34, 197, 94, 0.2)",
            border: "1px solid rgba(34, 197, 94, 0.5)",
            color: "#4ade80",
            borderRadius: 14,
            padding: "3px 8px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ⚡ Desbloquear App
        </button>

        <button
          type="button"
          onClick={handleLockApp}
          title="Bloquear para testar versão não paga"
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            color: "#f87171",
            borderRadius: 14,
            padding: "3px 8px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🔒 Bloquear
        </button>
      </div>

      <button
        type="button"
        onClick={onToggleMinimize}
        title="Minimizar barra de navegação dev"
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#f0d080",
          borderRadius: 8,
          padding: "3px 8px",
          fontSize: 11,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        — Minimizar
      </button>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Capture UTMs on mount and route changes
  useEffect(() => {
    captureAndStoreUtms();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if ?admin=1 or ?dev=1 is in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "1" || params.get("dev") === "1") {
      localStorage.setItem("faith_admin_enabled", "1");
      setIsAdmin(true);
    } else if (localStorage.getItem("faith_admin_enabled") === "1") {
      setIsAdmin(true);
    }

    // Check minimized preference
    const savedMin = localStorage.getItem("dev_nav_minimized");
    if (savedMin === "1") {
      setIsMinimized(true);
    }

    // Keyboard shortcut Alt+D or Ctrl+Shift+D to toggle admin dev bar
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === "d" || e.key === "D")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "d" || e.key === "D"))
      ) {
        e.preventDefault();
        setIsAdmin((prev) => {
          const next = !prev;
          if (next) {
            localStorage.setItem("faith_admin_enabled", "1");
          } else {
            localStorage.removeItem("faith_admin_enabled");
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleMinimize = () => {
    setIsMinimized((prev) => {
      const next = !prev;
      localStorage.setItem("dev_nav_minimized", next ? "1" : "0");
      return next;
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin && (
        <PrivateDevNav
          isMinimized={isMinimized}
          onToggleMinimize={handleToggleMinimize}
        />
      )}
      <div style={{ paddingTop: isAdmin && !isMinimized ? 42 : 0 }}>
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
