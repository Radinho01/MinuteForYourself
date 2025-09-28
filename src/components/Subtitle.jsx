import React, { useState, useEffect } from "react";
import { subtitleArray } from "../assets/constants/constants";

export default function Subtitle() {
  const [subtitle, setSubtitle] = useState("");
  const [fadeClass, setFadeClass] = useState("fade-in");

  useEffect(() => {
    const changeSubtitle = () => {
      setFadeClass("fade-out");

      setTimeout(() => {
        const randomSubtitle =
          subtitleArray[Math.floor(Math.random() * subtitleArray.length)];
        setSubtitle(randomSubtitle);
        setFadeClass("fade-in");
      }, 500);
    };

    changeSubtitle();
    const interval = setInterval(changeSubtitle, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p className={`subtitle ${fadeClass}`}>{subtitle}</p>
    </div>
  );
}
