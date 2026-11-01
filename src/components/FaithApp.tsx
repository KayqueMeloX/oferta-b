import { useState, useRef, useEffect } from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface Session {
  email: string;
  plan: string;
}

type Tab = "home" | "library" | "audio" | "pray";

interface Book {
  id: string;
  tag?: string;
  title: string;
  subtitle: string;
  cover: string;
  locked?: boolean;
  badge?: string;
  badgeColor?: string;
  pagesCount: number;
  chapters: { title: string; text: string[]; scripture?: string }[];
}

interface PrayerRequest {
  id: string;
  text: string;
  answered: boolean;
  date: string;
}

// ─── Real Assets from plan-faith.com ──────────────────────────────────────────

const ASSETS = {
  hero: "https://plan-faith.com/__l5e/assets-v1/ca4162c8-3869-4a49-9316-3c5c075e4757/faith-app-hero.jpg",
  coverBlueprint: "https://plan-faith.com/__l5e/assets-v1/371768e4-6927-4bc9-99f9-0f010985638b/faith-cover-blueprint.jpg",
  coverSanctuary: "https://plan-faith.com/__l5e/assets-v1/f1446989-c561-4963-9a9a-20bcffd85c0b/faith-cover-sanctuary.jpg",
  coverPlan: "https://plan-faith.com/assets/faith-cover-plan-DOQOKYqJ.jpg",
  coverSeals: "https://plan-faith.com/assets/faith-cover-seals-CRwSv7ld.jpg",
  coverWealth: "https://plan-faith.com/__l5e/assets-v1/517928fd-1d1d-4358-ac3f-e5310d138a77/faith-cover-wealth.jpg",
  coverAltar: "https://plan-faith.com/__l5e/assets-v1/3f844a80-3def-4203-975a-31611624c3c0/faith-cover-altar.jpg",
};

// ─── Complete Books Content for the In-App Reader ────────────────────────────

const LIBRARY_BOOKS: Book[] = [
  {
    id: "front",
    title: "Personalized Script & Blueprint",
    subtitle: "200+ prayers, scriptures & declarations",
    cover: ASSETS.coverBlueprint,
    pagesCount: 42,
    badge: "INCLUDED",
    badgeColor: "#c9a84c",
    chapters: [
      {
        title: "Part 1: The Principle of the Divine Seed",
        scripture: '"Now he that ministereth seed to the sower both minister bread for your food, and multiply your seed sown." — 2 Corinthians 9:10',
        text: [
          "Faith is not an abstract wishing; it is the spiritual title deed of things hoped for. When God places a burden or an intense desire for breakthrough in your chest, He is not teasing you. He is planting a seed of what already exists in the heavenly realms.",
          "Every physical manifestation begins as a spiritual declaration. The words you speak over your mornings dictate the harvest you reap in your evenings. You cannot speak lack all day and expect divine abundance at midnight.",
          "Starting today, you will align your mouth with God's heavenly ledger. Where the world reports scarcity, inflation, and closed doors, you will declare: 'My God shall supply all my needs according to His riches in glory by Christ Jesus.'",
        ],
      },
      {
        title: "Part 2: Breaking the Spirit of Delay",
        scripture: '"For the vision is yet for an appointed time, but at the end it shall speak, and not lie: though it tarry, wait for it; because it will surely come." — Habakkuk 2:3',
        text: [
          "Many believers mistakenly believe that waiting on God means doing nothing. But biblical waiting is active expectation. It is like a waiter in a royal dining room, alert and ready to serve.",
          "The enemy loves to use time as a weapon of weariness. If he can make you tired of believing, he does not even have to fight you. But today, every chain of spiritual sluggishness and delay is broken in Jesus' name.",
          "Speak this aloud right now: 'I refuse to be tired of doing good. My harvest is not delayed; it is ripening. At the appointed hour, every closed door in my finances, family, and health shall swing open wide.'",
        ],
      },
      {
        title: "Part 3: Daily Sevenfold Abundance Protocol",
        scripture: '"Beloved, I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth." — 3 John 1:2',
        text: [
          "1. First 5 Minutes: Guard the morning gates. Do not look at notifications or bank balances before thanking God for breath and life.",
          "2. The Living Decree: Speak your three primary prayers out loud into the atmosphere.",
          "3. The Act of Trust: Give, bless, or perform an act of kindness without expecting return.",
          "4. Guard Your Gates: Silence every voice of mockery, gossiping, and doubt throughout the afternoon.",
          "5. Evening Release: Hand all unsettled matters back into the hands of the Father before your head touches the pillow.",
        ],
      },
    ],
  },
  {
    id: "plan",
    title: "90-Day Activation Plan",
    subtitle: "Daily path + 7 guided audio prayers",
    cover: ASSETS.coverPlan,
    pagesCount: 65,
    badge: "INCLUDED",
    badgeColor: "#c9a84c",
    chapters: [
      {
        title: "Day 1 to 30: Clearing the Spiritual Soil",
        scripture: '"Break up your fallow ground, and sow not among thorns." — Jeremiah 4:3',
        text: [
          "Before the seed can explode with life, the thorns of old grudges, unforgiveness, and secret doubts must be pulled out by the roots.",
          "Spend these first thirty days asking the Holy Spirit to reveal any bitterness stored in your heart. Forgiveness is not saying what happened was right; it is transferring the case to God's courtroom where justice is eternal.",
          "Declare today: 'Lord, clean my heart. I release everyone who hurt me. I open my hands so You can fill them with miracles.'",
        ],
      },
      {
        title: "Day 31 to 60: The Deep Roots of Bold Faith",
        scripture: '"That Christ may dwell in your hearts by faith; that ye, being rooted and grounded in love..." — Ephesians 3:17',
        text: [
          "In month two, your prayers shift from asking timidly to standing boldly upon what the Word already promises.",
          "A person rooted in God cannot be blown over by a bad phone call, an unexpected bill, or a doctor's report. Rooted trees flourish even in drought.",
          "Declare: 'I am like a tree planted by rivers of living water. What I put my hands to do shall prosper.'",
        ],
      },
      {
        title: "Day 61 to 90: Receiving the Supernatural Harvest",
        scripture: '"And let us not be weary in well doing: for in due season we shall reap, if we faint not." — Galatians 6:9',
        text: [
          "The final stretch is where the enemy attacks the hardest, because he knows the breakthrough is within arm's reach.",
          "Do not give up at day 75 or 85. Keep watering your faith with daily gratitude and bold praises.",
          "Today's declaration: 'I step into my harvest season. The blessings of the Lord make rich and add no sorrow with it!'",
        ],
      },
    ],
  },
  {
    id: "app",
    title: "Daily Sanctuary & Prayer Protocol",
    subtitle: "Devotional, prayer tracker & SOS prayers",
    cover: ASSETS.coverSanctuary,
    pagesCount: 38,
    badge: "BONUS",
    badgeColor: "#8b5cf6",
    chapters: [
      {
        title: "Establishing the Sanctuary of Peace in Your Home",
        scripture: '"Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you." — John 14:27',
        text: [
          "Your home is an altar. What atmosphere are you feeding inside its four walls? Is it anxious news and stress, or praise and prayer?",
          "Every morning, consecrate each room: the doorway, the kitchen table, the bedrooms. Where the Lord dwells, fear has no legal right to remain.",
        ],
      },
      {
        title: "The 3-Minute Emergency SOS Prayers",
        scripture: '"God is our refuge and strength, a very present help in trouble." — Psalm 46:1',
        text: [
          "When panic strikes your chest or unexpected news arrives, do not react with human words. Stop immediately, place your hand over your heart, and say: 'The Lord is my shepherd; I shall not want. Peace, be still.'",
          "Speak Psalm 91 in full authority. No weapon formed against your household shall prosper.",
        ],
      },
    ],
  },
  {
    id: "seals",
    tag: "Protection",
    title: "The 7 Holy Seals of Family Protection",
    subtitle: "Daily protective covering over your loved ones",
    cover: ASSETS.coverSeals,
    pagesCount: 30,
    badge: "VAULT",
    badgeColor: "#d97706",
    chapters: [
      {
        title: "Seal 1: The Blood of the Lamb Over Your Doorposts",
        scripture: '"And the blood shall be to you for a token upon the houses where ye are: and when I see the blood, I will pass over you." — Exodus 12:13',
        text: [
          "Just as the children of Israel were covered during the darkest night in Egypt, your family is marked by divine covenant.",
          "Every morning, speak this over your children and spouse: 'I place the blood of the Lamb over our minds, our bodies, our coming in and our going out.'",
        ],
      },
      {
        title: "Seal 2: The Angelic Wall of Fire",
        scripture: '"For I, saith the Lord, will be unto her a wall of fire round about, and will be the glory in the midst of her." — Zechariah 2:5',
        text: [
          "No accident, stray bullet, disease or evil intent can penetrate God's consuming fire surrounding your family. Rest in that promise tonight.",
        ],
      },
    ],
  },
  {
    id: "wealth",
    tag: "Provision",
    title: "The Solomon Wealth Code",
    subtitle: "30-day journey through the money wisdom of Proverbs",
    cover: ASSETS.coverWealth,
    pagesCount: 52,
    badge: "VAULT",
    badgeColor: "#d97706",
    chapters: [
      {
        title: "Day 1: Asking for Wisdom Above Gold",
        scripture: '"Give me now wisdom and knowledge... And God said to Solomon, Wisdom and knowledge is granted unto thee; and I will give thee riches, and wealth, and honour." — 2 Chronicles 1:10-12',
        text: [
          "When you ask God for wisdom to manage what is in your hands, money automatically flows to you as a servant, never as a master.",
          "Declare: 'Lord, give me divine ideas, witty inventions, and financial clarity today.'",
        ],
      },
      {
        title: "Day 2: Breaking the Spirit of Debt",
        scripture: '"The rich ruleth over the poor, and the borrower is servant to the lender." — Proverbs 22:7',
        text: [
          "You are not born to be an economic slave. God has a strategy for debt cancellation and supernatural surplus for your household.",
        ],
      },
    ],
  },
  {
    id: "altar",
    tag: "Family",
    title: "The 40-Night Family Altar",
    subtitle: "Nightly prayer protocol for home restoration",
    cover: ASSETS.coverAltar,
    pagesCount: 48,
    badge: "VAULT",
    badgeColor: "#d97706",
    chapters: [
      {
        title: "Night 1: Consecrating the Family Altar",
        scripture: '"As for me and my house, we will serve the Lord." — Joshua 24:15',
        text: [
          "Gather your loved ones or pray alone in their honor. 10 minutes at night can overturn 10 years of family struggle.",
          "Pray: 'Lord, reign over this household. May peace fill every heart in this home.'",
        ],
      },
    ],
  },
];

