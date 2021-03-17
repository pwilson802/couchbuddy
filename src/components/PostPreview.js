/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Link from "next/link";

const colors = {
  light: {
    text: "black",
    heading: "black",
  },
  dark: {
    text: "white",
    heading: "#96D0D3",
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
  const articleTitle = "What to Watch " + heading;
  const articleLink = "/blog/" + slug;

  const styles = {
    heading: css({
      color: colors[mode]["heading"],
      fontSize: "1.7rem",
      lineHeight: "1.8rem",
      margin: "3px 0",
    }),
    introduction: css({
      color: colors[mode]["text"],
      marginTop: "0.5rem",
    }),
    image: css({
      borderRadius: "20px",
      width: "100%",
    }),
    wrapper: css({
      cursor: "pointer",
    }),
  };
  return (
    <Link href={articleLink}>
      <div css={styles.wrapper}>
        <img css={styles.image} src={sharingImage} alt={articleTitle} />
        {/* <Image
          css={styles.image}
          src={sharingImage}
          alt={articleTitle}
          width={840}
          height={441}
          layout="responsive"
        /> */}
        <h1 css={styles.heading}>{articleType + " " + heading}</h1>
        {topPost && (
          <p css={styles.introduction}>{introduction.slice(1, 150)}</p>
        )}
      </div>
    </Link>
  );
}

export default PostPreview;
