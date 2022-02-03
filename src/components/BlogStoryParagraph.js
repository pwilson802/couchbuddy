/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import BlogProviders from "./BlogProviders";
import YouTubeVideo from "./YouTubeVideo";
import { Adsense } from "@ctrl/react-adsense";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function BlogStoryParagraph({ paragraph, mode, media, width}) {
const styles = {
    pageWrapper: css({
      width: "100%",
    }),
    text: css({
      color: colors[mode]["text"],
    }),
    imageWrapper: css({
      textAlign: "center",
    }),
  };
    return (
        <div css={styles.pageWrapper}>
            <div css={styles.text}>
            {documentToReactComponents(paragraph)}
            </div>
            <div>
                {media != null && media.type == "image" && (
                    <div css={styles.imageWrapper}>
                        <img src={media.address} alt={media.imageText } />
                    </div>
                )}
                {media != null && media.type == "video" && (
                    <div css={styles.imageWrapper}>
                        <YouTubeVideo id={media.address} width={width } />
                    </div>
                )}
            </div>
        </div>
    )
}

export default BlogStoryParagraph