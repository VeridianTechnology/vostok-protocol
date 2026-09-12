import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { radioTracks, trackSrc } from "@/pages/radio/tracks";

const formatTime = (time: number) =>
  `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

export default function MiniRadio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantsPlayback = useRef(false);
  const failures = useRef(0);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [lastVolume, setLastVolume] = useState(0.3);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [collapsed, setCollapsed] = useState(
    () => window.matchMedia("(max-width: 800px)").matches,
  );
  const [message, setMessage] = useState("PRESS PLAY TO LISTEN");
  const track = radioTracks[index];

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    wantsPlayback.current = true;
    void audio.play().catch((error: DOMException) => {
      if (error.name === "NotAllowedError") setMessage("PRESS PLAY TO LISTEN");
      else if (error.name !== "AbortError" && failures.current < 3)
        setMessage("TRACK UNAVAILABLE · TRY NEXT");
    });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setTime(0);
    setDuration(0);
    if (wantsPlayback.current) play();
  }, [index, play]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const selectTrack = (direction: number) => {
    failures.current = 0;
    setMessage("LOADING TRACK");
    wantsPlayback.current = true;
    setIndex(
      (current) =>
        (current + direction + radioTracks.length) % radioTracks.length,
    );
  };

  const onError = () => {
    failures.current += 1;
    setPlaying(false);
    if (wantsPlayback.current && failures.current < 3) {
      setMessage("UNAVAILABLE · SKIPPING TRACK");
      setIndex((current) => (current + 1) % radioTracks.length);
    } else {
      wantsPlayback.current = false;
      setMessage("UNAVAILABLE · TRY NEXT TRACK");
    }
  };

  return (
    <aside
      className={`mini-radio ${collapsed ? "is-collapsed" : ""}`}
      aria-label="Radio Vostok music player"
    >
      <audio
        ref={audioRef}
        src={trackSrc(track)}
        preload="metadata"
        onPlaying={() => {
          setPlaying(true);
          setMessage("CURATED BY NYX");
          failures.current = 0;
        }}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) =>
          setDuration(
            Number.isFinite(event.currentTarget.duration)
              ? event.currentTarget.duration
              : 0,
          )
        }
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onEnded={() => selectTrack(1)}
        onError={onError}
      />
      <div className="radio-topline">
        <span
          className={`radio-wave ${playing ? "is-playing" : ""}`}
          aria-hidden="true"
        >
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>RADIO VØSTOK</span>
        <span className="radio-count">
          {String(index + 1).padStart(2, "0")} / {radioTracks.length}
        </span>
        <button
          className="radio-collapse"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={
            collapsed ? "Expand radio player" : "Minimize radio player"
          }
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>
      <div className="radio-main">
        <button
          className="radio-play"
          aria-label={playing ? "Pause radio" : "Play radio"}
          onClick={() => {
            if (audioRef.current?.paused) play();
            else {
              wantsPlayback.current = false;
              audioRef.current?.pause();
            }
          }}
        >
          {playing ? (
            <Pause size={15} fill="currentColor" />
          ) : (
            <Play size={15} fill="currentColor" />
          )}
        </button>
        <div className="radio-track">
          <span title={track.title}>{track.title}</span>
          <small aria-live="polite">{message}</small>
        </div>
        <div className="radio-skip">
          <button onClick={() => selectTrack(-1)} aria-label="Previous song">
            <SkipBack size={13} />
          </button>
          <button onClick={() => selectTrack(1)} aria-label="Next song">
            <SkipForward size={13} />
          </button>
        </div>
      </div>
      <div className="radio-expanded">
        {!collapsed && (
          <div className="radio-seek">
            <input
              type="range"
              min="0"
              max={duration || 1}
              step="0.1"
              value={Math.min(time, duration || 1)}
              disabled={!duration}
              aria-label="Song position"
              onChange={(event) => {
                const next = Number(event.target.value);
                if (audioRef.current) audioRef.current.currentTime = next;
                setTime(next);
              }}
            />
            <span>
              {formatTime(time)} / {formatTime(duration)}
            </span>
          </div>
        )}
        <div className="radio-volume">
          <button
            aria-label={volume === 0 ? "Unmute radio" : "Mute radio"}
            onClick={() => {
              if (volume > 0) {
                setLastVolume(volume);
                setVolume(0);
              } else setVolume(lastVolume || 0.3);
            }}
          >
            {volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(volume * 100)}
            aria-label="Radio volume"
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
          />
          <span>{Math.round(volume * 100)}%</span>
          <span className="radio-stereo">STEREO</span>
        </div>
      </div>
    </aside>
  );
}
