import React, { useEffect, useState } from "react";
import { VslPlayer } from "./VslPlayer";
import { getPaymentUrl } from "../config/payment";
import { trackViewContent, trackInitiateCheckout } from "../lib/tracking";

const BACKGROUND_URL = "/images/background.jpg";

const SEED_IMAGES: Record<string, string> = {
  "seed-27": "/images/seed-27.jpg",
  "seed-47": "/images/seed-47.jpg",
  "seed-77": "/images/seed-77.jpg",
  "seed-100": "/images/seed-100.jpg",
};

const THEMES = [
  {
    name: "My Future",
    img: "/images/pf-future.jpg",
  },
  {
    name: "Faith Decision",
    img: "/images/pf-faith.jpg",
  },
  {
    name: "Dream Home",
    img: "/images/pf-home.jpg",
  },
  {
    name: "Daily Faith",
    img: "/images/pf-car.jpg",
  },
  {
    name: "Happy Family",
    img: "/images/pf-family.jpg",
  },
  {
    name: "Inner Peace",
    img: "/images/pf-health.jpg",
  },
  {
    name: "Abundance",
    img: "/images/pf-abundance.jpg",
  },
  {
    name: "Renewed Hope",
    img: "/images/pf-boost.jpg",
  },
  {
    name: "Letting Go",
    img: "/images/pf-blocks.jpg",
  },
  {
    name: "Gratitude",
    img: "/images/pf-mult.jpg",
  },
];

const PRODUCTS = [
  {
    key: "seed-27",
    name: "Seed of Faith",
    price: "$27",
  },
  {
    key: "seed-47",
    name: "Roots of Faith",
    price: "$47",
  },
  {
    key: "seed-77",
    name: "Harvest of Faith",
    price: "$77",
  },
  {
    key: "seed-100",
    name: "Legacy of Faith",
    price: "$100",
  },
];

