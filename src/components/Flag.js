/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";

function Flag({ country }) {
  const styles = {
    wrapper: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
  };
  const flagImage = `/flags/${country.toLowerCase()}.png`;
  return <img src={flagImage} alt={`country flag for ${country}`} />;
}

export default Flag;