// ─── Guided Audio Tracks ──────────────────────────────────────────────────────

const GUIDED_AUDIOS = [
  {
    id: 1,
    title: "Morning Prayer of Faith & Favor",
    duration: 512, // 8:32
    formattedDuration: "8:32",
    verse: "Psalm 5:3",
    narration: "Heavenly Father, as the dawn breaks, I lift my soul to You. I place this day into Your sovereign hands. I decree that every step I take today is ordered by the Lord. Favor surrounds me as a shield, and doors of supernatural blessing are open before me. Amen.",
  },
  {
    id: 2,
    title: "Abundance & Provision Activation",
    duration: 735, // 12:15
    formattedDuration: "12:15",
    verse: "Philippians 4:19",
    narration: "Lord of all provision, You own the cattle on a thousand hills. I release every anxiety concerning finances, bills, and debt. I declare that Your abundance flows into my hands, not just for survival, but to be a blessing to many. In Jesus' name, Amen.",
  },
  {
    id: 3,
    title: "Deep Sleep & Angelic Protection",
    duration: 1368, // 22:48
    formattedDuration: "22:48",
    verse: "Psalm 91:11",
    narration: "Lord, I lay my head down in peace. You give Your angels charge over me to guard me in all my ways. Every worry of today is cast upon You. I receive deep, restorative sleep under the shadow of the Almighty. Amen.",
  },
  {
    id: 4,
    title: "Faith Declaration Over Your Household",
    duration: 364, // 6:04
    formattedDuration: "6:04",
    verse: "Joshua 24:15",
    narration: "I speak life, health, and salvation over my spouse, my children, and my entire generation. No weapon formed against us shall prosper. As for me and my house, we will walk in the favor and joy of the Lord. Amen.",
  },
  {
    id: 5,
    title: "Breaking Chains of Fear & Anxiety",
    duration: 580, // 9:40
    formattedDuration: "9:40",
    verse: "2 Timothy 1:7",
    narration: "God has not given me a spirit of fear, but of power, love, and a sound mind. I command every panic and dark thought to flee from my presence. My mind is filled with the shalom peace of Christ.",
  },
  {
    id: 6,
    title: "Healing & Restoration of the Body",
    duration: 642, // 10:42
    formattedDuration: "10:42",
    verse: "Isaiah 53:5",
    narration: "By His stripes I am healed. Every cell, every organ, and every bone in my body comes into divine alignment with the life of God. Sickness has no legal ground in my temple.",
  },
  {
    id: 7,
    title: "The Evening Miracle Prayer",
    duration: 490, // 8:10
    formattedDuration: "8:10",
    verse: "Psalm 4:8",
    narration: "Lord, I thank You for sustaining me through this day. What I could not finish, I trust You to complete while I sleep. Tomorrow will bring fresh mercies and unexpected testimonies.",
  },
];

