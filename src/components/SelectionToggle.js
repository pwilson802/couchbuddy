/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
// import animation from "../assets/24-toggle-switch.json";
import animation from "../assets/toggle-selection.json";
import React, { useState, useRef, useEffect } from "react";

const colors = {
  light: {
    opacitiy: 1,
  },
  dark: {
    opacity: 0.6,
  },
};

function SelectionToggle({ enabled, handleSwitch, mode, selection, refine }) {
  const player = useRef();
  const styles = {
    wrapper: css({
      display: "flex",
      color: colors[mode]["text"],
      alignItems: "center",
      cursor: "pointer",
    }),
    lottieWrapper: css({
      opacity: colors[mode]["opacity"],
      width: "52px",
    }),
    text: css({
      color: colors[mode]["text"],
      marginLeft: "10px",
    }),
  };

  useEffect(() => {
    if (refine && enabled) {
      player.current.setSpeed(3);
      player.current.play();
    }
  }, [refine]);

  const handleClick = () => {
    player.current.setSpeed(1);
    player.current.setDirection(enabled ? -1 : 1);
    player.current.play();
    if (!enabled) {
      handleSwitch(true);
    } else {
      handleSwitch(false);
    }
  };
  return (
    <div css={styles.wrapper} onClick={handleClick}>
      <div css={styles.lottieWrapper}>
        <Lottie
          animationData={animation}
          autoplay={false}
          loop={false}
          lottieRef={player}
        />
      </div>{" "}
      <span css={styles.text}>{selection}</span>
    </div>
  );
}

export default SelectionToggle;
