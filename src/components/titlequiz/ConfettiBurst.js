/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/react";

const COLORS = ["#e12c86", "#fdd782", "#96d0d3", "#7ed957", "#5271ff"];
const PARTICLE_COUNT = 14;

const wrapperStyle = css({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 0,
  height: 0,
});

function particleStyle(angle, distance, color) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * distance;
  const dy = Math.sin(rad) * distance;
  const burst = keyframes`
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(${dx}px, ${dy}px) scale(0.4); opacity: 0; }
  `;
  return css({
    position: "absolute",
    top: 0,
    left: 0,
    width: 7,
    height: 7,
    borderRadius: "50%",
    backgroundColor: color,
    animation: `${burst} 700ms ease-out forwards`,
  });
}

// Purely decorative, self-contained burst of colored dots - regenerated
// fresh each time it's mounted (see the `key` prop used at the call site)
// so the random angles/distances differ per correct answer.
function ConfettiBurst() {
  return (
    <span css={wrapperStyle}>
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (360 / PARTICLE_COUNT) * i + (Math.random() * 20 - 10);
        const distance = 40 + Math.random() * 30;
        const color = COLORS[i % COLORS.length];
        return <span key={i} css={particleStyle(angle, distance, color)} />;
      })}
    </span>
  );
}

export default ConfettiBurst;
