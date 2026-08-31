/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import YouTube from "react-youtube";

// Rendered via a portal straight into document.body rather than in place -
// this needs to cover the true viewport regardless of where it's triggered
// from, and a fixed-position element inside an ancestor with an active CSS
// transform (the tile's own hover/expand lift) would be confined to that
// ancestor's box instead of the screen.
function TrailerModal({ videoId, onClose }) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const styles = {
    backdrop: css({
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "8vh 5vw",
    }),
    playerWrap: css({
      position: "relative",
      width: "100%",
      maxWidth: "1100px",
      aspectRatio: "16 / 9",
    }),
    iframeWrap: css({
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      borderRadius: 8,
      overflow: "hidden",
    }),
    closeButton: css({
      position: "absolute",
      top: "-44px",
      right: 0,
      background: "none",
      border: "none",
      color: "white",
      fontSize: 30,
      cursor: "pointer",
      lineHeight: 1,
      padding: 4,
    }),
  };

  return createPortal(
    <div css={styles.backdrop} onClick={onClose}>
      <div css={styles.playerWrap} onClick={(event) => event.stopPropagation()}>
        <button
          css={styles.closeButton}
          onClick={onClose}
          aria-label="Close trailer"
        >
          &times;
        </button>
        <div css={styles.iframeWrap}>
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: { autoplay: 1 },
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TrailerModal;
