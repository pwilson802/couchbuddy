/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import animation from "../assets/quiz-incorrect.json";
import React, { useState, useRef, useEffect } from "react";

const opacity = {
  notAnswered: "1",
  correct: "0.4",
  incorrect: "1",
};

function BlogQuizIncorrect({ updateScore, correct }) {
  const [active, setActive] = useState(false);
  const player = useRef();
  const styles = {
    wrapper: css({
      width: "51px",
      cursor: "pointer",
      opacity: opacity[correct],
    }),
  };

  useEffect(() => {
    if (correct === "incorrect") {
      player.current.setSpeed(0.4);
      player.current.setDirection(1);
      player.current.play();
      setTimeout(() => setActive(true), 1500);
    }
  }, [correct]);

  return (
    <div css={styles.wrapper} onClick={() => updateScore(false)}>
      <Lottie
        animationData={animation}
        autoplay={false}
        loop={false}
        initialSegment={active ? [45, 45] : [20, 45]}
        lottieRef={player}
      />
    </div>
  );
}
//   const player = useRef();
//   const activeSegments =
//     answered && correct == "incorrect" ? [45, 45] : [20, 45];
//   const styles = {
//     wrapper: css({
//       width: "51px",
//       cursor: "pointer",
//       opacity: opacity[correct],
//     }),
//   };

//   const handleClick = () => {
//     if (answered == true) {
//       return;
//     }
//     player.current.setSpeed(0.4);
//     player.current.setDirection(1);
//     player.current.play();
//     setTimeout(() => {
//       updateScore();
//     }, 1500);
//   };

//   return (
//     <div css={styles.wrapper} onClick={handleClick}>
//       <Lottie
//         animationData={animation}
//         autoplay={false}
//         loop={false}
//         initialSegment={activeSegments}
//         lottieRef={player}
//       />
//     </div>
//   );
// }

export default BlogQuizIncorrect;
