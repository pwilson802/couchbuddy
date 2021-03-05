/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import darkMode from "../assets/darkmode.json";
import React, { useState, useRef, useEffect } from "react";

function ModeSwitch({ mode, changeMode }) {
  const [isOpen, setIsOpen] = useState();
  const player = useRef();
  const activeSegments = mode == "dark" ? [240, 481] : [0, 240];
  const styles = {
    wrapper: css({
      width: "45%",
    }),
    "@media(min-width: 500px)": {
      width: "40%",
    },
    "@media(min-width: 700px)": {
      width: "40%",
    },
  };

  const handleClick = () => {
    player.current.setSpeed(1.7);
    if (mode === "light") {
      player.current.setDirection(1);
      player.current.play();
      setTimeout(() => {
        changeMode("dark");
      }, 1700);
    }
    if (mode === "dark") {
      player.current.setDirection(1);
      player.current.play();
      setTimeout(() => {
        changeMode("light");
      }, 1700);
    }
  };

  return (
    <div css={styles.wrapper} onClick={handleClick}>
      <Lottie
        animationData={darkMode}
        autoplay={false}
        loop={false}
        initialSegment={activeSegments}
        lottieRef={player}
      />
    </div>
  );
}

export default ModeSwitch;
