/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

const options = [
  { value: "AU", label: "Australia" },
  { value: "US", label: "United States" },
];

function LocationSelect({ handleLocation, location }) {
  const styles = {
    locationSelect: css({
      border: "none",
    }),
  };
  return (
    <div>
      <select
        css={styles.locationSelect}
        value={location}
        onChange={handleLocation}
      >
        <option value="AU">Australia</option>
        <option value="US">United States</option>
      </select>
    </div>
  );
}

export default LocationSelect;
