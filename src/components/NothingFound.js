/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import NavButton from "./NavButton";

function NothingFound({ setPage }) {
  const styles = {
    text: css({
      fontSize: 20,
      color: "white",
      textAlign: "center",
      marginTop: "20px",
    }),
  };
  return (
    <div>
      <div css={styles.text}>No movies were found, please try again</div>
      <NavButton
        handleSubmit={() => setPage("SearchPage")}
        buttonText={"New Search"}
      />
    </div>
  );
}

export default NothingFound;
