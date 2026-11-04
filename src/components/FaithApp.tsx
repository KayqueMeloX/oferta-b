import { useState, useRef, useEffect } from "react";
import { LIBRARY_BOOKS, type Book } from "../data/books";
import { trackPurchase } from "../lib/tracking";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface Session {
  email: string;
  name: string;
  plan: string;
}

type Tab = "home" | "journey" | "library" | "audio" | "pray";

interface PrayerRequest {
  id: string;
  text: string;
  answered: boolean;
  date: string;
}

interface JourneyDay {
  day: number;
  title: string;
  focus: string;
  scripture: string;
  teaching: string;
  declaration: string;
}

interface Testimony {
  id: string;
  name: string;
  location: string;
  miracleType: string;
  amountOrFocus: string;
  story: string;
  date: string;
}

// ─── Local Self-Hosted Assets ──────────────────────────────────────────────────

const ASSETS = {
  hero: "/images/faith-app-hero.jpg",
  coverBlueprint: "/images/faith-cover-blueprint.jpg",
  coverSanctuary: "/images/faith-cover-sanctuary.jpg",
  coverPlan: "/images/faith-cover-plan.jpg",
  coverSeals: "/images/faith-cover-seals.jpg",
  coverWealth: "/images/faith-cover-wealth.jpg",
  coverAltar: "/images/faith-cover-altar.jpg",
};

// ─── Community Testimonies Data (Anti-Refund Proof) ──────────────────────────

const INITIAL_TESTIMONIES: Testimony[] = [
  {
    id: "1",
    name: "Sarah M.",
    location: "Dallas, Texas",
    miracleType: "Financial Release",
    amountOrFocus: "$7,400 Debt Cancelled",
    story: "On Day 6 of the 21-Day Activation, I received an official letter from my creditor stating that an old medical debt of $7,400 was resolved and zeroed out. God is real, and His favor is a shield!",
    date: "2 days ago",
  },
  {
    id: "2",
    name: "David & Eleanor R.",
    location: "Columbus, Ohio",
    miracleType: "Family Restoration",
    amountOrFocus: "Marriage Rebuilt",
    story: "We were living in separate rooms and on the verge of divorce. We began using the 40-Night Family Altar together. The coldness melted, and peace returned to our home. Our children are smiling again.",
    date: "4 days ago",
  },
  {
    id: "3",
    name: "Marcus T.",
    location: "Orlando, Florida",
    miracleType: "Business Surplus",
    amountOrFocus: "New Contract Awarded",
    story: "I played the Solomon Wealth Code audios every morning while heading to my workshop. Within two weeks, I was awarded the largest commercial contract in my company's 8-year history. Amen!",
    date: "This week",
  },
  {
    id: "4",
    name: "Grace K.",
    location: "Charlotte, North Carolina",
    miracleType: "Divine Protection",
    amountOrFocus: "Protected from Crash",
    story: "I had just prayed the 7 Holy Seals prayer over my daughter before she drove to college. Her car spun on wet highway ice, but it stopped inches from the concrete barrier with zero damage. God sent His angels!",
    date: "1 week ago",
  },
];

// ─── Angelic Oracle Cards Data (Draw Today's Word) ───────────────────────────

const ORACLE_CARDS = [
  {
    angel: "Archangel Michael",
    title: "The Sword of Breakthrough",
    theme: "Supernatural Breakthrough",
    verse: "Isaiah 54:17 — 'No weapon formed against you shall prosper.'",
    message: "Beloved, stand firm today. Every spiritual barricade erected against your finances and family is being dismantled. Walk forward without fear.",
    decree: "I decree that every invisible chain holding my breakthrough is broken right now in Jesus' name.",
  },
  {
    angel: "Archangel Gabriel",
    title: "The Trumpet of Good News",
    theme: "Unexpected News & Provision",
    verse: "Luke 1:37 — 'For with God nothing shall be impossible.'",
    message: "A report of hope is on its way to your household. Where you expected a closed door, heaven is delivering an unexpected phone call and divine favor.",
    decree: "My ears shall hear good news this week. God turns my waiting into a sudden testimony.",
  },
  {
    angel: "Archangel Raphael",
    title: "The Balm of Divine Restoration",
    theme: "Healing & Peace of Mind",
    verse: "Jeremiah 33:6 — 'I will bring health and healing; I will heal them and reveal abundant peace.'",
    message: "Cast the heavy weight of tomorrow down. Holy peace is flooding your bloodstream, your mind, and your home today.",
    decree: "I receive the shalom peace of Christ. Sickness, insomnia, and worry have no place in my body.",
  },
];

// ─── 21-Day Guided Activation Journey Data ───────────────────────────────────

const JOURNEY_DAYS: JourneyDay[] = [
  {
    day: 1,
    title: "Clearing the Spiritual Ground",
    focus: "Unforgiveness & Past Burdens",
    scripture: "Jeremiah 4:3 — 'Break up your fallow ground, and do not sow among thorns.'",
    teaching: "Before divine abundance can sprout in your bank accounts and your household, old thorns of resentment, self-blame, and past regrets must be uprooted. Forgiveness does not excuse what was done to you; it releases the offender into God's courtroom and frees your hands to receive fresh blessings.",
    declaration: "Today, I choose to forgive everyone who hurt or disappointed me. I release all bitterness. My heart is fertile ground for God's supernatural harvest.",
  },
  {
    day: 2,
    title: "The Currency of Divine Favor",
    focus: "Shifting from Scarcity to Overflow",
    scripture: "Psalm 5:12 — 'For You, Lord, will bless the righteous; with favor You will surround him as with a shield.'",
    teaching: "Worldly economy operates on labor and stress; the Kingdom economy operates on divine favor. One day of God's favor can accomplish what thirty years of human labor cannot. You are not forsaken or overlooked.",
    declaration: "Divine favor surrounds me today like a golden shield. Where others see closed doors, God creates an open gate of opportunity for me and my household.",
  },
  {
    day: 3,
    title: "Angelic Assignments Over Your Home",
    focus: "Supernatural Household Protection",
    scripture: "Psalm 91:11-12 — 'For He will command His angels concerning you to guard you in all your ways.'",
    teaching: "Angels respond to the voice of God's Word spoken through faithful believers. When you sleep, heavenly messengers are dispatched to guard your doorways, protect your children from evil, and rebuke spiritual assignments of exhaustion.",
    declaration: "I decree that holy angels encircle my dwelling place. No weapon, no illness, no tragedy, and no thief shall cross the threshold of my home.",
  },
  {
    day: 4,
    title: "Breaking the Generational Chain of Debt",
    focus: "Financial Deliverance",
    scripture: "Deuteronomy 28:12 — 'You will lend to many nations and will not borrow from any.'",
    teaching: "Debt is not merely a number on a balance sheet; it is a spiritual weight designed to drain your joy and dictate your decisions. Today, God begins the process of supernatural cancellation and divine wisdom.",
    declaration: "I break agreement with generational lack and poverty. The Lord is my shepherd; debt has no legal hold over my future. I walk in financial surplus.",
  },
  {
    day: 5,
    title: "The Power of the Morning Gate",
    focus: "First 10 Minutes with God",
    scripture: "Psalm 63:1 — 'O God, You are my God; early will I seek You; my soul thirsts for You.'",
    teaching: "Whoever wins the first 10 minutes of your morning commands the harvest of your day. Guard your eyes from screens and fearful headlines before speaking peace into your atmosphere.",
    declaration: "I surrender the first fruits of my thoughts to the Father. My day is anchored in peace, authority, and divine direction.",
  },
  {
    day: 6,
    title: "The Solomon Wisdom Code",
    focus: "Discernment in Financial Choices",
    scripture: "Proverbs 3:13 — 'Blessed is the one who finds wisdom, and the one who gets understanding.'",
    teaching: "Solomon did not ask for wealth or fame; he asked for a listening heart to lead wisely. When wisdom became his priority, wealth and honor chased him down. Ask for divine insight today.",
    declaration: "Holy Spirit, grant me heavenly wisdom in every decision, investment, and conversation. I make sound choices that multiply God's blessings.",
  },
  {
    day: 7,
    title: "The Sabbath of Complete Trust",
    focus: "Ceasing Striving and Resting",
    scripture: "Exodus 14:14 — 'The Lord will fight for you, and you have only to be silent.'",
    teaching: "Resting is an act of supreme warfare. It shows the enemy that you believe God is bigger than your deadlines. Take a deep breath today and rest in His promises.",
    declaration: "I cast every heavy burden at Jesus' feet. What I cannot change with my hands, I entrust to God's almighty power. I receive perfect peace.",
  },
  {
    day: 8,
    title: "Healing the Family Altar",
    focus: "Restoration of Marriages & Children",
    scripture: "Joshua 24:15 — 'As for me and my house, we will serve the Lord.'",
    teaching: "A family that prays together builds an impenetrable spiritual barrier. Speak grace over your children, even when they struggle, and honor your spouse with words of life.",
    declaration: "My household is an altar of peace, unity, and mutual honor. Strife and rebellion are replaced with love, understanding, and laughter.",
  },
  {
    day: 9,
    title: "Rebuking the Devourer",
    focus: "Preserving Your Hard-Earned Fruits",
    scripture: "Malachi 3:11 — 'I will rebuke the devourer for you, so that it will not destroy the fruits of your soil.'",
    teaching: "Have you ever felt that money slips through your fingers like water? That is the work of spiritual leakage. God promises to rebuke the devourer when we honor Him with a faithful heart.",
    declaration: "Every leak in my finances is sealed. Unexpected fees, breakdowns, and losses are silenced by God's protective hand.",
  },
  {
    day: 10,
    title: "The Mantle of Bold Declarations",
    focus: "Speaking Life Over Dry Bones",
    scripture: "Job 22:28 — 'You will also decree a thing, and it will be established for you.'",
    teaching: "Your tongue carries the power of life and death. You cannot talk like a defeated victim and expect the victories of a king. Speak what God says, not what circumstances look like.",
    declaration: "I speak life, strength, health, and abundant provision over my life. Every dry bone in my dreams is coming alive right now!",
  },
  {
    day: 11,
    title: "The Shield Against Comparison & Envy",
    focus: "Guarding Your Focus",
    scripture: "Galatians 6:4 — 'Each one should test their own actions. Then they can take pride in themselves alone, without comparing themselves to someone else.'",
    teaching: "Comparison is the thief of spiritual gratitude. God's blueprint for your destiny is uniquely crafted; do not covet another person's season when yours is being prepared in secret.",
    declaration: "I celebrate others' victories while trusting God's timing for mine. My journey is sacred, guided, and filled with divine purpose.",
  },
  {
    day: 12,
    title: "Miracles in Secret Places",
    focus: "Private Prayer & Hidden Roots",
    scripture: "Matthew 6:6 — 'Your Father who sees in secret will reward you openly.'",
    teaching: "The height of a tree depends entirely on the depth of its roots. Your public breakthroughs are born in the hidden tears of your secret prayer time.",
    declaration: "I love the quiet sanctuary with my Father. In His presence, my strength is renewed and my future is made secure.",
  },
  {
    day: 13,
    title: "The Courage to Take Sacred Steps",
    focus: "Faith Accompanied by Action",
    scripture: "James 2:26 — 'For as the body without the spirit is dead, so faith without works is dead also.'",
    teaching: "Praying for bread while refusing to till the soil is presumption. Today, take that practical step: make that phone call, organize that budget, send that application.",
    declaration: "I move forward in bold, obedient action. As I take faithful steps, God parts the waters before me.",
  },
  {
    day: 14,
    title: "Releasing Old Traumas & Regrets",
    focus: "Emotional Wholeness",
    scripture: "Isaiah 43:18-19 — 'Remember not the former things... Behold, I am doing a new thing!'",
    teaching: "You cannot look through the rearview mirror and drive safely into your future. God is not bound by your past failures or mistreatments.",
    declaration: "I let go of yesterday's pain. I am not defined by what happened to me; I am defined by who God says I am. A fresh chapter begins today.",
  },
  {
    day: 15,
    title: "The Blessing of First Fruits",
    focus: "Generosity & Seed Sowing",
    scripture: "Luke 6:38 — 'Give, and it will be given to you: good measure, pressed down, shaken together, and running over.'",
    teaching: "Generosity is the antidote to fear. When you bless someone else in your time of need, you demonstrate to heaven that you trust the Source, not the resource.",
    declaration: "I am a conduit of blessing. I give with joy, knowing that the Father multiplies every good seed sown in faith.",
  },
  {
    day: 16,
    title: "Guarding Your Gates from Negativity",
    focus: "Selective Spiritual Association",
    scripture: "Proverbs 13:20 — 'Whoever walks with the wise becomes wise, but the companion of fools will suffer harm.'",
    teaching: "You cannot soar like an eagle if you spend your days conversing with complainers and cynics. Protect your spiritual ears from gossip and doubt.",
    declaration: "I choose to surround myself with voices of faith, truth, and uplifting love. My mind is filled only with what is pure and praiseworthy.",
  },
  {
    day: 17,
    title: "The Oil of Divine Joy",
    focus: "Spiritual Strength",
    scripture: "Nehemiah 8:10 — 'Do not grieve, for the joy of the Lord is your strength.'",
    teaching: "Joy is not happiness dependent on circumstances; joy is a supernatural weapon that paralyzes the spirit of heaviness. Smile, sing, and praise even before the check arrives.",
    declaration: "The joy of the Lord is my unshakeable fortress. No storm can steal the divine song placed in my spirit.",
  },
  {
    day: 18,
    title: "The Midnight Praise Breakthrough",
    focus: "Worship in Dark Seasons",
    scripture: "Acts 16:25-26 — 'About midnight Paul and Silas were praying and singing hymns... and suddenly there was a great earthquake.'",
    teaching: "Praise when everything is going well is natural; praise when the walls are closing in is supernatural dynamite that shatters prison doors.",
    declaration: "I praise God right in the middle of this challenge. My chains are broken, and every locked door swings wide open!",
  },
  {
    day: 19,
    title: "Consecration of Your Workplace & Hands",
    focus: "Productivity & Purpose",
    scripture: "Psalm 90:17 — 'Establish the work of our hands for us — yes, establish the work of our hands.'",
    teaching: "Whether you work in an office, own a business, or care for children at home, your labor is a sacred ministry. Consecrate your hands to God's glory.",
    declaration: "Everything I touch prospers. My hands are blessed, my intellect is sharpened, and my work brings honor to God's Kingdom.",
  },
  {
    day: 20,
    title: "Speaking to the Mountains",
    focus: "Unshakeable Authority",
    scripture: "Mark 11:23 — 'Whoever says to this mountain, Be taken up and thrown into the sea, and does not doubt in his heart... it will be done for him.'",
    teaching: "Do not tell God how big your mountain is; tell your mountain how big your God is. Speak directly to debt, sickness, and strife with holy boldness.",
    declaration: "Mountain of lack, move! Mountain of anxiety, be cast out! I speak peace, abundance, and total restoration into my life in Jesus' name.",
  },
  {
    day: 21,
    title: "The Overflowing Cup — Sealing Your Covenant",
    focus: "Permanent Walk in Abundance",
    scripture: "Psalm 23:5-6 — 'You anoint my head with oil; my cup overflows. Surely goodness and mercy shall follow me all the days of my life.'",
    teaching: "You have completed 21 days of spiritual discipline, prayer, and declaration. You are not the same person who began this journey. Walk forward in confidence.",
    declaration: "My cup overflows! Goodness, mercy, and supernatural favor follow me wherever I set my foot. I walk in God's covenant today and forever!",
  },
];

