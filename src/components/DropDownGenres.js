/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import Genres from "./Genres";
import DropDownButton from "./DropDownButton";

const colors = {
  light: {
    text: "black",
    backgroundColor: "rgba(241, 136, 143,1)",
  },
  dark: {
    text: "#F1888F",
    backgroundColor: "rgba(241, 136, 143,0.3)",
  },
};

function DropDownGenres({ selectedGenres, handleGenre, mode, setSelected }) {
  const [show, setShow] = useState(false);

  const styles = {
    dropText: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 0,
      fontSize: 26,
      backgroundColor: colors[mode]["backgroundColor"],
      textAlign: "center",
      color: colors[mode]["text"],
      "&:hover": {
        cursor: "pointer",
      },
    }),
    dropDown: css({
      display: "flex",
      marginTop: "8px",
    }),
  };

  const handleDropClick = () => {
    setShow(!show);
  };

  return (
    <div>
      <div css={styles.dropText} onClick={handleDropClick}>
        <div css={styles.dropDown}>
          <DropDownButton show={show} />
        </div>
        GENRES
        <div css={styles.dropDown}>
          <DropDownButton show={show} />
        </div>
      </div>
      {show && (
        <Genres
          selectedGenres={selectedGenres}
          handleGenre={handleGenre}
          mode={mode}
          setSelected={setSelected}
        />
      )}
    </div>
  );
}

export default DropDownGenres;
