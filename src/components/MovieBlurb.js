/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import BlogProviders from "./BlogProviders";
import FakeAd from "./FakeAd";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function MovieBlurb({ id, body, providers, movieDetails, mode }) {
  const title = movieDetails.original_title;
  const tagline = movieDetails.tagline;
  const runtime = movieDetails.runtime;
  const image = "http://image.tmdb.org/t/p/w185" + movieDetails.poster_path;

  const styles = {
    image: css({
      // width: "30%",
      float: "left",
      marginRight: "0.5rem",
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
    }),
    adWrap: css({
      marginTop: "1rem",
    }),
  };

  return (
    <div>
      <h2 css={styles.title}>{title}</h2>
      <div css={styles.wrapper}>
        <img css={styles.image} src={image} alt="" />
        {body}
      </div>
      <BlogProviders providers={providers} mode={mode} />
      <div css={styles.adWrap}>
        <FakeAd num={1} />
      </div>
    </div>
  );
}

export default MovieBlurb;
