import React, { useEffect, memo } from "react";

export const VslPlayer = memo(function VslPlayer() {
  useEffect(() => {
    if (typeof document === "undefined") return;
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
      document.querySelectorAll("vturb-smartplayer, [id^='vid-6ae4ee283ce6']").forEach((el) => el.remove());
      document.querySelectorAll(`script[src*="converteai.net"]`).forEach((s) => s.remove());
    } catch {}
  }, []);

  return null;
});
