/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share";

function ShareButtons({ movie, tagline }) {
  const styles = {
    shareButtons: css({
      display: "flex",
      flexDirection: "row",
    }),
    shareButton: css({
      marginRight: 15,
    }),
  };
  const shareMessage = `I'm watching ${movie}.\r\n\r\n${tagline}`;
  return (
    <div css={styles.shareButtons}>
      <div css={styles.shareButton}>
        <TwitterShareButton
          url={"https://couchbuddy.info"}
          title={shareMessage}
        >
          <TwitterIcon size={32} round={true} />
        </TwitterShareButton>
      </div>
      <div css={styles.shareButton}>
        <FacebookShareButton
          url={"https://couchbuddy.info"}
          quote={shareMessage}
        >
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </div>
    </div>
  );
}

export default ShareButtons;
