/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

import { FacebookShareButton, FacebookIcon } from "react-share";

function BlogQuizSocials({ rank, score, slug }) {
  const styles = {
    shareButtons: css({
      display: "flex",
      flexDirection: "row",
    }),
    shareButton: css({
      margin: "0 20px",
    }),
    image: css({
      width: 32,
      height: 32,
    }),
  };
  const pageUrl = `https://couchbuddy.info/blog/${slug}`;
  const shareMessage = `I got ${score} out of 15.\r\n\r\n${rank}`;
  const twitterShareMessage = `I got ${score} out of 15.\n${rank}\n\n@couch_buddy\n`;
  const shareURLTwitter =
    `https://twitter.com/intent/tweet?url=${pageUrl}&text=` +
    encodeURIComponent(twitterShareMessage);
  return (
    <div css={styles.shareButtons}>
      <div css={styles.shareButton}>
        <a href={shareURLTwitter} target="_blank">
          <img css={styles.image} src="/share/twitter.png" alt="twitter logo" />
        </a>
      </div>
      <div css={styles.shareButton}>
        <FacebookShareButton url={pageUrl} quote={shareMessage}>
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </div>
    </div>
  );
}

export default BlogQuizSocials;
