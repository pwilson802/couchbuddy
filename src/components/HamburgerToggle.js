/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { motion } from "framer-motion";

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeLinecap="round"
    strokeWidth="3"
    {...props}
  />
);

const transition = { duration: 0.3 };

const colors = {
  light: {
    open: "black",
    closed: "black",
  },
  dark: {
    open: "black",
    closed: "white",
  },
};

function HamburgerToggle({ toggle, isOpen, mode }) {
  const styles = {
    button: css({
      zIndex: 99,
      cursor: "pointer",
    }),
  };
  const sizes = {
    small: {
      firstClosed: "M 2 2.5 L 20 2.5",
      firstOpen: "M 3 16.5 L 17 2.5",
      second: "M 2 9.423 L 20 9.423",
      thirdClosed: "M 2 16.346 L 20 16.346",
      thirdOpen: "M 3 2.5 L 17 16.346",
    },
    medium: {
      firstClosed: "M 3 3.75 L 30 3.75",
      firstOpen: "M 1.5 24.75 L 25.5 3.75",
      second: "M 3 14.135 L 30 14.135",
      thirdClosed: "M 3 24.519 L 30 24.519",
      thirdOpen: "M 3 3.75 L 25.5 25.519",
    },
  };
  return (
    <div css={styles.button} onClick={toggle}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <Path
          animate={isOpen ? "open" : "closed"}
          initial={false}
          variants={{
            closed: {
              d: sizes["medium"]["firstClosed"],
              stroke: colors[mode]["closed"],
            },
            open: {
              d: sizes["medium"]["firstOpen"],
              stroke: colors[mode]["open"],
            },
          }}
          transition={transition}
        />
        <Path
          d={sizes["medium"]["second"]}
          stroke={colors[mode]["closed"]}
          animate={isOpen ? "open" : "closed"}
          initial={false}
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={transition}
        />
        <Path
          animate={isOpen ? "open" : "closed"}
          initial={false}
          variants={{
            closed: {
              d: sizes["medium"]["thirdClosed"],
              stroke: colors[mode]["closed"],
            },
            open: {
              d: sizes["medium"]["thirdOpen"],
              stroke: colors[mode]["open"],
            },
          }}
          transition={transition}
        />
      </svg>
    </div>
  );
}

export default HamburgerToggle;
