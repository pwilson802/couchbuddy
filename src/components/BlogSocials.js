/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { FacebookShareButton, FacebookIcon } from "react-share";
import React from "react";

function BlogSocials({ slug }) {
  const url = "https://couchbuddy.info/blog/" + slug;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&via=couch_buddy`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

  const styles = {
    wrapper: css({
      display: "flex",
      alignItems: "center",
    }),
    image: css({
      width: 32,
      height: 32,
    }),
    facebookImage: css({
      marginLeft: "25px",
    }),
  };

  return (
    <div css={styles.wrapper}>
      <a href={twitterUrl} target="_blank">
        <img css={styles.image} src="/share/twitter.png" alt="twitter logo" />
      </a>
      {/* <a css={styles.facebookImage} href={facebookUrl} target="_blank">
        <img css={styles.image} src="/share/facebook.png" alt="facebook logo" />
      </a> */}
      <div css={styles.facebookImage}>
        <FacebookShareButton url={url}>
          <FacebookIcon size={34} round={true} />
        </FacebookShareButton>
      </div>
    </div>
  );
}

export default BlogSocials;
