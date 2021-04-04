/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import animation from "../assets/basic-dropdown.json";
import React, { useState, useRef, useEffect } from "react";

function DropDownButton({ show }) {
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
        animationData={animation}
        autoplay={false}
        loop={false}
        initialSegment={activeSegments}
        lottieRef={player}
      />
    </div>
  );
}

export default DropDownButton;
