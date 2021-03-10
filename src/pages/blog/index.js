/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
// import Amplify from "aws-amplify";
// import config from "../../aws-exports";
// Amplify.configure(config);
import React, { useEffect, useState } from "react";
import Head from "next/head";
import PostPreview from "../../components/PostPreview";
import NavBlog from "../../components/NavBlog";
import BlogSideBar from "../../components/BlogSideBar";
import Burger from "../../components/Burger";

function changeBackground(mode) {
  if (mode === "dark") {
    document.body.style = "background: #15202A";
  } else {
    document.body.style = "background: white";
  }
}

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

const client = require("contentful").createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_KEY,
});

function HomePage({ location, handleLocation }) {
  // const [location, setLocation] = useState("AU");
  const [previews, setPreviews] = useState([]);
  const [mode, setMode] = useState("dark");

  const changeMode = (mode) => {
    localStorage.setItem("mode", mode);
    changeBackground(mode);
    setMode(mode);
  };

  // function handleLocation(loc) {
  //   localStorage.setItem("country", loc.target.value);
  //   setLocation(loc.target.value);
  // }

  async function fetchEntries() {
    const entries = await client.getEntries({
      content_type: "articleTitle",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  useEffect(() => {
    const currentMode = localStorage.getItem("mode") || "dark";
    changeMode(currentMode);
    // const currentLocation = localStorage.getItem("country") || "US";
    // setLocation(currentLocation);
  }, []);

  useEffect(() => {
    async function getPreviews() {
      const allPreviews = await fetchEntries();
      setPreviews([...allPreviews]);
    }
    getPreviews();
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
      justifyContent: "space-between",
    }),
    otherPreviewWrapper: css({
      marginTop: "2rem",
      width: "100%",
      "@media(min-width: 600px)": {
        width: "49%",
      },
      "@media(min-width: 768px)": {
        width: "32%",
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
        <div css={styles.otherPreviews}>
          {previews.length > 0
            ? previews.slice(1).map((p) => (
                <div css={styles.otherPreviewWrapper}>
                  <PostPreview
                    key={p.fields.slug}
                    articleType={p.fields.articleType}
                    heading={p.fields.heading}
                    introduction={p.fields.introduction}
                    sharingImage={p.fields.sharingImage}
                    slug={p.fields.slug}
                    topPost={false}
                    mode={mode}
                  />
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
}

export default HomePage;
