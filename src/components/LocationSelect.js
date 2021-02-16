/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

const options = [
  { value: "US", label: "Unites States" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "NZ", label: "New Zealand" },
  { value: "IN", label: "India" },
  { value: "GB", label: "Great Britian" },
  { value: "NL", label: "NetherLands" },
  { value: "BR", label: "Brazil" },
  { value: "FI", label: "Finland" },
  { value: "ES", label: "Spain" },
  { value: "PT", label: "Portugal" },
  { value: "MY", label: "Malaysia" },
  { value: "SE", label: "Sweden" },
  { value: "DK", label: "Denmark" },
  { value: "NO", label: "NO" },
  { value: "HU", label: "Hungary" },
  { value: "LT", label: "Lithuania" },
  { value: "RU", label: "RU" },
  { value: "PH", label: "PH" },
  { value: "IT", label: "Italy" },
];

const colors = {
  light: {
    text: "black",
    locationBackground: "white",
    selectBackground: "white",
  },
  dark: {
    text: "white",
    locationBackground: "#15202A",
    selectBackground: "#15202Ab",
  },
  darkNav: {
    text: "white",
    locationBackground: "transparent",
    selectBackground: "#15202A",
  },
  lightNav: {
    text: "white",
    locationBackground: "transparent",
    selectBackground: "#15202A",
    // selectBackground: "rgba(254,244,225,1)",
  },
};

function LocationSelect({ handleLocation, location, mode }) {
  const styles = {
    locationSelect: css({
      backgroundColor: colors[mode]["locationBackground"],
      color: colors[mode]["text"],
    }),
    option: css({
      backgroundColor: colors[mode]["selectBackground"],
      color: colors[mode]["text"],
    }),
  };
  return (
    <div>
      <select
        css={styles.locationSelect}
        value={location}
        onChange={handleLocation}
      >
        <option css={styles.option} value="AU">
          Australia
        </option>
        <option css={styles.option} value="US">
          United States
        </option>
      </select>
    </div>
  );
}

export default LocationSelect;
