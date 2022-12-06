/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    // text: "#FEF4E1",
    text: "white",
  },
};

function DateRangeSlider({ dateRange, handleDateRange, mode, dynamicKey }) {
  const styles = {
    durationText: css({
      textAlign: "center",
      marginTop: 10,
      fontSize: 16,
      color: colors[mode]["text"],
      marginBottom: "-30px",
      zIndex: "9999"
    }),
    sliderWrapper: css({
      margin: "0 25%",
    }),
  };

  return (
    <div>
      <p css={styles.durationText}>{dateRange[0]} - {dateRange[1]}</p>
      <div>
        <Range
          key={dynamicKey}
          min={1950}
          max={2030}
          allowCross={false}
          value={dateRange}
          onChange={(item) => handleDateRange(item)}
          railStyle={{ backgroundColor: "rgba(253,215,130,.00)", height: 60 }}
          trackStyle={[{ backgroundColor: "rgba(225, 44, 134, 0.2)", height: 60 }]}
          handleStyle={[{
            borderColor: "#FDD782",
            marginTop: "-2px",
            height: 37,
            width: 4,
            backgroundColor: "#FDD782",
            borderRadius: "0px"
          }, {
            borderColor: "#FDD782",
            marginTop: "-2px",
            height: 37,
            width: 4,
            backgroundColor: "#FDD782",
            borderRadius: "0px"
          }]}
        />
      </div>
    </div>
  );
}

export default DateRangeSlider;
