import { useEffect, useId, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  score: string;
  youtubeUrl: string;
  audioSrc?: string;
};

type SongFlash = {
  color: string;
  text: string;
  subText: string;
  key: number;
};

type RandomSource = () => number;

const RADIO_SESSION_SEED_KEY = "timeless-elegance-radio-seed";

const getRadioSessionSeed = () => {
  if (typeof window === "undefined") {
    return "server-session";
  }

  try {
    const existingSeed = window.sessionStorage.getItem(RADIO_SESSION_SEED_KEY);
    if (existingSeed) {
      return existingSeed;
    }

    const entropy =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.floor(window.performance?.now?.() ?? 0)}`;
    window.sessionStorage.setItem(RADIO_SESSION_SEED_KEY, entropy);
    return entropy;
  } catch {
    return `${Date.now()}-${Math.floor(typeof performance !== "undefined" ? performance.now() : 0)}`;
  }
};

const hashStringToSeed = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0 || 1;
};

const createSeededRandom = (seed: number): RandomSource => {
  let state = seed >>> 0 || 1;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
};

const createSessionRandom = (seed: string, scope: string) =>
  createSeededRandom(hashStringToSeed(`${seed}:${scope}`));

const randomInt = (rng: RandomSource, maxExclusive: number) => Math.floor(rng() * maxExclusive);


const TRACKS: Track[] = [
  {
    id: "01",
    title: "BJ Lips - Love Potion",
    score: "10/10",
    audioSrc: "https://audio.vostok.guide/01_bj_lips.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=C51ZecKDYkQ&list=RDIDi6v7GqgsY",
  },
  {
    id: "02",
    title: "Love Potions X Track 10",
    score: "11/10",
    audioSrc: "https://audio.vostok.guide/02_love_potions_x_track_10.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=YCXYkcpD5tw",
  },
  {
    id: "03",
    title: "Ecstasy (Remix)",
    score: "10/10",
    audioSrc: "https://audio.vostok.guide/03_ecstasy_remix.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=VeS3O47Jv9s&list=RDIDi6v7GqgsY",
  },
  {
    id: "04",
    title: "Love Potions x I'll Do It",
    score: "7/10",
    audioSrc: "https://audio.vostok.guide/04_love_potions_x_ill_do_it.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=4YV5Tryq3LU&list=RDIDi6v7GqgsY",
  },
  {
    id: "05",
    title: "Voruyu alkogol (Slowed + Reverb)",
    score: "8/10",
    audioSrc: "https://audio.vostok.guide/05_voruyu_alkogol_slowed_reverb.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=z5EXOl9UOnM&list=RDIDi6v7GqgsY",
  },
  {
    id: "06",
    title: "ROMANCEPLANET w/ STAKILLAZ",
    score: "10/10",
    audioSrc: "https://audio.vostok.guide/06_romanceplanet_w_stakillaz.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Kqmzbpa7_6w&list=RDIDi6v7GqgsY",
  },
  {
    id: "07",
    title: "BABYDOLL",
    score: "6/10",
    audioSrc: "https://audio.vostok.guide/07_babydoll.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=mCkBsSEG440&list=RDIDi6v7GqgsY",
  },
  {
    id: "08",
    title: "MY JEALOUSY (Slowed)",
    score: "10/10",
    audioSrc: "https://audio.vostok.guide/08_my_jealousy_slowed.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=xnFvhn-1wHY",
  },
  {
    id: "09",
    title: "Love Potions x Tipsy (Slowed)",
    score: "9/10",
    audioSrc: "https://audio.vostok.guide/09_love_potions_x_tipsy.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=0FbdiUyWYPQ&list=RDIDi6v7GqgsY",
  },
  {
    id: "10",
    title: "Mariah Carey - Obsessed (fvckaron audio)",
    score: "9/10",
    audioSrc: "https://audio.vostok.guide/11_mariah_carey_obsessed_fvckaron_audio_slowed_reverb.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=4febO0OejZs&list=RDIDi6v7GqgsY",
  },
  {
    id: "11",
    title: "glamorgeddon (Slowed)",
    score: "5/10",
    audioSrc: "https://audio.vostok.guide/10_glamorgeddon_slowed.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Ekv9FYSqkEI&list=RDIDi6v7GqgsY",
  },
  {
    id: "12",
    title: "Tears/Lipgloss (Remix)",
    score: "6/10",
    audioSrc: "https://audio.vostok.guide/12_tears_lipgloss_remix.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=jzJKtDUiTYY&list=RDIDi6v7GqgsY",
  },
  {
    id: "13",
    title: "Britney Manson - FASHION (Slowed)",
    score: "7/10",
    audioSrc: "https://audio.vostok.guide/13_britney_manson_fashion_slowed.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=aDRD4OvNvus&list=RDYCXYkcpD5tw",
  },
  {
    id: "14",
    title: "Shy Smith - Soaked",
    score: "5/10",
    audioSrc: "https://audio.vostok.guide/14_shy_smith_soaked_slowed_reverb.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=SuNHuNSmMl8&list=RDYCXYkcpD5tw",
  },
  {
    id: "15",
    title: "Love Potions X MY JEALOUSY - bjlips & vivibaby",
    score: "9/10",
    audioSrc: "https://audio.vostok.guide/15_Love_Potions_X_MY_JEALOUSY_-_bjlips_&_vivibaby_(mashup).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=eKpP58Rris8&list=RDYCXYkcpD5tw",
  },
  {
    id: "16",
    title: "INTERSTELLAR ULTRAFUNK - SLOWED",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/16_INTERSTELLAR_ULTRAFUNK_-_SLOWED.m4a",
    youtubeUrl: "https://www.youtube.com/results?search_query=INTERSTELLAR+ULTRAFUNK+SLOWED",
  },
  {
    id: "17",
    title: "bj lips, princess paparazzi - love potions",
    score: "10/10",
    audioSrc: "https://audio.vostok.guide/17_Love_Potions_(6arelyhuman_Remix).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=3DnGBRPCnv0",
  },
  {
    id: "18",
    title: "Snow Strippers x Adore x Crystal Castles type beat - 'sleez'",
    score: "6/10",
    audioSrc: "https://audio.vostok.guide/18_Snow_Strippers_x_Adore_x_Crystal_Castles_type_beat_-_'sleez'.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=mI8SpXlOP1A",
  },
  {
    id: "19",
    title: "Charli xcx - b2b (qyurisuu remix)",
    score: "6/10",
    audioSrc: "https://audio.vostok.guide/19_Charli_xcx_-_b2b_(qyurisuu_remix).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=DQ22Uayxc-c",
  },
  {
    id: "20",
    title: "2000 (slowed)",
    score: "7/10",
    audioSrc: "https://audio.vostok.guide/20_2000_(slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=eifO7vXT_m8",
  },
  {
    id: "21&",
    title: "Schleini - Liebe (Techno)",
    score: "8/10",
    audioSrc: "https://audio.vostok.guide/21&_Schleini_-_Liebe_(Techno).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=rB3gX_shM8w",
  },
  {
    id: "22",
    title: "TENSA (Ultra Slowed)",
    score: "10/10",
    audioSrc: "https://audio.vostok.guide/22_TENSA_(Ultra_Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=ZtIA-BclORA",
  },
  {
    id: "23&",
    title: "Big Boogie - Kush Breath",
    score: "9/10",
    audioSrc: "https://audio.vostok.guide/23&_Big_Boogie_-_Kush_Breath_(Official_Music_Video).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=65NvWGZ5AvU",
  },
  {
    id: "24",
    title: "me pierdo",
    score: "8/10",
    audioSrc: "https://audio.vostok.guide/24_me_pierdo.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=FsYfzpg76So",
  },
  {
    id: "25&",
    title: "Habits (Stay High) x Stereo Love",
    score: "10/10",
    audioSrc: "https://audio.vostok.guide/25&_Habits_(Stay_High)_x_Stereo_Love_(slowed_to_perfection).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=oawmdHxyiyY",
  },
  {
    id: "26",
    title: "Saxo Funk (Super Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/26Saxo_Funk_(Super_Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=A_fVkPSzbeQ",
  },
  {
    id: "27",
    title: "Lost Sky - Fearless (Ultra Slowed + Reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/27_𝗟𝗼𝘀𝘁_𝗦𝗸𝘆_-_𝗙𝗲𝗮𝗿𝗹𝗲𝘀𝘀_(Ultra_Slowed__Reverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=qvgi-E6N8FU",
  },
  {
    id: "28",
    title: "TIKI TIKI",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/28_TIKI_TIKI.m4a",
    youtubeUrl: "https://www.youtube.com/results?search_query=TIKI+TIKI+slowed",
  },
  {
    id: "29",
    title: "THUNDER (Super Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/29_THUNDER_(Super_Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Oy_aY90u1Cc",
  },
  {
    id: "30",
    title: "Bad Romance // Best Part Only // Slowed + Reverb",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/30_bad_romance__best_part_only__slowed__reverb.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=FPrMZvdS0VI",
  },
  {
    id: "31",
    title: "Kavkaz (slowed+reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/31_Kavkaz_(slowedreverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=TWwGr5z7uFc",
  },
  {
    id: "32",
    title: "Versatile (Hardstylish Remix Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/32_Versatile_(Hardstylish_Remix_Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/results?search_query=Versatile+Hardstylish+Remix+Slowed",
  },
  {
    id: "33",
    title: "You got it (jersey club)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/33_You_got_it_(jersey_club).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=CEDokiMddd0",
  },
  {
    id: "34",
    title: "PortwaveShadow lady Slowed Reverb",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/34_PortwaveShadow_lady_Slowed_Reverb.m4a",
    youtubeUrl: "https://www.youtube.com/results?search_query=PortwaveShadow+lady+Slowed+Reverb",
  },
  {
    id: "35",
    title: "And I Have Come for You",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/35_And_I_Have_Come_for_You.m4a",
    youtubeUrl: "https://www.youtube.com/results?search_query=And+I+Have+Come+for+You",
  },
  {
    id: "36",
    title: "VIDA NOTURNA (Slowed + Reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/36_VIDA_NOTURNA_(Slowed_Reverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=VnvL3z0jmaw&list=RDqvgi-E6N8FU",
  },
  {
    id: "37",
    title: "Atmosphere",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/37_KNSRK_-_Atmosphere_(Slowed__Reverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=6YDCyXi12Sk",
  },
  {
    id: "38",
    title: "Hoes Come Easy",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/38_Hoes_Come_Easy_(Slowed__Low_Honor_-_The_Dark_Triad).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=fEj4v7AJkgY",
  },
  {
    id: "39",
    title: "Leanin - Cornell",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/39_Leanin.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=sB04u3tGbuM",
  },
  {
    id: "40",
    title: "Travis Scott - DUMBO (Instrumental)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/40_Travis_Scott_-_DUMBO_(Instrumental).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=osJ6p7PmoAg",
  },
  {
    id: "41",
    title: "specialsadism (super slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/41_specialsadism_(super_slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=YbvkuJ3oQCM&list=RDMM0Uo67YlIdcw",
  },
  {
    id: "42",
    title: "Gangnam Style x Give Me Everything (Slowed & Reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/42_Gangnam_Style_x_Give_Me_Everything_(Slowed_&_Reverb)_(TikTok_Version).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=ylfJtbVSs0w&list=RDMM0Uo67YlIdcw",
  },
  {
    id: "43",
    title: "BLAULICHT HARDTEKK",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/43_BLAULICHT_HARDTEKK.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=fyZjRw1Ez_k",
  },
  {
    id: "44",
    title: "I WAS MADE FOR LOVIN' YOU (Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/44_I_WAS_MADE_FOR_LOVIN'_YOU_(Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=M0b_qzdpHyQ",
  },
  {
    id: "45",
    title: "UMBASA - NERO (Super Slowed + Reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/45_UMBASA_-_NERO_(Super_Slowed_+_reverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=ktRytKptndk",
  },
  {
    id: "46",
    title: "down on me x I mean it",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/46_down_on_me_x_I_mean_it.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=QpH6aE3AfAo",
  },
  {
    id: "47",
    title: "Strippers",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/47_Strippers.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=ygoCpnxTAkg",
  },
  {
    id: "48",
    title: "Griddle (feat. Don Toliver)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/48_Griddle_(feat._Don_Toliver).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=_H0yAU3IP5I",
  },
  {
    id: "49",
    title: "Yo Voy - Lil Uzi Vert (unreleased)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/49_Yo_Voy_-_Lil_Uzi_Vert_(unreleased).m4a",
    youtubeUrl: "https://www.youtube.com/results?search_query=Yo+Voy+Lil+Uzi+Vert+unreleased",
  },
  {
    id: "50",
    title: "(FREE) twentythree + 2013club + swag type beat - money walk",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/50_(FREE)_twentythree_+_2013club_+_swag_type_beat_-_money_walk.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=tnbqcz_iIf8",
  },
  {
    id: "51",
    title: "Antiflvx - White Light",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/51_Antiflvx_-_White_Light.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=6_cnq8n2_mA",
  },
  {
    id: "52",
    title: "The Way I Are (slowed to perfection)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/52_The_Way_I_Are_(slowed_to_perfection).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=VgOJv8tpKlw",
  },
  {
    id: "53",
    title: "VOCE NA MIRA (Super Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/53_VOCE_NA_MIRA_(Super_Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=oXf-mHcJkfw",
  },
  {
    id: "54",
    title: "Take Me There - DA TI",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/54_Take_Me_There_-_DA_TI_(Lyrics).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=t0fq25M8mSI",
  },
  {
    id: "55",
    title: "Templar (Versions) (Super Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/55_Templar_(Versions)_(Super_Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=qdBGG6Vjm5k",
  },
  {
    id: "56",
    title: "The Haunted Youth - Coming Home",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/56_The_Haunted_Youth_-_Coming_Home.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=SgrSr6LNMdY",
  },
  {
    id: "57",
    title: "HERO! - Sped Up",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/57_HERO!_-_Sped_Up.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=EhUtJdRSs6M",
  },
  {
    id: "58",
    title: "OBLXKQ, eyfect, +w - Untitled#39",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/58_OBLXKQ,_eyfect,_w__-__Untitled#39.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=WD-fV1QCaWM",
  },
  {
    id: "59",
    title: "Criminal x Love Potions",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/59_Criminal_x_Love_Potions.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=HQqhqxzuKBs",
  },
  {
    id: "60",
    title: "You Could Be The One [Slowed To Perfection] Snow Strippers",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/60_You_Could_Be_The_One_[Slowed_To_Perfection]_Snow_Strippers.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=DH0vqfwwrYA",
  },
  {
    id: "61",
    title: "Porter Robinson - Mirror",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/61_Porter_Robinson_-_Mirror_(Official_Music_Video)_4.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=PkiIPzG37vQ",
  },
  {
    id: "62",
    title: "Feel So Close (Best Part Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/62_Feel_So_Close_(Best_Part_Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=vNbZjC5H-K4",
  },
  {
    id: "63",
    title: "worry (ultra slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/63_worry_(ultra_slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=lCKU-tI-upI",
  },
  {
    id: "64",
    title: "New Jeans Jersey Remix (Miside Mita Edit TikTok Version)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/64_New_Jeans_Jersey_Remix_(Audio_Edited)_(Miside_Mita_Edit_TikTok_Version)_[made_by_purple_drip_boy]_4.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=i66MQyYuiHM",
  },
  {
    id: "65",
    title: "SIMULVCRUM - Silent Love (Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/65_Silent_Love_(Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=m02icgjgAts",
  },
  {
    id: "66",
    title: "ravyn, CLINCE, winter - CELESTIA (Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/66_CELESTIA_(Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=iuqOXaIQW5M",
  },
  {
    id: "67",
    title: "CLARITY - HARDSTYLE (AGARTHA EDIT)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/67_CLARITY_-_HARDSTYLE_(AGARTHA_EDIT).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=rqtixbqxoTk",
  },
  {
    id: "68",
    title: "T3NZU - Under The Influence",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/68_T3NZU_-_Under_The_Influence.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Y8Fh6ZC-5FU",
  },
  {
    id: "69",
    title: "Kenia Os - Tu y Yo X Siempre",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/69_Kenia_Os_-_Tú_y_Yo_X_Siempre_(Lyric_Video).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=p9_OfhaG8I0",
  },
  {
    id: "70",
    title: "Ayesha Erotica, Mo Beats - Yummy (Righteous Remix - Sped Up)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/70_Yummy_(Righteous_Remix_-_Sped_Up)_4.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=hVZwm4ZzxBM",
  },
  {
    id: "71",
    title: "Embers (Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/71_Embers_(Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=huTqagrLjzU",
  },
  {
    id: "72",
    title: "Irokz - Angel (Sped Up)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/72_Angel_(Sped_Up)_[ZTiaysiWjVE].m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=ZTiaysiWjVE",
  },
  {
    id: "73",
    title: "Blurred Stars",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/73_Blurred_Stars.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=S1ngG7vg_Zs",
  },
  {
    id: "74",
    title: "Jeff Germita - IM SO LUCKY JUMPSTYLE (Super Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/74_IM_SO_LUCKY_JUMPSTYLE_(Super_Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=PAxxAnMxjS0",
  },
  {
    id: "75",
    title: "Nostalgia",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/75_Nostalgia.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Ui1wruLfNEg",
  },
  {
    id: "76",
    title: "2hollis - poster boy (slowed + reverb) lyrics",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/76_2hollis_-_poster_boy_(slowed__reverb)_lyrics.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=S37_XuxHCSE",
  },
  {
    id: "77",
    title: "Close Your Eyes and Make a Wish - Fright Night (Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/77_Close_Your_Eyes_and_Make_a_Wish_-_Fright_Night_(Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=WnGNxkYpufU",
  },
  {
    id: "78",
    title: "lustr - tell me (lyrics)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/78_lustr_-__tell_me_(lyrics).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=jjxRHFuTTw4",
  },
  {
    id: "79",
    title: "UNDONE",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/79_UNDONE.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=SADGCyunoLE",
  },
  {
    id: "80",
    title: "FUNERAL",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/80_FUNERAL.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=lHI7ZGfLnB4",
  },
  {
    id: "81",
    title: "Desire (Hucci Remix)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/81_Desire_(Hucci_Remix)_4.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=g6SVzgSjJck",
  },
  {
    id: "82",
    title: "BLOODY MARY - VØIDGLiTCH & ØNELY",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/82_BLOODY_MARY_-_VØIDGLiTCH_&_ØNELY.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=RostBo8JJHs",
  },
  {
    id: "83",
    title: "Tart, Andreea Flavia - Stereo Love",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/83_Tart,_Andreea_Flavia_-_Stereo_Love.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=uPkuKVjXjMQ",
  },
  {
    id: "84",
    title: "Poker Face X Vacation Bible School - Ayesha Erotica & Lady Gaga (mashup)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/84_Poker_Face_X_Vacation_Bible_School_-_Ayesha_Erotica_&_Lady_Gaga_(mashup).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=ViLL9KFSqWo",
  },
  {
    id: "85",
    title: "SHAED - Trampoline (Jauz Remix)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/85_SHAED_-_Trampoline_(Jauz_Remix).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=jWNY3EvQQIQ",
  },
  {
    id: "86",
    title: "SAILXNCE - ACTION",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/86_SAILXNCE_-_ACTION.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Jf4lAQqnJqk",
  },
  {
    id: "87",
    title: "OXWAVE - korabli",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/87_OXWAVE_-_korabli.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=GSQ9G1c0518",
  },
  {
    id: "88",
    title: "SORYN - IDLE [hardwave/phonk]",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/88_SORYN_-_IDLE_[hardwave_phonk]_-_Soryn_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=1yaIsIcoeBE",
  },
  {
    id: "89",
    title: "Kxllswxtch - WASTE [PHNK REMIX]",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/89_Kxllswxtch_-_WASTE_[PHNK_REMIX]_-_PHONKmedia東京_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=8DVwzJef6zQ",
  },
  {
    id: "90",
    title: "VØJ, .diedlonely, énoument, GOTHBOY - Last Thought Before Shutdown",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/90_VØJ,_.diedlonely,_énoument,_GOTHBOY_-_Last_Thought_Before_Shutdown_(4K_Official_Music_Video)_-_GOTHBOY_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=vwdA81-7FL0",
  },
  {
    id: "91",
    title: "YEAT - Percz",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/91_YEAT_-_Percz_(prod._SKY)_-_SKY_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Hn3Mv_MnFwM",
  },
  {
    id: "92",
    title: "studio killers - jenny (slowed + reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/92_studio_killers_-_jenny_(slowed_+_reverb)_-_vierra_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=UG7vrHP0FTs",
  },
  {
    id: "93",
    title: "Devi McCallion - I WANT THINGS TO BE BEAUTIFUL",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/93_Devi_McCallion_-_I_WANT_THINGS_TO_BE_BEAUTIFUL_-_Devi_McCallion_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=kOcnj-0lzeA",
  },
  {
    id: "94",
    title: "All Aboard - Yelawolf",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/94_All_Aboard_-_Yelawolf_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=eNnaveslbCM",
  },
  {
    id: "95",
    title: "SAKUREYE - IN YOUR EYES / Extended",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/95_SAKUREYE_-_IN_YOUR_EYES___Extended_-_S.P_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=sVcNLxgOuNw",
  },
  {
    id: "96",
    title: "Popstar (Yokimo Remix)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/96_Popstar_(Yokimo_Remix)_-_Kill_Eva_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=uiqU-vC2ymI",
  },
  {
    id: "97",
    title: "Dirty - Hit Da Floe",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/97_Dirty_-_Hit_Da_Floe_-_DirtyVEVO_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=dnToxeBgwC8",
  },
  {
    id: "98",
    title: "I'm Miles Morales - lovin",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/98_I'm_Miles_Morales_-_lovin_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=mplYB2YHZW0",
  },
  {
    id: "99",
    title: "Purity Ring - Belispeak - Purity Ring",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/99_Purity_Ring_-_Belispeak_-_Purity_Ring_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=wVcOwVD4V30",
  },
  {
    id: "100",
    title: "the craft (portishead glory box ) scorn remix 1994",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/100_the_craft_(portishead_glory_box_)_scorn_remix_1994_-_musique_cinema_et_série_télévisée_(youtube).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=F_J2VKumPfw",
  },
  {
    id: "101",
    title: "KAIZXKU - Under my skin",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/101_KAIZXKU_-_Under_my_skin.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=HOW4yx3vWZA",
  },
  {
    id: "102",
    title: "MARINA - Bubblegum Bitch",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/102_Bubblegum_Bitch_(Hardtekk).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=NSYPVIiDN8k",
  },
  {
    id: "103",
    title: "Secret Society - Neoperreo (feat. ALIC3E)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/103_Secret_Society_-_Neoperreo_(feat._ALIC3E).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=IZ_VJPMI7T4",
  },
  {
    id: "104",
    title: "Aura (Ultra Slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/104_Aura_(Ultra_Slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=hdaVOtPuKCQ",
  },
  {
    id: "105",
    title: "adore - dancing while the world burns",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/105_adore_-_dancing_while_the_world_burns.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=Fn06M50rp94",
  },
  {
    id: "106",
    title: "GRIM LIGHT (Hardtekk)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/106_GRIM_LIGHT_(Hardtekk).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=inyYv3ds614",
  },
  {
    id: "107",
    title: "TWENTYTHREE - MAKE IT HURT",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/107_TWENTYTHREE_-_MAKE_IT_HURT.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=DzAk5HJqHdo",
  },
  {
    id: "108",
    title: "RECREATE",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/108_RECREATE.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=WVMj-6pRsZk",
  },
  {
    id: "109",
    title: "Ravyn Lenae - Love Me Not best part ultra slowed (Edit by Uhar)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/109_Ravyn_Lenae_-_Love_Me_Not_best_part_ultra_slowed_(Edit_by_Uhar).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=khrbemDZJp0",
  },
  {
    id: "110",
    title: "prodarvee - It Can't Come Quickly Enough Hardstyle",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/110_prodarvee_-_It_Can't_Come_Quickly_Enough_Hardtekk.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=M9zgFsiuhUA",
  },
  {
    id: "111",
    title: "specialsadism hardstyle remix (slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/111_specialsadism_hardstyle_remix_(slowed).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=R3dYUhEzveg",
  },
  {
    id: "112",
    title: "OSTBLOCK 3 (SUPER SLOWED + BEST PART) - REKUUDOTEKK",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/112_OSTBLOCK_3_(SUPER_SLOWED__BEST_PART)_-_REKUUDOTEKK.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=vwCi6xZbn_A",
  },
  {
    id: "113",
    title: "VLNCRSH - No Way Out",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/113_VLNCRSH_-_No_Way_Out.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=QTpNb921z0Y",
  },
  {
    id: "114",
    title: "Neoperreo - Secret Society ft. ALIC3E (Slowed + Reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/114_Neoperreo_-_Secret_Society_ft._ALIC3E_(Slowed__Reverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=7uOgzC8Wic4",
  },
  {
    id: "115",
    title: "Nightcall ft. Dreamhour - Dead V (Official Lyric Video)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/115_Nightcall_ft._Dreamhour_-_Dead_V_(Official_Lyric_Video).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=9cH7beQVfkY",
  },
  {
    id: "116",
    title: "wiv - i love u. (sped up + reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/116_wiv_-_i_love_u._(sped_up__reverb).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=QU3Ax-xRJ-k",
  },
  {
    id: "117",
    title: "Hot N Cold (hardstyle remix + SUPER SLOWED)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/117_Hot_N_Cold_(hardstyle_remix__SUPER_SLOWED).m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=4pGkU32ia-k",
  },
  {
    id: "118",
    title: 'HOT FREAKS - "FOR NOTHING"',
    score: "NR",
    audioSrc: "https://audio.vostok.guide/118_HOT_FREAKS_-_FOR_NOTHING_(Official_Lyric_Video).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=MaSYFeLWDMM",
  },
  {
    id: "119",
    title: "Memories",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/119_Memories.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=57pw5VZ1seo",
  },
  {
    id: "120",
    title: "QMIIR, NUEKI - TAKA TITI",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/120_QMIIR,_NUEKI_-_TAKA_TITI.m4a",
    youtubeUrl: "https://www.youtube.com/watch?v=pPGlJ_uVC3A",
  },
  {
    id: "121",
    title: "twilight",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/121_twilight.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=oTiSJOgRdiE",
  },
  {
    id: "122",
    title: "only time",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/122_only_time.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=tm7M7ZhrHTY",
  },
  {
    id: "123",
    title: "i dont want your help",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/123_i_dont_want_your_help.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=4AjjUHFQvpI",
  },
  {
    id: "124",
    title: "Dominic Fike - Babydoll",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/124_Dominic_Fike_-_Babydoll_(Lyrics).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=pTmwTQrY3Ts",
  },
  {
    id: "125",
    title: "overtonight - spiral song",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/125_overtonight_-_spiral_song_(official_audio).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=-LJTTqsFT_c",
  },
  {
    id: "126",
    title: "iwonnit",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/126_iwonnit.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=TlQDimBgrNM",
  },
  {
    id: "127",
    title: "unhappy (slowed)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/127_unhappy_(slowed).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=Ixu_r8wqGo4",
  },
  {
    id: "128",
    title: "I can't deny",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/128_I_can't_deny.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=Xib2R3BfBk8",
  },
  {
    id: "129",
    title: "STATUS",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/129_STATUS.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=7hDD4fkgkys",
  },
  {
    id: "130",
    title: "Trap Life (feat. Ballout)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/130_Trap_Life_(feat._Ballout).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=14Tg__NOhzs",
  },
  {
    id: "131",
    title: "Arcade",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/131_Arcade.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=CzKGdTwFOAw",
  },
  {
    id: "132",
    title: "Love Potions X poster boy - 2hollis & bjlips (mashup)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/132_Love_Potions_X_poster_boy_-_2hollis_&_bjlips_(mashup).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=zwh6QC7czY4",
  },
  {
    id: "133",
    title: "Illusionary Daytime x 室内系 TrackMaker",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/133_Illusionary_Daytime_x_室内系_TrackMaker_[Extended_Edit_Version].mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=8KI21GoNiuI",
  },
  {
    id: "134",
    title: "NUMBER HARDTEKK (SUPER SLOWED)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/134_NUMBER_HARDTEKK_(SUPER_SLOWED).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=Ur5zd0NQcQY",
  },
  {
    id: "135",
    title: "Trust Nobody",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/135_Trust_Nobody.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=PNacEI0YMKw",
  },
  {
    id: "136",
    title: "away",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/136_away.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=g2JGZqtE9L0",
  },
  {
    id: "137",
    title: "Ap0LloN - Schachter (Slowed - Best Part)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/137_Ap0LloN_-_Schachter_(Slowed_-_Best_Part).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=TarauRp21Ys",
  },
  {
    id: "138",
    title: "MY JEALOUSY HARDTEKK",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/138_MY_JEALOUSY_HARDTEKK.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=spUoOM3vx8I",
  },
  {
    id: "139",
    title: "i have no friends",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/139_i_have_no_friends.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=1ESns2NaTUs",
  },
  {
    id: "140",
    title: "Don't Lose",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/140_Dont_Lose.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=u19WEbBdIhg",
  },
  {
    id: "141",
    title: "Illusionary Daytime x Trackmaker",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/141_Illusionary_Daytime_x_Trackmaker.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=M69BCLR0vSc",
  },
  {
    id: "142",
    title: "Катюха",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/142_Катюха.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=kKwYKbkUwEw",
  },
  {
    id: "143",
    title: "I'm Good (Blue) x Stereo Love (slowed + reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/143_I'm_Good_(Blue)_x_Stereo_Love_(slowed__reverb).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=XyLAyF3-0Hw",
  },
  {
    id: "144",
    title: "Sukuna In Shibuya X Glorilla - Yeah Glo (Guitar Remix)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/144_Sukuna_In_Shibuya_X_Glorilla_-_Yeah_Glo_(Guitar_Remix).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=R57uahpX58Y",
  },
  {
    id: "145",
    title: "twentythree - Bite Me",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/145_Twentythree_-_Bite_Me.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=ivKW1x7sXWA",
  },
  {
    id: "146",
    title: "I just banged a snus in canada water",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/146_I_just_banged_a_snus_in_canada_water.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=sM2phJAmGWM",
  },
  {
    id: "148",
    title: "MY JEALOUSY ULTRA SLOWED + LOW HONOR",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/148_MY_JEALOUSY_ULTRA_SLOWED__LOW_HONOR.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=CcfzeOMCV9M",
  },
  {
    id: "149",
    title: "On The Floor x I Wanna Go",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/149_On_The_Floor_x_I_Wanna_Go.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=9gnpNLVR6tI",
  },
  {
    id: "150",
    title: "Queen St (Slowed + Reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/150_Queen_St_(Slowed__Reverb).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=WVsD1pzbuRA",
  },
  {
    id: "151",
    title: "SMS",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/151_SMS.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=Eh4saGURXP4",
  },
  {
    id: "151b",
    title: "Playboi Carti - Long Time (Sanikwave Remix) (slowed and reverb)",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/151_Playboi_Carti_-_Long_Time_(Sanikwave_Remix)_(slowed_and_reverb).mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=l5HTnQyXYu4",
  },
  {
    id: "152",
    title: "fake ur face",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/152_fake_ur_face.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=osgNqtGdOqE",
  },
  {
    id: "153",
    title: "FOR LYFE",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/153_FOR_LYFE.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=2VzSPoma6tk",
  },
  {
    id: "156",
    title: "Kenny Carter - Don't Care",
    score: "NR",
    audioSrc: "https://audio.vostok.guide/156_kenny_carter_dont_care.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=K4klwq9bJjQ&list=RDK4klwq9bJjQ",
  },
];

const FEATURED_FLASH: Record<string, Omit<SongFlash, "key">> = {
  "01":  { color: "#cc0022", text: "ЛЮБОВНОЕ ЗЕЛЬЕ",  subText: "SIGNAL INCOMING · LOVE POTION" },
  "02":  { color: "#7700cc", text: "規格外",           subText: "11/10 · LIMIT EXCEEDED" },
  "03":  { color: "#dd0055", text: "エクスタシー",     subText: "ECSTASY OVERRIDE DETECTED" },
  "06":  { color: "#5500bb", text: "РОМАНС ПЛАНЕТА",  subText: "STAKILLAZ INCOMING" },
  "08":  { color: "#0022cc", text: "嫉妬",             subText: "MY JEALOUSY · SLOWED PROTOCOL" },
  "15":  { color: "#aa0044", text: "사랑의 마법",      subText: "LOVE POTIONS × MY JEALOUSY" },
  "17":  { color: "#990099", text: "愛のポーション",   subText: "PAPARAZZI SIGNAL ONLINE" },
  "22":  { color: "#003399", text: "ТЕНСА",           subText: "УЛЬТРА ЗАМЕДЛЕНИЕ · LOCKED" },
  "25&": { color: "#cc5500", text: "高い習慣",         subText: "STAY HIGH × STEREO LOVE" },
  "45":  { color: "#2a0044", text: "УМБАСА · НЕРО",  subText: "NERO · SUPER SLOWED" },
  "64":  { color: "#bb0066", text: "뉴진스 리믹스",   subText: "MITA EDIT · JERSEY DETECTED" },
  "67":  { color: "#440099", text: "クラリティ",       subText: "HARDSTYLE · AGARTHA EDIT" },
  "82":  { color: "#880000", text: "КРОВАВАЯ МЭРИ",  subText: "VOIDGLITCH × ØNELY SIGNAL" },
  "84":  { color: "#bb0077", text: "포커 페이스",      subText: "VACATION BIBLE SCHOOL MASHUP" },
  "90":  { color: "#00001e", text: "최후의 신호",      subText: "LAST THOUGHT BEFORE SHUTDOWN" },
  "99":  { color: "#002222", text: "ピュリティ·リング", subText: "BELISPEAK · LOADING" },
  "100": { color: "#0d0000", text: "THE CRAFT",       subText: "PORTISHEAD · SCORN 1994" },
  "102": { color: "#cc0055", text: "バブルガム",       subText: "BUBBLEGUM BITCH · HARDTEKK" },
  "106": { color: "#1a0000", text: "МРАЧНЫЙ СВЕТ",   subText: "GRIM LIGHT · HARDTEKK ONLINE" },
  "120": { color: "#001a00", text: "タカ·ティティ",   subText: "QMIIR × NUEKI · SIGNAL" },
};

const PLAYABLE_TRACKS = TRACKS.filter((track): track is Track & { audioSrc: string } =>
  Boolean(track.audioSrc)
);
const MISSING_TRACKS = TRACKS.filter((track) => !track.audioSrc);
const DJ_STINGERS = [
  "/audio/dj/lady/01.m4a",
  "/audio/dj/lady/02.m4a",
  "/audio/dj/lady/04.m4a",
  "/audio/dj/lady/05.m4a",
  "/audio/dj/lady/06.m4a",
  "/audio/dj/lady/07.m4a",
  "/audio/dj/lady/08.m4a",
  "/audio/dj/lady/09.m4a",
  "/audio/dj/lady/10.m4a",
  "/audio/dj/lady/11.m4a",
  "/audio/dj/lady/12.m4a",
  "/audio/dj/lady/13.m4a",
  "/audio/dj/lady/14.m4a",
  "/audio/dj/lady/15.m4a",
  "/audio/dj/lady/16.m4a",
  "/audio/dj/lady/17.m4a",
  "/audio/dj/lady/18.m4a",
  "/audio/dj/lady/19.m4a",
  "/audio/dj/lady/20.m4a",
  "/audio/dj/lady/21.m4a",
] as const;
const DEFAULT_VOLUME = 1;
const DJ_STINGER_VOLUME_MULTIPLIER = 0.35;
const DJ_STINGER_DELAY_MS = 5000;
const SKIP_LADY_COOLDOWN_MS = 60 * 1000;
const RADIO_AUDIO_RETRY_MS = 3000;
const RADIO_PLAYER_AUTO_CLOSE_MS = 20000;
const RADIO_PLAYER_CLOSE_DURATION_MS = 3000;
const RADIO_PLAYER_ICON_TOGGLE_DURATION_MS = RADIO_PLAYER_CLOSE_DURATION_MS / 2;
const OUTPUT_LIMITER_THRESHOLD_DB = -6;
const OUTPUT_LIMITER_KNEE_DB = 0;
const OUTPUT_LIMITER_RATIO = 20;
const OUTPUT_LIMITER_ATTACK_S = 0.003;
const OUTPUT_LIMITER_RELEASE_S = 0.25;

const RADIO_PLAYLIST_KEY = "te-radio-playlist";
const RADIO_POSITION_KEY = "te-radio-position";

const generateShuffledPlaylist = (): number[] => {
  const indices = Array.from({ length: PLAYABLE_TRACKS.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

const savePlaylistState = (playlist: number[], position: number): void => {
  try {
    localStorage.setItem(RADIO_PLAYLIST_KEY, JSON.stringify(playlist));
    localStorage.setItem(RADIO_POSITION_KEY, String(position));
  } catch {
    // Storage can be unavailable in private or locked-down browser contexts.
  }
};

const loadPlaylistState = (): { playlist: number[]; position: number } => {
  try {
    const rawPlaylist = localStorage.getItem(RADIO_PLAYLIST_KEY);
    const rawPosition = localStorage.getItem(RADIO_POSITION_KEY);
    if (rawPlaylist && rawPosition) {
      const playlist = JSON.parse(rawPlaylist) as number[];
      const position = parseInt(rawPosition, 10);
      if (
        Array.isArray(playlist) &&
        playlist.length === PLAYABLE_TRACKS.length &&
        Number.isFinite(position) &&
        position >= 0 &&
        position < playlist.length
      ) {
        return { playlist, position };
      }
    }
  } catch {
    // Ignore invalid persisted playlist state and rebuild the playlist below.
  }
  const playlist = generateShuffledPlaylist();
  savePlaylistState(playlist, 0);
  return { playlist, position: 0 };
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

const getTrackDisplayTitle = (track: Track) =>
  `${track.id in FEATURED_FLASH ? `* ` : ""}${track.title}${track.audioSrc ? "" : " *"}`;
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
  const sessionSeedRef = useRef<string | null>(null);
  if (sessionSeedRef.current === null) {
    sessionSeedRef.current = getRadioSessionSeed();
  }

  const djStingerRandomRef = useRef<RandomSource | null>(null);
  if (djStingerRandomRef.current === null) {
    djStingerRandomRef.current = createSessionRandom(sessionSeedRef.current, "dj-stinger");
  }

  const playlistRef = useRef<number[] | null>(null);
  const positionRef = useRef<number | null>(null);
  if (playlistRef.current === null) {
    const { playlist, position } = loadPlaylistState();
    playlistRef.current = playlist;
    positionRef.current = position;
  }

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const djStingerAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserMapRef = useRef(new Map<HTMLAudioElement, AnalyserNode>());
  const sourceNodeMapRef = useRef(new Map<HTMLAudioElement, MediaElementAudioSourceNode>());
  const limiterNodeMapRef = useRef(new Map<HTMLAudioElement, DynamicsCompressorNode>());
  const animationFrameRef = useRef<number | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  const visualizerRangesRef = useRef<Array<{ start: number; end: number; weight: number }> | null>(null);
  const visualizerPhaseRef = useRef(0);
  const visualizerFlatFramesRef = useRef(0);
  const hasInteractedRef = useRef(false);
  const shouldAutoplayRef = useRef(false);
  const previousTrackIdRef = useRef<string | null>(null);
  const lastSkipTimeRef = useRef<number>(0);
  const stingerDelayTimeoutRef = useRef<number | null>(null);
  const scrollPlayerTimeoutRef = useRef<number | null>(null);
  const audioRetryTimeoutRef = useRef<number | null>(null);
  const podCollapseTimeoutRef = useRef<number | null>(null);
  const playAttemptRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const visualizerInterruptTimeoutRef = useRef<number | null>(null);
  const songFlashKeyRef = useRef(0);
  const lastFlashedTrackIdRef = useRef<string | null>(null);
  const flashDismissTimeoutRef = useRef<number | null>(null);
  const hasTrackAdvancedRef = useRef(false);
  const isFirstTrackMountRef = useRef(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const playlist = playlistRef.current ?? [];
    const position = positionRef.current ?? 0;
    return playlist[position] ?? 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(VISUALIZER_IDLE_BARS);
  const [isPodCollapsed, setIsPodCollapsed] = useState(true);
  const [podTransitionDurationMs, setPodTransitionDurationMs] = useState(RADIO_PLAYER_CLOSE_DURATION_MS);
  const [isScrollPlayerVisible, setIsScrollPlayerVisible] = useState(false);
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [loadingDotCount, setLoadingDotCount] = useState(1);
  const [songFlash, setSongFlash] = useState<SongFlash | null>(null);
  const sliderId = useId();
  const currentTrack = PLAYABLE_TRACKS[currentTrackIndex] ?? PLAYABLE_TRACKS[0];
  const missingTrackSummary = MISSING_TRACKS.map((track) => `${track.id}*`).join(", ");
  const sliderProgress = duration > 0 ? `${(currentTime / duration) * 100}%` : "0%";
  const loadingLabel = `loading${".".repeat(loadingDotCount)}`;

  const advanceToNext = () => {
    hasTrackAdvancedRef.current = true;
    const playlist = playlistRef.current ?? [];
    const currentPos = positionRef.current ?? 0;
    let nextPos = currentPos + 1;
    let nextPlaylist = playlist;

    if (nextPos >= playlist.length) {
      nextPlaylist = generateShuffledPlaylist();
      playlistRef.current = nextPlaylist;
      nextPos = 0;
    }

    positionRef.current = nextPos;
    savePlaylistState(nextPlaylist, nextPos);
    setCurrentTrackIndex(nextPlaylist[nextPos] ?? 0);
  };

  const goToPrevious = () => {
    hasTrackAdvancedRef.current = true;
    const playlist = playlistRef.current ?? [];
    const currentPos = positionRef.current ?? 0;
    const prevPos = Math.max(0, currentPos - 1);
    positionRef.current = prevPos;
    savePlaylistState(playlist, prevPos);
    setCurrentTrackIndex(playlist[prevPos] ?? 0);
  };

  const clearStingerDelayTimeout = () => {
    if (stingerDelayTimeoutRef.current) {
      window.clearTimeout(stingerDelayTimeoutRef.current);
      stingerDelayTimeoutRef.current = null;
    }
  };

  const clearScrollPlayerTimeout = () => {
    if (scrollPlayerTimeoutRef.current) {
      window.clearTimeout(scrollPlayerTimeoutRef.current);
      scrollPlayerTimeoutRef.current = null;
    }
  };

  const clearAudioRetryTimeout = () => {
    if (audioRetryTimeoutRef.current) {
      window.clearTimeout(audioRetryTimeoutRef.current);
      audioRetryTimeoutRef.current = null;
    }
  };

  const clearPodCollapseTimeout = () => {
    if (podCollapseTimeoutRef.current) {
      window.clearTimeout(podCollapseTimeoutRef.current);
      podCollapseTimeoutRef.current = null;
    }
  };

  const clearVisualizerInterruptTimeout = () => {
    if (visualizerInterruptTimeoutRef.current) {
      window.clearTimeout(visualizerInterruptTimeoutRef.current);
      visualizerInterruptTimeoutRef.current = null;
    }
  };

  const clearFlashDismissTimeout = () => {
    if (flashDismissTimeoutRef.current) {
      window.clearTimeout(flashDismissTimeoutRef.current);
      flashDismissTimeoutRef.current = null;
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

    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = OUTPUT_LIMITER_THRESHOLD_DB;
    limiter.knee.value = OUTPUT_LIMITER_KNEE_DB;
    limiter.ratio.value = OUTPUT_LIMITER_RATIO;
    limiter.attack.value = OUTPUT_LIMITER_ATTACK_S;
    limiter.release.value = OUTPUT_LIMITER_RELEASE_S;

    try {
      const source = context.createMediaElementSource(audio);
      source.connect(limiter);
      limiter.connect(analyser);
      analyser.connect(context.destination);

      analyserMapRef.current.set(audio, analyser);
      sourceNodeMapRef.current.set(audio, source);
      limiterNodeMapRef.current.set(audio, limiter);
    } catch {
      // CORS not configured on audio source — fall back to native playback without visualizer.
      analyser.connect(context.destination);
      analyserMapRef.current.set(audio, analyser);
    }

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

    const analyser = ensureAnalyserForAudio(audio);

    // Resume after ensureAnalyserForAudio, which may have just created the context in suspended state.
    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume().catch(() => undefined);
    }
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

      if (currentAudio.paused || currentAudio.ended) {
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

  const requestAudioPlay = (audio: HTMLAudioElement) => {
    if (!shouldAutoplayRef.current) {
      return;
    }

    setIsTrackLoading(true);
    const playAttempt = playAttemptRef.current + 1;
    playAttemptRef.current = playAttempt;

    void audio.play().then(() => {
      if (playAttempt !== playAttemptRef.current) {
        return;
      }
      setIsPlaying(true);
      if (!audio.paused) {
        setIsTrackLoading(false);
      }
    }).catch(() => {
      if (playAttempt !== playAttemptRef.current) {
        return;
      }
      if (shouldAutoplayRef.current) {
        setIsTrackLoading(true);
        return;
      }
      setIsPlaying(false);
      setIsTrackLoading(false);
    });
  };

  const refreshCurrentSongPlayback = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || !shouldAutoplayRef.current) {
      return;
    }

    if (!audio.paused && audio.readyState >= 3 && audio.currentTime > 0) {
      setIsTrackLoading(false);
      return;
    }

    const currentPlaybackTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    audio.load();

    if (currentPlaybackTime > 0) {
      const restoreTime = () => {
        try {
          audio.currentTime = currentPlaybackTime;
        } catch {
          // Some browsers reject seeking until more metadata is available.
        }
      };

      if (audio.readyState >= 1) {
        restoreTime();
      } else {
        audio.addEventListener("loadedmetadata", restoreTime, { once: true });
      }
    }

    requestAudioPlay(audio);
  };

  useEffect(() => {
    const audio = audioRef.current;
    const djStingerAudio = djStingerAudioRef.current;
    if (!audio) {
      return;
    }

    audio.preload = "auto";
    audio.playsInline = true;
    if (djStingerAudio) {
      djStingerAudio.preload = "auto";
      djStingerAudio.playsInline = true;
    }

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => {
      setDuration(audio.duration || 0);
    };
    const handleLoading = () => {
      if (shouldAutoplayRef.current) {
        setIsTrackLoading(true);
      }
    };
    const handlePlay = () => {
      setIsPlaying(true);
      window.dispatchEvent(new Event("radio:play"));
      if (audio.readyState < 3) {
        setIsTrackLoading(true);
      }
    };
    const handlePlaying = () => {
      setIsPlaying(true);
      setIsTrackLoading(false);
      void startVisualizer();
      if (hasTrackAdvancedRef.current) {
        const flashConfig = FEATURED_FLASH[currentTrack.id];
        if (flashConfig && lastFlashedTrackIdRef.current !== currentTrack.id) {
          lastFlashedTrackIdRef.current = currentTrack.id;
          songFlashKeyRef.current += 1;
          setSongFlash({ ...flashConfig, key: songFlashKeyRef.current });
        }
      }
    };
    const handlePause = () => {
      if (shouldAutoplayRef.current && !audio.ended) {
        stopVisualizer();
        setIsTrackLoading(true);
        return;
      }
      setIsPlaying(false);
      setIsTrackLoading(false);
      stopVisualizer();
    };
    const handleReady = () => {
      if (shouldAutoplayRef.current && !audio.paused) {
        setIsTrackLoading(false);
      }
    };
    const handleError = () => {
      if (shouldAutoplayRef.current) {
        setIsTrackLoading(true);
        return;
      }
      setIsTrackLoading(false);
    };
    const handleEnded = () => {
      stopVisualizer();
      setIsTrackLoading(false);
      clearStingerDelayTimeout();
      if (djStingerAudio) {
        djStingerAudio.pause();
        djStingerAudio.currentTime = 0;
      }
      advanceToNext();
    };

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("loadstart", handleLoading);
    audio.addEventListener("waiting", handleLoading);
    audio.addEventListener("stalled", handleLoading);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("canplay", handleReady);
    audio.addEventListener("canplaythrough", handleReady);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    const tryPlay = () => {
      if (!shouldAutoplayRef.current) {
        return;
      }
      requestAudioPlay(audio);
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
      audio.removeEventListener("loadstart", handleLoading);
      audio.removeEventListener("waiting", handleLoading);
      audio.removeEventListener("stalled", handleLoading);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("canplay", handleReady);
      audio.removeEventListener("canplaythrough", handleReady);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
      window.removeEventListener("pointerdown", unlockPlayback);
      window.removeEventListener("keydown", unlockPlayback);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (djStingerAudioRef.current) {
      djStingerAudioRef.current.volume = volume * DJ_STINGER_VOLUME_MULTIPLIER;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      return;
    }

    if (isFirstTrackMountRef.current) {
      isFirstTrackMountRef.current = false;
      return;
    }

    lastFlashedTrackIdRef.current = null;
    clearAudioRetryTimeout();
    playAttemptRef.current += 1;

    if (!audio.paused && audio.readyState >= 3 && audio.currentTime > 0) {
      setIsTrackLoading(false);
      return;
    }

    setIsTrackLoading(shouldAutoplayRef.current);
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (!shouldAutoplayRef.current) {
      return;
    }

    requestAudioPlay(audio);
  }, [currentTrack]);

  useEffect(() => {
    return () => {
      stopVisualizer();
      clearAudioRetryTimeout();
      clearPodCollapseTimeout();
      clearFlashDismissTimeout();
    };
  }, []);

  useEffect(() => {
    clearFlashDismissTimeout();
    if (!songFlash) {
      return;
    }
    flashDismissTimeoutRef.current = window.setTimeout(() => {
      setSongFlash(null);
      flashDismissTimeoutRef.current = null;
    }, 1800);
    return clearFlashDismissTimeout;
  }, [songFlash]);

  useEffect(() => {
    if (!isTrackLoading) {
      setLoadingDotCount(1);
      return;
    }

    const dotInterval = window.setInterval(() => {
      setLoadingDotCount((current) => (current >= 3 ? 1 : current + 1));
    }, 420);

    return () => window.clearInterval(dotInterval);
  }, [isTrackLoading]);

  useEffect(() => {
    clearAudioRetryTimeout();

    if (!isTrackLoading || !shouldAutoplayRef.current) {
      return;
    }

    const scheduleRetry = () => {
      audioRetryTimeoutRef.current = window.setTimeout(() => {
        audioRetryTimeoutRef.current = null;
        refreshCurrentSongPlayback();

        if (shouldAutoplayRef.current) {
          scheduleRetry();
        }
      }, RADIO_AUDIO_RETRY_MS);
    };

    scheduleRetry();

    return clearAudioRetryTimeout;
  }, [currentTrack, isTrackLoading]);

  useEffect(() => {
    clearPodCollapseTimeout();

    if (isPodCollapsed) {
      return;
    }

    podCollapseTimeoutRef.current = window.setTimeout(() => {
      setPodTransitionDurationMs(RADIO_PLAYER_CLOSE_DURATION_MS);
      setIsPodCollapsed(true);
      podCollapseTimeoutRef.current = null;
    }, RADIO_PLAYER_AUTO_CLOSE_MS);

    return clearPodCollapseTimeout;
  }, [isPodCollapsed]);

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

    clearStingerDelayTimeout();
    djStingerAudio.pause();
    djStingerAudio.currentTime = 0;

    if (Date.now() - lastSkipTimeRef.current < SKIP_LADY_COOLDOWN_MS) {
      return;
    }

    const specialIntroSrc = getSpecialSongIntroSrc(currentTrack);
    const randomStinger =
      DJ_STINGERS[randomInt(djStingerRandomRef.current, DJ_STINGERS.length)] ?? DJ_STINGERS[0];
    const introSrc = specialIntroSrc ?? randomStinger;

    stingerDelayTimeoutRef.current = window.setTimeout(() => {
      stingerDelayTimeoutRef.current = null;
      djStingerAudio.src = introSrc;
      djStingerAudio.load();
      void djStingerAudio.play().catch(() => undefined);
    }, DJ_STINGER_DELAY_MS);
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
      }, RADIO_PLAYER_AUTO_CLOSE_MS);
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
      // Create + resume AudioContext during the user gesture so the browser unlocks it.
      // If created later (in an async audio event), Chrome keeps it suspended and resume() silently fails.
      if (!audioContextRef.current) {
        const Ctor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (Ctor) audioContextRef.current = new Ctor();
      }
      void audioContextRef.current?.resume().catch(() => undefined);
      requestAudioPlay(audio);
      return;
    }

    shouldAutoplayRef.current = false;
    playAttemptRef.current += 1;
    clearAudioRetryTimeout();
    setIsTrackLoading(false);
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
    setIsTrackLoading(true);
    clearStingerDelayTimeout();
    lastSkipTimeRef.current = Date.now();
    if (djStingerAudioRef.current) {
      djStingerAudioRef.current.pause();
      djStingerAudioRef.current.currentTime = 0;
    }
    goToPrevious();
  };

  const handleNextTrack = () => {
    shouldAutoplayRef.current = true;
    setIsTrackLoading(true);
    clearStingerDelayTimeout();
    lastSkipTimeRef.current = Date.now();
    if (djStingerAudioRef.current) {
      djStingerAudioRef.current.pause();
      djStingerAudioRef.current.currentTime = 0;
    }
    advanceToNext();
  };

  return (
    <>
      <audio ref={audioRef} src={currentTrack.audioSrc} preload="auto" crossOrigin="anonymous" />
      <audio ref={djStingerAudioRef} crossOrigin="anonymous" />
      <div
        className={`pointer-events-none fixed inset-x-0 z-[59] flex items-end justify-start pl-3 transition-[bottom] ease-in-out md:inset-x-auto md:right-[8vw] md:justify-start md:pl-0 ${
          isScrollPlayerVisible ? "bottom-[36px] md:bottom-[42px]" : "bottom-0"
        }`}
        style={{ transitionDuration: `${RADIO_PLAYER_CLOSE_DURATION_MS}ms` }}
      >
        <div
          className="pointer-events-auto relative transition-transform ease-in-out"
          style={{
            transform: isPodCollapsed ? "translateY(100%)" : "translateY(0)",
            transitionDuration: `${podTransitionDurationMs}ms`,
          }}
        >
        <button
          type="button"
          onClick={() => {
            setPodTransitionDurationMs(RADIO_PLAYER_ICON_TOGGLE_DURATION_MS);
            setIsPodCollapsed((current) => !current);
          }}
          aria-label={isPodCollapsed ? "Expand radio pod" : "Collapse radio pod"}
          className={`absolute left-1/2 top-0 z-[3] inline-flex h-[46px] w-[46px] -translate-x-1/2 -translate-y-[34px] items-center justify-center rounded-full border-2 border-[#05080f] shadow-[0_8px_18px_rgba(0,0,0,0.28)] transition md:h-[34px] md:w-[34px] md:-translate-y-[26px] ${
            isPodCollapsed
              ? "bg-white text-black hover:bg-white hover:text-black"
              : "bg-[#0b111c] text-white hover:bg-[#101827] hover:text-white"
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 md:h-4 md:w-4"
          >
            {isPodCollapsed ? (
              <path d="m6 15 6-6 6 6" />
            ) : (
              <path d="m6 9 6 6 6-6" />
            )}
          </svg>
        </button>
        <div className="relative flex w-[33vw] min-w-[118px] max-w-[152px] items-center justify-center gap-1 overflow-hidden rounded-t-[45px] border border-black/15 border-b-0 bg-[#eef2ec]/70 px-3 pb-3 pt-2 shadow-[0_10px_28px_rgba(0,0,0,0.12)] md:w-auto md:max-w-none md:gap-1.5 md:px-4 md:pl-[3vw] md:pr-[3vw] md:pt-[1.5vw]">
          <div className="pointer-events-none absolute inset-0">
            <div className="pod-wallpaper-bg absolute inset-0 opacity-70" />
            <div className="absolute inset-0 bg-[#eef2ec]/28" />
          </div>
          <div className="relative z-[1] mt-[2.5vh] flex min-w-0 flex-col items-center px-2 text-center md:mt-0">
            <div className="mb-1 flex items-center gap-2">
              {missingTrackSummary ? (
                <span className="pod-inset-text text-[8px] uppercase tracking-[0.18em] md:text-[9px]">
                  {PLAYABLE_TRACKS.length}/{TRACKS.length} loaded · {missingTrackSummary}
                </span>
              ) : null}
            </div>
            {isTrackLoading ? (
              <span className="pod-inset-text mb-1 animate-pulse text-center text-[8px] uppercase tracking-[0.14em] md:text-[10px]">
                {loadingLabel}
              </span>
            ) : (
              <a
                href={currentTrack.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pod-inset-text mb-1 max-w-[28vw] text-center text-[8px] uppercase tracking-[0.14em] underline decoration-white/40 underline-offset-[0.22em] transition hover:text-white md:max-w-[18vw] md:text-[10px]"
              >
                {getTrackDisplayTitle(currentTrack)}
              </a>
            )}
            <button
              type="button"
              onClick={handleNextTrack}
              aria-label="Next track"
              className="mb-[4vh] mt-[3vh] inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-white/90 bg-white text-black shadow-[inset_0_1px_5px_rgba(0,0,0,0.16),0_5px_12px_rgba(0,0,0,0.32)] transition hover:bg-white md:mb-2 md:mt-0 md:h-[26px] md:w-[26px]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[22px] w-[22px] md:h-[13px] md:w-[13px]"
              >
                <path d="m13 19 7-7-7-7" />
                <path d="m4 19 7-7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => void handleTogglePlayback()}
              aria-label={isPlaying ? "Pause radio" : "Play radio"}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/90 bg-white text-black shadow-[inset_0_1px_5px_rgba(0,0,0,0.16),0_8px_18px_rgba(0,0,0,0.34)] transition hover:scale-[1.02] hover:bg-white md:h-9 md:w-9"
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
        style={{ transitionDuration: `${RADIO_PLAYER_CLOSE_DURATION_MS}ms` }}
      >
        <div className="relative mx-auto flex h-[42px] w-full items-center overflow-hidden px-2 md:h-[48px] md:px-5">
          <div className="pointer-events-none absolute inset-0">
            <div aria-hidden="true" className="pod-wallpaper-bg absolute inset-0 opacity-100" />
            <div className="absolute inset-0 bg-[#f5f7f3]/26" />
          </div>
          <div className="relative min-w-0 w-full">
            <div className="pod-inset-text mb-0.5 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] md:mb-1 md:text-[11px]">
              {isTrackLoading ? (
                <span className="animate-pulse tracking-[0.22em]">{loadingLabel}</span>
              ) : (
                <a
                  href={currentTrack.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate pr-3 underline decoration-white/40 underline-offset-[0.22em] transition hover:text-white"
                >
                  {getTrackDisplayTitle(currentTrack)}
                </a>
              )}
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
