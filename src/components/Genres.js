/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import GeneralButton from "./GeneralButton";
import SelectAllButton from "./SelectAllButton";

const colors = {
  light: {
    buttonBorderColor: "#96D0D3",
    buttonColor: "black",
    buttonHoverBackground: "#96D0D3",
    buttonHoverBorder: "black",
    buttonHoverColor: "black",
    buttonSelectedBorder: "black",
    buttonSelectedBackround: "#96D0D3",
    buttonSelectedColor: "black",
    buttonSelectedHoverBorder: "black",
    buttonSelectedHoverBackground: "Transparent",
    buttonSelectedHoverColor: "black",
  },
  dark: {
    buttonBorderColor: "rgba(254,244,225,.2)",
    buttonColor: "#FEF4E1",
    buttonHoverBackground: "rgba(253,215,130,.02)",
    buttonHoverBorder: "rgba(253,215,130,.1)",
    buttonHoverColor: "#FDD782",
    buttonSelectedBorder: "rgba(253,215,130,.1)",
    buttonSelectedBackround: "rgba(253,215,130,.1)",
    buttonSelectedColor: "#FDD782",
    buttonSelectedHoverBorder: "rgba(254,244,225,.2)",
    buttonSelectedHoverBackground: "Transparent",
    buttonSelectedHoverColor: "#FEF4E1",
  },
};

function Genres({ selectedGenres, handleGenre, mode, setSelected }) {
  const data = Object.keys(selectedGenres);
  const styles = {
    genreWrapper: css({
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
    }),
    button: css({
      padding: 10,
      borderRadius: 10,
      margin: 10,
      borderColor: colors[mode]["buttonBorderColor"],
      borderStyle: "solid",
      borderWidth: 1,
      color: colors[mode]["buttonColor"],
      backgroundColor: "Transparent",
      cursor: "pointer",
      outline: "none",
      "&focus": {
        outline: 0,
      },
      "&:hover": {
        backgroundColor: colors[mode]["buttonHoverBackground"],
        borderColor: colors[mode]["buttonHoverBorder"],
        color: colors[mode]["buttonHoverColor"],
      },
    }),
    buttonSelected: css({
      padding: 10,
      borderRadius: 10,
      margin: 10,
      borderColor: colors[mode]["buttonSelectedBorder"],
      borderWidth: 1,
      backgroundColor: colors[mode]["buttonSelectedBackround"],
      color: colors[mode]["buttonSelectedColor"],
      cursor: "pointer",
      outline: "none",
    }),
  };
  return (
    <div css={styles.genreWrapper}>
      {Object.values(selectedGenres).length !== 0 && (
        <SelectAllButton
          selectedItems={selectedGenres}
          setSelected={setSelected}
          mode={mode}
        />
      )}
      {data.map((item) => (
        <GeneralButton
          handleClick={() => handleGenre(item)}
          selected={selectedGenres[item]}
          mode={mode}
          key={item}
          buttonText={item}
        />
      ))}
    </div>
  );
}

export default Genres;
