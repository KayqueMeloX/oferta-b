import React, { useEffect, useRef, useState } from "react";

const ASSET_BASE = "https://plan-faith.com/__l5e/assets-v1";

const MEDIA = {
  clips: {
    v1: `${ASSET_BASE}/cc41fd43-1aaa-4881-93cd-e5aaf22f8af9/quiz-v1.mp4`,
    v2: `${ASSET_BASE}/15459292-cdc3-4a52-aa18-aa782582b8bf/quiz-v2.mp4`,
    v3: `${ASSET_BASE}/d3fadad7-f4bd-494d-8e02-640d572a8b0b/quiz-v3.mp4`,
    v4: `${ASSET_BASE}/18afd891-5df1-4031-8e34-af72b1a0a2c3/quiz-v4.mp4`,
    v5: `${ASSET_BASE}/7a851682-0f39-46c1-97d5-d3bd137a9150/quiz-v5.mp4`,
    v6: `${ASSET_BASE}/54db6ef4-35ea-4707-92a5-9aed047a6d66/quiz-v6.mp4`,
    v7: `${ASSET_BASE}/a245e9a8-3747-4717-b291-7b0f3b85d3ce/quiz-v7.mp4`,
    v8: `${ASSET_BASE}/076c2ffe-8eb7-4924-a14b-cadb8d812666/quiz-v8.mp4`,
  },
  loop: `${ASSET_BASE}/bf4c8854-e825-42d2-9d50-d92aa3fd839a/quiz-loop.mp4`,
  bgm: `${ASSET_BASE}/6b1a07aa-2e39-4d9b-bcc7-63f446eb9093/quiz-bgm.mp3`,
  logo: `${ASSET_BASE}/90d44b0e-d74e-4018-909d-df4da854af47/quiz-logo.png`,
};

type ClipKey = keyof typeof MEDIA.clips;
const CLIPS_ORDER: ClipKey[] = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8"];

const getNextClip = (clip: ClipKey): ClipKey | null => {
  const idx = CLIPS_ORDER.indexOf(clip);
  return idx >= 0 && idx + 1 < CLIPS_ORDER.length ? CLIPS_ORDER[idx + 1] ?? null : null;
};

const SPEECH_MAP: Record<string, ClipKey> = {
  entrance: "v1",
  affirm: "v2",
  q0: "v3",
  q1: "v4",
  q6: "v5",
  q9: "v6",
  q15: "v7",
  loading: "v8",
};

const ACHIEVEMENTS: Record<
  string,
  { name: string; img: string; sub: string; btn: string }
> = {
  mult: {
    name: "100x Multiplication",
    img: `${ASSET_BASE}/ee396474-4be6-4d6a-98a7-37731c4773ee/pf-mult.jpg`,
    sub: "",
    btn: "⚡ YES! I receive 100x more!",
  },
  future: {
    name: "I Choose My Future",
    img: `${ASSET_BASE}/7665994b-aaa6-4edc-b414-0ba7e4ad5126/pf-future.jpg`,
    sub: "The power to change your life is in your hands!",
    btn: "⚡ Continue Evolution",
  },
  faith: {
    name: "Faith Decision",
    img: `${ASSET_BASE}/ecea97b0-8e6a-4d98-abbc-b7b5de9e5881/pf-faith.jpg`,
    sub: "🙏 Your Faith Will Move Mountains",
    btn: "⚡ Continue Evolution",
  },
  home: {
    name: "Dream Home",
    img: `${ASSET_BASE}/a46179d6-03e9-42d7-ae2a-28e48d8a45cc/pf-home.jpg`,
    sub: "🏠 Your Dream Home Is on Its Way",
    btn: "⚡ Continue Evolution",
  },
  car: {
    name: "Dream Car",
    img: `${ASSET_BASE}/06405fa0-2219-47a0-bf83-be0cf3087e02/pf-car.jpg`,
    sub: "🚗 Your Dream Car Is Reserved",
    btn: "⚡ Continue Evolution",
  },
  family: {
    name: "Happy Family",
    img: `${ASSET_BASE}/c0ccd35d-df5c-4d44-91a1-b8d4fddd1c18/pf-family.jpg`,
    sub: "👨‍👩‍👧‍👦 The Happy Family You Deserve",
    btn: "⚡ Continue Evolution",
  },
  health: {
    name: "Perfect Health",
    img: `${ASSET_BASE}/fc56eb74-af48-448c-a883-a531cfb8b151/pf-health.jpg`,
    sub: "❤️ Your Perfect Health Is Activated",
    btn: "⚡ Continue Evolution",
  },
  abundance: {
    name: "Abundance",
    img: `${ASSET_BASE}/d29c542e-920d-4f22-a8de-3bf91ea2cbd8/pf-abundance.jpg`,
    sub: "💸 Imagine abundance flowing into every area of your life right now!",
    btn: "⚡ YES! I believe, I receive!",
  },
  boost: {
    name: "100x Boost",
    img: `${ASSET_BASE}/facb5950-88cb-4607-954d-f9e0b8d30a08/pf-boost.jpg`,
    sub: "⚡ Your Manifestation Power Just Multiplied by 100x",
    btn: "⚡ Continue Evolution",
  },
  blocks: {
    name: "Blocks Broken",
    img: `${ASSET_BASE}/38c88d47-0875-4735-a48b-a9bf59c004ba/pf-blocks.jpg`,
    sub: "🔓 All Mental Blocks Have Been Removed",
    btn: "⚡ Continue Evolution",
  },
};

