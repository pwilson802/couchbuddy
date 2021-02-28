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

function HamburgerToggle({ toggle, isOpen }) {
  const styles = {
    button: css({
      zIndex: 99,
      cursor: "pointer",
    }),
  };
  return (
    <div css={styles.button} onClick={toggle}>
      <svg width="23" height="23" viewBox="0 0 23 23">
        <Path
          animate={isOpen ? "open" : "closed"}
          initial={false}
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5", stroke: "black" },
            open: { d: "M 3 16.5 L 17 2.5", stroke: "black" },
          }}
          transition={transition}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          stroke="black"
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
              d: "M 2 16.346 L 20 16.346",
              stroke: "black",
            },
            open: { d: "M 3 2.5 L 17 16.346", stroke: "black" },
          }}
          transition={transition}
        />
      </svg>
    </div>
  );
}

export default HamburgerToggle;
