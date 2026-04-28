import { useEffect, useId, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  score: string;
  youtubeUrl: string;
  audioSrc?: string;
};

const TRACKS: Track[] = [
  {
    id: "01",
    title: "BJ Lips - Love Potion",
    score: "10/10",
    audioSrc: "/audio/radio/01_bj_lips.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=C51ZecKDYkQ&list=RDIDi6v7GqgsY",
  },
  {
    id: "02",
    title: "Love Potions X Track 10",
    score: "11/10",
    audioSrc: "/audio/radio/02_love_potions_x_track_10.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=YCXYkcpD5tw",
  },
  {
    id: "03",
    title: "Ecstasy (Remix)",
    score: "10/10",
    audioSrc: "/audio/radio/03_ecstasy_remix.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=VeS3O47Jv9s&list=RDIDi6v7GqgsY",
  },
  {
    id: "04",
    title: "Love Potions x I'll Do It",
    score: "7/10",
    audioSrc: "/audio/radio/04_love_potions_x_ill_do_it.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=4YV5Tryq3LU&list=RDIDi6v7GqgsY",
  },
  {
    id: "05",
    title: "Voruyu alkogol (Slowed + Reverb)",
    score: "8/10",
    audioSrc: "/audio/radio/05_voruyu_alkogol_slowed_reverb.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=z5EXOl9UOnM&list=RDIDi6v7GqgsY",
  },
  {
    id: "06",
    title: "ROMANCEPLANET w/ STAKILLAZ",
    score: "10/10",
    audioSrc: "/audio/radio/06_romanceplanet_w_stakillaz.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Kqmzbpa7_6w&list=RDIDi6v7GqgsY",
  },
  {
    id: "07",
    title: "BABYDOLL",
    score: "6/10",
    audioSrc: "/audio/radio/07_babydoll.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=mCkBsSEG440&list=RDIDi6v7GqgsY",
  },
  {
    id: "08",
    title: "MY JEALOUSY (Slowed)",
    score: "10/10",
    audioSrc: "/audio/radio/08_my_jealousy_slowed.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=xnFvhn-1wHY",
  },
  {
    id: "09",
    title: "Love Potions x Tipsy (Slowed)",
    score: "9/10",
    audioSrc: "/audio/radio/09_love_potions_x_tipsy.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=0FbdiUyWYPQ&list=RDIDi6v7GqgsY",
  },
  {
    id: "10",
    title: "Mariah Carey - Obsessed (fvckaron audio)",
    score: "9/10",
    audioSrc: "/audio/radio/11_mariah_carey_obsessed_fvckaron_audio_slowed_reverb.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=4febO0OejZs&list=RDIDi6v7GqgsY",
  },
  {
    id: "11",
    title: "glamorgeddon (Slowed)",
    score: "5/10",
    audioSrc: "/audio/radio/10_glamorgeddon_slowed.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Ekv9FYSqkEI&list=RDIDi6v7GqgsY",
  },
  {
    id: "12",
    title: "Tears/Lipgloss (Remix)",
    score: "6/10",
    audioSrc: "/audio/radio/12_tears_lipgloss_remix.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=jzJKtDUiTYY&list=RDIDi6v7GqgsY",
  },
  {
    id: "13",
    title: "Britney Manson - FASHION (Slowed)",
    score: "7/10",
    audioSrc: "/audio/radio/13_britney_manson_fashion_slowed.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=aDRD4OvNvus&list=RDYCXYkcpD5tw",
  },
  {
    id: "14",
    title: "Shy Smith - Soaked",
    score: "5/10",
    audioSrc: "/audio/radio/14_shy_smith_soaked_slowed_reverb.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=SuNHuNSmMl8&list=RDYCXYkcpD5tw",
  },
  {
    id: "15",
    title: "Love Potions X MY JEALOUSY - bjlips & vivibaby",
    score: "9/10",
    audioSrc: "/audio/radio/15_Love Potions X MY JEALOUSY - bjlips & vivibaby (mashup).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=eKpP58Rris8&list=RDYCXYkcpD5tw",
  },
  {
    id: "16",
    title: "Kazy Lambist - Doing Yoga",
    score: "5/10",
    audioSrc: "/audio/radio/16_Kazy Lambist - Doing Yoga.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=wgg74iuPKqs&list=RDYCXYkcpD5tw",
  },
  {
    id: "17",
    title: "bj lips, princess paparazzi - love potions",
    score: "10/10",
    audioSrc: "/audio/radio/17_Love Potions (6arelyhuman Remix).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=3DnGBRPCnv0",
  },
  {
    id: "18",
    title: "Snow Strippers x Adore x Crystal Castles type beat - 'sleez'",
    score: "6/10",
    audioSrc: "/audio/radio/18_Snow Strippers x Adore x Crystal Castles type beat - 'sleez'.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=mI8SpXlOP1A",
  },
  {
    id: "19",
    title: "Charli xcx - b2b (qyurisuu remix)",
    score: "6/10",
    audioSrc: "/audio/radio/19_Charli xcx - b2b (qyurisuu remix).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=DQ22Uayxc-c",
  },
  {
    id: "20",
    title: "2000 (slowed)",
    score: "7/10",
    audioSrc: "/audio/radio/20_2000 (slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=eifO7vXT_m8",
  },
  {
    id: "21&",
    title: "Schleini - Liebe (Techno)",
    score: "8/10",
    audioSrc: "/audio/radio/21&_Schleini - Liebe (Techno).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=rB3gX_shM8w",
  },
  {
    id: "22",
    title: "TENSA (Ultra Slowed)",
    score: "10/10",
    audioSrc: "/audio/radio/22_TENSA (Ultra Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=ZtIA-BclORA",
  },
  {
    id: "23&",
    title: "Big Boogie - Kush Breath",
    score: "9/10",
    audioSrc: "/audio/radio/23&_Big Boogie - Kush Breath (Official Music Video).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=65NvWGZ5AvU",
  },
  {
    id: "24",
    title: "me pierdo",
    score: "8/10",
    audioSrc: "/audio/radio/24_me pierdo.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=FsYfzpg76So",
  },
  {
    id: "25&",
    title: "Habits (Stay High) x Stereo Love",
    score: "10/10",
    audioSrc: "/audio/radio/25&_Habits (Stay High) x Stereo Love (slowed to perfection).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=oawmdHxyiyY",
  },
  {
    id: "26",
    title: "Saxo Funk (Super Slowed)",
    score: "NR",
    audioSrc: "/audio/radio/26Saxo Funk (Super Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=A_fVkPSzbeQ",
  },
  {
    id: "27",
    title: "Lost Sky - Fearless (Ultra Slowed + Reverb)",
    score: "NR",
    audioSrc: "/audio/radio/27_𝗟𝗼𝘀𝘁 𝗦𝗸𝘆 - 𝗙𝗲𝗮𝗿𝗹𝗲𝘀𝘀 (Ultra Slowed  Reverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=qvgi-E6N8FU",
  },
  {
    id: "28",
    title: "TIKI TIKI",
    score: "NR",
    audioSrc: "/audio/radio/28_TIKI TIKI.m4a",
    youtubeUrl: "https://www.youtube.com/results?search_query=TIKI+TIKI+slowed",
  },
  {
    id: "29",
    title: "THUNDER (Super Slowed)",
    score: "NR",
    audioSrc: "/audio/radio/29_THUNDER (Super Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Oy_aY90u1Cc",
  },
  {
    id: "30",
    title: "Bad Romance // Best Part Only // Slowed + Reverb",
    score: "NR",
    audioSrc: "/audio/radio/30_bad romance  best part only  slowed  reverb.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=FPrMZvdS0VI",
  },
  {
    id: "31",
    title: "Kavkaz (slowed+reverb)",
    score: "NR",
    audioSrc: "/audio/radio/31_Kavkaz (slowedreverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=TWwGr5z7uFc",
  },
  {
    id: "32",
    title: "Versatile (Hardstylish Remix Slowed)",
    score: "NR",
    audioSrc: "/audio/radio/32_Versatile (Hardstylish Remix Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/results?search_query=Versatile+Hardstylish+Remix+Slowed",
  },
  {
    id: "33",
    title: "You got it (jersey club)",
    score: "NR",
    audioSrc: "/audio/radio/33_You got it (jersey club).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=CEDokiMddd0",
  },
  {
    id: "34",
    title: "PortwaveShadow lady Slowed Reverb",
    score: "NR",
    audioSrc: "/audio/radio/34_PortwaveShadow lady Slowed Reverb.m4a",
    youtubeUrl: "https://www.youtube.com/results?search_query=PortwaveShadow+lady+Slowed+Reverb",
  },
  {
    id: "35",
    title: "And I Have Come for You",
    score: "NR",
    audioSrc: "/audio/radio/35_And I Have Come for You.m4a",
    youtubeUrl: "https://www.youtube.com/results?search_query=And+I+Have+Come+for+You",
  },
  {
    id: "36",
    title: "VIDA NOTURNA (Slowed + Reverb)",
    score: "NR",
    audioSrc: "/audio/radio/36_VIDA NOTURNA (Slowed Reverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=VnvL3z0jmaw&list=RDqvgi-E6N8FU",
  },
  {
    id: "37",
    title: "Atmosphere",
    score: "NR",
    audioSrc: "/audio/radio/37_KNSRK - Atmosphere (Slowed  Reverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=6YDCyXi12Sk",
  },
  {
    id: "38",
    title: "Hoes Come Easy",
    score: "NR",
    audioSrc: "/audio/radio/38_Hoes Come Easy (Slowed  Low Honor - The Dark Triad).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=fEj4v7AJkgY",
  },
  {
    id: "39",
    title: "Leanin - Cornell",
    score: "NR",
    audioSrc: "/audio/radio/39_Leanin.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=sB04u3tGbuM",
  },
  {
    id: "40",
    title: "Travis Scott - DUMBO (Instrumental)",
    score: "NR",
    audioSrc: "/audio/radio/40_Travis Scott - DUMBO (Instrumental).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=osJ6p7PmoAg",
  },
  {
    id: "41",
    title: "specialsadism (super slowed)",
    score: "NR",
    audioSrc: "/audio/radio/41_specialsadism (super slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=YbvkuJ3oQCM&list=RDMM0Uo67YlIdcw",
  },
];

