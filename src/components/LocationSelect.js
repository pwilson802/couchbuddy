/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import Select from "react-select";

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

const countryMap = options.reduce((acc, curr) => {
  const countryCode = curr["value"];
  const country = curr["label"];
  acc[countryCode] = country;
  return acc;
}, {});

function makeSelectOption(value) {
  return options.filter((item) => item.value === value)[0];
}

const colors = {
  light: {
    text: "black",
    selectedText: "black",
    locationBackground: "white",
    menuBackground: "white",
    selectBackground: "white",
    locationFocus: "rgba(225,44,134, 0.2)",
    selected: "#96D0D3",
    activeOption: "rgba(225,44,134, 0.5)",
  },
  dark: {
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
    selectBackground: "#15202A",
    locationFocus: "rgba(225,44,134, 0.2)",
    selected: "#E12C86",
    activeOption: "rgba(225,44,134, 0.5)",
  },
};

function LocationSelect({ handleLocation, location, mode }) {
  const styles = {
    locationSelect: css({
      WebkitAppearance: "none",
      MozAppearance: "none",
      appearance: "none",
      backgroundColor: colors[mode]["locationBackground"],
      color: colors[mode]["text"],
      padding: 10,
      fontSize: "1rem",
      border: "none",
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
    // wrapper: css({
    //   width: 32,
    //   "&:after": {
    //     content: '"XXXXXXXXXXXXXXXX"',
    //     color: "white",
    //   },
    // }),
  };
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? colors[mode]["locationFocus"]
        : colors[mode]["locationBackground"],
      color: state.isSelected ? colors[mode]["selected"] : colors[mode]["text"],
      // color: state.isSelected ? "red" : "blue",
      padding: 20,
      border: "none",
      "&:active": {
        backgroundColor: colors[mode]["activeOption"],
      },
    }),
    control: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      backgroundColor: colors[mode]["locationBackground"],
      color: colors[mode]["text"],
    }),
    singleValue: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      backgroundColor: colors[mode]["locationBackground"],
      color: colors[mode]["selectedText"],
      textAlign: "right",
    }),
    menu: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      backgroundColor: colors[mode]["menuBackground"],
    }),
    input: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      backgroundColor: colors[mode]["locationBackground"],
      color: colors[mode]["text"],
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: colors[mode]["selectedText"],
      border: "none",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      backgroundColor: colors[mode]["selectedText"],
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      justifyContent: "flex-end",
    }),
    menuList: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      scrollbarColor: colors[mode]["locationBackground"],
      color: colors[mode]["selectedText"],
      textAlign: "right",
    }),
  };
  return (
    <div css={styles.wrapper}>
      {/* <Select
        options={options}
        onChange={handleLocation}
        styles={customStyles}
        value={makeSelectOption(location)}
        isSearchable={false}
        autoFocus={true}
        menuList={true}
      /> */}
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
    </div>
  );
}

export default LocationSelect;
