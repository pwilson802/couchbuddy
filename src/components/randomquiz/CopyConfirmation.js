/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

const colors = {
  light: {
    text: "white",
    background: "#E12C86",
  },
  dark: {
    text: "black",
    background: "#FEF4E1",
  },
};

function CopyConfirmation({ mode }) {
  const styles = {
    wrapper: css({
      display: "flex",
      alignItems: "center",
      // justifyContent: "center",
      // cursor: "pointer",
      // color: colors[mode]["text"],
      // padding: "10px 20px",
      // fontFamily: "Arial",
      // margin: "10px",
      //   border: "1px solid #E12C86",
      //   cursor: "pointer",
      // borderRadius: "10px",
      //   fontWeight: "bold",
      // backgroundColor: "#E12C86",
      position: "fixed",
      width: "100%",
      height: "100%",
      justifyContent: "space-around",
      alignItems: "center",
      left: "0",
      top: "0",
      width: "100%",
      height: "50%",
    }),
    button: css({
      color: colors[mode]["text"],
      padding: "10px 20px",
      fontFamily: "Arial",
      margin: "10px",
      // border: "1px solid #E12C86",
      // cursor: "pointer",
      borderRadius: "10px",
      fontWeight: "bold",
      backgroundColor: colors[mode]["background"],
    }),
  };
  return (
    <div css={styles.wrapper}>
      <div css={styles.button}>Copied quiz to clipboard</div>
    </div>
  );
}

export default CopyConfirmation;