// ─── SOS Quick Prayers ────────────────────────────────────────────────────────

const SOS_PRAYERS = [
  {
    id: "money",
    title: "Worried about money",
    ref: "Philippians 4:19",
    verse: "And my God will meet all your needs according to the riches of his glory in Christ Jesus.",
    prayer: "Lord, I bring You every bill and every number. Give me wisdom, calm and the courage to act well today. I trust Your provision above all things. Amen.",
  },
  {
    id: "family",
    title: "Family conflict",
    ref: "Colossians 3:13-14",
    verse: "Bear with each other and forgive one another... And over all these virtues put on love.",
    prayer: "Lord, remove all bitterness and harsh words from our home. Melt our hearts with patience, and let Your peace reign over our family today. Amen.",
  },
  {
    id: "anxiety",
    title: "Anxiety & Racing Mind",
    ref: "1 Peter 5:7",
    verse: "Cast all your anxiety on him because he cares for you.",
    prayer: "Father, take this heavy weight from my chest. I breathe out fear and I breathe in Your Holy Spirit. You hold my tomorrow. Amen.",
  },
  {
    id: "health",
    title: "Health & Healing",
    ref: "Jeremiah 30:17",
    verse: "For I will restore health unto thee, and I will heal thee of thy wounds, saith the Lord.",
    prayer: "Lord, lay Your healing hand upon my body right now. Restore every weak place, strengthen my spirit, and grant me vitality. Amen.",
  },
  {
    id: "direction",
    title: "Need Wisdom & Direction",
    ref: "James 1:5",
    verse: "If any of you lacks wisdom, you should ask God, who gives generously to all.",
    prayer: "Holy Spirit, guide my thoughts and my choices. Close doors that lead to trouble, and open doors that align with Your purpose. Amen.",
  },
];

// ─── Web Audio API Realtime Synthesizer (Heavenly Sounds) ─────────────────────

