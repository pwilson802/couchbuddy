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
    text: "#96D0D3",
    selectBackground: "white",
    locationFocus: "rgba(225,44,134, 0.2)",
    locationBackground: "transparent",
    selected: "#E12C86",
  },
  dark: {
    // text: "rgba(255,255,255, 0.8)",
    text: "#96D0D3",
    selectBackground: "#15202Ab",
    locationFocus: "rgba(225,44,134, 0.2)",
    locationBackground: "transparent",
    selected: "#E12C86",
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
      textIndent: intendation[location],
      "&:focus": {
        border: "none",
        outline: "none",
      },
      "&:active": {
        border: "none",
      },
      "@media(min-width: 700px)": {
        textIndent: 0,
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

const intendation = {
  AR: "20px",
  AT: "25px",
  AU: "20px",
  BE: "22px",
  BR: "30px",
  CA: "24px",
  CL: "31px",
  CO: "20px",
  CZ: "2px",
  DE: "20px",
  DK: "20px",
  EC: "22px",
  EE: "26px",
  FI: "26px",
  FR: "27px",
  GR: "26px",
  HU: "21px",
  ID: "19px",
  IE: "25px",
  IN: "31px",
  IT: "34px",
  JP: "28px",
  LT: "18px",
  LV: "28px",
  MX: "26px",
  MY: "23px",
  NL: "13px",
  NO: "24px",
  NZ: "11px",
  PE: "32px",
  PH: "15px",
  PL: "25px",
  PT: "20px",
  RO: "20px",
  RU: "29px",
  KR: "10px",
  ES: "30px",
  SE: "23px",
  SG: "19px",
  TH: "21px",
  TR: "25px",
  GB: "0px",
  US: "33px",
  VE: "17px",
  ZA: "13px",
  CH: "13px",
};
