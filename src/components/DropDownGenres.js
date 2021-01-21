/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import Genres from "./Genres";

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

function DropDownGenres({ selectedGenres, handleGenre, mode }) {
  const [show, setShow] = useState(false);

  const styles = {
    dropText: css({
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 22,
      backgroundColor: colors[mode]["backgroundColor"],
      textAlign: "center",
      color: colors[mode]["text"],
      "&:hover": {
        cursor: "pointer",
      },
    }),
  };

  return (
    <div>
      <div css={styles.dropText} onClick={() => setShow(!show)}>
        GENRES
      </div>
      {show && (
        <Genres
          selectedGenres={selectedGenres}
          handleGenre={handleGenre}
          mode={mode}
        />
      )}
    </div>
  );
}

export default DropDownGenres;
