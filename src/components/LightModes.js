/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { button } from "aws-amplify";
import React from "react";

const colors = {
  light: {
    text: "black",
    lightButtonText: "black",
    darkButtonText: "black",
  },
  dark: {
    text: "white",
    lightButtonText: "white",
    darkButtonText: "white",
  },
};

function LightModes({ mode, changeMode }) {
  const styles = {
    buttons: css({
      padding: "7px 20px",
      borderRadius: 10,
      cursor: "pointer",
      outline: "none",
      marginLeft: 10,
      backgroundColor: "Transparent",
      border: "none",
    }),
    darkButtonSelected: css({
      color: "rgba(150, 208, 211, 1)",
      backgroundColor: "rgba(150, 208, 211, 0.2)",
    }),
    darkButtonUnselected: css({
      color: "black",
      "&:hover": {
        color: "black",
        backgroundColor: "rgba(150, 208, 211, 1)",
      },
    }),
    lightButtonSelected: css({
      backgroundColor: "rgba(253,215,130,0.7)",
      color: "black",
    }),
    lightButtonUnselected: css({
      color: "#FDD782",
      "&:hover": {
        backgroundColor: "rgba(253,215,130,0.7)",
        color: "black",
      },
    }),
    lightButton: css({
      color: colors[mode]["lightButtonText"],
    }),
  };
  const darkSelected = [styles.buttons, styles.darkButtonSelected];
  const darkUnselected = [styles.buttons, styles.darkButtonUnselected];
  const lightSelected = [styles.buttons, styles.lightButtonSelected];
  const lightUnselected = [styles.buttons, styles.lightButtonUnselected];
  return (
    <div>
      <button
        css={mode === "dark" ? darkSelected : darkUnselected}
        button
        onClick={() => changeMode("dark")}
      >
        Dark Mode
      </button>
      <button
        css={mode === "light" ? lightSelected : lightUnselected}
        onClick={() => changeMode("light")}
      >
        Light Mode
      </button>
    </div>
  );
}

export default LightModes;
