/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import YouTube from "react-youtube";

function YouTubeVideo({ id }) {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

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
      <YouTube videoId={id} options={opts} />
    </div>
  );
}

export default YouTubeVideo;
