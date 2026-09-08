/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

function PlayGroupButton({ handleClick, loading }) {
  const styles = {
    wrapper: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    }),
    button: css({
      padding: "5px 14px",
      fontSize: 15,
      borderRadius: 10,
      border: "1px solid rgba(150,208,211,0.85)",
      backgroundColor: "transparent",
      color: "rgba(150,208,211,1)",
      outline: "none",
      cursor: "pointer",
      "&:disabled": { opacity: 0.6, cursor: "default" },
    }),
  };
  return (
    <div css={styles.wrapper}>
      <button css={styles.button} onClick={handleClick} disabled={loading}>
        {loading ? "Setting up..." : "👥 Play as a Group"}
      </button>
    </div>
  );
}

export default PlayGroupButton;
