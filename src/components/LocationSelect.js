/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

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
        {options.map((country) => {
          return (
            <option css={styles.option} value={country.value}>
              {country.label}
            </option>
          );
        })}
      </select>
      ;
    </div>
  );
}

export default LocationSelect;
