/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import Flag from "./Flag";

const options = [
  { value: "AR", label: "Argentina" },
  { value: "AT", label: "Austria" },
  { value: "AU", label: "Australia" },
  { value: "BE", label: "Belgium" },
  { value: "BR", label: "Brazil" },
  { value: "CA", label: "Canada" },
  { value: "CL", label: "Chile" },
  { value: "CO", label: "Colombia" },
  { value: "CZ", label: "Czech Republic" },
  { value: "DE", label: "Germany" },
  { value: "DK", label: "Denmark" },
  { value: "EC", label: "Ecuador" },
  { value: "EE", label: "Estonia" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "France" },
  { value: "GR", label: "Greece" },
  { value: "HU", label: "Hungary" },
  { value: "ID", label: "Indonesia" },
  { value: "IE", label: "Ireland" },
  { value: "IN", label: "India" },
  { value: "IT", label: "Italy" },
  { value: "JP", label: "Japan" },
  { value: "LT", label: "Lithuania" },
  { value: "LV", label: "Latvia" },
  { value: "MX", label: "Mexico" },
  { value: "MY", label: "Malaysia" },
  { value: "NL", label: "Netherlands" },
  { value: "NO", label: "Norway" },
  { value: "NZ", label: "New Zealand" },
  { value: "PE", label: "Peru" },
  { value: "PH", label: "Philippines" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "RO", label: "Romania" },
  { value: "RU", label: "Russia" },
  { value: "KR", label: "South Korea" },
  { value: "ES", label: "Spain" },
  { value: "SE", label: "Sweden" },
  { value: "SG", label: "Singapore" },
  { value: "TH", label: "Thailand" },
  { value: "TR", label: "Turkey" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "USA" },
  { value: "VE", label: "Venezuela" },
  { value: "ZA", label: "South Africa" },
  { value: "CH", label: "Switzerland" },
];

const colors = {
  light: {
    text: "black",
    selectedText: "black",
    locationBackground: "transparent",
    menuBackground: "white",
    selectBackground: "white",
    locationFocus: "rgba(225,44,134, 0.2)",
    selected: "#96D0D3",
    activeOption: "rgba(225,44,134, 0.5)",
  },
  dark: {
    text: "black",
    selectedText: "white",
    locationBackground: "transparent",
    menuBackground: "#15202A",
    selectBackground: "#15202Ab",
    locationFocus: "rgba(225,44,134, 0.2)",
    selected: "#E12C86",
    activeOption: "rgba(225,44,134, 0.5)",
  },
  darkFooter: {
    text: "white",
    selectedText: "white",
    locationBackground: "#15202A",
    menuBackground: "#15202A",
    selectBackground: "#15202Ab",
    locationFocus: "rgba(225,44,134, 0.2)",
    selected: "#E12C86",
    activeOption: "rgba(225,44,134, 0.5)",
  },
  darkNav: {
    text: "white",
    selectedText: "white",
    locationBackground: "transparent",
    menuBackground: "#15202A",
    selectBackground: "#15202A",
    locationFocus: "rgba(225,44,134, 0.2)",
    selected: "#E12C86",
    activeOption: "rgba(225,44,134, 0.5)",
  },
  lightNav: {
    text: "black",
    selectedText: "white",
    locationBackground: "transparent",
    menuBackground: "white",
    selectBackground: "white",
    locationFocus: "rgba(225,44,134, 0.2)",
    selected: "#E12C86",
    activeOption: "rgba(225,44,134, 0.5)",
  },
};

function LocationSelect({ handleLocation, location, mode, isOpen, setOpen }) {
  const styles = {
    locationSelect: css({
      WebkitAppearance: "none",
      MozAppearance: "none",
      appearance: "none",
      backgroundColor: colors[mode]["locationBackground"],
      color: colors[mode]["text"],
      paddingLeft: 54,
      marginLeft: 10,
      fontSize: 22,
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
      textAlignLast: "center",
      "&:focus": {
        border: "none",
        outline: "none",
      },
      "&:active": {
        border: "none",
      },
    }),
    option: css({
      backgroundColor: colors[mode]["selectBackground"],
      color: colors[mode]["text"],
      "&:focus": {
        backgroundColor: colors[mode]["locationFocus"],
      },
    }),
    optionSelected: css({
      backgroundColor: colors[mode]["selectBackground"],
      color: colors[mode]["selected"],
      "&:focus": {
        backgroundColor: colors[mode]["locationFocus"],
      },
    }),
    dropArrow: css({
      position: "relative",
      right: 15,
      top: 5,
      pointerEvents: "none",
      borderRight: `solid ${colors[mode]["text"]}`,
      borderBottom: `solid ${colors[mode]["text"]}`,
      height: "10px",
      width: "10px",
      transform: "rotate(45deg)",
      webkitTransform: "rotate(45deg)",
    }),
    locationWrapper: css({
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "center",
    }),
    flag: css({
      marginRight: -48,
      display: "flex",
      alignItems: "center",
      zIndex: 2,
      pointerEvents: "none",
    }),
    hiddenLocation: css({
      fontSize: 22,
      visibility: "hidden",
    }),
  };

  const updateLocation = (loc) => {
    handleLocation(loc);
    if (isOpen) {
      setOpen(false);
    }
  };

  return (
    <div>
      <div css={styles.locationWrapper}>
        <div css={styles.flag}>
          <Flag country={location} />
        </div>
        <select
          css={styles.locationSelect}
          value={location}
          onChange={updateLocation}
        >
          {options.map((country) => {
            return (
              <option
                css={
                  country.value === location
                    ? styles.optionSelected
                    : styles.option
                }
                value={country.value}
              >
                {country.label}
              </option>
            );
          })}
        </select>
      </div>
      {/* <div id="selectedOptionHidden">
        <div css={styles.flag}>
          <Flag country="AU" />
        </div>
        <span css={[styles.hiddenLocation, styles.locationSelect]}>
          {options.filter((item) => item.value === location)[0].label}
        </span>
      </div> */}
    </div>
  );
}

export default LocationSelect;
