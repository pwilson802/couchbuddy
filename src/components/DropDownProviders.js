/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import Providers from "./Providers";
import DropDownButton from "./DropDownButton";

const colors = {
  light: {
    text: "black",
    backgroundColor: "rgba(253,215,130,0.8)",
  },
  dark: {
    text: "#96D0D3",
    backgroundColor: "rgba(150,208,211,0.2)",
  },
};

function DropDownProviders({
  selectedProviders,
  handleProvider,
  allProviderData,
  sortedProviders,
  mode,
}) {
  const [show, setShow] = useState(false);

  const styles = {
    dropText: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 26,
      backgroundColor: colors[mode]["backgroundColor"],
      marginTop: 10,
      color: colors[mode]["text"],
      textAlign: "center",
      "&:hover": {
        cursor: "pointer",
      },
    }),
    dropDown: css({
      display: "flex",
      marginTop: "8px",
    }),
  };

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <div>
      <div css={styles.dropText} onClick={handleClick}>
        <div css={styles.dropDown}>
          <DropDownButton show={show} mode={mode} menu={"providers"} />
        </div>
        <div>PROVIDERS</div>
        <div css={styles.dropDown}>
          <DropDownButton show={show} mode={mode} menu={"providers"} />
        </div>
      </div>
      {show && (
        <Providers
          selectedProviders={selectedProviders}
          handleProvider={handleProvider}
          allProviderData={allProviderData}
          sortedProviders={sortedProviders}
          mode={mode}
        />
      )}
    </div>
  );
}

export default DropDownProviders;
