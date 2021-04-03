/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import YouTube from "react-youtube";

function YouTubeVideo({ id, screenSize }) {
  const opts =
    screenSize == "small"
      ? {
          width: "360",
        }
      : {};

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