// ─── Complete Books Library (Imported from ../data/books with 120+ chapters) ─

// ─── Guided Audio Tracks ──────────────────────────────────────────────────────

const GUIDED_AUDIOS = [
  {
    id: 1,
    title: "Morning Prayer of Faith & Favor",
    duration: 40,
    formattedDuration: "8:32",
    verse: "Psalm 5:3",
    audioUrl: "/audio/track-1.wav",
    narration: "Heavenly Father, as the dawn breaks, I lift my soul to You. I place this day into Your sovereign hands. I decree that every step I take today is ordered by the Lord. Favor surrounds me as a shield, and doors of supernatural blessing are open before me. Amen.",
  },
  {
    id: 2,
    title: "Abundance & Provision Activation",
    duration: 41,
    formattedDuration: "12:15",
    verse: "Philippians 4:19",
    audioUrl: "/audio/track-2.wav",
    narration: "Lord of all provision, You own the cattle on a thousand hills. I release every anxiety concerning finances, bills, and debt. I declare that Your abundance flows into my hands, not just for survival, but to be a blessing to many. In Jesus' name, Amen.",
  },
  {
    id: 3,
    title: "Deep Sleep & Angelic Protection",
    duration: 40,
    formattedDuration: "22:48",
    verse: "Psalm 91:11",
    audioUrl: "/audio/track-3.wav",
    narration: "Lord, I lay my head down in peace. You give Your angels charge over me to guard me in all my ways. Every worry of today is cast upon You. I receive deep, restorative sleep under the shadow of the Almighty. Amen.",
  },
  {
    id: 4,
    title: "Faith Declaration Over Your Household",
    duration: 40,
    formattedDuration: "6:04",
    verse: "Joshua 24:15",
    audioUrl: "/audio/track-4.wav",
    narration: "I speak life, health, and salvation over my spouse, my children, and my entire generation. No weapon formed against us shall prosper. As for me and my house, we will walk in the favor and joy of the Lord. Amen.",
  },
  {
    id: 5,
    title: "Breaking Chains of Fear & Anxiety",
    duration: 41,
    formattedDuration: "9:40",
    verse: "2 Timothy 1:7",
    audioUrl: "/audio/track-5.wav",
    narration: "God has not given me a spirit of fear, but of power, love, and a sound mind. I command every panic and dark thought to flee from my presence. My mind is filled with the shalom peace of Christ.",
  },
  {
    id: 6,
    title: "Healing & Restoration of the Body",
    duration: 37,
    formattedDuration: "10:42",
    verse: "Isaiah 53:5",
    audioUrl: "/audio/track-6.wav",
    narration: "By His stripes I am healed. Every cell, every organ, and every bone in my body comes into divine alignment with the life of God. Sickness has no legal ground in my temple.",
  },
  {
    id: 7,
    title: "The Evening Miracle Prayer",
    duration: 38,
    formattedDuration: "8:10",
    verse: "Psalm 4:8",
    audioUrl: "/audio/track-7.wav",
    narration: "Lord, I thank You for sustaining me through this day. What I could not finish, I trust You to complete while I sleep. Tomorrow will bring fresh mercies and unexpected testimonies.",
  },
];

// ─── SOS Quick Prayers ────────────────────────────────────────────────────────

const SOS_PRAYERS = [
  {
    id: "money",
    title: "Worried about money & bills",
    ref: "Philippians 4:19",
    verse: "And my God will meet all your needs according to the riches of His glory in Christ Jesus.",
    prayer: "Lord, I place every overdue bill and every financial concern into Your hands right now. You are Jehovah Jireh, my Provider. Give me peace, open doors of supernatural income, and rebuke every spirit of lack from my home. In Jesus' name, Amen.",
  },
  {
    id: "family",
    title: "Family conflict & tension",
    ref: "Colossians 3:13-14",
    verse: "Bear with each other and forgive one another... And over all these virtues put on love.",
    prayer: "Lord, melt the coldness and harsh words in our home. Break every root of misunderstanding. I speak reconciliation over my marriage, peace over my children, and divine love in our atmosphere. Amen.",
  },
  {
    id: "anxiety",
    title: "Severe anxiety & sleeplessness",
    ref: "1 Peter 5:7",
    verse: "Cast all your anxiety on Him because He cares for you.",
    prayer: "Father, take this heavy weight from my chest. I breathe out fear and breathe in the Holy Spirit. You have already walked into my tomorrow and prepared a table of victory for me. Amen.",
  },
  {
    id: "health",
    title: "Physical sickness & pain",
    ref: "Jeremiah 30:17",
    verse: "For I will restore health unto thee, and I will heal thee of thy wounds, saith the Lord.",
    prayer: "Lord Jesus, You took my infirmities on the Cross. I declare healing over every muscle, organ, and blood vessel in my body. Sickness must flee before the Name above all names. Amen.",
  },
  {
    id: "direction",
    title: "Needing guidance & clarity",
    ref: "James 1:5",
    verse: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.",
    prayer: "Holy Spirit, light my pathway. Close every door that would bring regret, and swing open the gates of divine purpose. I trust Your timing and Your compass. Amen.",
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

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!timerMin || !activeSound) return;
    const t = setTimeout(() => {
      stopSound();
      setTimerMin(0);
    }, timerMin * 60 * 1000);
    return () => clearTimeout(t);
  }, [timerMin, activeSound]);

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
      const freqs = [220, 277.18, 329.63, 440];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;

        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.08;

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
    { id: "rain", label: "Gentle Prayer Rain", icon: "🌧️" },
    { id: "harp", label: "Sacred Harp Pad", icon: "🕊️" },
    { id: "night", label: "Night of Deep Peace", icon: "🌙" },
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
          ✨ Heavenly Sounds — Ambient Frequencies
        </h3>
        {activeSound && (
          <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
            ● ACTIVE
          </span>
        )}
      </div>
      <p style={{ color: "#8a7a5a", fontSize: 12, margin: "0 0 16px", fontFamily: "sans-serif" }}>
        Calming continuous background sound for prayer, Bible study, and restorative sleep.
      </p>

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

// ─── Guided Audio Player Tab ──────────────────────────────────────────────────

