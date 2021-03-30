/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";

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
    selectBackground: "white",
    locationFocus: "rgba(225,44,134, 0.2)",
    locationBackground: "transparent",
  },
  dark: {
    text: "rgba(255,255,255, 0.8)",
    selectBackground: "#15202Ab",
    locationFocus: "rgba(225,44,134, 0.2)",
    locationBackground: "transparent",
  },
};

function LocationSelectSmall({ mode, location, handleLocation }) {
  const styles = {
    locationSelect: css({
      WebkitAppearance: "none",
      MozAppearance: "none",
      appearance: "none",
      backgroundColor: colors[mode]["locationBackground"],
      color: colors[mode]["text"],
      fontSize: "0.8rem",
      border: "none",
      cursor: "pointer",
      textIndent: "0px",
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
      color: "black",
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
    locationSlect: css({}),
  };

  return (
    <select
      css={styles.locationSelect}
      value={location}
      onChange={handleLocation}
    >
      {options.map((country) => {
        return (
          <option
            key={country.value}
            css={
              country.value === location ? styles.optionSelected : styles.option
            }
            value={country.value}
          >
            {country.label}
          </option>
        );
      })}
    </select>
  );
}

export default LocationSelectSmall;
