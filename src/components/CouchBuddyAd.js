/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Logo from "./Logo";
import Link from "next/link";

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
      cursor: "pointer",
    }),
    text: css({
      color: colors[mode]["text"],
    }),
  };
  return (
    <Link href={"/"}>
      <div css={styles.wrapper}>
        <div css={styles.textWrapper}>
          <p css={styles.text}>What are you watching tonight?</p>
          <p css={styles.text}>Find out on CouchBuddy</p>
        </div>
        <img src="./tv-65.png" alt="CouchBuddy Television" />
      </div>
    </Link>
  );
}

export default CouchBuddyAdd;
