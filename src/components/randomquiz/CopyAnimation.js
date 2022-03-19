/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/copy.json";

function CopyAnimation({ mode }) {
    const styles = {
    wrapper: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      width: "30px",
      padding: 0,
      // height: "20px",
    })
  };
  return (
          <div css={styles.wrapper} >
              <Lottie
              animationData={animationData}
      />  
          </div>
  );
}

export default CopyAnimation;
