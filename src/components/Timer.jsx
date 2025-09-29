import { useState, useRef, useEffect } from "react";

export default function Timer({ audioSettings }) {
  const { muted, volume, selectedAudio } = audioSettings;

  const duration = 60;
  const refillDuration = 1.2;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);
  const [dashOffset, setDashOffset] = useState(0);

  const rafRef = useRef(null);
  const runStartRef = useRef(0);
  const refillStartRef = useRef(0);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    if (!isRunning && !isRefilling) return;

    const tick = () => {
      const now = Date.now();

      if (isRunning) {
        const elapsed = (now - runStartRef.current) / 1000;
        const remaining = Math.max(duration - elapsed, 0);
        setTimeLeft(remaining);

        setDashOffset(circumference * (1 - remaining / duration));

        if (audioRef.current) {
          audioRef.current.volume = muted
            ? 0
            : remaining <= 2
            ? (remaining / 2) * volume
            : volume;
        }

        if (remaining <= 0) {
          setIsRunning(false);
          setIsRefilling(true);
          refillStartRef.current = Date.now();
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.volume = volume;
          }
        }
      } else if (isRefilling) {
        const elapsedRef = (now - refillStartRef.current) / 1000;
        const p = Math.min(elapsedRef / refillDuration, 1);
        setDashOffset(circumference * (1 - p));
        if (p >= 1) {
          setIsRefilling(false);
          setTimeLeft(duration);
          setDashOffset(0);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [isRunning, isRefilling, muted, volume]);

  const handleStart = async () => {
    setTimeLeft(duration);
    setIsRefilling(false);
    setIsRunning(true);
    runStartRef.current = Date.now();
    setDashOffset(0);

    if (audioRef.current) {
      audioRef.current.src = selectedAudio;
      try {
        await audioRef.current.play();
      } catch (err) {
        console.log("Audio play failed:", err);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "relative",
      }}
    >
      <div
        className="timer-container"
        style={{ position: "relative", width: 220, height: 220 }}
      >
        <svg width="220" height="220" viewBox="0 0 220 220">
          <g transform="rotate(90 110 110) scale(-1,1) translate(-220,0)">
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="whitesmoke"
              strokeWidth="20"
              fill="none"
            />
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="#2bae8b"
              strokeWidth="20"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className={isRunning ? "pulse-ring" : ""}
            />
          </g>
        </svg>

        <audio ref={audioRef} loop />

        {!isRunning && !isRefilling && (
          <button
            onClick={handleStart}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "10px 20px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "transparent",
              color: "white",
              cursor: "pointer",
              fontSize: "40px",
              fontFamily: "Inknut Antiqua",
            }}
            className="start"
          >
            Start
          </button>
        )}

        {(isRunning || isRefilling) && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "whitesmoke",
              fontSize: "40px",
              fontWeight: "bold",
              fontFamily: "Inknut Antiqua",
            }}
            className="seconds"
          >
            {Math.ceil(timeLeft)}s
          </div>
        )}
      </div>
    </div>
  );
}
