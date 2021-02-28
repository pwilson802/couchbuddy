import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Link from "next/link";
import LocationSelect from "./LocationSelect";

const MenuContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: fixed;
  top: 0px;
  right: 0px;
  user-select: none;
  background-color: rgba(253, 215, 130, 0.95);
  padding-top: 70px;
  padding-left: 30px;
  padding-bottom: 50px;
  padding-right: 30px;
  height: 100%;
  margin: -10;
  width: 50%;
  box-shadow: -2px 0 2px rgba(15, 15, 15, 0.3);
  z-index: 90;
  transform: translateX(4em);
  user-select: none;
`;

const MenuItemContainer = styled.div`
  margin: 30px;
  font-size: 22px;
  font-weight: "bold";
  color: "black";
`;

const menuVariants = {
  open: {
    transform: "translateX(3%)",
  },
  closed: {
    transform: "translateX(103%)",
  },
};

const menuTransition = {
  type: "spring",
  duration: 1,
  stiffness: 33,
  delay: 0.1,
};

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

function BurgerMenu({ handleLocation, location, mode, isOpen }) {
  //   const styles = {
  //     wrapper: css({
  //       display: "flex",
  //       flexDirection: "column",
  //       justifyContent: "flex-start",
  //       position: "fixed",
  //       top: "0px",
  //       right: "0px",
  //       userSelect: "none",
  //       backgroundColor: colors[mode]["backgroundColor"],
  //       paddingTop: 70,
  //       paddingLeft: 30,
  //       paddingBottom: 50,
  //       paddingRight: 30,
  //       height: "100%",
  //       margin: -10,
  //       width: "50%",
  //       zIndex: 90,
  //       "@media(min-width: 768px)": {
  //         width: "33%",
  //       },
  //       "@media(min-width: 1024px)": {
  //         width: "25%",
  //       },
  //       "@media(min-width: 1396px)": {
  //         width: "20%",
  //       },
  //     }),
  //     menuItem: css({
  //       margin: 30,
  //       fontSize: 22,
  //       fontWeight: "bold",
  //       color: colors[mode]["text"],
  //     }),
  //   };
  return (
    <MenuContainer
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      transition={menuTransition}
    >
      <MenuItemContainer>
        <Link href={"/about"}>
          <div>About</div>
        </Link>
      </MenuItemContainer>
      <MenuItemContainer>
        <Link href={"/blog"}>
          <div>Blog</div>
        </Link>
      </MenuItemContainer>
      <MenuItemContainer>
        <LocationSelect
          handleLocation={handleLocation}
          location={location}
          mode={mode}
        />
      </MenuItemContainer>
    </MenuContainer>
  );
}

export default BurgerMenu;
