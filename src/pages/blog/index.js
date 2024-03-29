/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import PostPreview from "../../components/PostPreview";
import NavBlog from "../../components/NavBlog";
import BlogSideBar from "../../components/BlogSideBar";
import BlogPreviewScroll from "../../components/BlogPreviewScroll";
import Footer from "../../components/Footer";

function HomePage({ location, handleLocation, mode, changeMode, previews }) {
  useEffect(() => {
    const currentMode = localStorage.getItem("mode") || "dark";
    changeMode(currentMode);
  }, []);

  const styles = {
    previewsWrapper: css({
      margin: "70px 3%",
      "@media(min-width: 1024px)": {
        margin: "70px  40%",
      },
      "@media(min-width: 768px)": {
        margin: "70px  10%",
      },
    }),
    topPreview: css({
      marginTop: "1rem",
      "@media(min-width: 1024px)": {
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
      "@media(min-width: 1024px)": {
        display: "flex",
      },
    }),
    sideBar: css({
      "@media(min-width: 1024px)": {
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
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="CouchBuddy blog exists to help you choose a movie based on your mood or hankering (and as an excuse for us to write silly things about movies we watch)."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="Not sure what to watch? CouchBuddy's got you sorted"
        />
        <meta name="twitter:title" content="CouchBuddy" />
        <meta name="twitter:site" content="@couch_buddy" />
        <meta
          name="twitter:image"
          content="https://couchbuddy-images.s3.amazonaws.com/twitter-card-blog.png"
        />
        <meta property="og:title" content="CouchBuddy Blog" />
        <meta
          property="og:description"
          content="Not sure what to watch? CouchBuddy's got you sorted"
        />
        <meta
          property="og:image"
          content="https://couchbuddy-images.s3.amazonaws.com/twitter-card-blog.png"
        />
      </Head>
      <NavBlog
        handleLocation={handleLocation}
        location={location}
        mode={mode}
        changeMode={changeMode}
      />
      <main css={styles.previewsWrapper}>
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
      </main>
      <footer>
        <Footer
          activePage="blog"
          mode={mode}
          location={location}
          handleLocation={handleLocation}
        />
      </footer>
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
        return 1;
      } else if (firstDate - secondDate > 0) {
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
