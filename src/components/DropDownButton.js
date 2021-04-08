/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import animationLight from "../assets/basic-dropdown.json";
import animationDarkGenres from "../assets/basic-dropdown-genres-dark.json";
import animationDarkProviders from "../assets/basic-dropdown-providers-dark.json";
import React, { useState, useRef, useEffect } from "react";

function DropDownButton({ show, menu, mode }) {
  const [prevShow, setPrevShow] = useState(show);
  const player = useRef();
  const activeSegments = prevShow ? [55, 115] : [0, 55];
  const styles = {
    wrapper: css({
      width: "40px",
    }),
  };

  useEffect(() => {
    if (show != prevShow) {
      player.current.setSpeed(1.5);
      player.current.setDirection(1);
      player.current.play();
      setTimeout(() => {
        setPrevShow(show);
      }, 400);
    }
  }, [show]);

  console.log(activeSegments);

  return (
    <div css={styles.wrapper}>
      <Lottie
        animationData={
          mode === "light"
            ? animationLight
            : menu === "genres"
            ? animationDarkGenres
            : animationDarkProviders
        }
        autoplay={false}
        loop={false}
        initialSegment={activeSegments}
        lottieRef={player}
      />
    </div>
  );
}

export default DropDownButton;
