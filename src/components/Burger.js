/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useRef, useEffect } from "react";
import HamburgerToggle from "./HamburgerToggle";
import OutsideClickHandler from "react-outside-click-handler";

import BurgerMenu from "./BurgerMenu";

function Burger({
  handleLocation,
  location,
  mode,
  changeMode,
  inBlog,
  showCountry = true,
}) {
  const [isOpen, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!isOpen);
  };
  const styles = {
    burger: css({
      color: "black",
      cursor: "pointer",
      zIndex: 99,
      transition: "all 250mx ease-in-out",
      position: "fixed",
      top: "0x",
      right: "3px",
    }),
    burgerNav: css({
      color: "black",
      cursor: "pointer",
      zIndex: 300,
      transition: "all 250mx ease-in-out",
      position: "fixed",
    }),
  };
  return (
    <div>
      <OutsideClickHandler
        onOutsideClick={() => {
          setOpen(false);
        }}
      >
        <div css={styles.burger} onClick={toggle}>
          <HamburgerToggle toggle={toggle} isOpen={isOpen} mode={mode} />
        </div>
        {location && (
          <BurgerMenu
            handleLocation={handleLocation}
            location={location}
            mode={mode}
            isOpen={isOpen}
            changeMode={changeMode}
            setOpen={setOpen}
            inBlog={inBlog}
            showCountry={showCountry}
          />
        )}
      </OutsideClickHandler>
    </div>
  );
}

export default Burger;
