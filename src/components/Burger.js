/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { CSSTransition, Transition } from "react-transition-group";
import Lottie from "react-lottie";
import * as animationData from "../assets/menuicon.json";

import BurgerMenu from "./BurgerMenu";

const duration = 300;

const defaultStyle = {
  transition: `transform 200ms, opacity 200ms ease`,
  opacity: 1,
};

const transitionStyles = {
  entering: { transform: "200ms", opacity: "300ms ease" },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

function Burger({ handleLocation, location, mode }) {
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  const defaultOptions = {
    animationData: animationData.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const styles = {
    burger: css({
      position: "fixed",
      top: "0x",
      right: "3px",
      zIndex: 2,
    }),
  };
  return (
    <div>
      <div css={styles.burger} onClick={toggle}>
        <Lottie options={defaultOptions} height={50} width={50} />
      </div>
      <Transition in={show} timeout={duration} unmountOnExit>
        {(state) => (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <BurgerMenu
              handleLocation={handleLocation}
              location={location}
              mode={mode}
              setShow={setShow}
            />
          </div>
        )}
      </Transition>
    </div>
  );
}

export default Burger;