const PLAYABLE_TRACKS = TRACKS.filter((track): track is Track & { audioSrc: string } =>
  Boolean(track.audioSrc)
);
const MISSING_TRACKS = TRACKS.filter((track) => !track.audioSrc);
const DJ_STINGERS = [
  "/audio/dj/lady/01.m4a",
  "/audio/dj/lady/02.m4a",
  "/audio/dj/lady/03.m4a",
  "/audio/dj/lady/04.m4a",
  "/audio/dj/lady/05.m4a",
  "/audio/dj/lady/06.m4a",
  "/audio/dj/lady/07.m4a",
  "/audio/dj/lady/08.m4a",
  "/audio/dj/lady/09.m4a",
  "/audio/dj/lady/10.m4a",
] as const;
const DJ_VOICE_CLIPS = [
  "/audio/dj/disko/1.m4a",
  "/audio/dj/disko/2.m4a",
  "/audio/dj/disko/3.m4a",
  "/audio/dj/disko/4.m4a",
  "/audio/dj/disko/5.m4a",
  "/audio/dj/disko/6.m4a",
  "/audio/dj/disko/7.m4a",
  "/audio/dj/disko/8.m4a",
  "/audio/dj/disko/9.m4a",
  "/audio/dj/disko/10.m4a",
  "/audio/dj/disko/11.m4a",
  "/audio/dj/disko/12.m4a",
  "/audio/dj/disko/13.m4a",
  "/audio/dj/disko/14.m4a",
] as const;
const DJ_INTERRUPTION_CLIPS = [
  "/audio/dj/special_interruption/01.m4a",
  "/audio/dj/interruption/1.m4a",
  "/audio/dj/interruption/2.m4a",
  "/audio/dj/interruption/3.m4a",
  "/audio/dj/interruption/4.m4a",
  "/audio/dj/interruption/5.m4a",
  "/audio/dj/interruption/6.m4a",
  "/audio/dj/interruption/7.m4a",
  "/audio/dj/interruption/8.m4a",
  "/audio/dj/interruption/9.m4a",
  "/audio/dj/interruption/10.m4a",
] as const;
const DJ_RANDOM_CLIPS = [
  "/audio/dj/random/1.m4a",
  "/audio/dj/random/2.m4a",
  "/audio/dj/random/3.m4a",
  "/audio/dj/random/4.m4a",
  "/audio/dj/random/5.m4a",
  "/audio/dj/random/6.m4a",
  "/audio/dj/random/7.m4a",
  "/audio/dj/random/8.m4a",
] as const;
const DJ_REWIND_CLIP_PAIRS = [
  ["/audio/dj/rewind/1.mp3.m4a", "/audio/dj/rewind/1.1.m4a"],
  ["/audio/dj/rewind/2.mp3.m4a", "/audio/dj/rewind/2.1.m4a"],
  ["/audio/dj/rewind/3.mp3.m4a", "/audio/dj/rewind/3.1.m4a"],
] as const;
const DEFAULT_VOLUME = 1;
const DJ_STINGER_VOLUME_MULTIPLIER = 0.6;
const DJ_RESUME_LEAD_MS = 500;
const DJ_INTERRUPT_VOLUME_MULTIPLIER = 0.7;
const DJ_RANDOM_VOLUME_MULTIPLIER = 0.7;
const DJ_INTERRUPTION_PREFIX_MS = 700;
const DJ_INTERRUPT_MIN_LEAD_S = 20;
const DJ_INTERRUPT_END_BUFFER_S = 18;
const DJ_INTERRUPT_WINDOW_START = 0.35;
const DJ_INTERRUPT_WINDOW_END = 0.72;
const DJ_REWIND_WINDOW_START = 0.72;
const DJ_REWIND_WINDOW_END = 0.82;
const DJ_REWIND_SEEK_BACK_S = 10;
const DJ_RANDOM_MIN_DELAY_MS = 2 * 60 * 1000;
const DJ_RANDOM_MAX_DELAY_MS = 5 * 60 * 1000;
const DJ_RANDOM_WINDOW_START = 0.25;
const DJ_RANDOM_WINDOW_END = 0.75;

