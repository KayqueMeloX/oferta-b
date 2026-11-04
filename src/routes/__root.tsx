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
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

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
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function PrivateDevNav({ onClose }: { onClose: () => void }) {
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
        email: "admin@plan-faith.com",
        name: "Admin Master",
        plan: "seed-100",
      };
      localStorage.setItem("faith_app_session", JSON.stringify(fullSession));
      window.location.href = "/faith-app?success=true";
    } catch {}
  };

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
          🔒 ADMIN DEV
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
          ⚡ Unlock App
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        title="Hide Dev Panel (press Alt+D or visit ?admin=1 to reopen)"
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#aaa",
          borderRadius: 8,
          padding: "3px 8px",
          fontSize: 11,
          cursor: "pointer",
        }}
      >
        ✕ Hide
      </button>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check URL parameters ?admin=1 or ?dev=1
    const params = new URLSearchParams(window.location.search);
    const hasAdminParam = params.get("admin") === "1" || params.get("dev") === "1";

    if (hasAdminParam) {
      localStorage.setItem("faith_admin_mode", "1");
      setIsAdmin(true);
    } else {
      // 2. Check localStorage
      if (localStorage.getItem("faith_admin_mode") === "1") {
        setIsAdmin(true);
      }
    }

    // 3. Secret keyboard shortcut: Alt + D or Ctrl + Shift + D
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === "d" || e.key === "D")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "d" || e.key === "D"))
      ) {
        e.preventDefault();
        setIsAdmin((prev) => {
          const next = !prev;
          if (next) {
            localStorage.setItem("faith_admin_mode", "1");
          } else {
            localStorage.removeItem("faith_admin_mode");
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClose = () => {
    localStorage.removeItem("faith_admin_mode");
    setIsAdmin(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin && <PrivateDevNav onClose={handleClose} />}
      <div style={{ paddingTop: isAdmin ? 42 : 0 }}>
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
