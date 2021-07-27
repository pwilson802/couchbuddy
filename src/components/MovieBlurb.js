/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import BlogProviders from "./BlogProviders";
import FakeAd from "./FakeAd";
import AdResponsiveHorizontal from "./AdResponsiveHorizonal";
import { Adsense } from "@ctrl/react-adsense";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function MovieBlurb({ id, body, providers, movieDetails, mode, itemIndex }) {
  const title = movieDetails.title;
  const tagline = movieDetails.tagline;
  const runtime = movieDetails.runtime;
  const year = movieDetails.release_date.split("-")[0];
  const image = "https://image.tmdb.org/t/p/w185" + movieDetails.poster_path;
  const styles = {
    image: css({
      float: "left",
      marginRight: "1rem",
      marginBottom: "0.5rem",
    }),
    wrapper: css({
      color: colors[mode]["text"],
      "&:after": {
        content: '""',
        clear: "both",
        display: "table",
      },
    }),
    title: css({
      color: colors[mode]["text"],
      fontSize: 32,
      textAlign: "left",
      marginBottom: 10,
    }),
    adWrap: css({
      marginTop: "3rem",
    }),
    articleWrap: css({
      paddingBottom: "50px",
    }),
  };

  return (
    <article css={styles.articleWrap}>
      <h2 css={styles.title}>
        {title} ({year})
      </h2>
      <div css={styles.wrapper}>
        <img css={styles.image} src={image} alt="" />
        {body}
      </div>
      <BlogProviders providers={providers} mode={mode} />
      {/* Only showing ad add after every 3 articles. */}
      {(itemIndex + 1) % 3 === 0 && (
        <div css={styles.adWrap}>
          <Adsense
            client="ca-pub-9245347946008848"
            slot="5327454859"
            style={{ display: "block" }}
            responsive={true}
          />
          {/* <FakeAd num="1" /> */}
        </div>
      )}
    </article>
  );
}

export default MovieBlurb;
