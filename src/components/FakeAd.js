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
  };
  return (
    <div css={styles.wrapper}>
      <a href="https://thegeneralquiz.com" target="_blanks">
        <img
          src={`/ad${num}.png`}
          alt="An ad for The General Quiz"
          width={300}
          height={100}
        />
      </a>
    </div>
  );
}

export default FakeAd;
