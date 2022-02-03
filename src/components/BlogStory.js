/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import BlogSocials from "./BlogSocials";
import BlogStoryParagraph from "./BlogStoryParagraph";

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

function BlogStory({
  articleType,
  author,
  heading,
  slug,
  introduction,
  pageDetails,
  mode,
  location,
}) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
    const handleResizeWindow = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
    };
    handleResizeWindow();
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

    const medias = pageDetails.medias.reduce((acc, curr) => {
    let tempObj = {address: curr.address, type: curr.type, imageText: curr.imageText}
    acc[curr.order] = tempObj
    return acc 
    }, {})
    console.log(pageDetails)
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
    quizWrapper: css({
      marginTop: 40,
    }),
  };


    return (
    <div css={styles.pageWrapper}>
      <h1 css={styles.heading}>{heading}</h1>
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
            <div css={styles.quizWrapper}>
        {pageDetails.paragraphs.length > 0
                    ? pageDetails.paragraphs.map((p, index) => {
                        const media = medias[p.order] || null
              
                        return (
                        <BlogStoryParagraph
                                paragraph={p.paragraph}
                                mode={mode}
                                itemIndex={index}
                                media={media}
                                width={width}
                        />)
                    })
          : null}
      </div>
    </div>
    )
    
}

export default BlogStory