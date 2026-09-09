/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useMemo, useRef, useState } from "react";
import SwipeCard from "./SwipeCard";
import SwipeCardGhost from "./SwipeCardGhost";

const VISIBLE_CARDS = 3;

const colors = {
  light: { text: "black", subtleText: "rgba(0,0,0,0.6)" },
  dark: { text: "white", subtleText: "rgba(255,255,255,0.6)" },
};

function SwipeDeck({ stack, mySwipes, onSwipe, participants, mode }) {
  const palette = colors[mode] || colors.dark;
  const topCardRef = useRef(null);
  const [ghost, setGhost] = useState(null);

  // Filtering the already-swiped titles out (rather than tracking a
  // separate index) is what makes a resumed session just work - a reload
  // mid-round re-derives exactly where this player left off from the
  // swipes the server already has on file for them.
  const remaining = useMemo(
    () => stack.filter((movie) => !(movie.id in mySwipes)),
    [stack, mySwipes]
  );
  const swipedCount = stack.length - remaining.length;
  const visible = remaining.slice(0, VISIBLE_CARDS);

  function handleDecided(movie, direction, startX) {
    // Advance the queue immediately - the next card must be interactive
    // the instant a choice is made (see SwipeCard.js). The fly-off visual
    // for the just-decided card continues separately via the ghost below,
    // which is non-interactive so it can never block the real next swipe.
    onSwipe(movie.id, direction);
    setGhost({ key: `${movie.id}-${Date.now()}`, movie, direction, startX });
  }

  const styles = {
    // flex:1/minHeight:0 makes this fill exactly whatever's left below
    // PartyRoom's header inside its fixed-height, overflow:hidden page
    // (see there) - the stage below then flex-fills whatever's left here
    // in turn, instead of sizing itself from a fixed aspect-ratio/vh
    // value that doesn't account for how much room the header, progress
    // text and action buttons actually took. That mismatch was exactly
    // what could push this screen taller than the viewport and force a
    // page scroll - one a horizontal swipe gesture could then fight with.
    wrapper: css({
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      maxWidth: 420,
      width: "100%",
      margin: "0 auto",
      padding: "8px 20px 16px",
      boxSizing: "border-box",
      color: palette.text,
    }),
    progress: css({ textAlign: "center", fontSize: 13, opacity: 0.6, marginBottom: 12, flexShrink: 0 }),
    stage: css({
      position: "relative",
      width: "100%",
      flex: "1 1 auto",
      minHeight: 0,
      maxHeight: "70vh",
    }),
    actions: css({
      display: "flex",
      justifyContent: "center",
      gap: 24,
      marginTop: 16,
      flexShrink: 0,
    }),
    actionButton: css({
      width: 64,
      height: 64,
      borderRadius: "50%",
      border: "none",
      fontSize: 28,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
    }),
    nopeButton: css({ backgroundColor: "#2A1616", color: "#F87171" }),
    likeButton: css({ backgroundColor: "#16241A", color: "#4ADE80" }),
    waitingWrap: css({
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
      padding: "20px 10px",
      overflowY: "auto",
    }),
    waitingHeading: css({ fontSize: 20, marginBottom: 8 }),
    waitingSub: css({ fontSize: 14, opacity: 0.7, marginBottom: 24 }),
    participantRow: css({
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 14px",
      borderRadius: 8,
      backgroundColor: "rgba(150,208,211,0.1)",
      marginBottom: 6,
      fontSize: 14,
    }),
  };

  if (visible.length === 0) {
    return (
      <div css={styles.waitingWrap}>
        <p css={styles.waitingHeading}>You&rsquo;re all caught up!</p>
        <p css={styles.waitingSub}>Waiting for everyone else to finish swiping...</p>
        {participants.map((p) => (
          <div css={styles.participantRow} key={p.id}>
            <span>{p.displayName}</span>
            <span>{p.swipedCount} / {stack.length}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div css={styles.wrapper}>
      <p css={styles.progress}>
        {swipedCount} / {stack.length} swiped
      </p>
      <div css={styles.stage}>
        {visible
          .map((movie, index) => (
            <SwipeCard
              key={movie.id}
              ref={index === 0 ? topCardRef : null}
              movie={movie}
              isTop={index === 0}
              stackDepth={index}
              onDecided={(direction, startX) => handleDecided(movie, direction, startX)}
            />
          ))
          .reverse()}
        {ghost && (
          <SwipeCardGhost
            key={ghost.key}
            movie={ghost.movie}
            direction={ghost.direction}
            startX={ghost.startX}
            onFinished={() => setGhost(null)}
          />
        )}
      </div>
      <div css={styles.actions}>
        <button
          css={[styles.actionButton, styles.nopeButton]}
          onClick={() => topCardRef.current && topCardRef.current.commit("no")}
          aria-label="No"
        >
          &#10005;
        </button>
        <button
          css={[styles.actionButton, styles.likeButton]}
          onClick={() => topCardRef.current && topCardRef.current.commit("yes")}
          aria-label="Yes"
        >
          &#10003;
        </button>
      </div>
    </div>
  );
}

export default SwipeDeck;
