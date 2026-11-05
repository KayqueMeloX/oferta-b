import React, { useEffect, useRef, memo } from "react";

interface VslPlayerProps {
  onReveal?: () => void;
  revealTime?: number; // seconds (default 155s)
}

const VTURB_PLAYER_ID = "vid-6ae4ee283ce680b34e9f0d05";
const VTURB_SCRIPT_URL =
  "https://scripts.converteai.net/85233a33-7dd7-47f0-a1c8-356935a092df/players/6ae4ee283ce680b34e9f0d05/v4/player.js";

export const VslPlayer = memo(function VslPlayer({
  onReveal,
  revealTime = 155,
}: VslPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);

  const triggerReveal = () => {
    if (!revealedRef.current) {
      revealedRef.current = true;
      try {
        localStorage.setItem("faith_offer_revealed_v2", "1");
      } catch {}
      if (onReveal) onReveal();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if user already revealed in a previous session
    try {
      if (localStorage.getItem("faith_offer_revealed_v2") === "1") {
        triggerReveal();
      }
    } catch {}

    // Ensure only a single vturb-smartplayer element exists in container
    if (!container.querySelector("vturb-smartplayer")) {
      container.innerHTML = `
        <vturb-smartplayer id="${VTURB_PLAYER_ID}" style="display:block;margin:0 auto;width:100%;">
          <div style="position:relative;width:100%;padding:178.22% 0 0;background-color:black;"></div>
        </vturb-smartplayer>
      `;
    }

    // Inject official VTurb script once
    let script = document.querySelector(`script[src="${VTURB_SCRIPT_URL}"]`) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.src = VTURB_SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }

    // Reveal timer fallback (155s)
    const timeoutTimer = window.setTimeout(triggerReveal, revealTime * 1000);

    // Track VTurb player currentTime API
    const intervalTimer = window.setInterval(() => {
      const el = document.getElementById(VTURB_PLAYER_ID) as any;
      if (el) {
        const cur = el?.getCurrentTime?.();
        if (typeof cur === "number" && cur >= revealTime) {
          triggerReveal();
        }
      }
    }, 1000);

    return () => {
      window.clearTimeout(timeoutTimer);
      window.clearInterval(intervalTimer);
    };
  }, [revealTime]);

  return (
    <div
      ref={containerRef}
      onClick={triggerReveal}
      onTouchStart={triggerReveal}
      className="mx-auto my-6 w-full max-w-[400px] overflow-hidden rounded-2xl shadow-2xl bg-black cursor-pointer"
    />
  );
});
