/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Link from "next/link";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function PostPreview({
  articleType,
  heading,
  introduction,
  sharingImage,
  slug,
  topPost,
  mode,
}) {
  console.log("colors", colors[mode]);
  const articleTitle = "What to Watch " + heading;
  const articleLink = "/blog/" + slug;

  const styles = {
    heading: css({
      color: colors[mode]["text"],
      fontSize: "1.8rem",
      margin: "0",
    }),
    introduction: css({
      color: colors[mode]["text"],
      marginTop: "0.5rem",
    }),
    image: css({
      borderRadius: "20px",
      width: "100%",
    }),
  };
  return (
    <Link href={articleLink}>
      <div css={styles.wrapper}>
        <img css={styles.image} src={sharingImage} alt={articleTitle} />
        <h1 css={styles.heading}>{articleType + " " + heading}</h1>
        {topPost && (
          <p css={styles.introduction}>{introduction.slice(1, 150)}</p>
        )}
      </div>
    </Link>
  );
}

export default PostPreview;
