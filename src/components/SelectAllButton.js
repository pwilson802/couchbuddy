/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import animationDark from "../assets/allgenres-darkmode.json";
import animationLight from "../assets/allgenres-lightmode.json";
import React, { useState, useRef, useEffect } from "react";

const colors = {
  light: {
    opacitiy: 1,
  },
  dark: {
    opacity: 0.6,
  },
};

function SelectAllButton({ selectedItems, setSelected, mode }) {
  //console.log()("selectedItems", selectedItems);
  const [allSelected, setAllSelected] = useState(false);
  const player = useRef();
  const styles = {
    wrapper: css({
      height: 32,
      width: 32,
      opacity: colors[mode]["opacity"],
      cursor: "pointer",
    }),
  };

  useEffect(() => {
    if (Object.values(selectedItems).every((item) => item === true)) {
      player.current.setDirection(1);
      player.current.setSpeed(1);
      player.current.play();
      setAllSelected(true);
    }
    if (Object.values(selectedItems).some((item) => item === false)) {
      player.current.setDirection(-1);
      player.current.setSpeed(2);
      player.current.play();
      setAllSelected(false);
    }
  }, [selectedItems, mode]);

  const handleClick = () => {
    player.current.setSpeed(1);
    player.current.setDirection(allSelected ? -1 : 1);
    player.current.play();
    if (!allSelected) {
      const newSelectedObj = Object.keys(selectedItems).reduce((acc, curr) => {
        acc[curr] = true;
        return acc;
      }, {});
      setSelected(newSelectedObj);
    } else {
      const newSelectedObj = Object.keys(selectedItems).reduce((acc, curr) => {
        acc[curr] = false;
        return acc;
      }, {});
      setSelected(newSelectedObj);
    }
    setAllSelected(!allSelected);
  };
  return (
    <div css={styles.wrapper} onClick={handleClick}>
      <Lottie
        animationData={mode === "dark" ? animationDark : animationLight}
        autoplay={false}
        loop={false}
        lottieRef={player}
      />
    </div>
  );
}

export default SelectAllButton;
