/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";

const colors = {
  light: { text: "black", subtleText: "rgba(0,0,0,0.6)", inputBackground: "white", border: "rgba(150,208,211,1)" },
  dark: { text: "white", subtleText: "rgba(255,255,255,0.6)", inputBackground: "#15202A", border: "rgba(150,208,211,0.5)" },
};

function JoinForm({ code, mode, onJoin, joining, error }) {
  const [name, setName] = useState("");
  const palette = colors[mode] || colors.dark;

  const styles = {
    wrapper: css({
      maxWidth: 360,
      margin: "80px auto",
      padding: "0 20px",
      textAlign: "center",
      color: palette.text,
    }),
    code: css({
      fontSize: 14,
      letterSpacing: 2,
      opacity: 0.6,
      marginBottom: 4,
    }),
    heading: css({ fontSize: 24, marginBottom: 20 }),
    input: css({
      width: "100%",
      padding: "12px 14px",
      fontSize: 16,
      borderRadius: 10,
      border: `1px solid ${palette.border}`,
      backgroundColor: palette.inputBackground,
      color: palette.text,
      outline: "none",
      boxSizing: "border-box",
    }),
    button: css({
      width: "100%",
      marginTop: 14,
      padding: "12px 14px",
      fontSize: 16,
      fontWeight: "bold",
      borderRadius: 10,
      border: "none",
      backgroundColor: "#FDD782",
      cursor: "pointer",
      "&:disabled": { opacity: 0.5, cursor: "default" },
    }),
    error: css({ color: "#ff8080", marginTop: 10, fontSize: 13 }),
  };

  return (
    <div css={styles.wrapper}>
      <p css={styles.code}>ROOM {code}</p>
      <h1 css={styles.heading}>What should we call you?</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim()) onJoin(name.trim());
        }}
      >
        <input
          css={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          maxLength={24}
          autoFocus
        />
        <button css={styles.button} type="submit" disabled={joining || !name.trim()}>
          {joining ? "Joining..." : "Join the room"}
        </button>
      </form>
      {error && <p css={styles.error}>{error}</p>}
    </div>
  );
}

export default JoinForm;
