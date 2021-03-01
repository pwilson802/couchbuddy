import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Link from "next/link";
import LocationSelect from "./LocationSelect";
import ModeSwitch from "./ModeSwitch";

const MenuContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: fixed;
  top: 0px;
  right: 0px;
  user-select: none;
  background-color: ${(props) => props.backgroundColor};
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
  @media (min-width: 768px) {
    width: 33%;
  }
  @media (min-width: 1024px) {
    width: 25%;
  }
  @media (min-width: 1396px) {
    width: 20%;
  }
`;

const MenuContainerItem = styled(motion.div)`
  margin: 30px;
  font-size: 22px;
  font-weight: bold;
  color: black;
  cursor: pointer;
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

const itemVariants = {
  show: {
    transform: "translateX(0em)",
    opacity: 1,
  },
  hide: {
    transform: "translateX(5em)",
    opacity: 0,
  },
};

const colors = {
  light: {
    text: "black",
    backgroundColor: "rgba(253,215,130, 0.95)",
  },
  dark: {
    text: "black",
    backgroundColor: "rgba(150,208,211,0.95)",
  },
};

function BurgerMenu({ handleLocation, location, mode, isOpen }) {
  return (
    <MenuContainer
      backgroundColor={colors[mode]["backgroundColor"]}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      transition={menuTransition}
    >
      <MenuContainerItem
        initial={false}
        animate={isOpen ? "show" : "hide"}
        variants={{
          show: {
            ...itemVariants.show,
            transition: { delay: 0.3, duration: 0.2 },
          },
          hide: {
            ...itemVariants.hide,
            transition: { delay: 0.05, duration: 0.05 },
          },
        }}
      >
        <Link href={"/blog"}>
          <ModeSwitch mode={mode} />
        </Link>
      </MenuContainerItem>
      <MenuContainerItem
        initial={false}
        animate={isOpen ? "show" : "hide"}
        variants={{
          show: {
            ...itemVariants.show,
            transition: { delay: 0.4, duration: 0.2 },
          },
          hide: {
            ...itemVariants.hide,
            transition: { delay: 0.1, duration: 0.05 },
          },
        }}
      >
        <Link href={"/about"}>
          <div>About</div>
        </Link>
      </MenuContainerItem>
      <MenuContainerItem
        initial={false}
        animate={isOpen ? "show" : "hide"}
        variants={{
          show: {
            ...itemVariants.show,
            transition: { delay: 0.5, duration: 0.2 },
          },
          hide: {
            ...itemVariants.hide,
            transition: { delay: 0.15, duration: 0.05 },
          },
        }}
      >
        <Link href={"/blog"}>
          <div>Blog</div>
        </Link>
      </MenuContainerItem>
      <MenuContainerItem
        initial={false}
        animate={isOpen ? "show" : "hide"}
        variants={{
          show: {
            ...itemVariants.show,
            transition: { delay: 0.6, duration: 0.2 },
          },
          hide: {
            ...itemVariants.hide,
            transition: { delay: 0.2, duration: 0.05 },
          },
        }}
      >
        <LocationSelect
          handleLocation={handleLocation}
          location={location}
          mode={mode}
        />
      </MenuContainerItem>
    </MenuContainer>
  );
}

export default BurgerMenu;
