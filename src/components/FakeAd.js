/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

function FakeAd({ num }) {
  const styles = {
    wrapper: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    image: css({
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
    <div css={styles.wrapper}>
      <a href="https://thegeneralquiz.com" target="_blanks">
        <img
          css={styles.image}
          src={`/ad${num}.png`}
          alt="An ad for The General Quiz"
        />
      </a>
    </div>
  );
}

export default FakeAd;
