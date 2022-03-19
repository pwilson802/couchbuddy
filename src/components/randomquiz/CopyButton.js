/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import CopyAnimation from "./CopyAnimation";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function CopyButton({ handleClick, mode }) {
    const styles = {
    wrapper: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      // width: "100%",
      color: colors[mode]["text"],
      padding: "10px 20px",
      fontFamily: "Arial",
      margin: "10px",
      border: "1px solid #E12C86",
      cursor: "pointer",
      borderRadius: "10px",
      fontWeight: "bold",
      backgroundColor: "#E12C86",
    }),
      button: css({
      color: colors[mode]["text"],
      padding: "10px 20px",
      fontFamily: "Arial",
      margin: "10px",
      border: "1px solid #E12C86",
      cursor: "pointer",
      borderRadius: "10px",
      fontWeight: "bold",
      backgroundColor: "#E12C86",
      })
  };
  return (
      <div css={styles.button} onClick={() => handleClick()}>
          Copy 📋
    </div>
  );
}

export default CopyButton;
