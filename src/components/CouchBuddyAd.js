/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Logo from "./Logo";

const colors = {
  light: {
    text: "#96D0D3",
  },
  dark: {
    text: "white",
  },
};

function CouchBuddyAdd({ mode }) {
  const styles = {
    wrapper: css({
      display: "flex",
      borderTopStyle: "solid",
      borderWidth: 1,
      padding: "0.5rem",
      borderColor: "#F1888F",
      justifyContent: "space-around",
      alignItems: "center",
    }),
    text: css({
      color: colors[mode]["text"],
    }),
  };
  return (
    <div css={styles.wrapper}>
      <div css={styles.textWrapper}>
        <p css={styles.text}>What are you watching tonight?</p>
        <p css={styles.text}>Find out on CouchBuddy</p>
      </div>
      <img src="./tv-65.png" alt="CouchBuddy Television" />
    </div>
  );
}

export default CouchBuddyAdd;
