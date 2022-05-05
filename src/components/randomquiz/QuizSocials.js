/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

import { FacebookShareButton, FacebookIcon } from "react-share";

function QuizSocials({ score, slug }) {
  const styles = {
    shareButtons: css({
      display: "flex",
      flexDirection: "row",
    }),
    shareButton: css({
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      margin: "0 20px 0 0",
    }),
    image: css({
      width: 32,
      height: 32,
    }),
  };
  const quizName =
    slug === "random-movie-quiz"
      ? "random movie quiz"
      : "ramdom movie picture quiz";
  const shareMessage = `I got ${score}/15 in the ${quizName}.\r\n\r\n`;
  const twitterShareMessage = `I got ${score}/15 in the ${quizName}.\n\n@couch_buddy\n`;
  const shareURLTwitter =
    `https://twitter.com/intent/tweet?url=https://couchbuddy.info/blog/${slug}&text=` +
    encodeURIComponent(twitterShareMessage);
  return (
    <div css={styles.shareButtons}>
      <div css={styles.shareButton}>
        <a href={shareURLTwitter} target="_blank">
          <img css={styles.image} src="/share/twitter.png" alt="twitter logo" />
        </a>
      </div>
      <div css={styles.shareButton}>
        <FacebookShareButton
          url={`https://couchbuddy.info/blog/${slug}`}
          quote={shareMessage}
        >
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </div>
    </div>
  );
}

export default QuizSocials;
