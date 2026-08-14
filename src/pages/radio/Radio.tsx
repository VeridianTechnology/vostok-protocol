import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { usePageMetadata } from "@/lib/pageMetadata";
import { radioTracks, trackSrc } from "./tracks";
import "../landing.css";
import "./radio.css";

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const Radio = () => {
  usePageMetadata({
    title: "Radio Vostok — 181 Tracks Curated by Nyx",
    description: "Radio Vostok is a numbered collection of 181 tracks curated by Nyx.",
    path: "/radio",
  });
  const [trackIndex, setTrackIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tilesRef = useRef<HTMLDivElement | null>(null);
  const scrollDotRef = useRef<HTMLSpanElement | null>(null);
  const scrollRailRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  const track = radioTracks[trackIndex];

  const selectTrack = useCallback(
    (index: number) => {
      const next = ((index % radioTracks.length) + radioTracks.length) % radioTracks.length;
      startedRef.current = true;
      if (next === trackIndex) {
        // same tile — the index effect won't fire, so play directly
        audioRef.current?.play().catch(() => {});
        return;
      }
      setTrackIndex(next);
      setCurrentTime(0);
      setDuration(0);
      setPlaying(true);
    },
    [trackIndex]
  );

  // Advance: in order normally, anywhere-but-here when shuffle is on
  const nextTrack = useCallback(() => {
    if (shuffle && radioTracks.length > 1) {
      let next = trackIndex;
      while (next === trackIndex) next = Math.floor(Math.random() * radioTracks.length);
      selectTrack(next);
    } else {
      selectTrack(trackIndex + 1);
    }
  }, [shuffle, trackIndex, selectTrack]);

  // Load + (auto)play whenever the track changes after first interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !startedRef.current) return;
    audio.load();
    audio.play().catch(() => setPlaying(false));
  }, [trackIndex]);

  // Weighted scroll on the tile pane: wheel input moves a target position and
  // the pane eases toward it each frame, so the list hesitates just slightly
  // instead of snapping. Touch and scrollbar dragging stay fully native.
  useEffect(() => {
    const pane = tilesRef.current;
    if (!pane) return undefined;
    let target = pane.scrollTop;
    let raf = 0;

    const animate = () => {
      const diff = target - pane.scrollTop;
      if (Math.abs(diff) < 0.5) {
        pane.scrollTop = target;
        raf = 0;
        return;
      }
      pane.scrollTop += diff * 0.16;
      raf = requestAnimationFrame(animate);
    };

    const onWheel = (event: WheelEvent) => {
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      const max = pane.scrollHeight - pane.clientHeight;
      const next = Math.max(0, Math.min(max, target + delta));
      // already resting at an edge — hand the wheel back to the page
      if (next === target && (target <= 0 || target >= max)) return;
      event.preventDefault();
      target = next;
      if (!raf) raf = requestAnimationFrame(animate);
    };

    // keep the target honest when the pane scrolls by other means
    const onScroll = () => {
      if (!raf) target = pane.scrollTop;
    };

    pane.addEventListener("wheel", onWheel, { passive: false });
    pane.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      pane.removeEventListener("wheel", onWheel);
      pane.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll-position dot: the native scrollbar is hidden, so a white dot on a
  // hairline rail shows where you are in the list.
  useEffect(() => {
    const pane = tilesRef.current;
    const dot = scrollDotRef.current;
    if (!pane || !dot) return undefined;
    const update = () => {
      const max = pane.scrollHeight - pane.clientHeight;
      const frac = max > 0 ? pane.scrollTop / max : 0;
      dot.style.top = `calc(${(frac * 100).toFixed(3)}% - ${(frac * 14).toFixed(2)}px)`;
    };
    update();
    pane.addEventListener("scroll", update, { passive: true });
    return () => pane.removeEventListener("scroll", update);
  }, []);

  // The rail is a real scrollbar: click to jump, drag the dot to scrub.
  useEffect(() => {
    const pane = tilesRef.current;
    const rail = scrollRailRef.current;
    if (!pane || !rail) return undefined;
    let dragging = false;

    const scrollToPointer = (event: PointerEvent) => {
      const rect = rail.getBoundingClientRect();
      const frac = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      pane.scrollTop = frac * (pane.scrollHeight - pane.clientHeight);
    };
    const onDown = (event: PointerEvent) => {
      dragging = true;
      rail.setPointerCapture(event.pointerId);
      scrollToPointer(event);
      event.preventDefault();
    };
    const onMove = (event: PointerEvent) => {
      if (dragging) scrollToPointer(event);
    };
    const onUp = (event: PointerEvent) => {
      dragging = false;
      try {
        rail.releasePointerCapture(event.pointerId);
      } catch {
        // pointer capture may already be gone
      }
    };

    rail.addEventListener("pointerdown", onDown);
    rail.addEventListener("pointermove", onMove);
    rail.addEventListener("pointerup", onUp);
    rail.addEventListener("pointercancel", onUp);
    return () => {
      rail.removeEventListener("pointerdown", onDown);
      rail.removeEventListener("pointermove", onMove);
      rail.removeEventListener("pointerup", onUp);
      rail.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // Keep the active tile in view inside the tile pane (never scroll the page)
  useEffect(() => {
    const pane = tilesRef.current;
    const active = pane?.querySelector(".vr-tile--active") as HTMLElement | null;
    if (!pane || !active) return;
    const top = active.offsetTop - pane.clientHeight / 2 + active.clientHeight / 2;
    pane.scrollTo({ top, behavior: "smooth" });
  }, [trackIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    startedRef.current = true;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className="vl vr">
      <SiteNav suffix="RADIO" active="Radio" />

      <section className="vl-section vr-head">
        <h1 className="vl-h2">NYX Playlist 25'</h1>
        <p className="vl-lead">
          {radioTracks.length} tracks, numbered and curated by Nyx — the music the protocol is built
          to. Pick a number, press play.
        </p>
      </section>

      <section className="vl-section vr-main">
        <div className="vr-grid">
          {/* Player */}
          <div className="vr-player">
            <span className="vr-player-num">№ {track.id}</span>
            <h2 className="vr-player-title">{track.title}</h2>
            {track.score && <span className="vr-player-score">Nyx rating · {track.score}</span>}
            {track.youtube && (
              <a
                className="vr-player-yt"
                href={track.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                Original on YouTube ↗
              </a>
            )}

            <audio
              ref={audioRef}
              src={trackSrc(track)}
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onEnded={nextTrack}
            />

            <div className="vr-seek">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Seek"
              />
              <span>{formatTime(duration)}</span>
            </div>

            <div className="vr-controls">
              <button className="vr-skip" aria-label="Previous track" onClick={() => selectTrack(trackIndex - 1)}>
                ‹
              </button>
              <button className="vr-play" aria-label={playing ? "Pause" : "Play"} onClick={togglePlay}>
                {playing ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button className="vr-skip" aria-label="Next track" onClick={nextTrack}>
                ›
              </button>
            </div>

            <button
              className={`vr-shuffle${shuffle ? " vr-shuffle--on" : ""}`}
              aria-pressed={shuffle}
              onClick={() => setShuffle((s) => !s)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M16 3h5v5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 20L21 3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 16v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 15l6 6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Shuffle {shuffle ? "on" : "off"}
            </button>

            <p className="vr-player-note">
              {shuffle
                ? "Shuffle is on — the station picks the next track at random."
                : "Tracks play in order — leave it running like a station."}
            </p>
          </div>

          {/* Tile selection */}
          <div className="vr-tiles-wrap">
            <div className="vr-tiles" ref={tilesRef}>
              {radioTracks.map((t, i) => (
                <button
                  key={t.file}
                  className={`vr-tile${i === trackIndex ? " vr-tile--active" : ""}`}
                  onClick={() => selectTrack(i)}
                  aria-label={`Play track ${t.id}: ${t.title}`}
                  title={t.title}
                >
                  <span className="vr-tile-num">{t.id}</span>
                  <span className="vr-tile-title">{t.title}</span>
                </button>
              ))}
            </div>
            <div className="vr-scroll-rail" ref={scrollRailRef} aria-hidden="true">
              <span className="vr-scroll-dot" ref={scrollDotRef} />
            </div>
          </div>
        </div>
      </section>

      {/* The business to be */}
      <section className="vl-dark vl-dark--center vr-soon">
        <div className="vl-dark-bg" style={{ backgroundImage: "url(/obsidian/beacon.webp)" }} aria-hidden="true" />
        <div className="vl-dark-inner">
          <p className="vl-kicker">Coming — Radio Vostok Live</p>
          <h2 className="vl-dark-quote">
            One station. One <em>consciousness.</em>
          </h2>
          <p className="vl-dark-text">
            Radio Vostok will be a subscription radio station — <strong>$1.99 a month</strong> — broadcasting
            around the clock from a select group of songs, chosen the way everything here is chosen:
            ruthlessly. And once a day, the music will stop for the{" "}
            <em>Global Consciousness Hour</em> — a full hour of guided meditation in which everyone
            listening, everywhere on Earth, must meditate together at the same moment.
          </p>
          <p className="vl-dark-text vr-soon-note">
            It doesn't exist yet. This page is the antenna going up. Until the frequency opens, the
            {" " + String(radioTracks.length)} tracks above are free air.
          </p>
        </div>
      </section>

      <footer className="vl-footer vr-footer">
        <Link to="/" className="vr-footer-link">
          ← Back to the Method
        </Link>
        <p className="vl-fineprint">Radio Vostok</p>
      </footer>
    </div>
  );
};

export default Radio;