const shuffleIndices = (length: number, pinnedFirstIndex?: number) => {
  const indices = Array.from({ length }, (_, index) => index);

  for (let index = indices.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [indices[index], indices[randomIndex]] = [indices[randomIndex], indices[index]];
  }

  if (
    pinnedFirstIndex !== undefined &&
    indices.length > 1 &&
    indices[0] === pinnedFirstIndex
  ) {
    const swapIndex = indices.findIndex((value) => value !== pinnedFirstIndex);
    if (swapIndex > 0) {
      [indices[0], indices[swapIndex]] = [indices[swapIndex], indices[0]];
    }
  }

  return indices;
};

const buildRandomPlayState = (length: number, pinnedFirstIndex?: number) => {
  const order = shuffleIndices(length, pinnedFirstIndex);
  if (order.length <= 1) {
    return { playOrder: order, trackPosition: 0 };
  }

  const offset = Math.floor(Math.random() * order.length);
  const rotatedOrder = [...order.slice(offset), ...order.slice(0, offset)];
  return { playOrder: rotatedOrder, trackPosition: 0 };
};

const shuffleItems = <T,>(items: readonly T[]) => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const getTrackDisplayTitle = (track: Track) => `${track.title}${track.audioSrc ? "" : " *"}`;
const getSpecialSongIntroSrc = (track: Track) =>
  track.id.includes("&") ? `/audio/dj/special_song/${track.id}.m4a` : null;

const VISUALIZER_BAR_COUNT = 11;
const VISUALIZER_IDLE_BARS = Array.from({ length: VISUALIZER_BAR_COUNT }, () => 0.14);
const VISUALIZER_ATTACK = 0.68;
const VISUALIZER_DECAY = 0.16;
const VISUALIZER_MIN_LEVEL = 0.08;

const getVisualizerRanges = (binCount: number) => {
  const ranges: Array<{ start: number; end: number; weight: number }> = [];
  const maxIndex = Math.max(1, binCount - 1);

  for (let index = 0; index < VISUALIZER_BAR_COUNT; index += 1) {
    const startRatio = Math.pow(index / VISUALIZER_BAR_COUNT, 1.9);
    const endRatio = Math.pow((index + 1) / VISUALIZER_BAR_COUNT, 1.9);
    const start = Math.min(maxIndex, Math.floor(startRatio * maxIndex));
    const end = Math.max(start + 1, Math.min(binCount, Math.ceil(endRatio * maxIndex) + 1));
    const weight = 1 + index / VISUALIZER_BAR_COUNT;

    ranges.push({ start, end, weight });
  }

  return ranges;
};

const RadioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const djStingerAudioRef = useRef<HTMLAudioElement | null>(null);
  const djVoiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const djRandomAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserMapRef = useRef(new Map<HTMLAudioElement, AnalyserNode>());
  const sourceNodeMapRef = useRef(new Map<HTMLAudioElement, MediaElementAudioSourceNode>());
  const animationFrameRef = useRef<number | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  const visualizerRangesRef = useRef<Array<{ start: number; end: number; weight: number }> | null>(null);
  const visualizerPhaseRef = useRef(0);
  const visualizerFlatFramesRef = useRef(0);
  const hasInteractedRef = useRef(false);
  const shouldAutoplayRef = useRef(false);
  const previousTrackIdRef = useRef<string | null>(null);
  const playedTrackIdsRef = useRef<string[]>([]);
  const djInterruptionOrderRef = useRef<string[]>(shuffleItems(DJ_INTERRUPTION_CLIPS));
  const djInterruptionIndexRef = useRef(0);
  const djVoiceOrderRef = useRef<string[]>(shuffleItems(DJ_VOICE_CLIPS));
  const djVoiceIndexRef = useRef(0);
  const djRandomOrderRef = useRef<string[]>(shuffleItems(DJ_RANDOM_CLIPS));
  const djRandomIndexRef = useRef(0);
  const rewindPairIndexRef = useRef(0);
  const completedSongCountRef = useRef(0);
  const pendingRewindRef = useRef(false);
  const djInterruptTimeoutRef = useRef<number | null>(null);
  const djResumeTimeoutRef = useRef<number | null>(null);
  const djPrefixTimeoutRef = useRef<number | null>(null);
  const djRandomTimeoutRef = useRef<number | null>(null);
  const scrollPlayerTimeoutRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const visualizerInterruptTimeoutRef = useRef<number | null>(null);
  const isDjVoiceActiveRef = useRef(false);
  const [{ playOrder, trackPosition }, setPlayState] = useState(() =>
    buildRandomPlayState(PLAYABLE_TRACKS.length)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(VISUALIZER_IDLE_BARS);
  const [isPodCollapsed, setIsPodCollapsed] = useState(true);
  const [isScrollPlayerVisible, setIsScrollPlayerVisible] = useState(false);
  const sliderId = useId();
  const currentTrackIndex = playOrder[trackPosition] ?? 0;
  const currentTrack = PLAYABLE_TRACKS[currentTrackIndex] ?? PLAYABLE_TRACKS[0];
  const missingTrackSummary = MISSING_TRACKS.map((track) => `${track.id}*`).join(", ");
  const sliderProgress = duration > 0 ? `${(currentTime / duration) * 100}%` : "0%";

  const clearDjInterruptTimeout = () => {
    if (djInterruptTimeoutRef.current) {
      window.clearTimeout(djInterruptTimeoutRef.current);
      djInterruptTimeoutRef.current = null;
    }
  };

  const clearDjResumeTimeout = () => {
    if (djResumeTimeoutRef.current) {
      window.clearTimeout(djResumeTimeoutRef.current);
      djResumeTimeoutRef.current = null;
    }
  };

  const clearDjPrefixTimeout = () => {
    if (djPrefixTimeoutRef.current) {
      window.clearTimeout(djPrefixTimeoutRef.current);
      djPrefixTimeoutRef.current = null;
    }
  };

  const clearDjRandomTimeout = () => {
    if (djRandomTimeoutRef.current) {
      window.clearTimeout(djRandomTimeoutRef.current);
      djRandomTimeoutRef.current = null;
    }
  };

  const clearScrollPlayerTimeout = () => {
    if (scrollPlayerTimeoutRef.current) {
      window.clearTimeout(scrollPlayerTimeoutRef.current);
      scrollPlayerTimeoutRef.current = null;
    }
  };

  const clearVisualizerInterruptTimeout = () => {
    if (visualizerInterruptTimeoutRef.current) {
      window.clearTimeout(visualizerInterruptTimeoutRef.current);
      visualizerInterruptTimeoutRef.current = null;
    }
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    clearVisualizerInterruptTimeout();
    visualizerFlatFramesRef.current = 0;
    setVisualizerBars(VISUALIZER_IDLE_BARS);
  };

  const ensureAnalyserForAudio = (audio: HTMLAudioElement) => {
    const AudioContextCtor = window.AudioContext || (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    const existingAnalyser = analyserMapRef.current.get(audio);
    if (existingAnalyser) {
      return existingAnalyser;
    }

    const context = audioContextRef.current;
    if (!context) {
      return null;
    }

    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.72;

    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    analyserMapRef.current.set(audio, analyser);
    sourceNodeMapRef.current.set(audio, source);

    if (!frequencyDataRef.current) {
      frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);
      visualizerRangesRef.current = getVisualizerRanges(analyser.frequencyBinCount);
    }

    return analyser;
  };

  const startVisualizer = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume().catch(() => undefined);
    }

    const analyser = ensureAnalyserForAudio(audio);
    const frequencyData = frequencyDataRef.current;
    const visualizerRanges = visualizerRangesRef.current;
    if (!analyser || !frequencyData || !visualizerRanges) {
      return;
    }

    clearVisualizerInterruptTimeout();
    if (animationFrameRef.current) {
      return;
    }

    const draw = () => {
      const currentAudio = audioRef.current;
      const currentAnalyser = currentAudio ? ensureAnalyserForAudio(currentAudio) : null;
      const currentFrequencyData = frequencyDataRef.current;
      const currentVisualizerRanges = visualizerRangesRef.current;

      if (!currentAudio || !currentAnalyser || !currentFrequencyData || !currentVisualizerRanges) {
        setVisualizerBars(VISUALIZER_IDLE_BARS);
        animationFrameRef.current = window.requestAnimationFrame(draw);
        return;
      }

      if (currentAudio.paused || currentAudio.ended || isDjVoiceActiveRef.current) {
        visualizerFlatFramesRef.current = 0;
        setVisualizerBars(VISUALIZER_IDLE_BARS);
        animationFrameRef.current = window.requestAnimationFrame(draw);
        return;
      }

      currentAnalyser.getByteFrequencyData(currentFrequencyData);
      const nextBars = currentVisualizerRanges.map(({ start, end, weight }, index) => {
        let weightedSum = 0;
        let totalWeight = 0;

        for (let offset = start; offset < end; offset += 1) {
          const value = currentFrequencyData[offset] ?? 0;
          const positionWeight =
            1 +
            ((offset - start) / Math.max(1, end - start)) * 0.6 +
            index / VISUALIZER_BAR_COUNT;
          weightedSum += value * positionWeight;
          totalWeight += positionWeight;
        }

        const average = totalWeight > 0 ? weightedSum / totalWeight : 0;
        const normalized = Math.min(1, (average / 255) * weight * 1.05);
        return Math.max(VISUALIZER_MIN_LEVEL, Math.pow(normalized, 0.9));
      });

      const totalEnergy = nextBars.reduce((sum, value) => sum + value, 0);
      const nearIdleEnergy = VISUALIZER_MIN_LEVEL * VISUALIZER_BAR_COUNT + 0.12;
      const shouldUseFallback = totalEnergy <= nearIdleEnergy;
      visualizerFlatFramesRef.current = shouldUseFallback
        ? visualizerFlatFramesRef.current + 1
        : 0;

      const targetBars =
        visualizerFlatFramesRef.current > 12
          ? nextBars.map((_, index) => {
              const phase = visualizerPhaseRef.current + index * 0.55;
              const wave = (Math.sin(phase) + 1) * 0.5;
              return 0.18 + wave * 0.56;
            })
          : nextBars;

      visualizerPhaseRef.current += 0.12;

      setVisualizerBars((current) =>
        current.map((bar, index) => {
          const target = targetBars[index] ?? VISUALIZER_MIN_LEVEL;
          const easing = target > bar ? VISUALIZER_ATTACK : VISUALIZER_DECAY;
          return bar + (target - bar) * easing;
        })
      );
      animationFrameRef.current = window.requestAnimationFrame(draw);
    };

    animationFrameRef.current = window.requestAnimationFrame(draw);
  };

  const showInterruptedVisualizerState = () => {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    clearVisualizerInterruptTimeout();
    setVisualizerBars((current) =>
      current.map((_, index) => (index % 3 === 0 ? 0.72 : index % 2 === 0 ? 0.48 : 0.32))
    );
    visualizerInterruptTimeoutRef.current = window.setTimeout(() => {
      setVisualizerBars(VISUALIZER_IDLE_BARS);
      visualizerInterruptTimeoutRef.current = null;
    }, 220);
  };

  const getNextDjInterruptionClip = () => {
    const order = djInterruptionOrderRef.current;
    if (djInterruptionIndexRef.current >= order.length) {
      djInterruptionOrderRef.current = shuffleItems(DJ_INTERRUPTION_CLIPS);
      djInterruptionIndexRef.current = 0;
    }

    const clip =
      djInterruptionOrderRef.current[djInterruptionIndexRef.current] ?? DJ_INTERRUPTION_CLIPS[0];
    djInterruptionIndexRef.current += 1;
    return clip;
  };

  const getNextDjVoiceClip = () => {
    const order = djVoiceOrderRef.current;
    if (djVoiceIndexRef.current >= order.length) {
      djVoiceOrderRef.current = shuffleItems(DJ_VOICE_CLIPS);
      djVoiceIndexRef.current = 0;
    }

    const clip = djVoiceOrderRef.current[djVoiceIndexRef.current] ?? DJ_VOICE_CLIPS[0];
    djVoiceIndexRef.current += 1;
    return clip;
  };

  const getNextRewindPair = () => {
    const pair =
      DJ_REWIND_CLIP_PAIRS[rewindPairIndexRef.current] ?? DJ_REWIND_CLIP_PAIRS[0];
    rewindPairIndexRef.current =
      (rewindPairIndexRef.current + 1) % DJ_REWIND_CLIP_PAIRS.length;
    return pair;
  };

  const getNextDjRandomClip = () => {
    const order = djRandomOrderRef.current;
    if (djRandomIndexRef.current >= order.length) {
      djRandomOrderRef.current = shuffleItems(DJ_RANDOM_CLIPS);
      djRandomIndexRef.current = 0;
    }

    const clip = djRandomOrderRef.current[djRandomIndexRef.current] ?? DJ_RANDOM_CLIPS[0];
    djRandomIndexRef.current += 1;
    return clip;
  };

  const scheduleDjRandomOverlay = () => {
    clearDjRandomTimeout();
    djRandomTimeoutRef.current = window.setTimeout(() => {
      const mainAudio = audioRef.current;
      const djRandomAudio = djRandomAudioRef.current;
      if (!mainAudio || !djRandomAudio || mainAudio.paused || isDjVoiceActiveRef.current) {
        scheduleDjRandomOverlay();
        return;
      }

      const durationSeconds = Number.isFinite(mainAudio.duration) ? mainAudio.duration : 0;
      if (durationSeconds > 0) {
        const progress = mainAudio.currentTime / durationSeconds;
        const isWithinWindow =
          progress >= DJ_RANDOM_WINDOW_START &&
          progress <= DJ_RANDOM_WINDOW_END &&
          mainAudio.currentTime >= DJ_INTERRUPT_MIN_LEAD_S &&
          durationSeconds - mainAudio.currentTime >= DJ_INTERRUPT_END_BUFFER_S;

        if (isWithinWindow) {
          djRandomAudio.pause();
          djRandomAudio.currentTime = 0;
          djRandomAudio.src = getNextDjRandomClip();
          djRandomAudio.load();
          void djRandomAudio.play().catch(() => undefined);
        }
      }

      scheduleDjRandomOverlay();
    }, DJ_RANDOM_MIN_DELAY_MS + Math.random() * (DJ_RANDOM_MAX_DELAY_MS - DJ_RANDOM_MIN_DELAY_MS));
  };

  const scheduleDjVoiceInterrupt = () => {
    clearDjInterruptTimeout();
    const audio = audioRef.current;
    if (!audio || audio.paused || isDjVoiceActiveRef.current) {
      return;
    }

    const durationSeconds = Number.isFinite(audio.duration) ? audio.duration : 0;
    if (durationSeconds <= 0) {
      return;
    }

    const isRewindEvent = pendingRewindRef.current;
    const windowStart = isRewindEvent ? DJ_REWIND_WINDOW_START : DJ_INTERRUPT_WINDOW_START;
    const windowEnd = isRewindEvent ? DJ_REWIND_WINDOW_END : DJ_INTERRUPT_WINDOW_END;
    const earliestTime = Math.max(
      audio.currentTime + DJ_INTERRUPT_MIN_LEAD_S,
      durationSeconds * windowStart
    );
    const latestTime = Math.min(
      durationSeconds - DJ_INTERRUPT_END_BUFFER_S,
      durationSeconds * windowEnd
    );

    if (latestTime <= earliestTime) {
      return;
    }

    const targetTime =
      earliestTime + Math.random() * (latestTime - earliestTime);
    const delay = Math.max(0, (targetTime - audio.currentTime) * 1000);

    djInterruptTimeoutRef.current = window.setTimeout(() => {
      const mainAudio = audioRef.current;
      const djVoiceAudio = djVoiceAudioRef.current;
      if (!mainAudio || !djVoiceAudio || mainAudio.paused || isDjVoiceActiveRef.current) {
        return;
      }

      isDjVoiceActiveRef.current = true;
      clearDjResumeTimeout();
      clearDjPrefixTimeout();
      mainAudio.pause();
      showInterruptedVisualizerState();
      djVoiceAudio.pause();
      djVoiceAudio.currentTime = 0;

      const resumeMainAudio = () => {
        clearDjResumeTimeout();
        clearDjPrefixTimeout();
        isDjVoiceActiveRef.current = false;
        if (shouldAutoplayRef.current) {
          void mainAudio.play().catch(() => {
            setIsPlaying(false);
          });
        }
      };

      const startDjVoiceClip = () => {
        const scheduleResume = () => {
          const clipDuration = Number.isFinite(djVoiceAudio.duration) ? djVoiceAudio.duration : 0;
          const resumeDelay = Math.max(0, clipDuration * 1000 - DJ_RESUME_LEAD_MS);
          clearDjResumeTimeout();
          djResumeTimeoutRef.current = window.setTimeout(() => {
            resumeMainAudio();
          }, resumeDelay);
        };

        djVoiceAudio.onloadedmetadata = scheduleResume;
        djVoiceAudio.onended = () => {
          resumeMainAudio();
        };
        djVoiceAudio.src = getNextDjVoiceClip();
        djVoiceAudio.load();
        void djVoiceAudio.play().catch(() => {
          resumeMainAudio();
        });
      };

      const startRewindPair = () => {
        const [leadClip, followClip] = getNextRewindPair();
        pendingRewindRef.current = false;
        mainAudio.currentTime = Math.max(0, mainAudio.currentTime - DJ_REWIND_SEEK_BACK_S);

        const playFollowClip = () => {
          const scheduleResume = () => {
            const clipDuration = Number.isFinite(djVoiceAudio.duration) ? djVoiceAudio.duration : 0;
            const resumeDelay = Math.max(0, clipDuration * 1000 - DJ_RESUME_LEAD_MS);
            clearDjResumeTimeout();
            djResumeTimeoutRef.current = window.setTimeout(() => {
              resumeMainAudio();
            }, resumeDelay);
          };

          djVoiceAudio.onloadedmetadata = scheduleResume;
          djVoiceAudio.onended = () => {
            resumeMainAudio();
          };
          djVoiceAudio.src = followClip;
          djVoiceAudio.load();
          void djVoiceAudio.play().catch(() => {
            resumeMainAudio();
          });
        };

        djVoiceAudio.onloadedmetadata = null;
        djVoiceAudio.onended = null;
        djVoiceAudio.src = leadClip;
        djVoiceAudio.load();
        void djVoiceAudio.play().catch(() => {
          resumeMainAudio();
        });
        djPrefixTimeoutRef.current = window.setTimeout(() => {
          if (!isDjVoiceActiveRef.current) {
            return;
          }
          djVoiceAudio.pause();
          djVoiceAudio.currentTime = 0;
          playFollowClip();
        }, DJ_INTERRUPTION_PREFIX_MS);
      };

      if (isRewindEvent) {
        startRewindPair();
        return;
      }

      djVoiceAudio.onloadedmetadata = null;
      djVoiceAudio.onended = null;
      djVoiceAudio.src = getNextDjInterruptionClip();
      djVoiceAudio.load();
      void djVoiceAudio.play().catch(() => {
        resumeMainAudio();
      });
      djPrefixTimeoutRef.current = window.setTimeout(() => {
        if (!isDjVoiceActiveRef.current) {
          return;
        }
        djVoiceAudio.pause();
        djVoiceAudio.currentTime = 0;
        startDjVoiceClip();
      }, DJ_INTERRUPTION_PREFIX_MS);
    }, delay);
  };

  useEffect(() => {
    const audio = audioRef.current;
    const djStingerAudio = djStingerAudioRef.current;
    const djVoiceAudio = djVoiceAudioRef.current;
    const djRandomAudio = djRandomAudioRef.current;
    if (!audio) {
      return;
    }

    audio.preload = "auto";
    audio.playsInline = true;
    if (djStingerAudio) {
      djStingerAudio.preload = "auto";
      djStingerAudio.playsInline = true;
    }
    if (djVoiceAudio) {
      djVoiceAudio.preload = "auto";
      djVoiceAudio.playsInline = true;
    }
    if (djRandomAudio) {
      djRandomAudio.preload = "auto";
      djRandomAudio.playsInline = true;
    }

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => {
      setDuration(audio.duration || 0);
    };
    const handlePlay = () => {
      setIsPlaying(true);
      scheduleDjRandomOverlay();
      void startVisualizer();
    };
    const handlePause = () => {
      setIsPlaying(false);
      clearDjInterruptTimeout();
      clearDjRandomTimeout();
      stopVisualizer();
    };
    const handleEnded = () => {
      clearDjInterruptTimeout();
      clearDjResumeTimeout();
      clearDjPrefixTimeout();
      clearDjRandomTimeout();
      stopVisualizer();
      isDjVoiceActiveRef.current = false;
      if (djVoiceAudio) {
        djVoiceAudio.pause();
        djVoiceAudio.currentTime = 0;
      }
      if (djRandomAudio) {
        djRandomAudio.pause();
        djRandomAudio.currentTime = 0;
      }
      if (djStingerAudio) {
        djStingerAudio.pause();
        djStingerAudio.currentTime = 0;
      }
      completedSongCountRef.current += 1;
      if (completedSongCountRef.current % 2 === 0) {
        pendingRewindRef.current = true;
      }
      setPlayState((current) => {
        if (current.trackPosition < current.playOrder.length - 1) {
          return { ...current, trackPosition: current.trackPosition + 1 };
        }

        playedTrackIdsRef.current = [];
        return buildRandomPlayState(PLAYABLE_TRACKS.length, currentTrackIndex);
      });
    };

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    const tryPlay = () => {
      if (!shouldAutoplayRef.current) {
        return;
      }
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    };

    tryPlay();

    const unlockPlayback = () => {
      if (hasInteractedRef.current || !shouldAutoplayRef.current) {
        return;
      }
      hasInteractedRef.current = true;
      tryPlay();
    };

    window.addEventListener("pointerdown", unlockPlayback, { passive: true });
    window.addEventListener("keydown", unlockPlayback);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      clearDjInterruptTimeout();
      clearDjResumeTimeout();
      clearDjPrefixTimeout();
      clearDjRandomTimeout();
      window.removeEventListener("pointerdown", unlockPlayback);
      window.removeEventListener("keydown", unlockPlayback);
    };
  }, [currentTrackIndex, playOrder.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (djStingerAudioRef.current) {
      djStingerAudioRef.current.volume = volume * DJ_STINGER_VOLUME_MULTIPLIER;
    }
    if (djVoiceAudioRef.current) {
      djVoiceAudioRef.current.volume = volume * DJ_INTERRUPT_VOLUME_MULTIPLIER;
    }
    if (djRandomAudioRef.current) {
      djRandomAudioRef.current.volume = volume * DJ_RANDOM_VOLUME_MULTIPLIER;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      return;
    }

    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (!shouldAutoplayRef.current) {
      return;
    }

    void audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [currentTrack]);

  useEffect(() => {
    return () => {
      stopVisualizer();
    };
  }, []);

  useEffect(() => {
    const djStingerAudio = djStingerAudioRef.current;
    if (!djStingerAudio || !currentTrack) {
      return;
    }

    if (previousTrackIdRef.current === null) {
      previousTrackIdRef.current = currentTrack.id;
      return;
    }

    if (previousTrackIdRef.current === currentTrack.id) {
      return;
    }

    previousTrackIdRef.current = currentTrack.id;
    const specialIntroSrc = getSpecialSongIntroSrc(currentTrack);
    const randomStinger =
      DJ_STINGERS[Math.floor(Math.random() * DJ_STINGERS.length)] ?? DJ_STINGERS[0];
    const introSrc = specialIntroSrc ?? randomStinger;
    djStingerAudio.pause();
    djStingerAudio.currentTime = 0;
    djStingerAudio.src = introSrc;
    djStingerAudio.load();
    void djStingerAudio.play().catch(() => undefined);
  }, [currentTrack]);

  useEffect(() => {
    if (!currentTrack) {
      return;
    }

    if (!playedTrackIdsRef.current.includes(currentTrack.id)) {
      playedTrackIdsRef.current.push(currentTrack.id);
    }

    if (playedTrackIdsRef.current.length > PLAYABLE_TRACKS.length) {
      playedTrackIdsRef.current = [currentTrack.id];
    }
  }, [currentTrack]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (currentScrollY <= 0) {
        clearScrollPlayerTimeout();
        setIsScrollPlayerVisible(false);
        return;
      }

      if (!isScrollingDown) {
        return;
      }

      setIsScrollPlayerVisible(true);
      clearScrollPlayerTimeout();
      scrollPlayerTimeoutRef.current = window.setTimeout(() => {
        setIsScrollPlayerVisible(false);
        scrollPlayerTimeoutRef.current = null;
      }, 15000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearScrollPlayerTimeout();
    };
  }, []);

  const handleTogglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      shouldAutoplayRef.current = true;
      await audio.play().catch(() => {
        setIsPlaying(false);
      });
      return;
    }

    shouldAutoplayRef.current = false;
    clearDjInterruptTimeout();
    clearDjResumeTimeout();
    clearDjRandomTimeout();
    if (djVoiceAudioRef.current) {
      djVoiceAudioRef.current.pause();
      djVoiceAudioRef.current.currentTime = 0;
    }
    if (djRandomAudioRef.current) {
      djRandomAudioRef.current.pause();
      djRandomAudioRef.current.currentTime = 0;
    }
    isDjVoiceActiveRef.current = false;
    audio.pause();
    stopVisualizer();
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handlePreviousTrack = () => {
    shouldAutoplayRef.current = true;
    clearDjInterruptTimeout();
    clearDjResumeTimeout();
    clearDjPrefixTimeout();
    clearDjRandomTimeout();
    isDjVoiceActiveRef.current = false;
    if (djVoiceAudioRef.current) {
      djVoiceAudioRef.current.pause();
      djVoiceAudioRef.current.currentTime = 0;
    }
    if (djRandomAudioRef.current) {
      djRandomAudioRef.current.pause();
      djRandomAudioRef.current.currentTime = 0;
    }
    if (djStingerAudioRef.current) {
      djStingerAudioRef.current.pause();
      djStingerAudioRef.current.currentTime = 0;
    }
    setPlayState((current) => ({
      ...current,
      trackPosition: current.trackPosition === 0 ? current.playOrder.length - 1 : current.trackPosition - 1,
    }));
  };

  const handleNextTrack = () => {
    shouldAutoplayRef.current = true;
    clearDjInterruptTimeout();
    clearDjResumeTimeout();
    clearDjPrefixTimeout();
    clearDjRandomTimeout();
    isDjVoiceActiveRef.current = false;
    if (djVoiceAudioRef.current) {
      djVoiceAudioRef.current.pause();
      djVoiceAudioRef.current.currentTime = 0;
    }
    if (djRandomAudioRef.current) {
      djRandomAudioRef.current.pause();
      djRandomAudioRef.current.currentTime = 0;
    }
    if (djStingerAudioRef.current) {
      djStingerAudioRef.current.pause();
      djStingerAudioRef.current.currentTime = 0;
    }
    setPlayState((current) => {
      if (current.trackPosition < current.playOrder.length - 1) {
        return { ...current, trackPosition: current.trackPosition + 1 };
      }

      playedTrackIdsRef.current = [];
      return buildRandomPlayState(PLAYABLE_TRACKS.length, currentTrackIndex);
    });
  };

  return (
    <>
      <audio ref={audioRef} src={currentTrack.audioSrc} />
      <audio ref={djStingerAudioRef} />
      <audio ref={djVoiceAudioRef} />
      <audio ref={djRandomAudioRef} />
      <div
        className={`fixed inset-x-0 z-[59] flex items-end justify-start pl-3 transition-[bottom] ease-in-out md:inset-x-auto md:right-[8vw] md:justify-start md:pl-0 ${
          isScrollPlayerVisible ? "bottom-[36px] md:bottom-[42px]" : "bottom-0"
        }`}
        style={{ transitionDuration: "2000ms" }}
      >
        <div
          className="relative transition-transform duration-[2000ms] ease-in-out"
          style={{
            transform: isPodCollapsed ? "translateY(100%)" : "translateY(0)",
          }}
        >
        <button
          type="button"
          onClick={() => setIsPodCollapsed((current) => !current)}
          aria-label={isPodCollapsed ? "Expand radio pod" : "Collapse radio pod"}
          className="absolute left-1/2 top-0 z-[3] inline-flex h-[34px] w-[34px] -translate-x-1/2 -translate-y-[26px] items-center justify-center rounded-full border border-black/35 bg-black text-white shadow-[0_8px_18px_rgba(0,0,0,0.22)] transition hover:bg-black hover:text-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            {isPodCollapsed ? (
              <path d="m6 15 6-6 6 6" />
            ) : (
              <path d="m6 9 6 6 6-6" />
            )}
          </svg>
        </button>
        <div className="relative flex w-[33vw] min-w-[118px] max-w-[152px] items-center justify-center gap-1 overflow-hidden rounded-t-[45px] border border-black/15 border-b-0 bg-[#eef2ec] px-3 pb-3 pt-2 shadow-[0_10px_28px_rgba(0,0,0,0.12)] md:w-auto md:max-w-none md:gap-1.5 md:px-4 md:pl-[3vw] md:pr-[3vw] md:pt-[1.5vw]">
          <div className="pointer-events-none absolute inset-0">
            <div className="pod-wallpaper-bg absolute inset-0 opacity-90" />
            <div className="absolute inset-0 bg-[#eef2ec]/28" />
          </div>
          <div className="relative z-[1] flex min-w-0 flex-col items-center px-2 text-center">
            <div className="mb-1 flex items-center gap-2">
              {missingTrackSummary ? (
                <span className="text-[8px] uppercase tracking-[0.18em] text-black/70 md:text-[9px]">
                  {PLAYABLE_TRACKS.length}/{TRACKS.length} loaded · {missingTrackSummary}
                </span>
              ) : null}
            </div>
            <a
              href={currentTrack.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 max-w-[28vw] text-center text-[8px] uppercase tracking-[0.14em] text-black/80 underline decoration-black/30 underline-offset-[0.22em] transition hover:text-black md:max-w-[18vw] md:text-[10px]"
            >
              {getTrackDisplayTitle(currentTrack)}
            </a>
            <button
              type="button"
              onClick={handleNextTrack}
              aria-label="Next track"
              className="mb-[4vh] inline-flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border border-black/20 bg-white/92 text-black shadow-[inset_0_1px_6px_rgba(255,255,255,0.9),0_4px_10px_rgba(255,255,255,0.28)] transition hover:bg-white md:mb-2 md:h-[26px] md:w-[26px]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[11px] w-[11px] md:h-[13px] md:w-[13px]"
              >
                <path d="m13 19 7-7-7-7" />
                <path d="m4 19 7-7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => void handleTogglePlayback()}
              aria-label={isPlaying ? "Pause radio" : "Play radio"}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/92 text-black shadow-[inset_0_1px_6px_rgba(255,255,255,0.92),0_8px_20px_rgba(255,255,255,0.2)] transition hover:scale-[1.02] md:h-9 md:w-9"
            >
              {isPlaying ? (
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 md:h-4 md:w-4">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-3.5 w-3.5 md:h-4 md:w-4">
                  <path d="M8 5.5v13l10-6.5-10-6.5Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-[60] border-t border-black/20 text-black backdrop-blur-md transition-all ease-in-out ${
          isScrollPlayerVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        }`}
        style={{ transitionDuration: "2000ms" }}
      >
        <div className="relative mx-auto flex h-[42px] w-full items-center overflow-hidden px-2 md:h-[48px] md:px-5">
          <div className="pointer-events-none absolute inset-0">
            <div aria-hidden="true" className="pod-wallpaper-bg absolute inset-0 opacity-90" />
            <div className="absolute inset-0 bg-[#f5f7f3]/26" />
          </div>
          <div className="relative min-w-0 w-full">
            <div className="mb-0.5 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-black/65 md:mb-1 md:text-[11px]">
              <a
                href={currentTrack.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate pr-3 underline decoration-black/30 underline-offset-[0.22em] transition hover:text-black"
              >
                {getTrackDisplayTitle(currentTrack)}
              </a>
              <span className="shrink-0">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <label htmlFor={sliderId} className="sr-only">
                Seek through song
              </label>
              <input
                id={sliderId}
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={(event) => handleSeek(Number(event.target.value))}
                style={{ ["--radio-progress" as string]: sliderProgress }}
                className="radio-player-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-white/30 md:h-2.5"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RadioPlayer;