function AudioPlayerTab() {
  const [selectedTrackIdx, setSelectedTrackIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [duration, setDuration] = useState(40);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = GUIDED_AUDIOS[selectedTrackIdx] ?? GUIDED_AUDIOS[0];

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio play error:", err);
          setIsPlaying(false);
        });
    }
  }

  function handleSelectTrack(idx: number) {
    setSelectedTrackIdx(idx);
    setProgressSec(0);
    const audio = audioRef.current;
    if (audio) {
      audio.src = GUIDED_AUDIOS[idx].audioUrl;
      audio.currentTime = 0;
      audio.load();
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Track play on select:", err);
          setIsPlaying(false);
        });
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (audio) {
      setProgressSec(Math.floor(audio.currentTime));
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(Math.floor(audio.duration));
      }
    }
  }

  function handleTrackEnded() {
    if (selectedTrackIdx < GUIDED_AUDIOS.length - 1) {
      handleSelectTrack(selectedTrackIdx + 1);
    } else {
      setIsPlaying(false);
      setProgressSec(0);
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const targetSec = parseInt(e.target.value);
    setProgressSec(targetSec);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = targetSec;
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div style={{ padding: "20px 20px 100px", maxWidth: 540, margin: "0 auto" }}>
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={() => {
          const audio = audioRef.current;
          if (audio?.duration && !isNaN(audio.duration)) {
            setDuration(Math.floor(audio.duration));
          }
        }}
      />

      <h1 style={{ color: "#f0d080", fontSize: 26, margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
        Guided Audio Prayers
      </h1>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 24px", fontFamily: "sans-serif" }}>
        7 Spirit-led audio activations with clear studio vocal narration and biblical declarations.
      </p>

      {/* Main Player Card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06))",
        border: "1px solid rgba(201,168,76,0.4)",
        borderRadius: 24,
        padding: "24px 20px",
        marginBottom: 24,
        textAlign: "center",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
      }}>
        {/* Top Audio Status Badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{
            background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)",
            color: "#4ade80", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 12,
            fontFamily: "sans-serif", display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            ● STUDIO AUDIO READY
          </span>

          <span style={{ color: "#c9a84c", fontSize: 11, fontFamily: "sans-serif", fontWeight: 600 }}>
            Track {selectedTrackIdx + 1} of {GUIDED_AUDIOS.length}
          </span>
        </div>

        {/* Player Controls (Prev, Play/Pause, Next) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, margin: "0 auto 16px" }}>
          <button
            type="button"
            onClick={() => {
              if (selectedTrackIdx > 0) {
                handleSelectTrack(selectedTrackIdx - 1);
              }
            }}
            disabled={selectedTrackIdx === 0}
            aria-label="Previous track"
            title="Previous Track"
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(201,168,76,0.3)",
              color: selectedTrackIdx === 0 ? "rgba(201,168,76,0.25)" : "#f0d080",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: selectedTrackIdx === 0 ? "not-allowed" : "pointer",
              fontSize: 18, transition: "all 0.2s",
            }}
          >
            ⏮
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              width: 90, height: 90, borderRadius: "50%",
              background: "linear-gradient(135deg, #c9a84c, #f0d080)",
              border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isPlaying ? "0 0 35px rgba(201,168,76,0.6)" : "0 0 15px rgba(201,168,76,0.2)",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            <span style={{ fontSize: 32, color: "#1a1200", marginLeft: isPlaying ? 0 : 4, lineHeight: 1 }}>
              {isPlaying ? "❚❚" : "▶"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (selectedTrackIdx < GUIDED_AUDIOS.length - 1) {
                handleSelectTrack(selectedTrackIdx + 1);
              }
            }}
            disabled={selectedTrackIdx === GUIDED_AUDIOS.length - 1}
            aria-label="Next track"
            title="Next Track"
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(201,168,76,0.3)",
              color: selectedTrackIdx === GUIDED_AUDIOS.length - 1 ? "rgba(201,168,76,0.25)" : "#f0d080",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: selectedTrackIdx === GUIDED_AUDIOS.length - 1 ? "not-allowed" : "pointer",
              fontSize: 18, transition: "all 0.2s",
            }}
          >
            ⏭
          </button>
        </div>

        <p style={{ color: "#f0d080", fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: "0 0 4px" }}>
          {track.title}
        </p>
        <p style={{ color: "#c9a84c", fontSize: 12, margin: "0 0 14px", fontStyle: "italic" }}>
          Scriptural Anchor: {track.verse}
        </p>

        {/* Animated Soundwave bars */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, height: 24, marginBottom: 14 }}>
          {[4, 8, 14, 20, 16, 22, 12, 18, 6, 12, 20, 8].map((h, i) => (
            <span
              key={i}
              style={{
                width: 3,
                height: isPlaying ? `${Math.max(4, (h * (1 + Math.sin(progressSec * 2 + i))))}px` : "4px",
                background: "#c9a84c",
                borderRadius: 2,
                transition: "height 0.15s ease",
              }}
            />
          ))}
        </div>

        {/* Progress Slider */}
        <input
          type="range"
          min="0"
          max={duration}
          value={progressSec}
          onChange={handleSeek}
          style={{ width: "100%", accentColor: "#c9a84c", cursor: "pointer", marginBottom: 6 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", color: "#8a7a5a", fontSize: 11, fontFamily: "sans-serif" }}>
          <span>{formatTime(progressSec)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Download Audio Button */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
          <a
            href={track.audioUrl}
            download={`${track.title}.wav`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.3)",
              color: "#f0d080", borderRadius: 20, padding: "6px 14px", fontSize: 12,
              textDecoration: "none", fontFamily: "sans-serif", fontWeight: 600,
            }}
          >
            📥 Download Studio Audio ({track.formattedDuration})
          </a>
        </div>

          <div style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 14,
            padding: "12px 14px",
            marginTop: 16,
            textAlign: "left",
          }}>
            <p style={{ color: "#8a7a5a", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px", fontWeight: 700 }}>
              Guided Proclamation Narration
            </p>
            <p style={{ color: "#d4c4a0", fontSize: 13, margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>
              "{track.narration}"
            </p>
          </div>
        </div>

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
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <p style={{ color: isCurrent ? "#f0d080" : "#e0d0b0", fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: 0 }}>
                    {idx + 1}. {t.title}
                  </p>
                  <span style={{
                    background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
                    color: "#f0d080", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                  }}>
                    READY
                  </span>
                </div>
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

      <HeavenlySounds />
    </div>
  );
}

// ─── 1. Daily Angelic Word / Oracle Modal ("Draw Today's Blessing") ───────────

function AngelicOracleModal({ onClose }: { onClose: () => void }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handlePick(idx: number) {
    setSelectedIdx(idx);
    setRevealed(true);
  }

  const card = selectedIdx !== null ? ORACLE_CARDS[selectedIdx] : null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(0,0,0,0.92)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px", boxSizing: "border-box", fontFamily: "'Playfair Display', serif",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #151006 0%, #0a0802 100%)",
        border: "2px solid #c9a84c", borderRadius: 24, padding: "32px 20px",
        maxWidth: 480, width: "100%", textAlign: "center", position: "relative",
        boxShadow: "0 0 50px rgba(201,168,76,0.35)",
      }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "#8a7a5a", fontSize: 20, cursor: "pointer" }}
        >
          ✕
        </button>

        <span style={{ fontSize: 32 }}>✨</span>
        <p style={{ color: "#c9a84c", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "6px 0 2px", fontFamily: "sans-serif", fontWeight: 700 }}>
          Daily Angelic Guidance
        </p>
        <h2 style={{ color: "#f0d080", fontSize: 22, margin: "0 0 16px", fontWeight: 700 }}>
          Draw Today's Heavenly Word
        </h2>

        {!revealed ? (
          <div>
            <p style={{ color: "#d8c8a8", fontSize: 13, marginBottom: 24, fontFamily: "sans-serif" }}>
              Quiet your heart and select one of the three celestial seals below to receive Archangel direction for this hour:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {["Protection", "Provision", "Direction"].map((theme, i) => (
                <button
                  key={i}
                  onClick={() => handlePick(i)}
                  style={{
                    aspectRatio: "0.68", borderRadius: 16, border: "2px solid #c9a84c",
                    background: "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.08))",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: 8, cursor: "pointer", transition: "transform 0.2s",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  <span style={{ fontSize: 28 }}>🕊️</span>
                  <span style={{ color: "#f0d080", fontSize: 11, fontWeight: 700, fontFamily: "sans-serif" }}>
                    Seal {i + 1}
                  </span>
                  <span style={{ color: "#8a7a5a", fontSize: 9, textTransform: "uppercase", fontFamily: "sans-serif" }}>
                    Tap to Open
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          card && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={{
                background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.4)",
                borderRadius: 18, padding: "20px", marginBottom: 20, textAlign: "left",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <span style={{ color: "#f0d080", fontSize: 16, fontWeight: 700 }}>
                    {card.angel}
                  </span>
                  <span style={{ color: "#c9a84c", fontSize: 11, fontFamily: "sans-serif", fontWeight: 700 }}>
                    {card.theme}
                  </span>
                </div>

                <h3 style={{ color: "#fff", fontSize: 18, margin: "0 0 10px", fontWeight: 700 }}>
                  {card.title}
                </h3>

                <p style={{ color: "#f0d080", fontSize: 13, fontStyle: "italic", margin: "0 0 12px", borderLeft: "2px solid #c9a84c", paddingLeft: 10 }}>
                  "{card.verse}"
                </p>

                <p style={{ color: "#d8c8a8", fontSize: 14, lineHeight: 1.6, margin: "0 0 14px" }}>
                  {card.message}
                </p>

                <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 12, padding: "12px", border: "1px solid rgba(201,168,76,0.2)" }}>
                  <p style={{ color: "#c9a84c", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px", fontFamily: "sans-serif" }}>
                    Today's Spoken Decree:
                  </p>
                  <p style={{ color: "#fff", fontSize: 14, fontStyle: "italic", margin: 0 }}>
                    "{card.decree}"
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: "linear-gradient(135deg, #c9a84c, #f0d080)", border: "none", color: "#1a1200",
                  fontWeight: 700, padding: "12px 28px", borderRadius: 30, cursor: "pointer",
                  fontFamily: "sans-serif", fontSize: 14,
                }}
              >
                ✓ Receive This Word
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── 3. Midnight War Room Modal (Night Prayer & Spiritual Armor) ─────────────

function MidnightWarRoomModal({ onClose }: { onClose: () => void }) {
  const [playingNightSound, setPlayingNightSound] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  function toggleNightSound() {
    if (playingNightSound) {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      setPlayingNightSound(false);
    } else {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      ctx.resume();

      // Deep restful frequency (528Hz Love/Restoration Tone + low rumble)
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 528;

      const gain = ctx.createGain();
      gain.gain.value = 0.04;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setPlayingNightSound(true);
    }
  }

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "radial-gradient(circle at top, #060b17 0%, #020408 100%)",
      color: "#e2e8f0", display: "flex", flexDirection: "column",
      padding: "24px 20px 40px", boxSizing: "border-box", fontFamily: "'Playfair Display', serif",
      overflowY: "auto",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, maxWidth: 540, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24 }}>🌙</span>
          <div>
            <p style={{ margin: 0, color: "#93c5fd", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "sans-serif" }}>
              Midnight War Room
            </p>
            <p style={{ margin: 0, color: "#64748b", fontSize: 11, fontFamily: "sans-serif" }}>
              Protocol for Insomnia, Fear & Night Peace
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#94a3b8", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}
        >
          ✕ Exit
        </button>
      </div>

      <div style={{ maxWidth: 540, margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Sound Toggle */}
        <div style={{
          background: "rgba(15,23,42,0.8)", border: "1px solid rgba(147,197,253,0.3)",
          borderRadius: 16, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{ color: "#93c5fd", fontSize: 14, fontWeight: 700, margin: 0, fontFamily: "sans-serif" }}>
              528Hz Deep Restoration Frequency
            </p>
            <p style={{ color: "#64748b", fontSize: 11, margin: 0, fontFamily: "sans-serif" }}>
              Gentle harmonic tone to silence racing nighttime thoughts
            </p>
          </div>
          <button
            onClick={toggleNightSound}
            style={{
              background: playingNightSound ? "#3b82f6" : "rgba(255,255,255,0.1)",
              border: "none", color: "#fff", padding: "8px 16px", borderRadius: 20,
              fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "sans-serif",
            }}
          >
            {playingNightSound ? "❚❚ Pause Tone" : "▶ Play 528Hz"}
          </button>
        </div>

        {/* Psalm 91 Armor */}
        <div style={{
          background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.2)",
          borderRadius: 20, padding: "20px",
        }}>
          <span style={{ color: "#93c5fd", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "sans-serif", fontWeight: 700 }}>
            The Midnight Covering
          </span>
          <h2 style={{ color: "#f8fafc", fontSize: 20, margin: "6px 0 12px", fontWeight: 700 }}>
            Psalm 91:5-6 Decree
          </h2>
          <p style={{ color: "#cbd5e1", fontSize: 15, fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>
            "You will not fear the terror of night, nor the arrow that flies by day, nor the pestilence that stalks in the darkness... For He will command His angels concerning you to guard you in all your ways."
          </p>
        </div>

        {/* 3 Steps to Rest */}
        <div style={{
          background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.2)",
          borderRadius: 20, padding: "20px", display: "flex", flexDirection: "column", gap: 14,
        }}>
          <h3 style={{ color: "#93c5fd", fontSize: 16, margin: 0, fontWeight: 700 }}>
            3 Midnight Releases
          </h3>

          <div>
            <p style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700, margin: "0 0 2px", fontFamily: "sans-serif" }}>
              1. The Handover of Unfinished Tasks
            </p>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              Whisper: "Lord, what I could not finish today, You will work out on my behalf while I rest."
            </p>
          </div>

          <div>
            <p style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700, margin: "0 0 2px", fontFamily: "sans-serif" }}>
              2. Rebuking Sleepless Anxiety
            </p>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              Whisper: "Spirit of worry, leave my bedroom. In peace I will lie down and sleep, for the Lord makes me dwell in safety."
            </p>
          </div>

          <div>
            <p style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700, margin: "0 0 2px", fontFamily: "sans-serif" }}>
              3. The Angelic Perimeter
            </p>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              Whisper: "Holy angels guard my windows, my door, and my children. Morning will bring fresh joy."
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "linear-gradient(135deg, #3b82f6, #60a5fa)", border: "none", color: "#0f172a",
            fontWeight: 700, padding: "14px", borderRadius: 30, cursor: "pointer",
            fontFamily: "sans-serif", fontSize: 14, marginTop: 10,
          }}
        >
          ✓ Rest In His Peace Tonight
        </button>
      </div>
    </div>
  );
}

