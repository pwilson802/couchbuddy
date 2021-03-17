/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import PostPreview from "../../components/PostPreview";
import NavBlog from "../../components/NavBlog";
import BlogSideBar from "../../components/BlogSideBar";
import BlogPreviewScroll from "../../components/BlogPreviewScroll";

// function changeBackground(mode) {
//   if (mode === "dark") {
//     document.body.style = "background: #15202A";
//   } else {
//     document.body.style = "background: white";
//   }
// }

function HomePage({ location, handleLocation, mode, changeMode, previews }) {
  // console.log("preview", previews);
  // const [mode, setMode] = useState("dark");

  // const changeMode = (mode) => {
  //   localStorage.setItem("mode", mode);
  //   changeBackground(mode);
  //   setMode(mode);
  // };

  useEffect(() => {
    const currentMode = localStorage.getItem("mode") || "dark";
    changeMode(currentMode);
  }, []);

  const styles = {
    previewsWrapper: css({
      margin: "70px 3%",
    }),
    topPreview: css({
      marginTop: "1rem",
      "@media(min-width: 768px)": {
        width: "70%",
      },
    }),
    otherPreviews: css({
      display: "flex",
      flexBasis: "100%",
      flexWrap: "wrap",
      margin: "0 -1%",
    }),
    otherPreviewWrapper: css({
      marginTop: "2rem",
      width: "100%",
      margin: "1rem 1%",
      "@media(min-width: 768px)": {
        width: "48%",
      },
      "@media(min-width: 1024px)": {
        width: "31%",
      },
    }),
    topSection: css({
      "@media(min-width: 768px)": {
        display: "flex",
      },
    }),
    sideBar: css({
      "@media(min-width: 768px)": {
        marginTop: "1rem",
        marginLeft: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    }),
  };

  return (
    <>
      <Head>
        <title>CouchBuddy Blog</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="Not sure what to watch? CouchBuddy's got you sorted"
        />
        <meta name="twitter:title" content="CouchBuddy" />
        <meta name="twitter:site" content="@couch_buddy" />
        <meta
          name="twitter:image"
          content="https://couchbuddy.s3-ap-southeast-2.amazonaws.com/twitterCard.png"
        />
        <meta property="og:title" content="CouchBuddy" />
        <meta
          property="og:description"
          content="Not sure what to watch? CouchBuddy's got you sorted"
        />
        <meta
          property="og:image"
          content="https://couchbuddy.s3-ap-southeast-2.amazonaws.com/twitterCard.png"
        />
      </Head>
      <NavBlog
        handleLocation={handleLocation}
        location={location}
        mode={mode}
        changeMode={changeMode}
      />
      <div css={styles.previewsWrapper}>
        <div css={styles.topSection}>
          <div css={styles.topPreview}>
            {previews.length > 0
              ? previews
                  .slice(0, 1)
                  .map((p) => (
                    <PostPreview
                      key={p.fields.slug}
                      articleType={p.fields.articleType}
                      heading={p.fields.heading}
                      introduction={p.fields.introduction}
                      sharingImage={p.fields.sharingImage}
                      slug={p.fields.slug}
                      topPost={true}
                      mode={mode}
                    />
                  ))
              : null}
          </div>
          <div css={styles.sideBar}>
            <BlogSideBar mode={mode} />
          </div>
        </div>
        {previews.length > 0 ? (
          <BlogPreviewScroll mode={mode} previews={previews.slice(1)} />
        ) : null}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const client = require("contentful").createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_KEY,
  });

  async function fetchEntries() {
    const entries = await client.getEntries({
      content_type: "articleTitle",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  async function getPreviews() {
    const allPreviews = await fetchEntries();
    const sortedPreviews = allPreviews.sort((a, b) => {
      const firstDate = new Date(a.fields.dateAdded);
      const secondDate = new Date(b.fields.dateAdded);
      if (firstDate - secondDate < 0) {
        console.log("--- sort returned 1");
        return 1;
      } else if (firstDate - secondDate > 0) {
        console.log("--- sort returned 2");
        return -1;
      }
      return 0;
    });
    return sortedPreviews;
  }
  const previews = await getPreviews();

  return {
    props: {
      previews,
    },
  };
}

export default HomePage;
