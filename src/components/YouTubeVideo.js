/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import YouTube from "react-youtube";

function YouTubeVideo({ id, width }) {
  let videoWidth = 360;

  if (width < 600) {
    videoWidth = { width: "340" };
  } else if (width < 680) {
    videoWidth = { width: "520" };
  } else if (width < 720) {
    videoWidth = { width: "600" };
  } else {
    videoWidth = {};
  }

  const opts = videoWidth;
  console.log(opts);
  opts["playerVars"] = { origin: window.location.origin };

  const styles = {
    wrapper: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    }),
  };

  return (
    <div css={styles.wrapper}>
      <YouTube videoId={id} opts={opts} css={styles.wrapper} />
    </div>
  );
}

export default YouTubeVideo;
