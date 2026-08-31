/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css, ClassNames } from "@emotion/react";
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
    }),
    playerWrap: css({
      position: "relative",
      // Fill roughly 3/4 of the screen while staying 16:9 and never
      // overflowing the viewport in either dimension - whichever
      // constraint (width or height) is tighter wins.
      width: "min(75vw, calc(75vh * 16 / 9))",
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
          {/* react-youtube renders its own wrapper div (containerClassName)
              around the actual iframe (className) - neither is sized by
              default, so opts.width/height="100%" (an iframe HTML attribute)
              has nothing to resolve against and collapses to a sliver.
              ClassNames gets us real class strings to hand to both. */}
          <ClassNames>
            {({ css: cx }) => (
              <YouTube
                videoId={videoId}
                containerClassName={cx({ width: "100%", height: "100%" })}
                className={cx({ width: "100%", height: "100%" })}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: { autoplay: 1 },
                }}
              />
            )}
          </ClassNames>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TrailerModal;
