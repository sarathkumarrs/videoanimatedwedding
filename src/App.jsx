import { useEffect, useMemo, useRef, useState } from "react";

const COUPLE = {
  first: "Sarath Kumar",
  second: "Dr. Priya Raj",
};

const WEDDING_DATE = "March 15, 2026";

export default function App() {
  const [scene, setScene] = useState("intro");
  const [showDetails, setShowDetails] = useState(false);
  const introVideoRef = useRef(null);
  const audioRef = useRef(null);

  const petals = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        size: `${10 + Math.random() * 16}px`,
        delay: `${Math.random() * 4}s`,
        duration: `${6 + Math.random() * 6}s`,
        drift: `${-80 + Math.random() * 160}px`,
      })),
    []
  );

  useEffect(() => {
    const video = introVideoRef.current;
    if (!video) return;

    const goNext = () => setScene("wedding");
    video.addEventListener("ended", goNext);

    const fallback = setTimeout(goNext, 12000);
    return () => {
      video.removeEventListener("ended", goNext);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;

    const tryPlay = () => {
      audio.play().catch(() => {});
    };

    tryPlay();
    audio.addEventListener("canplay", tryPlay);
    window.addEventListener("pointerdown", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });
    window.addEventListener("focus", tryPlay);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tryPlay();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      audio.removeEventListener("canplay", tryPlay);
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
      window.removeEventListener("focus", tryPlay);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className="app-shell">
      <audio ref={audioRef} src="/music/bg.mp3" autoPlay loop preload="auto" />

      {scene === "intro" ? (
        <section className="scene">
          <video
            ref={introVideoRef}
            src="/videos/intro.mp4"
            autoPlay
            muted
            playsInline
            className="bg-video"
            preload="auto"
          />
          <div className="overlay intro-overlay" />
          <div className="petal-layer">
            {petals.map((petal) => (
              <span
                key={petal.id}
                className="petal"
                style={{
                  left: petal.left,
                  width: petal.size,
                  height: petal.size,
                  animationDelay: petal.delay,
                  animationDuration: petal.duration,
                  "--drift": petal.drift,
                }}
              />
            ))}
          </div>
          <div className="hero-text">
            <p className="kicker">A new chapter is about to begin</p>
            <h1>Wedding Bells Are Ringing</h1>
            <p className="subline">Stay with us for a special announcement.</p>
          </div>
        </section>
      ) : (
        <section className="scene">
          <video
            src="/videos/cherry.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="bg-video"
            preload="auto"
          />
          <div className="overlay wedding-overlay" />
          <div className="invite-card">
            <p className="kicker">Wedding Invitation</p>
            <h1>
              <span className="name-line">{COUPLE.first}</span>
              <span className="ampersand">&amp;</span>
              <span className="name-line">{COUPLE.second}</span>
            </h1>
            <p className="date-line">Are getting married on {WEDDING_DATE}</p>
            <button
              className="reveal-btn"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? "Hide Details" : "Reveal Celebration Note"}
            </button>
            {showDetails && (
              <div className="details">
                <p>
                  With love and blessings, our families invite you to celebrate
                  our big day.
                </p>
                <p>Save the date: March 15, 2026</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
