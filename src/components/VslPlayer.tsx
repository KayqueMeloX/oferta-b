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
  const initializedRef = useRef(false);

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
    // Strictly prevent duplicate execution
    if (initializedRef.current) return;
    initializedRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    // 1. Teardown and destroy any existing smartplayer instances from previous page loads
    try {
      const sp = (window as any).smartplayer;
      if (sp && Array.isArray(sp.instances)) {
        sp.instances.forEach((inst: any) => {
          try {
            inst?.video?.pause?.();
            inst?.destroy?.();
          } catch {}
        });
        sp.instances = [];
      }

      // Pause and remove any rogue video/audio elements currently in the DOM
      document.querySelectorAll("video, audio").forEach((media) => {
        try {
          (media as HTMLMediaElement).pause();
          (media as HTMLMediaElement).src = "";
          media.remove();
        } catch {}
      });

      // Remove any stray vturb tags that might have leaked into body
      document.querySelectorAll("body > vturb-smartplayer, body > [id^='vid-6ae4ee283ce6']").forEach((el) => {
        el.remove();
      });

      // Remove any old script tags for VTurb
      document.querySelectorAll(`script[src*="6ae4ee283ce680b34e9f0d05"]`).forEach((s) => s.remove());
    } catch (e) {
      console.warn("VTurb cleanup warning:", e);
    }

    // 2. Check if user already revealed
    try {
      if (localStorage.getItem("faith_offer_revealed_v2") === "1") {
        triggerReveal();
      }
    } catch {}

    // 3. Create single clean vturb-smartplayer tag
    container.innerHTML = `
      <vturb-smartplayer id="${VTURB_PLAYER_ID}" style="display:block;margin:0 auto;width:100%;">
        <div style="position:relative;width:100%;padding:178.22% 0 0;background-color:black;"></div>
      </vturb-smartplayer>
    `;

    // 4. Inject single fresh script tag
    const script = document.createElement("script");
    script.src = VTURB_SCRIPT_URL;
    script.async = true;
    document.head.appendChild(script);

    // 5. Timer fallback (155s)
    const timeoutTimer = window.setTimeout(triggerReveal, revealTime * 1000);

    // 6. Track currentTime from smartplayer instance or element API
    const intervalTimer = window.setInterval(() => {
      try {
        const sp = (window as any).smartplayer;
        const inst = sp?.instances?.[0];
        if (inst && typeof inst.video?.currentTime === "number") {
          if (inst.video.currentTime >= revealTime) {
            triggerReveal();
          }
          return;
        }

        const el = document.getElementById(VTURB_PLAYER_ID) as any;
        const cur = el?.getCurrentTime?.();
        if (typeof cur === "number" && cur >= revealTime) {
          triggerReveal();
        }
      } catch {}
    }, 1000);

    return () => {
      initializedRef.current = false;
      window.clearTimeout(timeoutTimer);
      window.clearInterval(intervalTimer);

      try {
        const sp = (window as any).smartplayer;
        if (sp && Array.isArray(sp.instances)) {
          sp.instances.forEach((inst: any) => {
            try {
              inst?.video?.pause?.();
              inst?.destroy?.();
            } catch {}
          });
          sp.instances = [];
        }
        if (container) {
          container.innerHTML = "";
        }
        document.querySelectorAll("body > vturb-smartplayer").forEach((el) => el.remove());
        script.remove();
      } catch {}
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