const MILESTONES: Record<number, string> = {
  0: "mult",
  4: "future",
  7: "faith",
  9: "home",
  10: "car",
  11: "family",
  12: "health",
  13: "abundance",
  14: "boost",
  15: "blocks",
};

interface Question {
  type: "number" | "choice";
  text: string;
  placeholder?: string;
  options?: string[];
}

const QUESTIONS: Question[] = [
  {
    type: "number",
    text: "[NAME], if you looked at your bank account today, how much would you have available?",
    placeholder: "Enter numbers only (e.g. 1500)",
  },
  {
    type: "choice",
    text: "[NAME], do you feel like you're living the life God dreamed for you?",
    options: [
      "Yes, but I know I can live more",
      "No, I feel I'm far from it",
      "Sometimes I wonder about this...",
    ],
  },
  {
    type: "choice",
    text: "How often do you feel an emptiness in your chest... as if something is missing?",
    options: ["Every day", "A few times a week", "Rarely"],
  },
  {
    type: "choice",
    text: "Do you feel stuck in the same negative cycles for years?",
    options: ["Yes, it feels like a loop", "Sometimes I feel this", "I'm not sure"],
  },
  {
    type: "choice",
    text: "If the life you live today was the direct result of your own choices... would you be satisfied?",
    options: ["No, I want to change", "More or less", "Yes, but I want more"],
  },
  {
    type: "choice",
    text: "How many times have you asked God for a sign to change your life?",
    options: [
      "Many times",
      "A few times",
      "I don't usually ask for signs",
      "This is my first time",
    ],
  },
  {
    type: "choice",
    text: "[NAME], if today were your final faith test… what would you do right now?",
    options: [
      "I would take action like someone who believes in miracles",
      "I'd take a small, scared step... but still take a step",
      "I'd stay frozen... one more time... just like the other times I gave up",
    ],
  },
  {
    type: "choice",
    text: "Do you believe God can transform your life with just one single decision from you?",
    options: ["Yes, absolutely", "I have doubts", "I don't know"],
  },
  {
    type: "choice",
    text: "Are you willing to make TODAY your day of faith and responsibility for your new life?",
    options: ["Yes, I'm ready", "I need a clearer sign", "No"],
  },
  {
    type: "choice",
    text: "If God gave you the chance to win your dream home… what would it look like?",
    options: [
      "Large, with several rooms",
      "A modern apartment",
      "A simple house, but full of peace",
      "I don't think much about it",
    ],
  },
  {
    type: "choice",
    text: "What car do you imagine parked in front of your ideal home?",
    options: [
      "A luxury SUV",
      "A comfortable sedan",
      "A simple but reliable car",
      "I don't care about cars",
    ],
  },
  {
    type: "choice",
    text: "What is your family life like today?",
    options: [
      "I feel there's a lack of unity",
      "I miss someone special",
      "I have a good family, but we can be happier",
      "I don't think much about it",
    ],
  },
  {
    type: "choice",
    text: "If you could wake up tomorrow with perfect health… what would be different?",
    options: [
      "More energy to chase my dreams",
      "Being able to play sports without pain",
      "Feeling good about my body",
      "My health is good, but I want more vitality",
    ],
  },
  {
    type: "choice",
    text: "If you received a large sum of money today… what would you do first?",
    options: [
      "Pay off my debts",
      "Buy a house",
      "Fulfill my family's dream",
      "Invest in my future",
    ],
  },
  {
    type: "choice",
    text: "Imagine that 30 days from now, your life is 100% transformed. Which of these images represents your future?",
    options: [
      "Luxury home and financial freedom",
      "Perfect health and vitality",
      "Happy family and love",
      "Travel and new experiences",
    ],
  },
  {
    type: "choice",
    text: "Do you feel there's something spiritual or emotional blocking you?",
    options: ["Yes, a weight I can't explain", "Sometimes I feel this", "No"],
  },
  {
    type: "choice",
    text: "Which of these statements best describes you?",
    options: [
      "I feel cursed, nothing ever works out for me",
      "My life has never been easy",
      "I don't feel worthy",
      "I lack energy and motivation",
    ],
  },
  {
    type: "choice",
    text: "Do you accept to be part of a group of people who decided to create their dream life through the power of faith?",
    options: ["Yes, I accept", "I'm not sure", "I need to think about it"],
  },
  {
    type: "choice",
    text: "If you could change just one thing right now... what would it be?",
    options: [
      "My financial situation",
      "My relationships",
      "My health",
      "My purpose in life",
    ],
  },
  {
    type: "choice",
    text: "If God gave you the chance to start over today… would you accept?",
    options: ["Yes, without hesitation", "Yes, but with some fear", "I'm not ready"],
  },
];

