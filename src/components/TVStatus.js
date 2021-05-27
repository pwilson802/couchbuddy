/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

const colors = {
  Returning: "#0477BF",
  Ended: "#23D984",
  Canceled: "#F23030",
};

function TVStatus({ status }) {
  const styles = {
    status: css({
      color: "white",
      backgroundColor: colors[status],
      padding: "5px 10px",
      fontSize: "14px",
      textAlign: "right",
      marginRight: "5px",
      marginTop: "5px",
      justifySelf: "flex-end",
      borderRadius: "3px",
    }),
  };

  return <div css={styles.status}>{status}</div>;
}

export default TVStatus;
