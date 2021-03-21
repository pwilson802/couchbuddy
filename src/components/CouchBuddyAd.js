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
      borderBottomStyle: "solid",
      borderWidth: 1,
      padding: "1rem",
      borderColor: "#F1888F",
      justifyContent: "space-around",
      alignItems: "center",
      cursor: "pointer",
    }),
    text: css({
      color: colors[mode]["text"],
    }),
    link: css({
      textDecoration: "none",
    }),
    adwrapper: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }),
  };
  return (
    <Link href={"/"}>
      <div css={styles.adwrapper}>
        <a href={"/"} css={styles.link}>
          <img
            src={`/couchbyddyad1.png`}
            alt="An ad for Couch Buddy"
            width={300}
            height={150}
          />
          {/* <div css={styles.wrapper}>
          <div css={styles.textWrapper}>
            <p css={styles.text}>What are you watching tonight?</p>
            <p css={styles.text}>Find out on CouchBuddy</p>
          </div>
          <img src="./tv-65.png" alt="CouchBuddy Television" />
        </div> */}
        </a>
      </div>
    </Link>
  );
}

export default CouchBuddyAdd;
