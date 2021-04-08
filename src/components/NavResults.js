/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Burger from "./Burger";

const colors = {
  light: {
    text: "white",
    // navBackground: "rgba(150,208,211, 0.95)",
    navBackground: "white",
    buttonBorder: "white",
  },
  dark: {
    text: "white",
    // navBackground: "rgba(150,208,211, 0.5)",
    navBackground: "#15202A",
    buttonBorder: "white",
  },
};

function NavResults({ handleLocation, location, mode, changeMode, setPage }) {
  const styles = {
    navLinks: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      height: "40px",
      marginTop: "10px",
    }),
    buttonWrapper: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    about: css({
      marginRight: "40px",
      color: colors[mode]["text"],
      outline: "none",
      cursor: "pointer",
      backgroundColor: "transparent",
      padding: "1px 10px",
      fontSize: 14,
      borderWidth: 1,
      borderColor: colors[mode]["buttonBorder"],
      borderStyle: "solid",
    }),
    logo: css({
      width: "40%",
      "&:hover": {
        cursor: "pointer",
      },
      "@media(min-width: 700px)": {
        width: "250px",
      },
    }),
    navWrapper: css({
      zIndex: "100",
      position: "fixed",
      top: "0",
      margin: "0",
      padding: "0",
      display: "flex",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
      backgroundColor: colors[mode]["navBackground"],
    }),
  };
  return (
    <nav css={styles.navWrapper}>
      <div>
        <div css={styles.logo} onClick={() => setPage("SearchPage")}>
          <img src={"/CouchBuddyLogo.png"} alt="CouchBuddy Logo" width={250} />
        </div>
      </div>
      <div css={styles.navLinks}>
        <Burger
          handleLocation={handleLocation}
          location={location}
          mode={mode}
          changeMode={changeMode}
          inBlog={true}
        />
      </div>
    </nav>
  );
}

export default NavResults;
