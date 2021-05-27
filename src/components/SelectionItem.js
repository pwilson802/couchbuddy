/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import animation from "../assets/24-toggle-switch.json";
import React, { useState, useRef, useEffect } from "react";
import SelectionToggle from "./SelectionToggle";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function SelectionItem({ selection, enabled, handleSwitch, mode, refine }) {
  const styles = {
    wrapper: css({
      display: "flex",
      color: colors[mode]["text"],
      alignItems: "center",
      marginTop: "10px",
    }),
    text: css({
      color: colors[mode]["text"],
      marginLeft: "10px",
    }),
  };

  return (
    <div css={styles.wrapper}>
      <SelectionToggle
        enabled={enabled}
        handleSwitch={handleSwitch}
        mode={mode}
        selection={selection}
        refine={refine}
      />
    </div>
  );
}

export default SelectionItem;
