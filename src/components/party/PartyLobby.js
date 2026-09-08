/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { MAX_PLAYERS } from "../../lib/partyConstants";

const colors = {
  light: { text: "black", subtleText: "rgba(0,0,0,0.6)", cardBackground: "rgba(150,208,211,0.15)", border: "rgba(150,208,211,1)" },
  dark: { text: "white", subtleText: "rgba(255,255,255,0.6)", cardBackground: "rgba(150,208,211,0.08)", border: "rgba(150,208,211,0.4)" },
};

function PartyLobby({ code, mode, participants, isHost, starting, startError, onStart }) {
  const [copied, setCopied] = useState(false);
  const palette = colors[mode] || colors.dark;
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/play/${code}` : "";

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join my CouchBuddy game", url: shareUrl });
        return;
      } catch {
        // User cancelled the native sheet - fall through to copy instead.
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable - the code is shown big above, still joinable manually.
    }
  }

  const styles = {
    wrapper: css({ maxWidth: 420, margin: "40px auto", padding: "0 20px", color: palette.text }),
    heading: css({ textAlign: "center", fontSize: 16, opacity: 0.7, marginBottom: 4 }),
    codeBlock: css({
      textAlign: "center",
      fontSize: 42,
      fontWeight: "bold",
      letterSpacing: 6,
      margin: "8px 0 16px",
    }),
    shareButton: css({
      display: "block",
      width: "100%",
      padding: "12px 14px",
      fontSize: 15,
      borderRadius: 10,
      border: `1px solid ${palette.border}`,
      backgroundColor: "transparent",
      color: palette.text,
      cursor: "pointer",
      marginBottom: 24,
    }),
    listHeading: css({ fontSize: 14, opacity: 0.7, marginBottom: 8 }),
    participant: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 14px",
      borderRadius: 10,
      backgroundColor: palette.cardBackground,
      marginBottom: 8,
    }),
    hostBadge: css({ fontSize: 11, opacity: 0.6 }),
    startButton: css({
      width: "100%",
      marginTop: 16,
      padding: "14px",
      fontSize: 17,
      fontWeight: "bold",
      borderRadius: 10,
      border: "none",
      backgroundColor: "#FDD782",
      cursor: "pointer",
      "&:disabled": { opacity: 0.5, cursor: "default" },
    }),
    waiting: css({ textAlign: "center", marginTop: 20, opacity: 0.7, fontSize: 14 }),
    error: css({ color: "#ff8080", marginTop: 10, fontSize: 13, textAlign: "center" }),
  };

  return (
    <div css={styles.wrapper}>
      <p css={styles.heading}>Share this code to invite friends</p>
      <p css={styles.codeBlock}>{code}</p>
      <button css={styles.shareButton} onClick={handleShare}>
        {copied ? "Link copied!" : "Copy invite link"}
      </button>

      <p css={styles.listHeading}>
        {participants.length} / {MAX_PLAYERS} players
      </p>
      {participants.map((p) => (
        <div css={styles.participant} key={p.id}>
          <span>{p.displayName}</span>
          {p.isHost && <span css={styles.hostBadge}>HOST</span>}
        </div>
      ))}

      {isHost ? (
        <React.Fragment>
          <button css={styles.startButton} onClick={onStart} disabled={starting}>
            {starting ? "Setting up the round..." : "Start the round"}
          </button>
          {startError && <p css={styles.error}>{startError}</p>}
        </React.Fragment>
      ) : (
        <p css={styles.waiting}>Waiting for the host to start...</p>
      )}
    </div>
  );
}

export default PartyLobby;
