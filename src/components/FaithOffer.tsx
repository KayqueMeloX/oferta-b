import React, { useEffect, useRef, useState } from "react";

const ASSET_BASE = "https://plan-faith.com/__l5e/assets-v1";

const BACKGROUND_URL = `${ASSET_BASE}/24285d67-8103-436e-bd4b-ea10a08cee39/background.jpg`;

const SEED_IMAGES: Record<string, string> = {
  "seed-27": `${ASSET_BASE}/faefb587-1ff2-483e-9804-a777b3191ba0/sedd-of-fath-27.jpg`,
  "seed-47": `${ASSET_BASE}/fcc7ce46-348d-439e-b4a0-568b54718cc7/seed-of-faith47.jpg`,
  "seed-77": `${ASSET_BASE}/262ab083-5f47-4a0a-9560-ef7023121fd8/seed-of-fath-77.jpg`,
  "seed-100": `${ASSET_BASE}/39d77d54-54ea-46c1-ae8d-37d543c3c4fb/seed-of-faith-100.jpg`,
};

const THEMES = [
  {
    name: "My Future",
    img: `${ASSET_BASE}/7665994b-aaa6-4edc-b414-0ba7e4ad5126/pf-future.jpg`,
  },
  {
    name: "Faith Decision",
    img: `${ASSET_BASE}/ecea97b0-8e6a-4d98-abbc-b7b5de9e5881/pf-faith.jpg`,
  },
  {
    name: "Dream Home",
    img: `${ASSET_BASE}/a46179d6-03e9-42d7-ae2a-28e48d8a45cc/pf-home.jpg`,
  },
  {
    name: "Daily Faith",
    img: `${ASSET_BASE}/06405fa0-2219-47a0-bf83-be0cf3087e02/pf-car.jpg`,
  },
  {
    name: "Happy Family",
    img: `${ASSET_BASE}/c0ccd35d-df5c-4d44-91a1-b8d4fddd1c18/pf-family.jpg`,
  },
  {
    name: "Inner Peace",
    img: `${ASSET_BASE}/fc56eb74-af48-448c-a883-a531cfb8b151/pf-health.jpg`,
  },
  {
    name: "Abundance",
    img: `${ASSET_BASE}/d29c542e-920d-4f22-a8de-3bf91ea2cbd8/pf-abundance.jpg`,
  },
  {
    name: "Renewed Hope",
    img: `${ASSET_BASE}/facb5950-88cb-4607-954d-f9e0b8d30a08/pf-boost.jpg`,
  },
  {
    name: "Letting Go",
    img: `${ASSET_BASE}/38c88d47-0875-4735-a48b-a9bf59c004ba/pf-blocks.jpg`,
  },
  {
    name: "Gratitude",
    img: `${ASSET_BASE}/ee396474-4be6-4d6a-98a7-37731c4773ee/pf-mult.jpg`,
  },
];

const PRODUCTS = [
  {
    key: "seed-27",
    name: "Seed of Faith",
    price: "$27",
    checkoutUrl: "/checkout?plan=27",
  },
  {
    key: "seed-47",
    name: "Roots of Faith",
    price: "$47",
    checkoutUrl: "/checkout?plan=47",
  },
  {
    key: "seed-77",
    name: "Harvest of Faith",
    price: "$77",
    checkoutUrl: "/checkout?plan=77",
  },
  {
    key: "seed-100",
    name: "Legacy of Faith",
    price: "$100",
    checkoutUrl: "/checkout?plan=100",
  },
];

const VTURB_ID = "vid-6ad8fee7e661f216ee2f0e00";
const VTURB_SCRIPT =
  "https://scripts.converteai.net/283ce102-11c9-4c28-89d2-e9eb86994d09/players/6ad8fee7e661f216ee2f0e00/v4/player.js";
const REVEAL_DELAY_SECONDS = 155;

export function FaithOffer() {
  const [name, setName] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const vturbContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    // Check if already revealed before
    try {
      if (localStorage.getItem("faith_offer_revealed_v2") === "1") {
        setIsRevealed(true);
      }
    } catch {}

    const timer = setTimeout(() => {
      setIsRevealed(true);
      try {
        localStorage.setItem("faith_offer_revealed_v2", "1");
      } catch {}
    }, REVEAL_DELAY_SECONDS * 1000);

    return () => clearTimeout(timer);
  }, []);

  // Vturb script loader
  useEffect(() => {
    const container = vturbContainerRef.current;
    if (container && !container.querySelector("vturb-smartplayer")) {
      container.innerHTML = `
        <vturb-smartplayer id="${VTURB_ID}" style="display:block;margin:0 auto;width:100%;">
          <div style="position:relative;width:100%;padding:178.22% 0 0;background-color:black;"></div>
        </vturb-smartplayer>
      `;
    }

    if (!document.querySelector(`script[src="${VTURB_SCRIPT}"]`)) {
      const script = document.createElement("script");
      script.src = VTURB_SCRIPT;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

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

        {/* Video Player */}
        <div
          ref={vturbContainerRef}
          className="mx-auto my-6 w-full max-w-[400px] overflow-hidden rounded-2xl shadow-2xl"
        />

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
              {PRODUCTS.map((prod) => (
                <article key={prod.key} className="flex flex-col gap-3">
                  <a
                    href={prod.checkoutUrl}
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
                    href={prod.checkoutUrl}
                    className="block w-full rounded-xl bg-gradient-to-r from-[#f7d873] to-[#e0a91d] py-4 text-center font-bold text-[#1a1206] shadow-lg transition-transform active:scale-[0.98]"
                  >
                    Choose this Seed – {prod.price} USD
                  </a>
                </article>
              ))}
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
