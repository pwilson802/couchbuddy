/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import { FacebookShareButton, FacebookIcon } from "react-share";

const colors = {
  light: { text: "black" },
  dark: { text: "white" },
};

function rankMessage(score, total) {
  const ratio = total > 0 ? score / total : 0;
  if (ratio === 1) return "Perfect score! You're a true superfan.";
  if (ratio >= 0.7) return "Great job - you really know this one.";
  if (ratio >= 0.4) return "Not bad! You know your stuff.";
  return "Room to improve - maybe it's time for a rewatch?";
}

function TitleQuizEnd({ score, total, title, href, resetQuiz, mode }) {
  const styles = {
    wrapper: css({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      color: colors[mode]["text"],
      padding: "20px 0",
    }),
    score: css({
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: "2.2rem",
      margin: 0,
    }),
    rank: css({
      fontSize: "1.05rem",
      margin: "8px 0 20px 0",
    }),
    button: css({
      padding: "10px 24px",
      outline: "none",
      cursor: "pointer",
      backgroundColor: "#96D0D3",
      border: "none",
      borderRadius: 20,
      fontWeight: "bold",
      fontSize: 14,
      marginBottom: 20,
    }),
    shareLabel: css({
      fontSize: 13,
      opacity: 0.7,
      marginBottom: 8,
    }),
    shareButtons: css({
      display: "flex",
      gap: 16,
      alignItems: "center",
    }),
    shareImage: css({
      width: 32,
      height: 32,
    }),
  };

  const shareUrl = `https://couchbuddy.info${href}`;
  const shareMessage = `I scored ${score}/${total} on the ${title} quiz on CouchBuddy! Think you can beat me?`;
  const twitterShareUrl =
    "https://twitter.com/intent/tweet?url=" +
    encodeURIComponent(shareUrl) +
    "&text=" +
    encodeURIComponent(`${shareMessage}\n\n@couch_buddy\n`);

  return (
    <div css={styles.wrapper}>
      <p css={styles.score}>
        {score} / {total}
      </p>
      <p css={styles.rank}>{rankMessage(score, total)}</p>
      <button css={styles.button} onClick={resetQuiz}>
        Play Again
      </button>
      <p css={styles.shareLabel}>Share your score</p>
      <div css={styles.shareButtons}>
        <a href={twitterShareUrl} target="_blank" rel="noreferrer">
          <img css={styles.shareImage} src="/share/twitter.png" alt="twitter logo" />
        </a>
        <FacebookShareButton url={shareUrl} quote={shareMessage}>
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </div>
    </div>
  );
}

export default TitleQuizEnd;
