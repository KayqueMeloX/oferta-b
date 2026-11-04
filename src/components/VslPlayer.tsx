import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";

interface VslPlayerProps {
  onReveal?: () => void;
  revealTime?: number; // seconds
}

declare global {
  interface Window {
    Hls?: any;
  }
}

const HLS_STREAM_URL =
  "https://cdn.converteai.net/283ce102-11c9-4c28-89d2-e9eb86994d09/6ad8fee2ee98a18ebb45e1dc/video_2.m3u8";
const POSTER_URL =
  "https://cdn.converteai.net/283ce102-11c9-4c28-89d2-e9eb86994d09/6ad8fee2ee98a18ebb45e1dc/poster.jpg";
const FALLBACK_MP4_URL = "/vsl-full.mp4";

export function VslPlayer({ onReveal, revealTime = 155 }: VslPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(168);
  const [hasStartedWithSound, setHasStartedWithSound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const revealedRef = useRef(false);

  // Initialize HLS or native playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initHls = () => {
      // 1. Check if native HLS is supported (Safari iOS / macOS)
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = HLS_STREAM_URL;
        video.load();
        video
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
        return;
      }

      // 2. Load Hls.js for Chrome, Firefox, Edge, Android
      const setupHlsJs = () => {
        if (window.Hls && window.Hls.isSupported()) {
          if (hlsRef.current) {
            hlsRef.current.destroy();
          }

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
              switch (data.type) {
                case window.Hls.ErrorTypes.NETWORK_ERROR:
                  console.warn("HLS network error, recovering...", data);
                  hls.startLoad();
                  break;
                case window.Hls.ErrorTypes.MEDIA_ERROR:
                  console.warn("HLS media error, recovering...", data);
                  hls.recoverMediaError();
                  break;
                default:
                  console.warn("HLS fatal error, falling back to local MP4", data);
                  hls.destroy();
                  hlsRef.current = null;
                  video.src = FALLBACK_MP4_URL;
                  video.load();
                  video.play().catch(() => {});
                  break;
              }
            }
          });
        } else {
          // Fallback to local MP4 if HLS is completely unavailable
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

  // Time tracking and reveal trigger
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const cur = video.currentTime;
    const dur = video.duration || duration;
    if (video.duration && !isNaN(video.duration)) {
      setDuration(video.duration);
    }

    setProgress((cur / dur) * 100);

    if (cur >= revealTime && !revealedRef.current) {
      revealedRef.current = true;
      if (onReveal) {
        onReveal();
      }
    }
  };

  // Start with sound interaction
  const handleUnmuteAndPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);
    setHasStartedWithSound(true);

    const target = 0.05;
    video.currentTime = target;
    if (hlsRef.current) {
      hlsRef.current.startLoad(target);
    }

    const doPlay = () => {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Play error:", err));
    };

    if (video.seeking) {
      video.addEventListener("seeked", doPlay, { once: true });
    } else {
      doPlay();
    }
  };

  // Toggle play/pause once unmuted
  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!hasStartedWithSound) {
      handleUnmuteAndPlay({ stopPropagation: () => {} } as any);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      if (hlsRef.current) {
        hlsRef.current.startLoad();
      }
      setIsLoading(true);
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn("Play error, trying canplay/seeked listener:", err);
          const onReady = () => {
            video
              .play()
              .then(() => {
                setIsPlaying(true);
                setIsLoading(false);
              })
              .catch(() => setIsLoading(false));
          };
          video.addEventListener("canplay", onReady, { once: true });
          video.addEventListener("seeked", onReady, { once: true });
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Rewind to beginning and guarantee playback
  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    const target = 0.05;
    video.currentTime = target;

    if (hlsRef.current) {
      hlsRef.current.startLoad(target);
    }

    const doPlay = () => {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn("Autoplay after restart prevented/delayed:", err);
          setIsLoading(false);
          setIsPlaying(false);
        });
    };

    if (video.seeking) {
      video.addEventListener("seeked", doPlay, { once: true });
    } else {
      doPlay();
    }
  };

  return (
    <div className="relative mx-auto my-6 w-full max-w-[400px] overflow-hidden rounded-2xl border-2 border-[#f3c34e]/40 bg-black shadow-2xl shadow-amber-950/40 select-none">
      {/* Video Container (Vertical 9:16) */}
      <div
        className="relative aspect-[9/16] w-full cursor-pointer bg-black overflow-hidden flex items-center justify-center"
        onClick={(e) => handleTogglePlay(e)}
      >
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted={isMuted}
          poster={POSTER_URL}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPlaying={() => {
            setIsPlaying(true);
            setIsLoading(false);
          }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onSeeked={() => setIsLoading(false)}
          onEnded={() => {
            setIsPlaying(false);
            if (!revealedRef.current && onReveal) {
              revealedRef.current = true;
              onReveal();
            }
          }}
          className="h-full w-full object-cover"
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none z-30">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f3c34e] border-t-transparent" />
          </div>
        )}

        {/* Big Central Play Button when Paused */}
        {hasStartedWithSound && !isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 pointer-events-none z-20 transition-all">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/80 border-2 border-[#f3c34e] text-[#f3c34e] shadow-[0_0_30px_rgba(243,195,78,0.6)] transform scale-100 hover:scale-110 transition-transform">
              <Play className="h-8 w-8 fill-[#f3c34e] ml-1" />
            </div>
          </div>
        )}

        {/* SMART AUTOPLAY OVERLAY (Pulsing sound button) */}
        {!hasStartedWithSound && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-between p-5 bg-gradient-to-b from-black/70 via-black/40 to-black/80 transition-all hover:bg-black/50"
            onClick={handleUnmuteAndPlay}
          >
            {/* Top Warning Banner */}
            <div className="animate-pulse flex items-center gap-2 rounded-full border border-amber-400/50 bg-black/80 px-4 py-2 text-xs font-bold text-amber-300 shadow-lg backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span>YOUR VIDEO HAS STARTED</span>
            </div>

            {/* Central High-Converting CTA Button */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleUnmuteAndPlay}
                className="group relative flex items-center gap-3 rounded-2xl border-2 border-[#f3c34e] bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-6 py-4 text-center font-bold text-black shadow-[0_0_30px_rgba(243,195,78,0.7)] transition-all transform hover:scale-105 active:scale-95 animate-bounce"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/90 text-[#f3c34e]">
                  <Volume2 className="h-6 w-6 animate-pulse" />
                </div>
                <div className="text-left leading-tight">
                  <div className="text-sm uppercase tracking-wider font-extrabold text-black">
                    Click to Listen
                  </div>
                  <div className="text-xs font-semibold text-black/80">
                    Unmute with Sound 🔊
                  </div>
                </div>
              </button>
              <p className="text-xs text-amber-200/90 font-medium tracking-wide drop-shadow">
                Tap anywhere to listen from the beginning
              </p>
            </div>

            {/* Bottom Note */}
            <div className="text-[11px] text-[#d8cba7]/80">
              Please make sure your volume is turned up
            </div>
          </div>
        )}

        {/* Minimal Controls when playing with sound */}
        {hasStartedWithSound && (
          <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8 opacity-90 transition-opacity hover:opacity-100">
            {/* Progress Bar */}
            <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between text-xs text-[#d8cba7]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleTogglePlay(e)}
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-all active:scale-95"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 fill-white" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleRestart(e)}
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-all active:scale-95"
                  aria-label="Restart video"
                  title="Restart from beginning"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const video = videoRef.current;
                    if (video) {
                      video.muted = !video.muted;
                      setIsMuted(video.muted);
                    }
                  }}
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-all active:scale-95"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-red-400" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-[#f3c34e]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
