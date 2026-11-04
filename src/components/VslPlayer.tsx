import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";

interface VslPlayerProps {
  onReveal?: () => void;
  revealTime?: number; // seconds (default 155s)
}

declare global {
  interface Window {
    Hls?: any;
  }
}

const VTURB_PLAYER_ID = "vid-6ae4ee283ce680b34e9f0d05";
const VTURB_SCRIPT_URL =
  "https://scripts.converteai.net/85233a33-7dd7-47f0-a1c8-356935a092df/players/6ae4ee283ce680b34e9f0d05/v4/player.js";
const HLS_STREAM_URL =
  "https://cdn.converteai.net/85233a33-7dd7-47f0-a1c8-356935a092df/6ae4ee24004e0ef3afbd656a/video_2.m3u8";
const POSTER_URL =
  "https://cdn.converteai.net/85233a33-7dd7-47f0-a1c8-356935a092df/6ae4ee24004e0ef3afbd656a/poster.jpg";
const FALLBACK_MP4_URL = "/vsl-full.mp4";

export function VslPlayer({ onReveal, revealTime = 155 }: VslPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const revealedRef = useRef(false);

  // Trigger reveal once
  const triggerReveal = () => {
    if (!revealedRef.current) {
      revealedRef.current = true;
      try {
        localStorage.setItem("faith_offer_revealed_v2", "1");
      } catch {}
      if (onReveal) onReveal();
    }
  };

  // 1. Mount official VTurb player (exactly as on plan-faith.com)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if user already revealed in localStorage
    try {
      if (localStorage.getItem("faith_offer_revealed_v2") === "1") {
        triggerReveal();
      }
    } catch {}

    // Insert vturb-smartplayer custom element
    if (!container.querySelector("vturb-smartplayer")) {
      container.innerHTML = `
        <vturb-smartplayer id="${VTURB_PLAYER_ID}" style="display:block;margin:0 auto;width:100%;">
          <div style="position:relative;width:100%;padding:178.22% 0 0;background-color:black;"></div>
        </vturb-smartplayer>
      `;
    }

    // Inject VTurb script if not already present
    let script = document.querySelector(`script[src="${VTURB_SCRIPT_URL}"]`) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.src = VTURB_SCRIPT_URL;
      script.async = true;
      script.onerror = () => {
        console.warn("VTurb script failed to load (possibly ad blocker). Switching to native fallback player.");
        setUseFallback(true);
      };
      document.head.appendChild(script);
    }

    // Reveal timer (fallback timer at 155s)
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

    // Safety watchdog: If VTurb doesn't inject anything within 4s, activate fallback player
    const watchdogTimer = window.setTimeout(() => {
      const playerEl = document.getElementById(VTURB_PLAYER_ID);
      const hasChildren = playerEl && (playerEl.children.length > 1 || playerEl.shadowRoot || playerEl.querySelector("video") || playerEl.querySelector("iframe"));
      if (!hasChildren) {
        // Check if vturb-smartplayer-js script loaded
        const smartScript = document.getElementById("vturb-smartplayer-js");
        if (!smartScript) {
          console.info("VTurb script took too long or blocked; activating resilient HLS player.");
          setUseFallback(true);
        }
      }
    }, 4500);

    return () => {
      window.clearTimeout(timeoutTimer);
      window.clearInterval(intervalTimer);
      window.clearTimeout(watchdogTimer);
    };
  }, [revealTime]);

  const handleContainerClick = () => {
    triggerReveal();
  };

  if (useFallback) {
    return (
      <NativeFallbackPlayer
        onReveal={triggerReveal}
        revealTime={revealTime}
      />
    );
  }

  return (
    <div
      onClick={handleContainerClick}
      onTouchStart={handleContainerClick}
      className="mx-auto my-6 w-full max-w-[400px] overflow-hidden rounded-2xl shadow-2xl bg-black cursor-pointer"
      style={{ minHeight: 480 }}
    >
      <div ref={containerRef} style={{ width: "100%", minHeight: "100%" }} />
    </div>
  );
}

// ─── Resilient Native Fallback Player (for adblockers / offline backup) ─────────

