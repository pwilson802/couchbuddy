/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import BlogSocials from "./BlogSocials";
import MovieBlurb from "./MovieBlurb";

const colors = {
  light: {
    text: "black",
    author: "#878787",
    heading: "black",
  },
  dark: {
    text: "white",
    author: "rgba(225,44,134, 0.8)",
    heading: "rgba(150,208,211, 1)",
  },
};

function BlogMovieList({
  articleType,
  author,
  heading,
  slug,
  introduction,
  pageDetails,
  mode,
  location,
}) {
  const authorImage = `/people/${author.toLowerCase().replace(" ", "")}.png`;

  const styles = {
    pageWrapper: css({
      width: "100%",
    }),
    heading: css({
      textAlign: "center",
      margin: 0,
      color: colors[mode]["heading"],
    }),
    introduction: css({
      color: colors[mode]["text"],
    }),
    author: css({
      color: colors[mode]["author"],
      marginRight: "1rem",
    }),
    authorWrap: css({
      marginTop: "1rem",
      display: "flex",
      alignItems: "center",
    }),
    authorSocials: css({
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginRight: "5px",
    }),
  };

  return (
    <div css={styles.pageWrapper}>
      <h1 css={styles.heading}>{articleType + " " + heading}</h1>
      <div css={styles.authorSocials}>
        <div css={styles.authorWrap}>
          <p css={styles.author}>by {author}</p>
          <img
            src={authorImage}
            alt="Picture of author"
            width={50}
            height={50}
          />
        </div>
        <div css={styles.socials}>
          <BlogSocials slug={slug} />
        </div>
      </div>
      <p css={styles.introduction}>{introduction}</p>
      {pageDetails.blurbs.length > 0
        ? pageDetails.blurbs.map((p, index) => (
            <MovieBlurb
              id={p.fields.movieId}
              body={p.fields.body}
              key={p.fields.movieId}
              providers={p.fields.providers[location] || {}}
              movieDetails={p.fields.movieDetails}
              mode={mode}
              itemIndex={index}
            />
          ))
        : null}
    </div>
  );
}

export default BlogMovieList;