export function FaithOffer() {
  const [name, setName] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Teardown any orphan background media elements from previous screens
    if (typeof document !== "undefined") {
      document.querySelectorAll("video, audio").forEach((el) => {
        if (!el.closest("vturb-smartplayer")) {
          try {
            (el as HTMLMediaElement).pause();
            (el as HTMLMediaElement).currentTime = 0;
          } catch {}
        }
      });
    }

    const params = new URLSearchParams(window.location.search);
    const n = params.get("name") || "";
    setName(n.trim().toUpperCase());

    setDateStr(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    // Track ViewContent on Meta Pixel
    trackViewContent("Faith Offer Page", 47);

    // Check if user already revealed in a previous visit
    try {
      if (localStorage.getItem("faith_offer_revealed_v2") === "1") {
        setIsRevealed(true);
      }
    } catch {}
  }, []);

  const handleReveal = () => {
    setIsRevealed(true);
    try {
      localStorage.setItem("faith_offer_revealed_v2", "1");
    } catch {}
  };

  return (
    <div
      className="relative isolate min-h-screen font-serif text-[#fff7e6]"
      style={{
        backgroundImage: `url(${BACKGROUND_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#050403",
      }}
    >
      <div className="absolute inset-0 bg-black/80 -z-10" />

      {/* Header Legal Nav */}
      <header className="mx-auto max-w-3xl px-4 pt-4 font-sans text-sm">
        <nav
          aria-label="Legal"
          className="flex flex-wrap justify-center gap-4 font-semibold text-[#d8cba7]"
        >
          <a className="underline underline-offset-4 hover:text-[#f3c34e]" href="/support">
            Support
          </a>
          <a className="underline underline-offset-4 hover:text-[#f3c34e]" href="/refund">
            Refund Policy
          </a>
          <a className="underline underline-offset-4 hover:text-[#f3c34e]" href="/privacy">
            Privacy Policy
          </a>
          <a className="underline underline-offset-4 hover:text-[#f3c34e]" href="/terms">
            Terms of Use
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-3xl text-center px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold leading-tight text-[#f3c34e] md:text-5xl">
          {name
            ? `${name}, you've made it this far… and that's no accident.`
            : "You've made it this far… and that's no accident."}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-xl text-[#f7f3ea]">
          Today is <b className="text-[#f3c34e]">{dateStr || "today"}</b> – the first day of
          your new reality.
        </p>

        {/* Video Player (Jesus VSL from plan-faith.com) */}
        <VslPlayer onReveal={handleReveal} revealTime={155} />

        {!isRevealed ? (
          <p className="font-sans text-sm text-[#d8cba7]">
            Keep watching — your Seeds of Faith will appear below the video.
          </p>
        ) : (
          <div>
            {/* Reflection Themes */}
            <section className="mt-10">
              <h2 className="text-3xl font-bold text-[#f3c34e]">
                Your themes for reflection:
              </h2>
              <ul className="mx-auto mt-5 grid max-w-2xl grid-cols-2 gap-3 text-left">
                {THEMES.map((theme) => (
                  <li
                    key={theme.name}
                    className="flex min-h-[78px] items-center gap-3 rounded-xl border-[3px] border-[#f3c34e] bg-[#0c0905]/90 p-3 text-lg font-bold"
                  >
                    <img
                      src={theme.img}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded-lg border-2 border-[#f3c34e] object-cover"
                    />
                    <span className="text-[#f7f3ea]">{theme.name}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Checklist Box */}
            <section className="mx-auto mt-8 flex max-w-xl flex-col gap-2 font-sans">
              <div className="rounded-xl border border-[#f3c34e]/40 bg-[#0c0905]/80 p-5 text-lg font-bold leading-relaxed text-[#f7f3ea]">
                <span className="text-[#f3c34e]">What you receive:</span> a personalized
                digital inspirational Script and the complete{" "}
                <span className="text-[#f3c34e]">Faith & Abundance Blueprint</span> – a 200+
                page biblical guide of prayers, scriptures, and daily declarations for
                every area of your life.
              </div>
              <div className="rounded-xl border border-[#f3c34e]/40 bg-[#0c0905]/60 p-3 font-bold text-[#f7f3ea]">
                📩 Delivered instantly by email
              </div>
              <div className="rounded-xl border border-[#f3c34e]/40 bg-[#0c0905]/60 p-3 font-bold text-[#f7f3ea]">
                💻 100% digital – no shipping
              </div>
              <div className="rounded-xl border border-[#f3c34e]/40 bg-[#0c0905]/60 p-3 font-bold text-[#f7f3ea]">
                🔒 Secure checkout
              </div>
              <p className="text-sm italic text-[#f3c34e]">
                Backed by our 7-day money-back guarantee – see our{" "}
                <a href="/refund" className="font-bold underline">
                  Refund Policy
                </a>
                .
              </p>
            </section>

            {/* Choice of Seed */}
            <h2 className="mt-10 text-3xl font-bold text-[#f3c34e]">
              {name ? `${name}, make your choice now` : "Make your choice now"}
            </h2>

            <div className="mx-auto mt-6 flex max-w-md flex-col gap-8">
              {PRODUCTS.map((prod) => {
                const targetUrl = getPaymentUrl(prod.key);
                const priceNum = parseInt(prod.price.replace("$", "")) || 47;
                const handleCheckoutClick = () => {
                  trackInitiateCheckout(prod.key, priceNum);
                };

                return (
                  <article key={prod.key} className="flex flex-col gap-3">
                    <a
                      href={targetUrl}
                      onClick={handleCheckoutClick}
                      className="block w-full cursor-pointer transition-transform active:scale-[0.98]"
                    >
                      <img
                        src={SEED_IMAGES[prod.key] ?? ""}
                        alt={prod.name}
                        width={420}
                        height={420}
                        loading="lazy"
                        className="aspect-square w-full rounded-2xl border-[3px] border-[#f3c34e] object-cover"
                      />
                    </a>
                    <a
                      href={targetUrl}
                      onClick={handleCheckoutClick}
                      className="block w-full rounded-xl bg-gradient-to-r from-[#f7d873] to-[#e0a91d] py-4 text-center font-bold text-[#1a1206] shadow-lg transition-transform active:scale-[0.98] text-lg font-sans"
                    >
                      Choose this Seed –{" "}
                      <span translate="no" className="notranslate font-extrabold">
                        {prod.price} USD
                      </span>
                    </a>
                  </article>
                );
              })}
            </div>

            <p className="mt-6 font-sans text-sm italic text-[#d8cba7]">
              7-day refund guarantee · Immediate digital access · 100% digital, nothing is
              shipped.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto mt-12 max-w-3xl border-t border-[#f3c34e]/30 px-4 py-8 text-center font-sans text-sm text-[#d8cba7]">
        <div className="mb-4">
          <nav
            aria-label="Legal"
            className="flex flex-wrap justify-center gap-4 font-semibold text-[#d8cba7]"
          >
            <a className="underline underline-offset-4 hover:text-[#f3c34e]" href="/support">
              Support
            </a>
            <a className="underline underline-offset-4 hover:text-[#f3c34e]" href="/refund">
              Refund Policy
            </a>
            <a className="underline underline-offset-4 hover:text-[#f3c34e]" href="/privacy">
              Privacy Policy
            </a>
            <a className="underline underline-offset-4 hover:text-[#f3c34e]" href="/terms">
              Terms of Use
            </a>
          </nav>
        </div>
        <p className="font-semibold text-[#f7f3ea]">
          FAKKO SOLUTIONS LLC – EIN 47-3829164
        </p>
        <p>30 N Gould St, Sheridan, WY 82801, United States</p>
        <p>
          Support:{" "}
          <a className="underline text-[#f3c34e]" href="mailto:support.fakko.solutions@gmail.com">
            support.fakko.solutions@gmail.com
          </a>{" "}
          · Digital product: immediate access to the members area and by email after
          payment.
        </p>
        <p className="mx-auto mt-3 max-w-xl italic">
          Inspirational and spiritual content for personal reflection and entertainment.
          Results vary from person to person. This is not financial, medical, legal or
          professional advice, and no specific outcome is promised.
        </p>
        <p className="mt-3">© 2026 FAKKO SOLUTIONS LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
