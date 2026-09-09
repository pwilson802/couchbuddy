/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const EXIT_DISTANCE = 600;

// Purely decorative - SwipeDeck spawns one of these in a card's place the
// instant a swipe is committed (see SwipeCard's commit()), so the "flying
// off screen" visual can keep playing without blocking the real queue: the
// actual next card underneath is already interactive from frame one, and
// pointerEvents:none here means a fast second swipe passes straight
// through to it instead of landing on this fading-out ghost.
function SwipeCardGhost({ movie, direction, startX, onFinished }) {
  const x = useMotionValue(startX || 0);
  const rotate = useTransform(x, [-250, 250], [-16, 16]);

  useEffect(() => {
    const controls = animate(x, direction === "yes" ? EXIT_DISTANCE : -EXIT_DISTANCE, {
      type: "spring",
      stiffness: 260,
      damping: 26,
      onComplete: onFinished,
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <motion.div css={styles.card} style={{ x, rotate }}>
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
