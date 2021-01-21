/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "#FEF4E1",
  },
};

function Duration({ duration, handleDuration, mode }) {
  const styles = {
    durationText: css({
      textAlign: "center",
      marginTop: 10,
      fontSize: 16,
      color: colors[mode]["text"],
    }),
    sliderWrapper: css({
      margin: "0 25%",
    }),
  };

  return (
    <div>
      <p css={styles.durationText}>{duration} minutes</p>
      <div css={styles.sliderWrapper}>
        <Slider
          min={0}
          max={400}
          step={1}
          value={duration}
          onChange={(item) => handleDuration(item)}
          railStyle={{ backgroundColor: "rgba(241,136,143,.5)", height: 10 }}
          trackStyle={{ backgroundColor: "#F1888F", height: 10 }}
          handleStyle={{
            borderColor: "#E12C86",
            height: 28,
            width: 28,
            marginLeft: -14,
            marginTop: -9,
            backgroundColor: "#E12C86",
          }}
        />
      </div>
    </div>
  );
}

export default Duration;
