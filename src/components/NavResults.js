/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Burger from "./Burger";
import ResultsNavButton from "./ResultsNavButton";
import SearchPage from "./SearchPage";

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

function NavResults({
  handleLocation,
  location,
  mode,
  changeMode,
  setPage,
  handleRefine,
  handleSearch,
}) {
  const styles = {
    navLinks: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      height: "42px",
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
      display: "none",
      "&:hover": {
        cursor: "pointer",
      },
      "@media(min-width: 700px)": {
        position: "fixed",
        top: "25px",
        left: "50%",
        width: "250px",
        transform: "translate(-50%, -50%)",
        display: "block",
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
    leftNav: css({
      display: "flex",
      flexDirection: "row",
    }),
  };

  return (
    <nav css={styles.navWrapper}>
      <div css={styles.leftNav}>
        <ResultsNavButton
          mode={mode}
          handleSubmit={handleSearch}
          buttonText={"Search"}
        />
        <ResultsNavButton
          mode={mode}
          handleSubmit={handleRefine}
          buttonText={"Refine"}
        />
      </div>
      <div css={styles.logo} onClick={handleSearch}>
        <img src={"/CouchBuddyLogo.png"} alt="CouchBuddy Logo" width={250} />
      </div>
      <div css={styles.navLinks}>
        <Burger
          handleLocation={handleLocation}
          location={location}
          mode={mode}
          changeMode={changeMode}
          inBlog={false}
          showCountry={false}
        />
      </div>
    </nav>
  );
}

export default NavResults;