function HeavenlySounds() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [timerMin, setTimerMin] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const cleanupFnRef = useRef<(() => void) | null>(null);

  // Volume update
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Auto-off timer
  useEffect(() => {
    if (!timerMin || !activeSound) return;
    const t = setTimeout(() => {
      stopSound();
      setTimerMin(0);
    }, timerMin * 60 * 1000);
    return () => clearTimeout(t);
  }, [timerMin, activeSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupFnRef.current?.();
      audioCtxRef.current?.close();
    };
  }, []);

  function stopSound() {
    cleanupFnRef.current?.();
    cleanupFnRef.current = null;
    setActiveSound(null);
  }

  function playSound(type: "rain" | "harp" | "night") {
    if (activeSound === type) {
      stopSound();
      return;
    }
    stopSound();

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = audioCtxRef.current ?? new AudioCtx();
    audioCtxRef.current = ctx;
    ctx.resume();

    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    const stopNodes: (() => void)[] = [];

    if (type === "rain" || type === "night") {
      // Pink/Brown noise generator
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = type === "rain" ? white * 0.18 : lastOut * 2.8;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = type === "rain" ? 1600 : 500;
      noise.connect(filter);

      if (type === "night") {
        // Night waves: LFO modulation
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.08;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.35;
        lfo.connect(lfoGain);

        const subGain = ctx.createGain();
        subGain.gain.value = 0.5;
        lfoGain.connect(subGain.gain);

        filter.connect(subGain);
        subGain.connect(masterGain);

        lfo.start();
        stopNodes.push(() => { lfo.stop(); lfo.disconnect(); });
      } else {
        filter.connect(masterGain);
      }

      noise.start();
      stopNodes.push(() => { noise.stop(); noise.disconnect(); filter.disconnect(); });
    } else if (type === "harp") {
      // Sacred Harp Pad (Chords: A 220Hz, C# 277.18Hz, E 329.63Hz, A 440Hz)
      const freqs = [220, 277.18, 329.63, 440];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;

        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.08;

        // Subtle shimmer LFO
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.15 + idx * 0.05;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.04;

        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        lfo.start();

        stopNodes.push(() => {
          osc.stop();
          lfo.stop();
          osc.disconnect();
          lfo.disconnect();
        });
      });
    }

    cleanupFnRef.current = () => {
      stopNodes.forEach(fn => fn());
      masterGain.disconnect();
    };

    setActiveSound(type);
  }

  const sounds = [
    { id: "rain", label: "Gentle prayer rain", icon: "🌧️" },
    { id: "harp", label: "Sacred harp pad", icon: "🕊️" },
    { id: "night", label: "Night of peace", icon: "🌙" },
  ];

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(201,168,76,0.25)",
      borderRadius: 20,
      padding: "20px",
      marginTop: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h3 style={{ color: "#f0d080", fontSize: 16, margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          ✨ Heavenly Sounds — Free Ambient
        </h3>
        {activeSound && (
          <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
            ● PLAYING
          </span>
        )}
      </div>
      <p style={{ color: "#8a7a5a", fontSize: 12, margin: "0 0 16px", fontFamily: "sans-serif" }}>
        Real-time calming background frequencies for prayer, Bible reading or deep restorative sleep.
      </p>

      {/* 3 Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
        {sounds.map(s => {
          const isActive = activeSound === s.id;
          return (
            <button
              key={s.id}
              onClick={() => playSound(s.id as "rain" | "harp" | "night")}
              style={{
                background: isActive ? "linear-gradient(135deg, #c9a84c, #f0d080)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${isActive ? "#c9a84c" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 14,
                padding: "14px 8px",
                color: isActive ? "#1a1200" : "#d4c4a0",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                fontWeight: isActive ? 700 : 500,
                fontSize: 12,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <span style={{ textAlign: "center", lineHeight: 1.2 }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Volume and Timer Controls */}
      {activeSound && (
        <div style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: 14,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
          {/* Volume */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#8a7a5a", fontSize: 12, minWidth: 50 }}>Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: "#c9a84c", cursor: "pointer" }}
            />
            <span style={{ color: "#f0d080", fontSize: 12, minWidth: 35, textAlign: "right" }}>
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Sleep Timer */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#8a7a5a", fontSize: 12, minWidth: 50 }}>Timer:</span>
            {[0, 15, 30, 60].map(mins => (
              <button
                key={mins}
                onClick={() => setTimerMin(mins)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 12,
                  fontSize: 11,
                  cursor: "pointer",
                  border: timerMin === mins ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                  background: timerMin === mins ? "#c9a84c" : "transparent",
                  color: timerMin === mins ? "#1a1200" : "#8a7a5a",
                  fontWeight: timerMin === mins ? 700 : 400,
                }}
              >
                {mins === 0 ? "Off" : `${mins}m`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Guided Audio Player ──────────────────────────────────────────────────────

function AudioPlayerTab() {
  const [selectedTrackIdx, setSelectedTrackIdx] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [speechActive, setSpeechActive] = useState(false);

  const track = selectedTrackIdx !== null ? GUIDED_AUDIOS[selectedTrackIdx] : null;

  // Real-time progress simulator or audio player
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && track) {
      interval = setInterval(() => {
        setProgressSec(prev => {
          if (prev >= track.duration) {
            setIsPlaying(false);
            if (speechActive && "speechSynthesis" in window) {
              window.speechSynthesis.cancel();
              setSpeechActive(false);
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, track, speechActive]);

  function togglePlay() {
    if (!track) return;

    if (isPlaying) {
      setIsPlaying(false);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.pause();
      }
    } else {
      setIsPlaying(true);
      // Optional speech narration for real audible guidance if desired
      if ("speechSynthesis" in window && !speechActive) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(track.narration);
          utterance.rate = 0.88; // gentle, reverent pace
          utterance.pitch = 1.0;
          utterance.lang = "en-US";
          utterance.onend = () => setSpeechActive(false);
          window.speechSynthesis.speak(utterance);
          setSpeechActive(true);
        } catch {
          // ignore if speech synthesis is disabled
        }
      } else if ("speechSynthesis" in window && speechActive) {
        window.speechSynthesis.resume();
      }
    }
  }

  function handleSelectTrack(idx: number) {
    if (speechActive && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeechActive(false);
    }
    setSelectedTrackIdx(idx);
    setProgressSec(0);
    setIsPlaying(true);

    if ("speechSynthesis" in window) {
      setTimeout(() => {
        try {
          const t = GUIDED_AUDIOS[idx];
          const utterance = new SpeechSynthesisUtterance(t.narration);
          utterance.rate = 0.88;
          utterance.pitch = 1.0;
          utterance.lang = "en-US";
          utterance.onend = () => setSpeechActive(false);
          window.speechSynthesis.speak(utterance);
          setSpeechActive(true);
        } catch {
          // ignore
        }
      }, 300);
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div style={{ padding: "20px 20px 100px", maxWidth: 540, margin: "0 auto" }}>
      <h1 style={{ color: "#f0d080", fontSize: 26, margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
        Audio Prayers
      </h1>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 24px", fontFamily: "sans-serif" }}>
        7 Spirit-led guided prayer tracks to transform the spiritual atmosphere of your life.
      </p>

      {/* Main Now Playing Card */}
      {track && (
        <div style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06))",
          border: "1px solid rgba(201,168,76,0.4)",
          borderRadius: 24,
          padding: "24px 20px",
          marginBottom: 24,
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}>
          {/* Animated Glow Circle */}
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "linear-gradient(135deg, #c9a84c, #f0d080)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: isPlaying ? "0 0 35px rgba(201,168,76,0.6)" : "0 0 15px rgba(201,168,76,0.2)",
            transition: "all 0.3s",
            cursor: "pointer",
          }} onClick={togglePlay}>
            <span style={{ fontSize: 36, color: "#1a1200", marginLeft: isPlaying ? 0 : 4 }}>
              {isPlaying ? "❚❚" : "▶"}
            </span>
          </div>

          <p style={{ color: "#f0d080", fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: "0 0 4px" }}>
            {track.title}
          </p>
          <p style={{ color: "#c9a84c", fontSize: 12, margin: "0 0 14px", fontStyle: "italic" }}>
            {track.verse}
          </p>

          {/* Animated sound bars */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, height: 24, marginBottom: 14 }}>
            {[4, 8, 14, 20, 16, 22, 12, 18, 6, 12, 20, 8].map((h, i) => (
              <span
                key={i}
                style={{
                  width: 3,
                  height: isPlaying ? `${Math.max(4, (h * (1 + Math.sin(progressSec + i))))}px` : "4px",
                  background: "#c9a84c",
                  borderRadius: 2,
                  transition: "height 0.2s ease",
                }}
              />
            ))}
          </div>

          {/* Seek Bar */}
          <input
            type="range"
            min="0"
            max={track.duration}
            value={progressSec}
            onChange={e => setProgressSec(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "#c9a84c", cursor: "pointer", marginBottom: 6 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", color: "#8a7a5a", fontSize: 11 }}>
            <span>{formatTime(progressSec)}</span>
            <span>{track.formattedDuration}</span>
          </div>

          {/* Spoken Word Preview Box */}
          <div style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 14,
            padding: "12px 14px",
            marginTop: 16,
            textAlign: "left",
          }}>
            <p style={{ color: "#8a7a5a", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px", fontWeight: 700 }}>
              Spoken Word Prayer
            </p>
            <p style={{ color: "#d4c4a0", fontSize: 13, margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>
              "{track.narration}"
            </p>
          </div>
        </div>
      )}

      {/* Track List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {GUIDED_AUDIOS.map((t, idx) => {
          const isCurrent = selectedTrackIdx === idx;
          return (
            <div
              key={t.id}
              onClick={() => handleSelectTrack(idx)}
              style={{
                background: isCurrent ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isCurrent ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: isCurrent && isPlaying ? "linear-gradient(135deg, #c9a84c, #f0d080)" : "rgba(201,168,76,0.15)",
                border: "1px solid rgba(201,168,76,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: isCurrent && isPlaying ? "#1a1200" : "#c9a84c",
                fontSize: 14, flexShrink: 0,
              }}>
                {isCurrent && isPlaying ? "❚❚" : "▶"}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ color: isCurrent ? "#f0d080" : "#e0d0b0", fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: "0 0 2px" }}>
                  {idx + 1}. {t.title}
                </p>
                <p style={{ color: "#8a7a5a", fontSize: 11, margin: 0 }}>
                  {t.verse}
                </p>
              </div>

              <span style={{ color: "#8a7a5a", fontSize: 12, flexShrink: 0 }}>
                {t.formattedDuration}
              </span>
            </div>
          );
        })}
      </div>

      {/* Heavenly Sounds Ambient Generator */}
      <HeavenlySounds />
    </div>
  );
}

// ─── Digital Book Reader Modal (Read in app) ──────────────────────────────────

function BookReaderModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const [fontSize, setFontSize] = useState(16);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const chapter = book.chapters[currentChapter] ?? book.chapters[0];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      background: "#0a0a0a",
      color: "#e8d8b8",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Playfair Display', serif",
    }}>
      {/* Top Bar */}
      <div style={{
        background: "rgba(20,20,20,0.98)",
        borderBottom: "1px solid rgba(201,168,76,0.25)",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 20 }}>📖</span>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: "#f0d080", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {book.title}
            </p>
            <p style={{ margin: 0, color: "#8a7a5a", fontSize: 11, fontFamily: "sans-serif" }}>
              Chapter {currentChapter + 1} of {book.chapters.length} · {book.pagesCount} pages
            </p>
          </div>
        </div>

        {/* Font Controls and Close */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setFontSize(s => Math.max(13, s - 1))}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#c9a84c", borderRadius: 8, padding: "4px 10px", fontSize: 13, cursor: "pointer",
            }}
          >
            A-
          </button>
          <button
            onClick={() => setFontSize(s => Math.min(22, s + 1))}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#c9a84c", borderRadius: 8, padding: "4px 10px", fontSize: 13, cursor: "pointer",
            }}
          >
            A+
          </button>
          <button
            onClick={onClose}
            style={{
              background: "linear-gradient(135deg, #c9a84c, #f0d080)", border: "none",
              color: "#1a1200", borderRadius: 8, padding: "6px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Book Content Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "36px 20px 80px",
        maxWidth: 700,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}>
        {/* Cover Preview Badge */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <img
            src={book.cover}
            alt={book.title}
            style={{
              width: 140, height: 180, objectFit: "cover", borderRadius: 14,
              boxShadow: "0 10px 30px rgba(0,0,0,0.8), 0 0 25px rgba(201,168,76,0.3)",
              marginBottom: 16, border: "1px solid rgba(201,168,76,0.3)",
            }}
          />
          <h1 style={{ color: "#f0d080", fontSize: 24, margin: "0 0 6px", fontWeight: 700 }}>
            {book.title}
          </h1>
          <p style={{ color: "#8a7a5a", fontSize: 13, fontFamily: "sans-serif", margin: 0 }}>
            {book.subtitle}
          </p>
        </div>

        {/* Chapter Switcher Tabs */}
        {book.chapters.length > 1 && (
          <div style={{
            display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 24,
            borderBottom: "1px solid rgba(201,168,76,0.2)",
          }}>
            {book.chapters.map((c, i) => (
              <button
                key={i}
                onClick={() => setCurrentChapter(i)}
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                  whiteSpace: "nowrap", fontFamily: "sans-serif",
                  border: currentChapter === i ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                  background: currentChapter === i ? "linear-gradient(135deg, #c9a84c, #f0d080)" : "rgba(255,255,255,0.04)",
                  color: currentChapter === i ? "#1a1200" : "#8a7a5a",
                  fontWeight: currentChapter === i ? 700 : 400,
                }}
              >
                Chapter {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Current Chapter Content */}
        <div>
          <h2 style={{ color: "#f0d080", fontSize: 20, margin: "0 0 16px", borderLeft: "3px solid #c9a84c", paddingLeft: 12 }}>
            {chapter.title}
          </h2>

          {chapter.scripture && (
            <div style={{
              background: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 14,
              padding: "16px 20px",
              marginBottom: 24,
              fontStyle: "italic",
              color: "#f0d080",
              lineHeight: 1.6,
              fontSize: fontSize + 1,
            }}>
              {chapter.scripture}
            </div>
          )}

          {chapter.text.map((paragraph, pIdx) => (
            <p
              key={pIdx}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: 1.85,
                color: "#d8c8a8",
                marginBottom: 20,
                textAlign: "justify",
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Bottom Navigation between Chapters */}
        <div style={{
          display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.1)", fontFamily: "sans-serif",
        }}>
          {currentChapter > 0 ? (
            <button
              onClick={() => setCurrentChapter(c => c - 1)}
              style={{
                background: "none", border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c",
                borderRadius: 8, padding: "8px 16px", cursor: "pointer",
              }}
            >
              ← Previous Chapter
            </button>
          ) : <div />}

          {currentChapter < book.chapters.length - 1 ? (
            <button
              onClick={() => setCurrentChapter(c => c + 1)}
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f0d080)", border: "none", color: "#1a1200",
                borderRadius: 8, padding: "8px 16px", fontWeight: 700, cursor: "pointer",
              }}
            >
              Next Chapter →
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f0d080)", border: "none", color: "#1a1200",
                borderRadius: 8, padding: "8px 16px", fontWeight: 700, cursor: "pointer",
              }}
            >
              ✓ Complete Reading
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Library Tab ──────────────────────────────────────────────────────────────

function LibraryTab({ session }: { session: Session }) {
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  const isAdmin = session.email.toLowerCase().includes("admin") || session.plan === "seed-100";

  return (
    <div style={{ padding: "20px 20px 100px", maxWidth: 540, margin: "0 auto" }}>
      <h1 style={{ color: "#f0d080", fontSize: 26, margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
        My Library
      </h1>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 24px", fontFamily: "sans-serif" }}>
        Tap any material to read immediately inside the app or download your digital copy.
      </p>

      {/* Your Unlocked Materials */}
      <h2 style={{
        color: "#c9a84c", fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
        textTransform: "uppercase", margin: "0 0 14px", fontFamily: "sans-serif",
      }}>
        Your Materials
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
        {LIBRARY_BOOKS.map(book => {
          return (
            <div
              key={book.id}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,168,76,0.25)",
                borderRadius: 20,
                padding: "16px",
                display: "flex",
                gap: 16,
                alignItems: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                transition: "all 0.2s",
              }}
            >
              {/* Cover Image */}
              <img
                src={book.cover}
                alt={book.title}
                style={{
                  width: 72, height: 96, objectFit: "cover", borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)", flexShrink: 0,
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    background: book.badgeColor || "#c9a84c", color: "#1a1200",
                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                    letterSpacing: 0.5, fontFamily: "sans-serif",
                  }}>
                    {book.badge}
                  </span>
                  <span style={{ color: "#8a7a5a", fontSize: 11, fontFamily: "sans-serif" }}>
                    {book.pagesCount} pages
                  </span>
                </div>

                <h3 style={{
                  color: "#f0d080", fontSize: 15, fontFamily: "'Playfair Display', serif",
                  fontWeight: 700, margin: "0 0 4px", lineHeight: 1.3,
                }}>
                  {book.title}
                </h3>
                <p style={{ color: "#8a7a5a", fontSize: 12, margin: "0 0 12px", fontFamily: "sans-serif", lineHeight: 1.4 }}>
                  {book.subtitle}
                </p>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setReadingBook(book)}
                    style={{
                      background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                      border: "none", color: "#1a1200", fontWeight: 700,
                      fontSize: 12, padding: "6px 14px", borderRadius: 20,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                      fontFamily: "sans-serif",
                    }}
                  >
                    📖 Read in app
                  </button>

                  <button
                    onClick={() => alert(`Starting download for ${book.title}...`)}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#d4c4a0", fontSize: 11, padding: "6px 12px",
                      borderRadius: 20, cursor: "pointer", fontFamily: "sans-serif",
                    }}
                  >
                    📥 PDF
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Modal */}
      {readingBook && (
        <BookReaderModal
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}
    </div>
  );
}

// ─── Pray & Journal Tab ───────────────────────────────────────────────────────

function PrayTab() {
  const [selectedSOS, setSelectedSOS] = useState<typeof SOS_PRAYERS[0] | null>(null);
  const [requests, setRequests] = useState<PrayerRequest[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("faith_prayer_requests");
      return saved ? JSON.parse(saved) : [
        { id: "1", text: "Protection and favor over my family and children", answered: true, date: "Yesterday" },
        { id: "2", text: "Supernatural financial breakthrough and wisdom", answered: false, date: "Today" },
      ];
    } catch {
      return [];
    }
  });

  const [newReqText, setNewReqText] = useState("");
  const [journal, setJournal] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("faith_journal") || "";
  });
  const [journalSaved, setJournalSaved] = useState(false);

  function addRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!newReqText.trim()) return;
    const item: PrayerRequest = {
      id: Date.now().toString(),
      text: newReqText.trim(),
      answered: false,
      date: "Just now",
    };
    const updated = [item, ...requests];
    setRequests(updated);
    localStorage.setItem("faith_prayer_requests", JSON.stringify(updated));
    setNewReqText("");
  }

  function toggleAnswered(id: string) {
    const updated = requests.map(r => r.id === id ? { ...r, answered: !r.answered } : r);
    setRequests(updated);
    localStorage.setItem("faith_prayer_requests", JSON.stringify(updated));
  }

  function saveJournal() {
    localStorage.setItem("faith_journal", journal);
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2000);
  }

  return (
    <div style={{ padding: "20px 20px 100px", maxWidth: 540, margin: "0 auto" }}>
      <h1 style={{ color: "#f0d080", fontSize: 26, margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
        Prayer & Journal
      </h1>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 24px", fontFamily: "sans-serif" }}>
        Bring your burdens before God. Speak His promises and record your personal testimonies.
      </p>

      {/* Sanctuary SOS Section */}
      <h2 style={{
        color: "#c9a84c", fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
        textTransform: "uppercase", margin: "0 0 12px", fontFamily: "sans-serif",
      }}>
        Sanctuary SOS — Prayers for hard moments
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 24 }}>
        {SOS_PRAYERS.map(sos => {
          const isSelected = selectedSOS?.id === sos.id;
          return (
            <button
              key={sos.id}
              onClick={() => setSelectedSOS(isSelected ? null : sos)}
              style={{
                background: isSelected ? "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.1))" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isSelected ? "#c9a84c" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 14,
                padding: "12px 14px",
                textAlign: "left",
                color: isSelected ? "#f0d080" : "#d4c4a0",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "sans-serif",
                fontWeight: isSelected ? 700 : 500,
              }}
            >
              {sos.title}
            </button>
          );
        })}
      </div>

      {/* SOS Prayer Card Popup */}
      {selectedSOS && (
        <div style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))",
          border: "1px solid rgba(201,168,76,0.4)",
          borderRadius: 18,
          padding: "20px",
          marginBottom: 28,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <h3 style={{ color: "#f0d080", fontSize: 17, margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
              {selectedSOS.title}
            </h3>
            <span style={{ color: "#c9a84c", fontSize: 12, fontStyle: "italic" }}>
              {selectedSOS.ref}
            </span>
          </div>
          <p style={{ color: "#f0d080", fontSize: 14, fontStyle: "italic", lineHeight: 1.6, margin: "0 0 12px" }}>
            "{selectedSOS.verse}"
          </p>
          <div style={{
            background: "rgba(0,0,0,0.4)", borderRadius: 12, padding: "14px",
            borderLeft: "3px solid #c9a84c",
          }}>
            <p style={{ color: "#e0d0b0", fontSize: 14, lineHeight: 1.6, margin: 0, fontFamily: "'Playfair Display', serif" }}>
              {selectedSOS.prayer}
            </p>
          </div>
        </div>
      )}

      {/* Prayer Requests Tracker */}
      <h2 style={{
        color: "#c9a84c", fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
        textTransform: "uppercase", margin: "0 0 12px", fontFamily: "sans-serif",
      }}>
        Prayer Requests Tracker (Private)
      </h2>

      <form onSubmit={addRequest} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={newReqText}
          onChange={e => setNewReqText(e.target.value)}
          placeholder="Lord, I ask You for..."
          style={{
            flex: 1, padding: "12px 14px", borderRadius: 12,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.3)",
            color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "sans-serif",
          }}
        />
        <button
          type="submit"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #f0d080)",
            border: "none", color: "#1a1200", fontWeight: 700,
            padding: "0 18px", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif",
          }}
        >
          Add
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {requests.map(req => (
          <div
            key={req.id}
            onClick={() => toggleAnswered(req.id)}
            style={{
              background: req.answered ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${req.answered ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <span style={{
              width: 22, height: 22, borderRadius: 6,
              border: `1px solid ${req.answered ? "#4ade80" : "rgba(255,255,255,0.3)"}`,
              background: req.answered ? "#4ade80" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#1a1200", fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              {req.answered ? "✓" : ""}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{
                color: req.answered ? "#86efac" : "#e0d0b0",
                fontSize: 14, margin: "0 0 2px",
                textDecoration: req.answered ? "line-through" : "none",
                fontFamily: "sans-serif",
              }}>
                {req.text}
              </p>
              <span style={{ color: "#6b5a2a", fontSize: 10 }}>
                {req.answered ? "Answered by God! 🎉" : req.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Faith Journal */}
      <h2 style={{
        color: "#c9a84c", fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
        textTransform: "uppercase", margin: "0 0 12px", fontFamily: "sans-serif",
      }}>
        Faith Journal (Private on this device)
      </h2>
      <textarea
        value={journal}
        onChange={e => setJournal(e.target.value)}
        placeholder="Lord, today I bring to You... (Gratitude, testimonies, inner thoughts)"
        rows={6}
        style={{
          width: "100%", padding: "14px", borderRadius: 14, boxSizing: "border-box",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.3)",
          color: "#f0d080", fontSize: 15, outline: "none", resize: "vertical",
          fontFamily: "'Playfair Display', serif", lineHeight: 1.6, marginBottom: 10,
        }}
      />
      <button
        onClick={saveJournal}
        style={{
          padding: "12px 24px", borderRadius: 50, border: "none",
          background: journalSaved ? "#4ade80" : "linear-gradient(135deg, #c9a84c, #f0d080)",
          color: journalSaved ? "#fff" : "#1a1200", fontWeight: 700, fontSize: 14,
          cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.3s",
        }}
      >
        {journalSaved ? "✓ Journal Saved!" : "Save Journal Entry"}
      </button>
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({ session, onNavigateTab }: { session: Session; onNavigateTab: (t: Tab) => void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const subline = hour < 12 ? "The Lord is your strength today." : hour < 18 ? "Pause for a moment — He is with you." : "Lay down today's weight. Rest in His peace.";

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Golden Sunrise Hero Banner */}
      <div style={{
        position: "relative",
        height: 250,
        overflow: "hidden",
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      }}>
        <img
          src={ASSETS.hero}
          alt="Golden sunrise"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.5) 50%, transparent 100%)",
        }} />

        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <p style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 4px" }}>
            Today's Word
          </p>
          <p style={{ color: "#f0d080", fontSize: 17, fontFamily: "'Playfair Display', serif", fontStyle: "italic", margin: "0 0 4px", lineHeight: 1.4 }}>
            "The Lord will fight for you; you need only to be still."
          </p>
          <p style={{ color: "#a09070", fontSize: 12, margin: 0, fontFamily: "sans-serif" }}>
            — Exodus 14:14
          </p>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0", maxWidth: 540, margin: "0 auto" }}>
        {/* Personalized Greeting */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ color: "#f0d080", fontSize: 24, margin: "0 0 4px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            {greeting}, Believer
          </h1>
          <p style={{ color: "#8a7a5a", fontSize: 13, margin: 0, fontFamily: "sans-serif" }}>
            {subline}
          </p>
        </div>

        {/* Streak Counter Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: 18,
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 32 }}>🔥</span>
          <div>
            <p style={{ color: "#f0d080", fontSize: 16, fontWeight: 700, margin: "0 0 2px", fontFamily: "sans-serif" }}>
              1 day in a row with God
            </p>
            <p style={{ color: "#8a7a5a", fontSize: 12, margin: 0, fontFamily: "sans-serif" }}>
              Come back tomorrow to keep your spiritual prayer streak.
            </p>
          </div>
        </div>

        {/* Quick Action Button: A Word for My Moment */}
        <button
          onClick={() => onNavigateTab("pray")}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #c9a84c, #f0d080)",
            border: "none",
            borderRadius: 18,
            padding: "16px 20px",
            textAlign: "left",
            cursor: "pointer",
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
          }}
        >
          <div>
            <p style={{ color: "#1a1200", fontSize: 16, fontWeight: 700, margin: "0 0 2px", fontFamily: "sans-serif" }}>
              A word for my moment →
            </p>
            <p style={{ color: "#3a2a00", fontSize: 12, margin: 0, fontFamily: "sans-serif" }}>
              Pick how you feel and receive an instant scripture & prayer.
            </p>
          </div>
          <span style={{ fontSize: 24 }}>✨</span>
        </button>

        {/* 3 Metric Badges */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28 }}>
          {[
            { label: "Unlocked", val: `${LIBRARY_BOOKS.length}/6` },
            { label: "Prayers", val: "200+" },
            { label: "Audios", val: "7 Tracks" },
          ].map(m => (
            <div key={m.label} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "12px 8px", textAlign: "center",
            }}>
              <p style={{ color: "#f0d080", fontSize: 17, fontWeight: 700, margin: "0 0 2px", fontFamily: "sans-serif" }}>
                {m.val}
              </p>
              <p style={{ color: "#8a7a5a", fontSize: 11, margin: 0, fontFamily: "sans-serif" }}>
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Continue Your Journey Grid */}
        <h2 style={{ color: "#f0d080", fontSize: 17, margin: "0 0 14px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          Continue Your Journey
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {LIBRARY_BOOKS.slice(0, 4).map(book => (
            <div
              key={book.id}
              onClick={() => onNavigateTab("library")}
              style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: 18,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <img
                src={book.cover}
                alt={book.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)",
              }} />
              <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
                <p style={{ color: "#f0d080", fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.2, fontFamily: "'Playfair Display', serif" }}>
                  {book.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Floating Support Chat Bubble (Grace) ─────────────────────────────────────

function SupportChatBubble() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: "bot" | "user"; text: string }[]>([
    { sender: "bot", text: "Hi! I'm Grace from Sanctuary Support ✨ Having trouble opening your books, audios, or need guidance? Ask me anything!" },
  ]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    const userText = msg.trim();
    setChatLog(prev => [...prev, { sender: "user", text: userText }]);
    setMsg("");

    setTimeout(() => {
      let reply = "I understand! Your books are available under 'Library' with the 'Read in app' button, and all 7 audio prayer tracks + Heavenly Sounds are under 'Audio'. If you need anything else, write to support.fakko.solutions@gmail.com!";
      if (userText.toLowerCase().includes("audio") || userText.toLowerCase().includes("sound")) {
        reply = "To listen to guided prayers, tap the 'Audio' tab at the bottom! You can also turn on 'Gentle prayer rain' or 'Sacred harp' in real time!";
      } else if (userText.toLowerCase().includes("book") || userText.toLowerCase().includes("pdf") || userText.toLowerCase().includes("read")) {
        reply = "You can tap any book in the 'Library' tab and click 'Read in app' to read the full chapter texts immediately!";
      }
      setChatLog(prev => [...prev, { sender: "bot", text: reply }]);
    }, 600);
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Need help? Chat with support"
        style={{
          position: "fixed", bottom: 70, right: 16, zIndex: 9000,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #c9a84c, #f0d080)",
          border: "none", color: "#1a1200", fontSize: 24,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 6px 25px rgba(201,168,76,0.5)",
        }}
      >
        💬
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: 135, right: 16, zIndex: 9001,
          width: "calc(100vw - 32px)", maxWidth: 360, height: 440,
          background: "#141414", border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: 20, display: "flex", flexDirection: "column",
          overflow: "hidden", boxShadow: "0 15px 50px rgba(0,0,0,0.8)",
          fontFamily: "sans-serif",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #c9a84c, #f0d080)",
            padding: "12px 16px", color: "#1a1200",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Sanctuary Support</p>
              <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>Grace · AI Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#1a1200" }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: "14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {chatLog.map((c, i) => (
              <div
                key={i}
                style={{
                  alignSelf: c.sender === "user" ? "flex-end" : "flex-start",
                  background: c.sender === "user" ? "#c9a84c" : "rgba(255,255,255,0.08)",
                  color: c.sender === "user" ? "#1a1200" : "#e0d0b0",
                  padding: "10px 14px", borderRadius: 14, maxWidth: "85%", fontSize: 13,
                  lineHeight: 1.4,
                }}
              >
                {c.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 8 }}>
            <input
              type="text"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="Type your question..."
              style={{
                flex: 1, padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff", fontSize: 13, outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#c9a84c", border: "none", color: "#1a1200",
                fontWeight: 700, borderRadius: 10, padding: "0 14px", cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// ─── Login Gate Screen ────────────────────────────────────────────────────────

function GateScreen({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ADMIN_EMAIL = "admin@gmail.com";

  function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Enter a valid email."); return; }
    setError("");
    setLoading(true);

    if (email.toLowerCase().trim() === ADMIN_EMAIL) {
      setTimeout(() => {
        const session: Session = { email, plan: "seed-100" };
        localStorage.setItem("faith_app_session", JSON.stringify(session));
        setLoading(false);
        onLogin(session);
      }, 600);
      return;
    }

    setTimeout(() => { setLoading(false); setStep("code"); }, 1000);
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 4) { setError("Enter the code you received."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const session: Session = { email, plan: "seed-100" };
      localStorage.setItem("faith_app_session", JSON.stringify(session));
      setLoading(false);
      onLogin(session);
    }, 800);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #151000 50%, #0a0a0a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "'Playfair Display', serif",
    }}>
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, #c9a84c, #f0d080)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px", fontSize: 32,
          boxShadow: "0 0 35px rgba(201,168,76,0.4)",
        }}>✨</div>
        <h1 style={{ color: "#f0d080", fontSize: 26, margin: "0 0 6px", fontWeight: 700 }}>
          My Faith Sanctuary
        </h1>
        <p style={{ color: "#8a7a5a", margin: 0, fontSize: 13, fontFamily: "sans-serif" }}>
          Member Area — Access your Blueprint, Audios & Devotional
        </p>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,168,76,0.3)",
        borderRadius: 20, padding: "32px 24px", width: "100%", maxWidth: 360,
      }}>
        {step === "email" ? (
          <form onSubmit={handleSendCode}>
            <p style={{ color: "#e0d0b0", fontSize: 14, textAlign: "center", margin: "0 0 20px", fontFamily: "sans-serif" }}>
              Enter the email you used at checkout:
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com (or admin@gmail.com)"
              required
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,168,76,0.3)",
                color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 10,
                fontFamily: "sans-serif",
              }}
            />
            {error && <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 10px", fontFamily: "sans-serif" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "15px", borderRadius: 12, border: "none",
                background: loading ? "#6b5a2a" : "linear-gradient(135deg, #c9a84c, #f0d080)",
                color: "#1a1200", fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer",
                fontFamily: "sans-serif",
              }}
            >
              {loading ? "Checking..." : "Send My Sign-In Code →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <p style={{ color: "#e0d0b0", fontSize: 13, textAlign: "center", margin: "0 0 16px", fontFamily: "sans-serif" }}>
              Enter the 4-digit code sent to <strong style={{ color: "#f0d080" }}>{email}</strong>:
            </p>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="1234"
              maxLength={6}
              style={{
                width: "100%", padding: "12px", borderRadius: 12, textAlign: "center",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,168,76,0.3)",
                color: "#fff", fontSize: 24, letterSpacing: 8, outline: "none", boxSizing: "border-box", marginBottom: 10,
              }}
            />
            {error && <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 10px", fontFamily: "sans-serif" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "15px", borderRadius: 12, border: "none",
                background: loading ? "#6b5a2a" : "linear-gradient(135deg, #c9a84c, #f0d080)",
                color: "#1a1200", fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer",
                fontFamily: "sans-serif",
              }}
            >
              {loading ? "Opening..." : "Access Sanctuary →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Bottom Navigation Bar ────────────────────────────────────────────────────

function BottomNavigation({ currentTab, onSelectTab }: { currentTab: Tab; onSelectTab: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "library", label: "Library", icon: "📚" },
    { id: "audio", label: "Audio", icon: "🎵" },
    { id: "pray", label: "Pray", icon: "🙏" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
      background: "rgba(10,10,10,0.96)", backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(201,168,76,0.25)",
      display: "flex", justifyContent: "space-around",
      padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
    }}>
      {tabs.map(tab => {
        const active = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              onSelectTab(tab.id);
              window.scrollTo(0, 0);
            }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              color: active ? "#f0d080" : "#6a6a6a",
              padding: "4px 16px", minWidth: 60,
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: active ? 700 : 400 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main FaithApp Export ─────────────────────────────────────────────────────

export function FaithApp() {
  const [session, setSession] = useState<Session | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("faith_app_session");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const [tab, setTab] = useState<Tab>("home");

  if (!session) {
    return <GateScreen onLogin={setSession} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#f5e8c8",
    }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 40, zIndex: 100,
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
        padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>✨</span>
          <span style={{ color: "#f0d080", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17 }}>
            My Faith Sanctuary
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#8a7a5a", fontSize: 11, fontFamily: "sans-serif" }}>
            {session.email.split("@")[0]}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("faith_app_session");
              setSession(null);
            }}
            style={{
              background: "none", border: "1px solid rgba(255,255,255,0.15)",
              color: "#8a7a5a", borderRadius: 12, padding: "3px 8px",
              fontSize: 11, cursor: "pointer", fontFamily: "sans-serif",
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main>
        {tab === "home" && <HomeTab session={session} onNavigateTab={setTab} />}
        {tab === "library" && <LibraryTab session={session} />}
        {tab === "audio" && <AudioPlayerTab />}
        {tab === "pray" && <PrayTab />}
      </main>

      {/* Floating Support Chat */}
      <SupportChatBubble />

      {/* Bottom Nav Bar */}
      <BottomNavigation currentTab={tab} onSelectTab={setTab} />
    </div>
  );
}
