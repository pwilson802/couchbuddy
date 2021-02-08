/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import LocationSelect from "./LocationSelect";
import Logo from "./Logo";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const colors = {
  light: {
    text: "white",
    // navBackground: "rgba(254,244,225, 0.7)",
    navBackground: "rgba(150,208,211, 0.95)",
    buttonBorder: "white",
  },
  dark: {
    text: "white",
    navBackground: "rgba(150,208,211, 0.5)",
    buttonBorder: "white",
  },
};

function NavBlog({ handleLocation, location, mode }) {
  const styles = {
    navLinks: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      height: "40px",
      // alignContent: "center",
      // alignItems: "center",
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
      // borderRadius: 10,
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
      position: "-webkit-sticky",
      position: "sticky",
      top: "0",
      margin: "0",
      padding: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors[mode]["navBackground"],
    }),
  };
  return (
    <div css={styles.navWrapper}>
      <Link href={"/blog"}>
        <img
          css={styles.logo}
          src="/CouchBuddyBlogLogo3.png"
          alt="CouchBuddy Logo"
        />
      </Link>
      <nav css={styles.navLinks}>
        <div css={styles.buttonWrapper}>
          <Link href={"/about"}>
            <button css={styles.about}>About</button>
          </Link>
        </div>
        <div>
          <LocationSelect
            handleLocation={handleLocation}
            location={location}
            mode={mode === "dark" ? "darkNav" : "lightNav"}
          />
        </div>
      </nav>
    </div>
  );
}

export default NavBlog;