const getTag = (index: number) => {
  if (index <= 5) return "Financial Awakening";
  if (index <= 8) return "Faith & Commitment";
  if (index <= 14) return "Vision & Desire";
  return "Breaking Blocks";
};

const formatCurrency = (val: number) =>
  "$" +
  val.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function FaithQuiz() {
  const [gateOpen, setGateOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<
    "entrance" | "affirmation" | "questionScreen" | "loading"
  >("entrance");
  const [userName, setUserName] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [balance, setBalance] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [numberInputValue, setNumberInputValue] = useState("");

  // Modal Overlay state
  const [modalActive, setModalActive] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  // Loading animation state
  const [loadPct, setLoadPct] = useState(0);
  const [loadStatus, setLoadStatus] = useState("Starting transformation...");

  // Media Refs
  const loopVidRef = useRef<HTMLVideoElement>(null);
  const speechVid1Ref = useRef<HTMLVideoElement>(null);
  const speechVid2Ref = useRef<HTMLVideoElement>(null);
  const activeSpeechIndexRef = useRef<0 | 1>(0);
  const bgmRef = useRef<HTMLAudioElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);

  // Speech video playback handler
  const playSpeech = (clipKey?: ClipKey, onEnd?: () => void) => {
    if (!clipKey || !MEDIA.clips[clipKey]) {
      setIsWaiting(false);
      setIsSpeaking(false);
      onEnd?.();
      return;
    }

    setIsWaiting(true);
    setIsSpeaking(true);

    const activeVid =
      activeSpeechIndexRef.current === 0
        ? speechVid1Ref.current
        : speechVid2Ref.current;
    const idleVid =
      activeSpeechIndexRef.current === 0
        ? speechVid2Ref.current
        : speechVid1Ref.current;

    if (!activeVid) return;

    let finished = false;
    let timer: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      activeVid.classList.remove("show");
      setIsWaiting(false);
      setIsSpeaking(false);
      onEnd?.();
    };

    activeVid.onended = cleanup;
    activeVid.onerror = cleanup;
    activeVid.onloadedmetadata = () => {
      clearTimeout(timer);
      const dur = activeVid.duration;
      timer = setTimeout(cleanup, ((dur || 10) + 4) * 1000);
    };

    timer = setTimeout(cleanup, 40000);

    const clipSrc = MEDIA.clips[clipKey];
    if (activeVid.src !== clipSrc) {
      activeVid.src = clipSrc;
      try {
        activeVid.load();
      } catch {}
    }

    activeVid.muted = soundMuted;
    activeVid.currentTime = 0;
    activeVid.classList.add("show");
    activeVid.play().catch(cleanup);

    // Preload next clip in idle player
    if (idleVid) {
      const nextKey = getNextClip(clipKey);
      if (nextKey) {
        idleVid.src = MEDIA.clips[nextKey];
        try {
          idleVid.load();
        } catch {}
      }
    }

    // Swap active player for next clip
    activeSpeechIndexRef.current = activeSpeechIndexRef.current === 0 ? 1 : 0;
  };

  // Keyboard and Viewport Resizing for mobile
  useEffect(() => {
    let maxY = 0;
    const handleViewport = () => {
      const vv = window.visualViewport;
      const h = vv ? vv.height : window.innerHeight;
      if (h > maxY) maxY = h;

      const pfq = document.getElementById("pfq");
      if (pfq) {
        pfq.style.setProperty("--vvh", `${h}px`);
        if (maxY - h > 140) {
          pfq.classList.add("kb-open");
        } else {
          pfq.classList.remove("kb-open");
        }
      }

      if (appContainerRef.current && vv) {
        appContainerRef.current.style.top = `${vv.offsetTop}px`;
      }
    };

    handleViewport();
    window.visualViewport?.addEventListener("resize", handleViewport);
    window.visualViewport?.addEventListener("scroll", handleViewport);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleViewport);
      window.visualViewport?.removeEventListener("scroll", handleViewport);
    };
  }, []);

  // Set initial video sources
  useEffect(() => {
    if (loopVidRef.current) loopVidRef.current.src = MEDIA.loop;
    if (bgmRef.current) {
      bgmRef.current.src = MEDIA.bgm;
      bgmRef.current.volume = 0.1;
    }
  }, []);

  // Sound toggle button
  const toggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);

    if (speechVid1Ref.current) speechVid1Ref.current.muted = nextMuted;
    if (speechVid2Ref.current) speechVid2Ref.current.muted = nextMuted;
    if (bgmRef.current) {
      bgmRef.current.muted = nextMuted;
      if (!nextMuted && bgmRef.current.paused) {
        bgmRef.current.play().catch(() => {});
      }
    }
  };

  // Start button on Gate
  const handleStartGate = () => {
    setGateOpen(true);
    if (loopVidRef.current) {
      loopVidRef.current.play().catch(() => {});
    }
    if (bgmRef.current) {
      bgmRef.current.volume = 0.1;
      bgmRef.current.play().catch(() => {});
    }
    playSpeech(SPEECH_MAP.entrance);
  };

  // Start Entrance name submission
  const handleNameSubmit = () => {
    const trimmed = userName.trim();
    if (!trimmed) return;
    setCurrentScreen("affirmation");
    playSpeech(SPEECH_MAP.affirm);
  };

  // Affirmation screen continue
  const handleAffirmationContinue = () => {
    setCurrentQ(0);
    setCurrentScreen("questionScreen");
    playSpeech(SPEECH_MAP.q0);
  };

  // Show milestone modal
  const showMilestoneModal = (key: string, onContinue: () => void) => {
    const item = ACHIEVEMENTS[key];
    if (!item) {
      onContinue();
      return;
    }

    if (!unlockedBadges.includes(key)) {
      setUnlockedBadges((prev) => [...prev, key]);
    }

    const isMult = key === "mult";

    const content = (
      <>
        <div className="modaltop">✓ &nbsp;UNLOCKED! &nbsp;✦</div>
        <div className="achimg">
          <img src={item.img} alt={item.name} />
        </div>
        <div className="achname">{item.name}</div>
        {isMult ? (
          <>
            <div className="achsub">
              {userName}, today I&apos;m adding 100x more to your spiritual balance — do
              you believe?
            </div>
            <div className="balbox">
              New Spiritual Balance: {formatCurrency(balance)}
            </div>
          </>
        ) : (
          <div className="achsub">{item.sub}</div>
        )}
        <button
          className="cta"
          onClick={() => {
            if (key === "abundance") {
              // Second modal for abundance
              setModalContent(
                <>
                  <div className="modaltop">✦ &nbsp;Abundance</div>
                  <div className="achname" style={{ fontSize: "24px" }}>
                    {userName}
                  </div>
                  <div className="achsub">
                    Your manifestation potential depends on your choice. Think big — you
                    are the size of your courage.
                  </div>
                  <button
                    className="cta"
                    onClick={() => {
                      setModalActive(false);
                      onContinue();
                    }}
                  >
                    Continue Journey
                  </button>
                </>
              );
            } else {
              setModalActive(false);
              onContinue();
            }
          }}
        >
          {item.btn}
        </button>
      </>
    );

    setModalContent(content);
    setModalActive(true);
  };

  // Next question or loading
  const advanceQuestion = () => {
    const nextQ = currentQ + 1;
    if (nextQ >= QUESTIONS.length) {
      startLoadingScreen();
    } else {
      setCurrentQ(nextQ);
      const speechKey = SPEECH_MAP[`q${nextQ}`];
      playSpeech(speechKey);
    }
  };

  // Handle answering
  const handleAnswer = (milestoneKey?: string) => {
    if (milestoneKey) {
      showMilestoneModal(milestoneKey, advanceQuestion);
    } else {
      advanceQuestion();
    }
  };

  // Handle number input continue (q0)
  const handleNumberSubmit = () => {
    if (!numberInputValue) return;
    const val = Math.max(0, Math.min(1e9, parseFloat(numberInputValue) || 0)) * 101;
    setBalance(val);
    const milestoneKey = MILESTONES[currentQ];
    handleAnswer(milestoneKey);
  };

  // Start Loading transformation screen
  const startLoadingScreen = () => {
    setCurrentScreen("loading");
    playSpeech(SPEECH_MAP.loading);

    const steps: [number, string][] = [
      [0, "Starting transformation..."],
      [22, "Reading the desires of your heart..."],
      [45, "Aligning your energy with the divine..."],
      [68, "Breaking spiritual blocks..."],
      [85, "Writing your Sacred Script, word by word..."],
      [97, "Finalizing your manifestation..."],
    ];

    let t = 0;
    const interval = setInterval(() => {
      t += 160;
      const totalDur = 12000;
      const pct = Math.min(100, (t / totalDur) * 100);

      for (let i = steps.length - 1; i >= 0; i--) {
        const step = steps[i];
        if (step && pct >= step[0]) {
          setLoadStatus(step[1]);
          break;
        }
      }

      setLoadPct(Math.floor(pct));

      if (pct >= 100) {
        clearInterval(interval);
        setLoadStatus("Your Divine Manifestation Script is ready ✦");
        setTimeout(() => {
          const params = new URLSearchParams(window.location.search);
          params.set("name", userName);
          window.location.href = `/offer?${params.toString()}`;
        }, 1200);
      }
    }, 160);
  };

  const currentQuestionData = QUESTIONS[currentQ];
  const questionText = currentQuestionData
    ? currentQuestionData.text.replace(/\[NAME\]/g, userName || "friend")
    : "";
  const progressPercent =
    currentScreen === "loading"
      ? 100
      : Math.round((currentQ / QUESTIONS.length) * 100);

  return (
    <div
      className={`pfq ${isWaiting ? "waiting" : ""} ${
        currentScreen === "loading" ? "noSpeak" : ""
      }`}
      id="pfq"
    >
      <div className="app" id="app" ref={appContainerRef}>
        {/* Stage with Video background and Audio */}
        <div className="stage">
          <video
            ref={loopVidRef}
            id="loopVid"
            muted
            loop
            playsInline
            preload="auto"
          />
          <video
            ref={speechVid1Ref}
            id="speechVid"
            playsInline
            preload="auto"
            muted={soundMuted}
          />
          <video
            ref={speechVid2Ref}
            id="speechVid2"
            playsInline
            preload="auto"
            muted={soundMuted}
          />
          <audio ref={bgmRef} id="mus" loop preload="auto" />
        </div>

        {/* Scrims */}
        <div className="scrim-top" />
        <div className="scrim-bottom" />

        {/* Top Progress Bar */}
        <div className="progress-wrap">
          <div
            className="progress-bar"
            id="progressBar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Sound Toggle Button */}
        {gateOpen && (
          <button
            className="soundbtn"
            id="soundBtn"
            onClick={toggleSound}
            aria-label="Toggle sound"
          >
            {soundMuted ? "🔇" : "🔊"}
          </button>
        )}

        {/* HUD (Spiritual Balance, Energy, Badges Strip) */}
        <div
          className={`hud ${
            currentScreen === "questionScreen" ? "on" : ""
          }`}
          id="hud"
        >
          <div className="hello" id="hello">
            Hello, {userName} — your journey has begun...
          </div>
          <div className="bal-label">Spiritual Balance</div>
          <div className="bal-value" id="balValue">
            {formatCurrency(balance)}
          </div>
          <div className="energy-row">
            <span>Your energy is aligning with the divine...</span>
            <span id="energyPct">{Math.round(((currentQ + 1) / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="energy-track">
            <div
              className="energy-fill"
              id="energyFill"
              style={{
                width: `${Math.round(((currentQ + 1) / QUESTIONS.length) * 100)}%`,
              }}
            />
          </div>
          <div className="strip" id="strip">
            {unlockedBadges.map((badgeKey) => (
              <div className="thumb" key={badgeKey}>
                <img
                  src={ACHIEVEMENTS[badgeKey]?.img ?? ""}
                  alt={ACHIEVEMENTS[badgeKey]?.name ?? ""}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="speaking" id="speaking">
            Archangel Michael is speaking
            <i />
            <i />
            <i />
          </div>
        )}

        {/* Content Screens */}
        <div className="panel" id="panel">
          {/* Screen 1: Entrance */}
          <div
            className={`screen ${currentScreen === "entrance" ? "active" : ""}`}
            id="entrance"
          >
            <div className="revealable">
              <div className="lead">
                God does not bring you here by accident.
                <br />
                <span className="big">
                  Type your name below and step into what was prepared for you.
                </span>
              </div>
              <input
                type="text"
                id="nameInput"
                className="name-input"
                placeholder="Your name"
                autoComplete="off"
                aria-label="Your name"
                maxLength={40}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNameSubmit();
                  }
                }}
              />
              <button
                className="cta"
                id="startBtn"
                onClick={handleNameSubmit}
                disabled={!userName.trim()}
              >
                BEGIN
              </button>
            </div>
          </div>

          {/* Screen 2: Affirmation */}
          <div
            className={`screen ${
              currentScreen === "affirmation" ? "active" : ""
            }`}
            id="affirmation"
          >
            <div className="revealable">
              <div className="vow">
                <div className="note">Repeat this phrase out loud:</div>
                <div className="phrase">
                  &quot;The life of my dreams begins with my choice.&quot;
                </div>
                <div className="note">
                  Only click continue after repeating it out loud.
                </div>
              </div>
              <button
                className="cta"
                id="affBtn"
                onClick={handleAffirmationContinue}
              >
                Continue Journey
              </button>
            </div>
          </div>

          {/* Screen 3: Question Screen */}
          <div
            className={`screen ${
              currentScreen === "questionScreen" ? "active" : ""
            }`}
            id="questionScreen"
          >
            <div className="tag" id="qtag">
              {getTag(currentQ)}
            </div>
            <div className="question" id="qtext">
              {questionText}
            </div>
            <div id="qbody" className="revealable">
              {currentQuestionData?.type === "number" ? (
                <div>
                  <input
                    type="number"
                    inputMode="decimal"
                    className="money-input"
                    placeholder={currentQuestionData.placeholder}
                    aria-label="Amount"
                    value={numberInputValue}
                    onChange={(e) => setNumberInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleNumberSubmit();
                      }
                    }}
                  />
                  <button
                    className="cta"
                    onClick={handleNumberSubmit}
                    disabled={!numberInputValue}
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="options">
                  {currentQuestionData?.options?.map((option, idx) => (
                    <button
                      key={idx}
                      className="opt"
                      onClick={() => handleAnswer(MILESTONES[currentQ])}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Screen 4: Loading Transformation */}
          <div
            className={`screen ${currentScreen === "loading" ? "active" : ""}`}
            id="loading"
          >
            <div className="lt" id="loadTitle">
              {userName}, your Divine Manifestation Script is being created...
            </div>
            <div className="load-status" id="loadStatus">
              {loadStatus}
            </div>
            <div className="load-track">
              <div
                className="load-fill"
                id="loadFill"
                style={{ width: `${loadPct}%` }}
              />
            </div>
            <div className="load-pct" id="loadPct">
              {loadPct}%
            </div>
          </div>
        </div>

        {/* Initial Gate Screen */}
        {!gateOpen && (
          <div className="gate" id="gate">
            <img
              src={MEDIA.logo}
              alt="Plan Faith"
              width={130}
              height={130}
              loading="eager"
            />
            <div className="gate-t">
              A message from Archangel Michael
              <br />
              is waiting for you
            </div>
            <button className="gate-btn" id="gateBtn" onClick={handleStartGate}>
              ▶ TAP TO BEGIN
            </button>
            <div className="gate-s">Turn your sound on 🔊</div>
          </div>
        )}

        {/* Modal Card Overlay */}
        <div
          className={`overlay ${modalActive ? "active" : ""}`}
          id="overlay"
        >
          <div className="modalcard" id="modalcard">
            {modalContent}
          </div>
        </div>
      </div>
    </div>
  );
}
