/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
// import logoImage from "../assets/tv-ex-small.png";

function Logo({ setPage }) {
  const styles = {
    logoImage: css({
      width: "40px",
      height: "40px",
    }),
    logo: css({
      display: "inline-flex",
      flexDirection: "row",
      alignItems: "flex-end",
      "&:hover": {
        cursor: "pointer",
      },
    }),
    logoText: css({
      color: "#96D0D3",
      marginLeft: "10px",
      // fontFamily: "ArturoTrial, sans-serif",
      // fontWeight: "bolder",
    }),
  };
  return (
    <div css={styles.logo} onClick={() => setPage("SearchPage")}>
      <div>
        <img
          src="/tv-ex-small.png"
          alt="CouchBuddy Logo"
          width={40}
          height={40}
        />
        {/* <img css={styles.logoImage} src={logoImage} alt="CouchBuddy Logo" /> */}
      </div>
      <div>
        <div className="page-heading" css={styles.logoText}>
          Couch Buddy
        </div>
      </div>
    </div>
  );
}

export default Logo;