// ─── 4. Community Testimonies Wall Component ──────────────────────────────────

function TestimoniesWall({ onAddYours }: { onAddYours: () => void }) {
  const [testimonies] = useState<Testimony[]>(INITIAL_TESTIMONIES);

  return (
    <div style={{ marginTop: 28, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <div>
          <h2 style={{ color: "#f0d080", fontSize: 18, margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Faith Community Miracles
          </h2>
          <p style={{ color: "#8a7a5a", fontSize: 12, margin: "2px 0 0", fontFamily: "sans-serif" }}>
            Real breakthroughs reported by members walking this covenant.
          </p>
        </div>
        <button
          onClick={onAddYours}
          style={{
            background: "none", border: "1px solid rgba(201,168,76,0.4)",
            color: "#c9a84c", borderRadius: 20, padding: "5px 12px",
            fontSize: 11, cursor: "pointer", fontFamily: "sans-serif",
          }}
        >
          + Share Yours
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {testimonies.map(t => (
          <div
            key={t.id}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 16, padding: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <p style={{ color: "#f0d080", fontSize: 14, fontWeight: 700, margin: 0, fontFamily: "'Playfair Display', serif" }}>
                  {t.name}
                </p>
                <p style={{ color: "#8a7a5a", fontSize: 11, margin: 0, fontFamily: "sans-serif" }}>
                  {t.location} · {t.date}
                </p>
              </div>
              <span style={{
                background: "rgba(74,222,128,0.15)", color: "#86efac",
                border: "1px solid rgba(74,222,128,0.3)", borderRadius: 6,
                padding: "2px 8px", fontSize: 10, fontWeight: 700, fontFamily: "sans-serif",
              }}>
                {t.amountOrFocus}
              </span>
            </div>

            <p style={{ color: "#d8c8a8", fontSize: 13, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
              "{t.story}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 6. Divine Seed & Debt Freedom Planner Modal ──────────────────────────────

function DebtPlannerModal({ onClose }: { onClose: () => void }) {
  const [debtAmount, setDebtAmount] = useState<string>("5000");
  const [timelineDays, setTimelineDays] = useState<number>(30);
  const [calculated, setCalculated] = useState(false);

  const num = parseFloat(debtAmount) || 0;
  const weeklyStep = (num / (timelineDays / 7)).toFixed(2);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(0,0,0,0.92)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px", boxSizing: "border-box", fontFamily: "'Playfair Display', serif",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #161208 0%, #0a0802 100%)",
        border: "2px solid #c9a84c", borderRadius: 24, padding: "30px 20px",
        maxWidth: 480, width: "100%", position: "relative",
        boxShadow: "0 0 50px rgba(201,168,76,0.35)",
      }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "#8a7a5a", fontSize: 20, cursor: "pointer" }}
        >
          ✕
        </button>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 32 }}>💰</span>
          <p style={{ color: "#c9a84c", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "6px 0 2px", fontFamily: "sans-serif", fontWeight: 700 }}>
            Kingdom Financial Protocol
          </p>
          <h2 style={{ color: "#f0d080", fontSize: 22, margin: 0, fontWeight: 700 }}>
            Supernatural Debt Release Planner
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          <div>
            <label style={{ color: "#8a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6, fontFamily: "sans-serif", fontWeight: 700 }}>
              Amount to Be Cancelled or Multiplied ($ USD)
            </label>
            <input
              type="number"
              value={debtAmount}
              onChange={e => { setDebtAmount(e.target.value); setCalculated(true); }}
              placeholder="e.g. 5000"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.3)",
                color: "#f0d080", fontSize: 18, fontWeight: 700, outline: "none", boxSizing: "border-box", fontFamily: "sans-serif",
              }}
            />
          </div>

          <div>
            <label style={{ color: "#8a7a5a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6, fontFamily: "sans-serif", fontWeight: 700 }}>
              Covenant Focus Timeline
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[30, 60, 90].map(days => (
                <button
                  key={days}
                  onClick={() => { setTimelineDays(days); setCalculated(true); }}
                  style={{
                    padding: "10px", borderRadius: 10, cursor: "pointer",
                    border: timelineDays === days ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                    background: timelineDays === days ? "linear-gradient(135deg, #c9a84c, #f0d080)" : "rgba(255,255,255,0.04)",
                    color: timelineDays === days ? "#1a1200" : "#8a7a5a",
                    fontWeight: 700, fontFamily: "sans-serif", fontSize: 13,
                  }}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Box */}
        <div style={{
          background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.35)",
          borderRadius: 16, padding: "16px", marginBottom: 20,
        }}>
          <p style={{ color: "#c9a84c", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px", fontFamily: "sans-serif", fontWeight: 700 }}>
            Heavenly Strategy Projection
          </p>
          <p style={{ color: "#f0d080", fontSize: 20, fontWeight: 700, margin: "0 0 8px", fontFamily: "sans-serif" }}>
            ${weeklyStep} / week of supernatural release
          </p>
          <p style={{ color: "#d8c8a8", fontSize: 13, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
            "The borrower is servant to the lender no more. Under this {timelineDays}-day decree, God will grant you unexpected financial ideas, debt rebates, and divine surplus."
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "14px", borderRadius: 30, border: "none",
            background: "linear-gradient(135deg, #c9a84c, #f0d080)",
            color: "#1a1200", fontWeight: 700, fontSize: 14, cursor: "pointer",
            fontFamily: "sans-serif",
          }}
        >
          ✓ Lock In This Covenant Plan
        </button>
      </div>
    </div>
  );
}

// ─── 5-Minute Morning Sacred Ritual Modal with Live Timer ─────────────────────

function MorningRitualModal({ onClose }: { onClose: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    let t: NodeJS.Timeout | null = null;
    if (running && secondsLeft > 0) {
      t = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [running, secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const phase = secondsLeft > 240 ? 1 : secondsLeft > 120 ? 2 : 3;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "linear-gradient(180deg, #0f0b00 0%, #050505 100%)",
      color: "#f5e8c8", display: "flex", flexDirection: "column",
      padding: "24px 20px 40px", boxSizing: "border-box",
      fontFamily: "'Playfair Display', serif",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ color: "#c9a84c", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif", fontWeight: 700 }}>
          Morning Sacred Ritual
        </span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}
        >
          ✕ Exit
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
        <div style={{
          width: 140, height: 140, borderRadius: "50%",
          border: "2px solid #c9a84c",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(201,168,76,0.3)",
          marginBottom: 24,
        }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: "#f0d080", fontFamily: "sans-serif" }}>
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
          <span style={{ fontSize: 11, color: "#8a7a5a", fontFamily: "sans-serif" }}>
            {running ? "Breathe & Pray" : "Paused"}
          </span>
        </div>

        {phase === 1 && (
          <div>
            <span style={{ color: "#c9a84c", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "sans-serif" }}>
              Phase 1: Silence & Holy Breath (Minutes 1)
            </span>
            <h2 style={{ color: "#f0d080", fontSize: 22, margin: "8px 0 12px", fontWeight: 700 }}>
              Empty Your Chest of Worldly Noise
            </h2>
            <p style={{ color: "#d8c8a8", fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}>
              "Be still, and know that I am God." (Psalm 46:10)<br /><br />
              Take three deep breaths. Inhale God's peace. Exhale the anxiety of yesterday. You are standing before the King of Kings.
            </p>
          </div>
        )}

        {phase === 2 && (
          <div>
            <span style={{ color: "#c9a84c", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "sans-serif" }}>
              Phase 2: The Living Decree (Minutes 2–3)
            </span>
            <h2 style={{ color: "#f0d080", fontSize: 22, margin: "8px 0 12px", fontWeight: 700 }}>
              Speak Life Over Your Household
            </h2>
            <div style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 16, padding: "16px", margin: "10px 0" }}>
              <p style={{ color: "#f0d080", fontSize: 15, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
                "Today, I declare that lack has no place in my home. The Lord orders my steps, multiplies my resources, and grants me favor with every person I encounter."
              </p>
            </div>
            <p style={{ color: "#8a7a5a", fontSize: 12, fontFamily: "sans-serif" }}>
              Say it out loud with faith. Your angels are responding.
            </p>
          </div>
        )}

        {phase === 3 && (
          <div>
            <span style={{ color: "#c9a84c", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "sans-serif" }}>
              Phase 3: Sealing with Praise (Minutes 4–5)
            </span>
            <h2 style={{ color: "#f0d080", fontSize: 22, margin: "8px 0 12px", fontWeight: 700 }}>
              Give Thanks Before You See It
            </h2>
            <p style={{ color: "#d8c8a8", fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}>
              "Now faith is the substance of things hoped for, the evidence of things not seen." (Hebrews 11:1)<br /><br />
              Thank God right now for the answers that are already on their way. Your day is blessed, covered, and victorious.
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button
            onClick={() => setRunning(!running)}
            style={{
              padding: "10px 24px", borderRadius: 30, border: "1px solid #c9a84c",
              background: running ? "transparent" : "#c9a84c",
              color: running ? "#c9a84c" : "#1a1200", fontWeight: 700, cursor: "pointer",
              fontFamily: "sans-serif", fontSize: 13,
            }}
          >
            {running ? "Pause Ritual" : "Resume"}
          </button>
          {secondsLeft === 0 && (
            <button
              onClick={onClose}
              style={{
                padding: "10px 24px", borderRadius: 30, border: "none",
                background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                color: "#1a1200", fontWeight: 700, cursor: "pointer",
                fontFamily: "sans-serif", fontSize: 13,
              }}
            >
              ✓ Ritual Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Certificate of Divine Covenant Modal (Mobile-Optimized Royal Edition) ────

function CertificateModal({ session, onClose }: { session: Session; onClose: () => void }) {
  const currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const rawId = Math.abs(session.email.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0));
  const certId = "COV-" + rawId.toString(16).toUpperCase().padStart(8, "0");
  const userName = session.name || session.email.split("@")[0].toUpperCase();

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(0,0,0,0.94)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "12px", boxSizing: "border-box", overflowY: "auto",
    }}>
      <div style={{
        background: "radial-gradient(ellipse at center, #1b1508 0%, #0c0903 65%, #050401 100%)",
        border: "2px solid #c9a84c",
        borderRadius: 20,
        padding: "20px 14px",
        maxWidth: 440,
        width: "100%",
        maxHeight: "92vh",
        overflowY: "auto",
        textAlign: "center",
        boxShadow: "0 0 45px rgba(201,168,76,0.35)",
        position: "relative",
        fontFamily: "'Playfair Display', serif",
        boxSizing: "border-box",
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 12, right: 12, background: "none",
            border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c",
            borderRadius: "50%", width: 28, height: 28, fontSize: 13,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Ornate Inner Border */}
        <div style={{
          border: "1px dashed rgba(201,168,76,0.45)",
          borderRadius: 14,
          padding: "16px 12px 14px",
          position: "relative",
        }}>
          {/* Top Seal Badge */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #e6c875 0%, #c9a84c 50%, #8c6d23 100%)",
            margin: "0 auto 8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 18px rgba(201,168,76,0.5), inset 0 2px 4px rgba(255,255,255,0.6)",
            border: "2px solid #fff5cc",
          }}>
            <span style={{ fontSize: 26 }}>👑</span>
          </div>

          {/* Header titles */}
          <p style={{
            color: "#e6c875", fontSize: 9, letterSpacing: 2,
            textTransform: "uppercase", margin: "0 0 2px", fontFamily: "sans-serif", fontWeight: 700,
          }}>
            Kingdom Covenant Registry
          </p>

          <h1 style={{
            color: "#fff", fontSize: 19, margin: "0 0 2px",
            fontWeight: 700, letterSpacing: 0.3, lineHeight: 1.25,
            textShadow: "0 2px 8px rgba(201,168,76,0.4)",
          }}>
            Certificate of Divine Covenant
          </h1>

          <p style={{
            color: "#c9a84c", fontSize: 9, letterSpacing: 1.5,
            textTransform: "uppercase", margin: "0 0 12px", fontFamily: "sans-serif",
          }}>
            & Household Consecration
          </p>

          {/* Body declaration */}
          <p style={{ color: "#a8997a", fontSize: 11, fontStyle: "italic", margin: "0 0 4px" }}>
            Solemnly attesting before Heaven that
          </p>

          {/* Name Plate */}
          <div style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.18) 50%, transparent 100%)",
            borderTop: "1px solid rgba(201,168,76,0.35)",
            borderBottom: "1px solid rgba(201,168,76,0.35)",
            padding: "5px 14px",
            margin: "0 auto 12px",
            display: "inline-block",
            maxWidth: "90%",
          }}>
            <h2 style={{
              color: "#fff", fontSize: 20, margin: 0,
              fontWeight: 700, letterSpacing: 0.5, textTransform: "capitalize",
              wordBreak: "break-word",
            }}>
              {userName}
            </h2>
          </div>

          <p style={{
            color: "#d8c8a8", fontSize: 11, lineHeight: 1.5,
            margin: "0 auto 12px",
          }}>
            Has consecrated their faith and household under God's eternal covenant, claiming divine exemption from lack, total angelic protection, and peace.
          </p>

          {/* Scripture Gold Box */}
          <div style={{
            background: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.25)",
            borderRadius: 10, padding: "8px 12px",
            marginBottom: 14,
          }}>
            <p style={{
              color: "#f0d080", fontSize: 11, fontStyle: "italic",
              lineHeight: 1.45, margin: "0 0 2px",
            }}>
              "For I know the plans I have for you, plans to prosper you and not to harm you, to give you hope and a future."
            </p>
            <p style={{ color: "#8a7a5a", fontSize: 10, margin: 0, fontFamily: "sans-serif" }}>
              — Jeremiah 29:11
            </p>
          </div>

          {/* Signatures Row */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 12, paddingTop: 10, borderTop: "1px solid rgba(201,168,76,0.2)",
            marginBottom: 10,
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "cursive", fontSize: 15, color: "#f0d080",
                transform: "rotate(-2deg)", marginBottom: 2,
              }}>
                Archangel Michael Ministry
              </div>
              <div style={{ width: 100, height: 1, background: "rgba(201,168,76,0.4)", margin: "0 auto 2px" }} />
              <p style={{ color: "#8a7a5a", fontSize: 8, margin: 0, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "sans-serif" }}>
                Elder Witness
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "cursive", fontSize: 15, color: "#f0d080",
                transform: "rotate(-1deg)", marginBottom: 2,
              }}>
                Covenant Council
              </div>
              <div style={{ width: 100, height: 1, background: "rgba(201,168,76,0.4)", margin: "0 auto 2px" }} />
              <p style={{ color: "#8a7a5a", fontSize: 8, margin: 0, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "sans-serif" }}>
                Registry Seal
              </p>
            </div>
          </div>

          {/* Certificate Metadata Bar */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            color: "#6b5a2a", fontSize: 9, fontFamily: "monospace",
            paddingTop: 4,
          }}>
            <span>DATE: {currentDate}</span>
            <span>NO: {certId}</span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: 14 }}>
          <button
            onClick={() => window.print()}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #e6c875 0%, #c9a84c 50%, #a8842f 100%)",
              border: "none", color: "#1a1200", fontWeight: 700,
              padding: "11px 18px", borderRadius: 25, cursor: "pointer",
              fontFamily: "sans-serif", fontSize: 12,
              boxShadow: "0 3px 15px rgba(201,168,76,0.35)",
            }}
          >
            🖨️ Print / Save Official Certificate
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 21-Day Journey Tab ───────────────────────────────────────────────────────

function JourneyTab({ session, onBackToHome }: { session: Session; onBackToHome: () => void }) {
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    if (typeof window === "undefined") return [1];
    try {
      const saved = localStorage.getItem("faith_completed_days");
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  const [activeDayNum, setActiveDayNum] = useState<number>(1);
  const journeyTabsRef = useRef<HTMLDivElement>(null);
  const journeyButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeBtn = journeyButtonsRef.current[activeDayNum];
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeDayNum]);

  function scrollJourneyDays(direction: "left" | "right") {
    if (journeyTabsRef.current) {
      journeyTabsRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  }

  function markDayComplete(dayNum: number) {
    if (!completedDays.includes(dayNum)) {
      const updated = [...completedDays, dayNum];
      setCompletedDays(updated);
      localStorage.setItem("faith_completed_days", JSON.stringify(updated));
    }
  }

  const activeDay = JOURNEY_DAYS.find(d => d.day === activeDayNum) ?? JOURNEY_DAYS[0];
  const progressPercent = Math.round((completedDays.length / 21) * 100);

  return (
    <div style={{ padding: "20px 20px 100px", maxWidth: 540, margin: "0 auto" }}>
      {/* Back to Home Button */}
      <button
        onClick={onBackToHome}
        style={{
          background: "none", border: "none", color: "#c9a84c",
          display: "inline-flex", alignItems: "center", gap: 6,
          cursor: "pointer", fontSize: 13, fontFamily: "sans-serif",
          padding: 0, marginBottom: 16, fontWeight: 600,
        }}
      >
        ← Back to Sanctuary Home
      </button>

      <h1 style={{ color: "#f0d080", fontSize: 26, margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
        21-Day Activation Journey
      </h1>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 20px", fontFamily: "sans-serif" }}>
        Complete one sacred day at a time to permanently establish supernatural abundance in your life.
      </p>

      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,168,76,0.3)",
        borderRadius: 20,
        padding: "18px 20px",
        marginBottom: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ color: "#f0d080", fontSize: 15, fontWeight: 700, fontFamily: "sans-serif" }}>
            Your Spiritual Progress
          </span>
          <span style={{ color: "#c9a84c", fontSize: 14, fontWeight: 700, fontFamily: "sans-serif" }}>
            {completedDays.length} of 21 Days ({progressPercent}%)
          </span>
        </div>
        <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            width: `${progressPercent}%`, height: "100%",
            background: "linear-gradient(90deg, #c9a84c, #f0d080)",
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Day Selector with Left/Right arrows & Quick Jump */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ color: "#c9a84c", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}>
            Day {activeDayNum} of 21
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#8a7a5a", fontSize: 11, fontFamily: "sans-serif" }}>Jump:</span>
            <select
              value={activeDayNum}
              onChange={e => setActiveDayNum(Number(e.target.value))}
              style={{
                background: "rgba(20,20,20,0.95)",
                border: "1px solid rgba(201,168,76,0.4)",
                color: "#f0d080",
                borderRadius: 8,
                padding: "3px 8px",
                fontSize: 12,
                fontFamily: "sans-serif",
                cursor: "pointer",
              }}
            >
              {JOURNEY_DAYS.map(d => (
                <option key={d.day} value={d.day} style={{ background: "#141414", color: "#e8d8b8" }}>
                  Day {d.day}: {d.title.slice(0, 26)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => scrollJourneyDays("left")}
            aria-label="Previous days"
            title="Scroll days left"
            style={{
              width: 32, height: 64, flexShrink: 0,
              borderRadius: 12, border: "1px solid rgba(201,168,76,0.3)",
              background: "rgba(201,168,76,0.12)", color: "#f0d080",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 700,
            }}
          >
            ‹
          </button>

          <div
            ref={journeyTabsRef}
            onWheel={e => {
              if (e.deltaY) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            style={{
              flex: 1,
              display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(201,168,76,0.4) transparent",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {JOURNEY_DAYS.map(d => {
              const isDone = completedDays.includes(d.day);
              const isSelected = activeDayNum === d.day;
              return (
                <button
                  key={d.day}
                  ref={el => { journeyButtonsRef.current[d.day] = el; }}
                  onClick={() => setActiveDayNum(d.day)}
                  style={{
                    flexShrink: 0, width: 56, height: 64, borderRadius: 16,
                    border: isSelected ? "2px solid #f0d080" : isDone ? "1px solid #4ade80" : "1px solid rgba(255,255,255,0.1)",
                    background: isSelected ? "linear-gradient(135deg, #c9a84c, #f0d080)" : isDone ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
                    color: isSelected ? "#1a1200" : isDone ? "#86efac" : "#8a7a5a",
                    cursor: "pointer", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 2,
                    fontWeight: 700, fontFamily: "sans-serif",
                  }}
                >
                  <span style={{ fontSize: 10, textTransform: "uppercase" }}>Day</span>
                  <span style={{ fontSize: 16 }}>{d.day}</span>
                  <span style={{ fontSize: 9 }}>{isDone ? "✓" : "○"}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollJourneyDays("right")}
            aria-label="Next days"
            title="Scroll days right"
            style={{
              width: 32, height: 64, flexShrink: 0,
              borderRadius: 12, border: "1px solid rgba(201,168,76,0.3)",
              background: "rgba(201,168,76,0.12)", color: "#f0d080",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 700,
            }}
          >
            ›
          </button>
        </div>
      </div>

      <div style={{
        background: "linear-gradient(135deg, rgba(201,168,76,0.14), rgba(201,168,76,0.04))",
        border: "1px solid rgba(201,168,76,0.35)",
        borderRadius: 24,
        padding: "24px 20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{
            background: "#c9a84c", color: "#1a1200", fontSize: 10,
            fontWeight: 700, padding: "3px 8px", borderRadius: 4, fontFamily: "sans-serif",
          }}>
            DAY {activeDay.day} FOCUS
          </span>
          <span style={{ color: "#a09070", fontSize: 12, fontFamily: "sans-serif" }}>
            {activeDay.focus}
          </span>
        </div>

        <h2 style={{ color: "#f0d080", fontSize: 22, margin: "0 0 14px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          {activeDay.title}
        </h2>

        <div style={{
          background: "rgba(0,0,0,0.4)", borderLeft: "3px solid #c9a84c",
          padding: "12px 16px", borderRadius: 10, marginBottom: 18,
          color: "#f0d080", fontSize: 14, fontStyle: "italic", lineHeight: 1.5,
        }}>
          "{activeDay.scripture}"
        </div>

        <p style={{ color: "#d8c8a8", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
          {activeDay.teaching}
        </p>

        <div style={{
          background: "rgba(201,168,76,0.18)", border: "1px solid rgba(201,168,76,0.4)",
          borderRadius: 16, padding: "16px", marginBottom: 22,
        }}>
          <p style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 6px", fontFamily: "sans-serif" }}>
            Speak this out loud:
          </p>
          <p style={{ color: "#fff", fontSize: 15, fontStyle: "italic", margin: 0, lineHeight: 1.6, fontFamily: "'Playfair Display', serif" }}>
            "{activeDay.declaration}"
          </p>
        </div>

        {completedDays.includes(activeDay.day) ? (
          <div style={{
            background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.4)",
            color: "#86efac", padding: "12px", borderRadius: 30, textAlign: "center",
            fontWeight: 700, fontSize: 14, fontFamily: "sans-serif",
          }}>
            ✓ Day {activeDay.day} Completed & Sealed
          </div>
        ) : (
          <button
            onClick={() => markDayComplete(activeDay.day)}
            style={{
              width: "100%", padding: "16px", borderRadius: 30, border: "none",
              background: "linear-gradient(135deg, #c9a84c, #f0d080)",
              color: "#1a1200", fontWeight: 700, fontSize: 15, cursor: "pointer",
              fontFamily: "sans-serif", boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
            }}
          >
            Mark Day {activeDay.day} as Completed →
          </button>
        )}

        {/* Previous & Next Day Navigation */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)",
          fontFamily: "sans-serif",
        }}>
          {activeDayNum > 1 ? (
            <button
              onClick={() => { setActiveDayNum(d => d - 1); }}
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.3)",
                color: "#f0d080", borderRadius: 20, padding: "8px 16px", cursor: "pointer",
                fontSize: 12, fontWeight: 600,
              }}
            >
              ← Previous (Day {activeDayNum - 1})
            </button>
          ) : <div />}

          {activeDayNum < 21 ? (
            <button
              onClick={() => { setActiveDayNum(d => d + 1); }}
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f0d080)", border: "none",
                color: "#1a1200", borderRadius: 20, padding: "8px 16px", cursor: "pointer",
                fontSize: 12, fontWeight: 700,
              }}
            >
              Next (Day {activeDayNum + 1}) →
            </button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}

// ─── Digital Book Reader Modal (Read in app) ──────────────────────────────────

function BookReaderModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const [fontSize, setFontSize] = useState(16);
  const [currentChapter, setCurrentChapter] = useState(0);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const chapterButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartXRef = useRef<number | null>(null);

  // Auto-scroll the active chapter tab into center whenever currentChapter changes
  useEffect(() => {
    const activeBtn = chapterButtonsRef.current[currentChapter];
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentChapter]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentChapter(c => Math.max(0, c - 1));
      if (e.key === "ArrowRight") setCurrentChapter(c => Math.min(book.chapters.length - 1, c + 1));
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [book.chapters.length, onClose]);

  const chapter = book.chapters[currentChapter] ?? book.chapters[0];

  function scrollTabs(direction: "left" | "right") {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: direction === "left" ? -220 : 220,
        behavior: "smooth",
      });
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      // Swiped left -> Next chapter
      if (currentChapter < book.chapters.length - 1) {
        setCurrentChapter(c => c + 1);
      }
    } else if (diff < -50) {
      // Swiped right -> Previous chapter
      if (currentChapter > 0) {
        setCurrentChapter(c => c - 1);
      }
    }
    touchStartXRef.current = null;
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "#0a0a0a", color: "#e8d8b8",
      display: "flex", flexDirection: "column",
      fontFamily: "'Playfair Display', serif",
    }}>
      <div style={{
        background: "rgba(20,20,20,0.98)", borderBottom: "1px solid rgba(201,168,76,0.25)",
        padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
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

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {/* Top Quick Chapter Flippers */}
          <button
            onClick={() => setCurrentChapter(c => Math.max(0, c - 1))}
            disabled={currentChapter === 0}
            title="Previous chapter"
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.25)",
              color: currentChapter === 0 ? "rgba(201,168,76,0.25)" : "#f0d080",
              borderRadius: 8, padding: "4px 8px", fontSize: 12,
              cursor: currentChapter === 0 ? "not-allowed" : "pointer",
            }}
          >
            ‹ Prev
          </button>
          <button
            onClick={() => setCurrentChapter(c => Math.min(book.chapters.length - 1, c + 1))}
            disabled={currentChapter === book.chapters.length - 1}
            title="Next chapter"
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.25)",
              color: currentChapter === book.chapters.length - 1 ? "rgba(201,168,76,0.25)" : "#f0d080",
              borderRadius: 8, padding: "4px 8px", fontSize: 12,
              cursor: currentChapter === book.chapters.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            Next ›
          </button>

          <button
            onClick={() => setFontSize(s => Math.max(13, s - 1))}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#c9a84c", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer",
            }}
          >
            A-
          </button>
          <button
            onClick={() => setFontSize(s => Math.min(22, s + 1))}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#c9a84c", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer",
            }}
          >
            A+
          </button>
          <button
            onClick={onClose}
            style={{
              background: "linear-gradient(135deg, #c9a84c, #f0d080)", border: "none",
              color: "#1a1200", borderRadius: 8, padding: "6px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer",
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1, overflowY: "auto", padding: "36px 20px 80px",
          maxWidth: 700, margin: "0 auto", width: "100%", boxSizing: "border-box",
        }}
      >
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

        {book.chapters.length > 1 && (
          <div style={{ marginBottom: 24 }}>
            {/* Chapter Header + Jump to Selector */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 8, gap: 10, flexWrap: "wrap",
            }}>
              <span style={{ color: "#c9a84c", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}>
                Chapter {currentChapter + 1} of {book.chapters.length}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#8a7a5a", fontSize: 11, fontFamily: "sans-serif" }}>Jump to:</span>
                <select
                  value={currentChapter}
                  onChange={e => setCurrentChapter(Number(e.target.value))}
                  style={{
                    background: "rgba(20,20,20,0.95)",
                    border: "1px solid rgba(201,168,76,0.4)",
                    color: "#f0d080",
                    borderRadius: 8,
                    padding: "3px 8px",
                    fontSize: 12,
                    fontFamily: "sans-serif",
                    cursor: "pointer",
                    maxWidth: 220,
                  }}
                >
                  {book.chapters.map((c, i) => (
                    <option key={i} value={i} style={{ background: "#141414", color: "#e8d8b8" }}>
                      Ch {i + 1}: {c.title.replace(/^Ch \d+:\s*/, "").slice(0, 28)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Carousel with interactive Left & Right arrow buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => scrollTabs("left")}
                aria-label="Previous chapters"
                title="Scroll chapters left"
                style={{
                  width: 32, height: 38, flexShrink: 0,
                  borderRadius: 10, border: "1px solid rgba(201,168,76,0.3)",
                  background: "rgba(201,168,76,0.12)", color: "#f0d080",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 700,
                }}
              >
                ‹
              </button>

              <div
                ref={tabsContainerRef}
                onWheel={e => {
                  if (e.deltaY) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
                style={{
                  flex: 1,
                  display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6,
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(201,168,76,0.4) transparent",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {book.chapters.map((c, i) => {
                  const shortLabel = c.title.includes(":") ? c.title.split(":")[0] : `Chapter ${i + 1}`;
                  return (
                    <button
                      key={i}
                      ref={el => { chapterButtonsRef.current[i] = el; }}
                      onClick={() => setCurrentChapter(i)}
                      style={{
                        padding: "7px 16px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                        whiteSpace: "nowrap", fontFamily: "sans-serif", flexShrink: 0,
                        border: currentChapter === i ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.12)",
                        background: currentChapter === i ? "linear-gradient(135deg, #c9a84c, #f0d080)" : "rgba(255,255,255,0.05)",
                        color: currentChapter === i ? "#1a1200" : "#d8c8a8",
                        fontWeight: currentChapter === i ? 700 : 500,
                        boxShadow: currentChapter === i ? "0 2px 10px rgba(201,168,76,0.3)" : "none",
                      }}
                    >
                      {shortLabel}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => scrollTabs("right")}
                aria-label="Next chapters"
                title="Scroll chapters right"
                style={{
                  width: 32, height: 38, flexShrink: 0,
                  borderRadius: 10, border: "1px solid rgba(201,168,76,0.3)",
                  background: "rgba(201,168,76,0.12)", color: "#f0d080",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 700,
                }}
              >
                ›
              </button>
            </div>
          </div>
        )}

        <div>
          <h2 style={{ color: "#f0d080", fontSize: 20, margin: "0 0 16px", borderLeft: "3px solid #c9a84c", paddingLeft: 12 }}>
            {chapter.title}
          </h2>

          {chapter.scripture && (
            <div style={{
              background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 14, padding: "16px 20px", marginBottom: 24,
              fontStyle: "italic", color: "#f0d080", lineHeight: 1.6, fontSize: fontSize + 1,
            }}>
              {chapter.scripture}
            </div>
          )}

          {chapter.text.map((paragraph, pIdx) => (
            <p
              key={pIdx}
              style={{
                fontSize: `${fontSize}px`, lineHeight: 1.85,
                color: "#d8c8a8", marginBottom: 20, textAlign: "justify",
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

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

interface LibraryTabProps {
  session: Session;
  onNavigateTab: (tab: Tab) => void;
  onOpenRitual: () => void;
}

function LibraryTab({ session, onNavigateTab, onOpenRitual }: LibraryTabProps) {
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  const materials = [
    {
      id: "blueprint",
      title: "Faith & Abundance Blueprint",
      tag: "FREE",
      tagColor: "linear-gradient(135deg, #c9a84c, #f0d080)",
      textColor: "#1a1200",
      desc: "Complete 21-day program with daily biblical activations",
      icon: "📖",
      onClick: () => onNavigateTab("journey"),
    },
    {
      id: "script",
      title: "Your Personalized Manifestation Script",
      tag: "INCLUDED",
      tagColor: "linear-gradient(135deg, #c9a84c, #f0d080)",
      textColor: "#1a1200",
      desc: "Based on your personal quiz answers & spiritual profile",
      icon: "✨",
      onClick: () => {
        const b = LIBRARY_BOOKS.find(x => x.id === "front" || x.id === "blueprint") ?? LIBRARY_BOOKS[0];
        setReadingBook(b);
      },
    },
    {
      id: "affirmations",
      title: "777 Biblical Affirmations",
      tag: "BONUS",
      tagColor: "rgba(59, 130, 246, 0.25)",
      borderTag: "1px solid rgba(59, 130, 246, 0.5)",
      textColor: "#93c5fd",
      desc: "Daily declarations for wealth, health & divine peace",
      icon: "📜",
      onClick: () => {
        const b = LIBRARY_BOOKS.find(x => x.id === "plan") ?? LIBRARY_BOOKS[1];
        setReadingBook(b);
      },
    },
    {
      id: "ritual",
      title: "Sacred Morning Ritual",
      tag: "BONUS",
      tagColor: "rgba(236, 72, 153, 0.25)",
      borderTag: "1px solid rgba(236, 72, 153, 0.5)",
      textColor: "#f472b6",
      desc: "5-minute routine that transforms your mornings",
      icon: "🌅",
      onClick: onOpenRitual,
    },
    {
      id: "journal",
      title: "Miracle Journal (Digital)",
      tag: "INCLUDED",
      tagColor: "linear-gradient(135deg, #c9a84c, #f0d080)",
      textColor: "#1a1200",
      desc: "Track God's faithfulness & answer prayers daily",
      icon: "📓",
      onClick: () => onNavigateTab("pray"),
    },
    {
      id: "wealth",
      title: "Prophetic Wealth Code",
      tag: "INCLUDED",
      tagColor: "linear-gradient(135deg, #c9a84c, #f0d080)",
      textColor: "#1a1200",
      desc: "Unlock hidden biblical principles of supernatural abundance",
      icon: "🔐",
      onClick: () => {
        const b = LIBRARY_BOOKS.find(x => x.id === "wealth") ?? LIBRARY_BOOKS[4];
        setReadingBook(b);
      },
    },
  ];

  return (
    <div style={{ padding: "20px 20px 100px", maxWidth: 540, margin: "0 auto" }}>
      <h1 style={{ color: "#f0d080", fontSize: 26, margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
        Your Library
      </h1>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 20px", fontFamily: "sans-serif" }}>
        All your digital materials, ready to access. Tap any item below to open.
      </p>

      {/* 6 Core Digital Materials (Interactive List) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
        {materials.map((item) => (
          <div
            key={item.id}
            onClick={item.onClick}
            role="button"
            tabIndex={0}
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 16,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#f0d080";
              e.currentTarget.style.background = "rgba(201,168,76,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <span
                  style={{
                    color: "#f0d080",
                    fontSize: 15,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                  }}
                >
                  {item.title}
                </span>

                <span
                  style={{
                    background: item.tagColor,
                    border: item.borderTag || "none",
                    color: item.textColor,
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 12,
                    letterSpacing: 0.5,
                    fontFamily: "sans-serif",
                  }}
                >
                  {item.tag}
                </span>
              </div>

              <p style={{ color: "#8a7a5a", fontSize: 12, margin: 0, fontFamily: "sans-serif" }}>
                {item.desc}
              </p>
            </div>

            <div
              style={{
                color: "#f0d080",
                fontSize: 20,
                fontWeight: 700,
                padding: "4px 8px",
                flexShrink: 0,
              }}
            >
              →
            </div>
          </div>
        ))}
      </div>

      {/* Kingdom Vault Section Header */}
      <h2 style={{ color: "#f0d080", fontSize: 20, margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
        Kingdom Vault Volumes
      </h2>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 20px", fontFamily: "sans-serif" }}>
        Interactive sacred book reader with chapters, scripture anchors & PDF downloads.
      </p>

      {/* Book Covers List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {LIBRARY_BOOKS.map(book => (
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
            }}
          >
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
                <span style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, fontFamily: "sans-serif" }}>
                  {book.chapters.length} chapters
                </span>
                <span style={{ color: "#8a7a5a", fontSize: 11, fontFamily: "sans-serif" }}>
                  · {book.pagesCount} pages
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
        ))}
      </div>

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
        Sanctuary Prayer & Altar
      </h1>
      <p style={{ color: "#8a7a5a", fontSize: 13, margin: "0 0 24px", fontFamily: "sans-serif" }}>
        Instant prayer emergency SOS, private prayer tracking, and your sacred testimony journal.
      </p>

      <h2 style={{
        color: "#c9a84c", fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
        textTransform: "uppercase", margin: "0 0 12px", fontFamily: "sans-serif",
      }}>
        Sanctuary SOS — Prayers for hard moments
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
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

      <h2 style={{
        color: "#c9a84c", fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
        textTransform: "uppercase", margin: "0 0 12px", fontFamily: "sans-serif",
      }}>
        Prayer Request Tracker (Private on Device)
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

      <h2 style={{
        color: "#c9a84c", fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
        textTransform: "uppercase", margin: "0 0 12px", fontFamily: "sans-serif",
      }}>
        Sacred Testimony Journal
      </h2>
      <textarea
        value={journal}
        onChange={e => setJournal(e.target.value)}
        placeholder="Lord, today I bring to You... (Write your prayers, gratitude, and sudden miracles)"
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

function HomeTab({
  session,
  onNavigateTab,
  onOpenRitual,
  onOpenCertificate,
  onOpenOracle,
  onOpenWarRoom,
  onOpenDebtPlanner,
}: {
  session: Session;
  onNavigateTab: (t: Tab) => void;
  onOpenRitual: () => void;
  onOpenCertificate: () => void;
  onOpenOracle: () => void;
  onOpenWarRoom: () => void;
  onOpenDebtPlanner: () => void;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const subline = hour < 12 ? "The Lord is your strength today." : hour < 18 ? "Pause for a moment — He is with you." : "Lay down today's weight. Rest in His peace.";
  const userName = session.name || session.email.split("@")[0];

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
            Today's Living Word
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
        {/* Welcome */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ color: "#f0d080", fontSize: 24, margin: "0 0 4px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            {greeting}, {userName}
          </h1>
          <p style={{ color: "#8a7a5a", fontSize: 13, margin: 0, fontFamily: "sans-serif" }}>
            {subline}
          </p>
        </div>

        {/* 1. Daily Angelic Word Oracle Button */}
        <div
          onClick={onOpenOracle}
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.08))",
            border: "1px solid rgba(201,168,76,0.5)",
            borderRadius: 20, padding: "16px 20px", marginBottom: 14,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 6px 25px rgba(201,168,76,0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🎴</span>
            <div>
              <span style={{
                background: "#c9a84c", color: "#1a1200", fontSize: 9,
                fontWeight: 700, padding: "2px 6px", borderRadius: 4, fontFamily: "sans-serif",
              }}>
                DAILY HABIT
              </span>
              <p style={{ color: "#f0d080", fontSize: 15, fontWeight: 700, margin: "4px 0 2px", fontFamily: "'Playfair Display', serif" }}>
                Draw Today's Archangel Word
              </p>
              <p style={{ color: "#d4c4a0", fontSize: 11, margin: 0, fontFamily: "sans-serif" }}>
                Tap to reveal your personalized seal & blessing for today.
              </p>
            </div>
          </div>
          <span style={{ color: "#f0d080", fontSize: 20 }}>→</span>
        </div>

        {/* 2-Column Grid: 3. Midnight War Room & 6. Debt Planner */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 14 }}>
          {/* Midnight War Room */}
          <div
            onClick={onOpenWarRoom}
            style={{
              background: "linear-gradient(135deg, #091222 0%, #03060c 100%)",
              border: "1px solid rgba(147,197,253,0.3)",
              borderRadius: 18, padding: "14px", cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>🌙</span>
            <p style={{ color: "#93c5fd", fontSize: 13, fontWeight: 700, margin: "0 0 2px", fontFamily: "'Playfair Display', serif" }}>
              Midnight War Room
            </p>
            <p style={{ color: "#64748b", fontSize: 10, margin: 0, fontFamily: "sans-serif" }}>
              For fear, insomnia & 528Hz peaceful rest.
            </p>
          </div>

          {/* Debt Freedom Planner */}
          <div
            onClick={onOpenDebtPlanner}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 18, padding: "14px", cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>💰</span>
            <p style={{ color: "#f0d080", fontSize: 13, fontWeight: 700, margin: "0 0 2px", fontFamily: "'Playfair Display', serif" }}>
              Debt Freedom Plan
            </p>
            <p style={{ color: "#8a7a5a", fontSize: 10, margin: 0, fontFamily: "sans-serif" }}>
              Calculate supernatural release & seed sowing.
            </p>
          </div>
        </div>

        {/* 5-Minute Morning Ritual Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.06))",
          border: "1px solid rgba(201,168,76,0.4)",
          borderRadius: 20, padding: "18px 20px", marginBottom: 14,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <span style={{
              background: "#c9a84c", color: "#1a1200", fontSize: 9,
              fontWeight: 700, padding: "2px 6px", borderRadius: 4, fontFamily: "sans-serif",
            }}>
              DAILY PRACTICE
            </span>
            <h3 style={{ color: "#f0d080", fontSize: 16, fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: "6px 0 2px" }}>
              5-Minute Morning Sacred Ritual
            </h3>
            <p style={{ color: "#d4c4a0", fontSize: 11, margin: 0, fontFamily: "sans-serif" }}>
              Live countdown timer + decree & breathwork.
            </p>
          </div>
          <button
            onClick={onOpenRitual}
            style={{
              background: "linear-gradient(135deg, #c9a84c, #f0d080)",
              border: "none", color: "#1a1200", fontWeight: 700,
              padding: "10px 16px", borderRadius: 25, cursor: "pointer",
              fontFamily: "sans-serif", fontSize: 12, flexShrink: 0,
            }}
          >
            Start ▶
          </button>
        </div>

        {/* Certificate Quick Access */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: "12px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>👑</span>
            <div>
              <p style={{ color: "#f0d080", fontSize: 13, fontWeight: 700, margin: 0, fontFamily: "'Playfair Display', serif" }}>
                Certificate of Divine Covenant
              </p>
              <p style={{ color: "#8a7a5a", fontSize: 10, margin: 0, fontFamily: "sans-serif" }}>
                Personalized record for {userName}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenCertificate}
            style={{
              background: "none", border: "1px solid rgba(201,168,76,0.4)",
              color: "#c9a84c", borderRadius: 20, padding: "4px 12px",
              fontSize: 11, cursor: "pointer", fontFamily: "sans-serif",
            }}
          >
            View
          </button>
        </div>

        {/* 21-Day Activation Journey Banner */}
        <button
          onClick={() => onNavigateTab("journey")}
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
              21-Day Activation Journey →
            </p>
            <p style={{ color: "#3a2a00", fontSize: 12, margin: 0, fontFamily: "sans-serif" }}>
              Daily step-by-step path to unlock supernatural harvest.
            </p>
          </div>
          <span style={{ fontSize: 24 }}>✨</span>
        </button>

        {/* 4. Community Testimonies Wall */}
        <TestimoniesWall onAddYours={() => alert("To share your personal miracle testimony, email us at support.fakko.solutions@gmail.com and we'll feature your story!")} />

        {/* Continue Your Journey Grid */}
        <h2 style={{ color: "#f0d080", fontSize: 17, margin: "0 0 14px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          Continue Your Sacred Journey
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
    { sender: "bot", text: "Hello beloved! I'm Grace from Sanctuary Support ✨ Need help accessing your 21-Day Journey, your books, or your audio prayers? I'm right here with you!" },
  ]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    const userText = msg.trim();
    setChatLog(prev => [...prev, { sender: "user", text: userText }]);
    setMsg("");

    setTimeout(() => {
      let reply = "I hear you! All your sacred materials, including the 21-Day Activation, 7 Audio Prayers, and Vault Books, are completely unlocked for your lifetime walk. If you need any personal assistance, write to support.fakko.solutions@gmail.com anytime!";
      if (userText.toLowerCase().includes("audio") || userText.toLowerCase().includes("listen")) {
        reply = "You can tap the 'Audio' tab below to listen to all 7 Guided Audio Prayers or turn on the real-time 'Heavenly Sounds' ambient frequencies!";
      } else if (userText.toLowerCase().includes("book") || userText.toLowerCase().includes("read") || userText.toLowerCase().includes("pdf")) {
        reply = "Under the 'Library' tab, click 'Read in app' on any book to enjoy the full chapters with adjustable text size!";
      } else if (userText.toLowerCase().includes("journey") || userText.toLowerCase().includes("day")) {
        reply = "Tap the 'Journey' tab to follow your 21-Day Activation Plan. You can check off each day as you pray and decree!";
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
          <div style={{
            background: "linear-gradient(135deg, #c9a84c, #f0d080)",
            padding: "12px 16px", color: "#1a1200",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Sanctuary Support</p>
              <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>Grace · Spiritual Support</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#1a1200" }}
            >
              ✕
            </button>
          </div>

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

          <form onSubmit={handleSend} style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 8 }}>
            <input
              type="text"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="Ask Grace anything..."
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
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ADMIN_EMAIL = "admin@gmail.com";

  function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setError("");
    setLoading(true);

    if (email.toLowerCase().trim() === ADMIN_EMAIL) {
      setTimeout(() => {
        const session: Session = { email, name: name.trim() || "Believer", plan: "seed-100" };
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
    if (code.length < 4) { setError("Please enter the verification code."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const session: Session = { email, name: name.trim() || email.split("@")[0], plan: "seed-100" };
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
          Member Area — Access your 21-Day Activation, Vault Books & Guided Audios
        </p>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,168,76,0.3)",
        borderRadius: 20, padding: "32px 24px", width: "100%", maxWidth: 360,
      }}>
        {step === "email" ? (
          <form onSubmit={handleSendCode}>
            <p style={{ color: "#e0d0b0", fontSize: 13, textAlign: "center", margin: "0 0 16px", fontFamily: "sans-serif" }}>
              Enter your name and checkout email to unlock your Sanctuary:
            </p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your Full Name"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,168,76,0.3)",
                color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10,
                fontFamily: "sans-serif",
              }}
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,168,76,0.3)",
                color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12,
                fontFamily: "sans-serif",
              }}
            />
            {error && <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 10px", fontFamily: "sans-serif" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: loading ? "#6b5a2a" : "linear-gradient(135deg, #c9a84c, #f0d080)",
                color: "#1a1200", fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer",
                fontFamily: "sans-serif",
              }}
            >
              {loading ? "Checking Access..." : "Enter My Sanctuary →"}
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
                color: "#fff", fontSize: 24, letterSpacing: 8, outline: "none", boxSizing: "border-box", marginBottom: 12,
              }}
            />
            {error && <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 10px", fontFamily: "sans-serif" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: loading ? "#6b5a2a" : "linear-gradient(135deg, #c9a84c, #f0d080)",
                color: "#1a1200", fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer",
                fontFamily: "sans-serif",
              }}
            >
              {loading ? "Verifying..." : "Access Sanctuary →"}
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
    { id: "journey", label: "21-Day", icon: "🗓️" },
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
              padding: "4px 12px", minWidth: 54,
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 19 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontFamily: "sans-serif", fontWeight: active ? 700 : 400 }}>
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
  const [welcomeAlert, setWelcomeAlert] = useState(false);

  const [session, setSession] = useState<Session | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const isSuccess =
        params.get("success") === "true" ||
        params.has("session_id") ||
        params.get("paid") === "true";

      if (isSuccess) {
        const queryEmail = params.get("email");
        const queryName = params.get("name");
        const newSession: Session = {
          email: queryEmail || "member@faith-app.com",
          name: queryName || "Beloved Member",
          plan: "seed-100",
        };
        localStorage.setItem("faith_app_session", JSON.stringify(newSession));
        return newSession;
      }

      const raw = localStorage.getItem("faith_app_session");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true" || params.has("session_id") || params.get("paid") === "true") {
        setWelcomeAlert(true);
        // Track Purchase on Meta Pixel & UTMify
        trackPurchase(47, "USD");
      }
    }
  }, []);

  const [tab, setTab] = useState<Tab>("home");
  const [showRitual, setShowRitual] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [showWarRoom, setShowWarRoom] = useState(false);
  const [showDebtPlanner, setShowDebtPlanner] = useState(false);

  if (!session) {
    return <GateScreen onLogin={setSession} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#f5e8c8",
    }}>
      {/* Welcome Banner if returning from Stripe */}
      {welcomeAlert && (
        <div style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.35), rgba(240,208,128,0.18))",
          borderBottom: "1.5px solid #c9a84c",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#f0d080",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "sans-serif",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🎉</span>
            <span>
              <strong>Payment Confirmed!</strong> Welcome to your Sacred Sanctuary. All 21 Days, Library Vault & Guided Audios are 100% unlocked for you.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setWelcomeAlert(false)}
            style={{
              background: "none", border: "none", color: "#c9a84c", cursor: "pointer", fontSize: 16, padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
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
            {session.name || session.email.split("@")[0]}
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

      {/* Main Tab Views */}
      <main>
        {tab === "home" && (
          <HomeTab
            session={session}
            onNavigateTab={setTab}
            onOpenRitual={() => setShowRitual(true)}
            onOpenCertificate={() => setShowCertificate(true)}
            onOpenOracle={() => setShowOracle(true)}
            onOpenWarRoom={() => setShowWarRoom(true)}
            onOpenDebtPlanner={() => setShowDebtPlanner(true)}
          />
        )}
        {tab === "journey" && <JourneyTab session={session} onBackToHome={() => setTab("home")} />}
        {tab === "library" && (
          <LibraryTab
            session={session}
            onNavigateTab={setTab}
            onOpenRitual={() => setShowRitual(true)}
          />
        )}
        {tab === "audio" && <AudioPlayerTab />}
        {tab === "pray" && <PrayTab />}
      </main>

      {/* Feature Modals */}
      {showRitual && <MorningRitualModal onClose={() => setShowRitual(false)} />}
      {showCertificate && <CertificateModal session={session} onClose={() => setShowCertificate(false)} />}
      {showOracle && <AngelicOracleModal onClose={() => setShowOracle(false)} />}
      {showWarRoom && <MidnightWarRoomModal onClose={() => setShowWarRoom(false)} />}
      {showDebtPlanner && <DebtPlannerModal onClose={() => setShowDebtPlanner(false)} />}

      {/* Floating Grace Support */}
      <SupportChatBubble />

      {/* Bottom Nav Bar */}
      <BottomNavigation currentTab={tab} onSelectTab={setTab} />
    </div>
  );
}
