/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

const colors = {
  light: {
    text: "black",
    buttonBorder: "black",
  },
  dark: {
    text: "white",
    buttonBorder: "white",
  },
};

function ResultsNavButton({ mode, handleSubmit, buttonText }) {
  const styles = {
    buttonWrapper: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 0 0 20px",
    }),
    button: css({
      //   width: "30px",
      padding: "5px 10px",
      fontSize: 16,
      borderRadius: 3,
      borderColor: colors[mode]["buttonBorder"],
      borderWidth: 1,
      outline: "none",
      cursor: "pointer",
      backgroundColor: "transparent",
      color: colors[mode]["text"],
    }),
  };
  return (
    <div css={styles.buttonWrapper}>
      <button css={styles.button} onClick={handleSubmit}>
        {buttonText}
      </button>
    </div>
  );
}

export default ResultsNavButton;
