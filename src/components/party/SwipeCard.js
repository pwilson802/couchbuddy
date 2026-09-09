/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const DECIDE_THRESHOLD = 120;

// commit() reports the decision to SwipeDeck IMMEDIATELY (not after a fly-
// off animation finishes) - the queue has to advance and the next card has
// to become interactive the instant a choice is made, or a second quick
// swipe can land on this card while it's still mid-animation and snap it
// back to center (looks like "the previous movie came back"). The actual
// fly-off visual is handled separately by a decorative, non-interactive
// SwipeCardGhost that SwipeDeck spawns in this card's place - see there.
const SwipeCard = forwardRef(function SwipeCard({ movie, isTop, stackDepth, onDecided }, ref) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-16, 16]);
  const likeOpacity = useTransform(x, [20, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -20], [1, 0]);
  const [decided, setDecided] = useState(false);

  function commit(direction) {
    if (decided) return;
    setDecided(true);
    onDecided(direction, x.get());
  }

  useImperativeHandle(ref, () => ({ commit }));

  function handleDragEnd(event, info) {
    if (info.offset.x > DECIDE_THRESHOLD) commit("yes");
    else if (info.offset.x < -DECIDE_THRESHOLD) commit("no");
    else animate(x, 0, { type: "spring", stiffness: 400, damping: 32 });
  }

  const styles = {
    card: css({
      position: "absolute",
      inset: 0,
      borderRadius: 18,
      overflow: "hidden",
      backgroundColor: "#111",
      boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
      touchAction: "none",
      cursor: isTop ? "grab" : "default",
    }),
    poster: css({
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      pointerEvents: "none",
      userSelect: "none",
    }),
    posterFallback: css({
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      textAlign: "center",
      color: "white",
      fontSize: 20,
      backgroundColor: "rgba(150,208,211,0.25)",
    }),
    info: css({
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: "40px 16px 16px",
      background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))",
      color: "white",
      pointerEvents: "none",
    }),
    title: css({ margin: 0, fontSize: 20, fontWeight: "bold" }),
    meta: css({ margin: "4px 0 0", fontSize: 13, opacity: 0.85 }),
    badge: css({
      position: "absolute",
      top: 24,
      padding: "8px 14px",
      borderRadius: 8,
      border: "4px solid",
      fontSize: 26,
      fontWeight: "bold",
      letterSpacing: 2,
      textTransform: "uppercase",
      pointerEvents: "none",
    }),
    like: css({ left: 20, color: "#4ADE80", borderColor: "#4ADE80", transform: "rotate(-12deg)" }),
    nope: css({ right: 20, color: "#F87171", borderColor: "#F87171", transform: "rotate(12deg)" }),
  };

  return (
    <motion.div
      css={styles.card}
      style={{
        x,
        rotate,
        scale: 1 - stackDepth * 0.04,
        top: stackDepth * 10,
      }}
      drag={isTop && !decided ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
    >
      {movie.posterPath ? (
        <img
          css={styles.poster}
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          alt={movie.title}
        />
      ) : (
        <div css={styles.posterFallback}>{movie.title}</div>
      )}
      <div css={styles.info}>
        <p css={styles.title}>{movie.title}</p>
        <p css={styles.meta}>
          {movie.year}
          {movie.voteAverage ? ` · ★ ${movie.voteAverage}` : ""}
        </p>
      </div>
      {isTop && (
        <React.Fragment>
          <motion.div css={[styles.badge, styles.like]} style={{ opacity: likeOpacity }}>
            Yes
          </motion.div>
          <motion.div css={[styles.badge, styles.nope]} style={{ opacity: nopeOpacity }}>
            No
          </motion.div>
        </React.Fragment>
      )}
    </motion.div>
  );
});

export default SwipeCard;
