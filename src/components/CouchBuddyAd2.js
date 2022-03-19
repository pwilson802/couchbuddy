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

function CouchBuddyAdd2({ mode }) {
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
    image: css({
      borderRadius: "10px",
      maxWidth: 350,
      "@media(min-width: 1024px)": {
        maxWidth: 300,
      },
      "@media(min-width: 1600px)": {
        maxWidth: 400,
      },
    }),
  };
  return (
    <Link href={"/"}>
      <div css={styles.adwrapper}>
        <a href={"/"} css={styles.link}>
          <img
            css={styles.image}
            src={`/ad2.png`}
            alt="An ad for Couch Buddy"
          />
        </a>
      </div>
    </Link>
  );
}

export default CouchBuddyAdd2;
