// Header.jsx
import { useState, useRef, useEffect } from "react";
import { LuAudioLines } from "react-icons/lu";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { audioTracks } from "../../public/audioConstants"; // prilagodi putanju ako treba
import "../App.css";

export default function Header({ onAudioChange }) {
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentTrack, setCurrentTrack] = useState(() => {
    // inicijalno: random iz svih
    const idx = Math.floor(Math.random() * audioTracks.length);
    return audioTracks[idx]?.src ?? "";
  });

  const sliderRef = useRef(null);

  // helper za boju slidera
  const updateSliderColor = (slider, value) => {
    const percentage = value * 100;
    slider.style.background = `linear-gradient(to right, #2bae8b ${percentage}%, #ccc ${percentage}%)`;
  };

  useEffect(() => {
    if (sliderRef.current) updateSliderColor(sliderRef.current, volume);
  }, [volume]);

  // kad se promijeni currentTrack / volume / muted, javi roditelju
  useEffect(() => {
    onAudioChange({
      muted,
      volume,
      selectedAudio: currentTrack,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, muted, volume]);

  // Bira random iz zadanog niza
  const pickRandomFrom = (tracksArray) => {
    if (!tracksArray || tracksArray.length === 0) return "";
    const i = Math.floor(Math.random() * tracksArray.length);
    return tracksArray[i].src;
  };

  // handler kategorije: koristi lokalni filtered (ne oslanjaj se na state odmah)
  const handleCategoryChange = (newCategory) => {
    // napravi localni filtered na temelju odmah dostupnih podataka
    const filtered =
      newCategory === "all"
        ? audioTracks
        : audioTracks.filter((t) => t.category === newCategory);

    const randomTrack = pickRandomFrom(filtered);

    // sad sigurno postavi state i current track
    setSelectedCategory(newCategory);
    setCurrentTrack(randomTrack);
    // onAudioChange se pozvat će iz useEffect-a zbog promjene currentTrack
  };

  return (
    <div
      className="header-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        marginBottom: "20px",
      }}
    >
      <div></div>

      <div>
        <p className="title">
          Take a minute for <b style={{ color: "#2bae8b" }}>YOURSELF</b>
        </p>
      </div>

      <div style={{ position: "relative" }}>
        <LuAudioLines
          size={40}
          title="Audio settings"
          style={{ cursor: "pointer" }}
          color="whitesmoke"
          onClick={() => setShowAudioMenu((p) => !p)}
          className="audio-settings"
        />

        {showAudioMenu && (
          <div
            className="volum-settings-container"
            style={{
              position: "absolute",
              top: "110%",
              right: 0,
              background: "#1e2a38cc",
              padding: "10px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              zIndex: 1000,
              width: "300px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => {
                  const newMuted = !muted;
                  setMuted(newMuted);
                  // onAudioChange će se pozvati iz useEffect-a
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "0",
                  height: "5vh",
                  width: "20%",
                  cursor: "pointer",
                }}
              >
                {muted ? (
                  <FaVolumeMute
                    title="Unmute"
                    size={"70%"}
                    style={{ color: "whitesmoke" }}
                  />
                ) : (
                  <FaVolumeUp
                    title="Mute"
                    size={"70%"}
                    style={{ color: "whitesmoke" }}
                  />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const newVol = parseFloat(e.target.value);
                  setVolume(newVol);
                  handleChange(undefined, newVol, undefined);
                  updateSliderColor(e.target, newVol);
                }}
                ref={sliderRef}
                style={{ width: "80%", "--value": `${volume * 100}%` }}
                className="custom-slider"
              />
            </div>

            <div
              className="filter-container"
              style={{
                display: "flex",
                alignItems: "center",
                height: "6vh",
              }}
            >
              <p
                className="filter-title"
                style={{ color: "whitesmoke", width: "20%", marginLeft: "5%" }}
              >
                Filter:
              </p>

              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                style={{ width: "80%", height: "50%", textAlign: "center" }}
                className="filter-dropdown"
              >
                <option value="all">All</option>
                <option value="rain">Rain</option>
                <option value="ambient">Ambient</option>
                <option value="nature">Nature</option>
                <option value="dreamy">Dreamy</option>
                <option value="wave">Wave</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
