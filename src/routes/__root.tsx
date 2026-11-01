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
import { useEffect, type ReactNode } from "react";

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

function DevNav() {
  const { location } = useRouterState();
  const currentPath = location.pathname;

  const pages = [
    { path: "/", label: "🏠 Quiz Intro" },
    { path: "/quiz", label: "🎯 Quiz" },
    { path: "/offer", label: "💰 Oferta" },
    { path: "/checkout", label: "🛒 Checkout" },
    { path: "/faith-app", label: "📱 Membros" },
    { path: "/support", label: "💬 Suporte" },
  ];

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: "rgba(0,0,0,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(201,168,76,0.3)",
      display: "flex",
      alignItems: "center",
      gap: 4,
      padding: "6px 12px",
      flexWrap: "wrap",
    }}>
      <span style={{
        color: "#6b5a2a",
        fontSize: 10,
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: 1,
        marginRight: 8,
        whiteSpace: "nowrap",
      }}>
        ⚡ DEV
      </span>
      {pages.map(({ path, label }) => {
        const active = currentPath === path;
        return (
          <Link
            key={path}
            to={path}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontFamily: "sans-serif",
              fontWeight: active ? 700 : 400,
              textDecoration: "none",
              whiteSpace: "nowrap",
              background: active
                ? "linear-gradient(135deg, #c9a84c, #f0d080)"
                : "rgba(255,255,255,0.06)",
              color: active ? "#1a1200" : "#8a7a5a",
              border: active
                ? "none"
                : "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.2s",
            }}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <DevNav />
      <div style={{ paddingTop: 40 }}>
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
