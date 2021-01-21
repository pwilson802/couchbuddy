/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

function NavButton({ handleSubmit, buttonText, width }) {
  const styles = {
    navButton: css({
      width: width,
      padding: "5px 10px",
      fontSize: 16,
      borderRadius: 10,
      borderColor: "rgba(253,215,130,0.85)",
      borderWidth: 1,
      backgroundColor: "rgba(253,215,130,0.85)",
      alignSelf: "center",
      outline: "none",
      cursor: "pointer",
      "&:Hover": {
        borderColor: "rgba(253,215,130,1)",
        backgroundColor: "rgba(253,215,130,1)",
      },
    }),
    buttonWrapper: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 15,
    }),
  };
  return (
    <div css={styles.buttonWrapper}>
      <button css={styles.navButton} onClick={handleSubmit}>
        {buttonText}
      </button>
    </div>
  );
}

export default NavButton;
