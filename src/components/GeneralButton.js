/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { button } from "aws-amplify";
import React from "react";

const colors = {
  light: {
    buttonBorderColor: "#96D0D3",
    buttonColor: "black",
    buttonHoverBackground: "#96D0D3",
    buttonHoverBorder: "black",
    buttonHoverColor: "black",
    buttonSelectedBorder: "black",
    buttonSelectedBackround: "#96D0D3",
    buttonSelectedColor: "black",
    buttonSelectedHoverBorder: "black",
    buttonSelectedHoverBackground: "Transparent",
    buttonSelectedHoverColor: "black",
  },
  dark: {
    buttonBorderColor: "rgba(254,244,225,.2)",
    buttonColor: "#FEF4E1",
    buttonHoverBackground: "rgba(253,215,130,.02)",
    buttonHoverBorder: "rgba(253,215,130,.1)",
    buttonHoverColor: "#FDD782",
    buttonSelectedBorder: "rgba(253,215,130,.1)",
    buttonSelectedBackround: "rgba(253,215,130,.1)",
    buttonSelectedColor: "#FDD782",
    buttonSelectedHoverBorder: "rgba(254,244,225,.2)",
    buttonSelectedHoverBackground: "Transparent",
    buttonSelectedHoverColor: "#FEF4E1",
  },
};

function GeneralButton({ selected, handleClick, mode, buttonText }) {
  const styles = {
    genreWrapper: css({
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
    }),
    button: css({
      padding: 10,
      borderRadius: 10,
      margin: 10,
      borderColor: colors[mode]["buttonBorderColor"],
      borderStyle: "solid",
      borderWidth: 1,
      color: colors[mode]["buttonColor"],
      backgroundColor: "Transparent",
      cursor: "pointer",
      outline: "none",
      "&focus": {
        outline: 0,
      },
      // "&:hover": {
      //   backgroundColor: colors[mode]["buttonHoverBackground"],
      //   borderColor: colors[mode]["buttonHoverBorder"],
      //   color: colors[mode]["buttonHoverColor"],
      // },
    }),
    buttonSelected: css({
      padding: 10,
      borderRadius: 10,
      margin: 10,
      borderColor: colors[mode]["buttonSelectedBorder"],
      borderWidth: 1,
      backgroundColor: colors[mode]["buttonSelectedBackround"],
      color: colors[mode]["buttonSelectedColor"],
      cursor: "pointer",
      outline: "none",
    }),
  };
  return (
    <button
      css={selected ? styles.buttonSelected : styles.button}
      onClick={handleClick}
    >
      {buttonText}
    </button>
  );
}

export default GeneralButton;
