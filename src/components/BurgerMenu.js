/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import Link from "next/link";
import LocationSelect from "./LocationSelect";

const colors = {
  light: {
    text: "black",
    backgroundColor: "rgba(253,215,130, 0.95)",
    // backgroundColor: "#E12C86",
  },
  dark: {
    text: "black",
    backgroundColor: "rgba(150,208,211,0.95)",
  },
};

function BurgerMenu({ handleLocation, location, mode }) {
  const styles = {
    wrapper: css({
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      position: "fixed",
      top: "0x",
      right: "3px",
      backgroundColor: colors[mode]["backgroundColor"],
      paddingTop: 70,
      paddingLeft: 30,
      paddingBottom: 50,
      paddingRight: 30,
      height: "100%",
      margin: -10,
      width: "50%",
      zIndex: 1,
      "@media(min-width: 768px)": {
        width: "33%",
      },
      "@media(min-width: 1024px)": {
        width: "25%",
      },
      "@media(min-width: 1396px)": {
        width: "20%",
      },
    }),
    menuItem: css({
      margin: 30,
      fontSize: 22,
      fontWeight: "bold",
      color: colors[mode]["text"],
    }),
  };
  return (
    <div css={styles.wrapper}>
      <div css={styles.menuItem}>
        <Link href={"/about"}>
          <div>About & Settings</div>
        </Link>
      </div>
      <div css={styles.menuItem}>
        <Link href={"/blog"}>
          <div>Blog</div>
        </Link>
      </div>
      <div css={styles.menuItem}>
        <LocationSelect
          handleLocation={handleLocation}
          location={location}
          mode={mode}
        />
      </div>
    </div>
  );
}

export default BurgerMenu;
