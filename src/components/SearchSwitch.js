/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import animationLight from "../assets/toggle-view-light.json";
import animationDark from "../assets/toggle-view-dark.json";
import React, { useState, useRef } from "react";

const colors = {
  light: {
    text: "black",
    enabledBackground: "rgba(150, 208, 211, 0.3)",
  },
  dark: {
    text: "white",
    enabledBackground: "rgba(150, 208, 211, 0.3)",
  },
};

function ModeSwitch({ view, mode, handleViewChange }) {
  const player = useRef();
  const activeSegments = view == "tv" ? [0, 34] : [34, 68];
  const styles = {
    lottieWrapper: css({
      width: "100px",
      cursor: "pointer",
      transform: "rotate(-90deg)",
      width: "34px",
    }),
    wrapper: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }),
    box: css({
      cursor: "pointer",
      display: "flex",
      textAlign: "center",
      borderStyle: "solid",
      borderColor: colors[mode]["enabledBackground"],
      padding: "4px 15px",
      borderRadius: "10px",
      color: colors[mode]["text"],
    }),
    enabled: css({
      backgroundColor: colors[mode]["enabledBackground"],
    }),
    textBox: css({
      marginLeft: "7px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "13px",
    }),
  };
  const tvImage =
    mode === "light" ? "/switch-tv-light.png" : "/switch-tv-dark.png";

  const handleClick = () => {
    player.current.setSpeed(1.7);
    if (view === "movie") {
      player.current.setDirection(1);
      player.current.play();
      setTimeout(() => {
        // setView("tv");
        handleViewChange();
      }, 300);
    }
    if (view === "tv") {
      player.current.setDirection(1);
      player.current.play();
      setTimeout(() => {
        // setView("movie");
        handleViewChange();
      }, 300);
    }
  };

  const handleTVClick = () => {
    if (view == "movie") {
      handleClick();
    }
  };

  const handleMovieClick = () => {
    if (view == "tv") {
      handleClick();
    }
  };

  return (
    <div css={styles.wrapper}>
      <div
        css={view == "tv" ? [styles.enabled, styles.box] : styles.box}
        onClick={handleTVClick}
      >
        <div>
          <img src={tvImage} alt="TV Switch" width="35px" />
        </div>
        <div css={styles.textBox}>
          <div>Search</div>
          <div>TV</div>
        </div>
      </div>
      <div css={styles.lottieWrapper} onClick={handleClick}>
        <Lottie
          animationData={mode == "light" ? animationLight : animationDark}
          autoplay={false}
          loop={false}
          initialSegment={activeSegments}
          lottieRef={player}
        />
      </div>
      <div
        css={view == "movie" ? [styles.enabled, styles.box] : styles.box}
        onClick={handleMovieClick}
      >
        <div>
          <img src="/switch-movie.png" alt="Movie Switch" width="35px" />
        </div>
        <div css={styles.textBox}>
          <div>Search</div>
          <div>Movie</div>
        </div>
      </div>
    </div>
  );
}

export default ModeSwitch;
