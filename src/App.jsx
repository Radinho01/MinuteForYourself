import { useState } from "react";
import Timer from "./components/Timer";
import Header from "./components/Header";
import Subtitle from "./components/Subtitle";
import "./App.css";

function App() {
  const [audioSettings, setAudioSettings] = useState({
    muted: false,
    volume: 1,
    selectedAudio: "",
  });

  return (
    <>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Header onAudioChange={setAudioSettings} />
        <div className="container">
          <div className="timer-container">
            <Timer audioSettings={audioSettings} />
          </div>
        </div>
        <Subtitle />
      </div>
    </>
  );
}

export default App;