function NativeFallbackPlayer({
  onReveal,
  revealTime = 155,
}: {
  onReveal: () => void;
  revealTime: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(168);
  const [hasStartedWithSound, setHasStartedWithSound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initHls = () => {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = HLS_STREAM_URL;
        video.load();
        video
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => setIsLoading(false));
        return;
      }

      const setupHlsJs = () => {
        if (window.Hls && window.Hls.isSupported()) {
          if (hlsRef.current) hlsRef.current.destroy();

          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false,
            startPosition: 0,
            backBufferLength: 60,
          });

          hlsRef.current = hls;
          hls.loadSource(HLS_STREAM_URL);
          hls.attachMedia(video);

          hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          });

          hls.on(window.Hls.Events.ERROR, (_: any, data: any) => {
            if (data.fatal) {
              hls.destroy();
              hlsRef.current = null;
              video.src = FALLBACK_MP4_URL;
              video.load();
              video.play().catch(() => {});
            }
          });
        } else {
          video.src = FALLBACK_MP4_URL;
          video.load();
          video
            .play()
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
        }
      };

      if (window.Hls) {
        setupHlsJs();
      } else {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";
        script.async = true;
        script.onload = setupHlsJs;
        script.onerror = () => {
          video.src = FALLBACK_MP4_URL;
          video.load();
          video.play().catch(() => {});
          setIsLoading(false);
        };
        document.head.appendChild(script);
      }
    };

    initHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const cur = video.currentTime;
    const dur = video.duration || duration;
    if (video.duration && !isNaN(video.duration)) {
      setDuration(dur);
    }
    setProgress(cur / dur);

    if (cur >= revealTime) {
      onReveal();
    }
  };

  const handleUnmuteAndPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);
    setHasStartedWithSound(true);

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Play failed:", err));
    }
    onReveal();
  };

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => console.warn("Resume failed:", err));
      }
      onReveal();
    }
  };

  const handleToggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) setHasStartedWithSound(true);
  };

  const handleRestart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = false;
    setIsMuted(false);
    setHasStartedWithSound(true);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Restart play error:", err));
    }
  };

  return (
    <div className="relative mx-auto my-6 w-full max-w-[400px] overflow-hidden rounded-2xl shadow-2xl bg-black">
      <div
        className="relative w-full cursor-pointer select-none"
        style={{ paddingBottom: "178.22%" }}
        onClick={!hasStartedWithSound ? handleUnmuteAndPlay : () => handleTogglePlay()}
      >
        <video
          ref={videoRef}
          playsInline
          muted={isMuted}
          autoPlay
          loop
          preload="auto"
          poster={POSTER_URL}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            onReveal();
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f3c34e] border-t-transparent" />
              <span className="font-sans text-xs font-semibold tracking-wide text-[#f3c34e]">
                Loading Sacred Video...
              </span>
            </div>
          </div>
        )}

        {!hasStartedWithSound && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 p-4 transition-all hover:bg-black/30">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleUnmuteAndPlay();
              }}
              className="group relative flex flex-col items-center gap-2 rounded-2xl bg-[#c91818]/95 px-6 py-4 shadow-2xl ring-4 ring-white/90 transition-transform active:scale-95 animate-pulse"
              style={{ animationDuration: "2s" }}
            >
              <div className="flex items-center gap-3 text-white">
                <Volume2 className="h-7 w-7 text-white" />
                <span className="font-sans text-lg font-extrabold uppercase tracking-wide">
                  Click to listen
                </span>
              </div>
              <span className="font-sans text-[11px] font-semibold tracking-wider text-white/90">
                Tap anywhere to watch with audio
              </span>
            </button>
          </div>
        )}

        {hasStartedWithSound && (
          <div
            className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8 transition-opacity duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-[#c9a84c] to-[#f0d080] transition-all duration-200"
                style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="rounded-full bg-black/60 p-2 text-white/90 hover:bg-black/80 hover:text-white"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="rounded-full bg-black/60 p-2 text-white/90 hover:bg-black/80 hover:text-white"
                  aria-label="Restart Video"
                  title="Restart video"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleToggleMute}
                className="rounded-full bg-black/60 p-2 text-white/90 hover:bg-black/80 hover:text-white"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
