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
    image: css({
      width: 32,
      height: 32,
    }),
  };
  const shareMessage = `I'm watching ${movie}.\r\n\r\n${tagline}`;
  const facebookShareMessage = `I'm watching ${movie}.\n${tagline}`;
  const twitterShareMessage = `I'm watching ${movie}.\n${tagline}\n\n@couch_buddy\n`;
  // const twitterIntent = "https://twitter.com/intent/tweet";
  // const url = "https://couchbuddy.info";
  // const shareURLTwitter = new URL(
  //   `${twitterIntent}?url=${url}&text=${twitterShareMessage}`
  // );
  const shareURLTwitter =
    "https://twitter.com/intent/tweet?url=https://couchbuddy.info&text=" +
    encodeURIComponent(twitterShareMessage);
  const shareURLFacebook =
    "https://www.facebook.com/sharer/sharer.php?u=https://couchbuddy.info&quote=" +
    encodeURIComponent(facebookShareMessage);
  return (
    <div css={styles.shareButtons}>
      <div css={styles.shareButton}>
        <a href={shareURLTwitter} target="_blank">
          <img css={styles.image} src="/share/twitter.png" alt="twitter logo" />
        </a>
      </div>
      <div css={styles.shareButton}>
        {/* <a href={shareURLFacebook} target="_blank">
          <img
            css={styles.image}
            src="/share/facebook.png"
            alt="facebook logo"
          />
        </a> */}
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
