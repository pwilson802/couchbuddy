/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import Providers from "./Providers";

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
  mode,
}) {
  const [show, setShow] = useState(false);

  const styles = {
    dropText: css({
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 22,
      backgroundColor: colors[mode]["backgroundColor"],
      marginTop: 10,
      color: colors[mode]["text"],
      textAlign: "center",
      "&:hover": {
        cursor: "pointer",
      },
    }),
  };

  return (
    <div>
      <div css={styles.dropText} onClick={() => setShow(!show)}>
        PROVIDERS
      </div>
      {show && (
        <Providers
          selectedProviders={selectedProviders}
          handleProvider={handleProvider}
          allProviderData={allProviderData}
        />
      )}
    </div>
  );
}

export default DropDownProviders;
