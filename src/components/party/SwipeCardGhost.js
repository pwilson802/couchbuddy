/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import { motion } from "framer-motion";

const EXIT_DISTANCE = 600;

function clampRotate(x) {
  return Math.max(-16, Math.min(16, (x / 250) * 16));
}

// Purely decorative - SwipeDeck spawns one of these in a card's place the
// instant a swipe is committed (see SwipeCard's commit()), so the "flying
// off screen" visual can keep playing without blocking the real queue: the
// actual next card underneath is already interactive from frame one, and
// pointerEvents:none here means a fast second swipe passes straight
// through to it instead of landing on this fading-out ghost.
//
// Uses framer-motion's declarative initial/animate (not a manual
// useMotionValue + an animate() call kicked off from useEffect) - a
// useEffect only fires after React has already committed and painted the
// mounted-at-rest frame, so for a frame or two the ghost would sit fully
// overlapping the real next card before its animation even started,
// reading as a jarring double-card "zoom" flash. The declarative form
// starts the transition as part of the mount itself.
function SwipeCardGhost({ movie, direction, startX, onFinished }) {
  const from = startX || 0;
  const to = direction === "yes" ? EXIT_DISTANCE : -EXIT_DISTANCE;

  const styles = {
    card: css({
      position: "absolute",
      inset: 0,
      borderRadius: 18,
      overflow: "hidden",
      backgroundColor: "#111",
      boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
      pointerEvents: "none",
    }),
    poster: css({ width: "100%", height: "100%", objectFit: "cover", display: "block" }),
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
    }),
    title: css({ margin: 0, fontSize: 20, fontWeight: "bold" }),
  };

  return (
    <motion.div
      css={styles.card}
      initial={{ x: from, rotate: clampRotate(from) }}
      animate={{ x: to, rotate: clampRotate(to) }}
      // A spring starting from rest ramps up gradually rather than moving
      // fast immediately - for a short time the two nearly-full-size
      // cards sit heavily overlapped, which reads as a "zoom" even though
      // nothing is actually flashing or popping (see the declarative
      // initial/animate fix above for that separate issue). An ease-out
      // tween moves fastest right at the start, clearing the overlap
      // quickly instead of lingering in it.
      transition={{ duration: 0.32, ease: "easeOut" }}
      onAnimationComplete={onFinished}
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
      </div>
    </motion.div>
  );
}

export default SwipeCardGhost;
