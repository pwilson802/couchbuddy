/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import MovieBlurb from "../../components/MovieBlurb";
import NavBlog from "../../components/NavBlog";
import Footer from "../../components/Footer";
import BlogSocials from "../../components/BlogSocials";

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

function Article({
  location,
  handleLocation,
  mode,
  changeMode,
  blurbs,
  article,
}) {
  const {
    heading,
    sharingDescription,
    sharingTitle,
    sharingImage,
    articleType,
    introduction,
    author,
    metaDescription,
    slug,
  } = article[0].fields;

  const authorImage = `/people/${author.toLowerCase().replace(" ", "")}.png`;

  useEffect(() => {
    const currentMode = localStorage.getItem("mode") || "dark";
    changeMode(currentMode);
  }, []);

  const styles = {
    image: css({
      borderRadius: "20px",
      width: "100%",
      "@media(min-width: 1024px)": {
        width: "80%",
        textAlign: "center",
      },
    }),
    imageWrapper: css({
      textAlign: "center",
    }),
    pageWrapper: css({
      margin: "70px 3%",
      "@media(min-width: 1024px)": {
        margin: "70px  40%",
      },
      "@media(min-width: 768px)": {
        margin: "70px  10%",
      },
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
    articlesWrapper: css({
      "@media(min-width: 1024px)": {
        margin: "0 40%",
      },
      "@media(min-width: 768px)": {
        margin: "0 10%",
      },
    }),
    authorSocials: css({
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginRight: "5px",
    }),
  };

  return (
    <>
      <Head>
        <title>{article.length > 0 ? articleType + " " + heading : ""}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={article.length > 0 ? metaDescription : ""}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content={article.length > 0 ? sharingDescription : ""}
        />
        <meta
          name="twitter:title"
          content={article.length > 0 ? sharingTitle : ""}
        />
        <meta name="twitter:site" content="@couch_buddy" />
        <meta
          name="twitter:image"
          content={article.length > 0 ? sharingImage : ""}
        />
        <meta
          property="og:title"
          content={article.length > 0 ? sharingTitle : ""}
        />
        <meta
          property="og:description"
          content={article.length > 0 ? sharingDescription : ""}
        />
        <meta
          property="og:image"
          content={article.length > 0 ? sharingImage : ""}
        />
        <meta
          property="og:url"
          content={`https://couchbuddy.info/blog/${slug}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="840" />
        <meta property="og:image:height" content="440" />
      </Head>
      <NavBlog
        handleLocation={handleLocation}
        location={location}
        mode={mode}
        changeMode={changeMode}
      />
      <main css={styles.pageWrapper}>
        <div css={styles.imageWrapper}>
          <img css={styles.image} src={sharingImage} alt={heading} />
        </div>
        <div css={styles.articlesWrapper}>
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
          {blurbs.length > 0
            ? blurbs.map((p, index) => (
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
      </main>
      <footer>
        <Footer activePage="blog" mode={mode} />
      </footer>
    </>
  );
}

export async function getStaticProps(context) {
  const client = require("contentful").createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_KEY,
  });

  async function getMovieProviders(id) {
    let TMB_KEY = process.env.TMB_KEY;
    let url = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${TMB_KEY}`;
    const response = await fetch(url);
    const providers = await response.json();
    return providers.results;
  }

  async function getMovieDetails(id) {
    let TMB_KEY = process.env.TMB_KEY;
    let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMB_KEY}&language=en-US`;
    const response = await fetch(url);
    const movieDetails = await response.json();
    return movieDetails;
  }

  async function fetchEntries() {
    const entries = await client.getEntries({
      "fields.slug": context.params.slug,
      content_type: "movieBlurb",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  async function fetchArticle() {
    const entries = await client.getEntries({
      "fields.slug": context.params.slug,
      content_type: "articleTitle",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }
  const blurbs = await fetchEntries();
  const article = await fetchArticle();
  for (let i = 0; i < blurbs.length; i++) {
    let id = blurbs[i].fields.movieId;
    let providers = await getMovieProviders(id);
    let movieDetails = await getMovieDetails(id);
    blurbs[i].fields.providers = providers;
    blurbs[i].fields.movieDetails = movieDetails;
  }

  return {
    props: {
      blurbs,
      article,
    },
  };
}

export async function getStaticPaths() {
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
  const posts = await fetchEntries();

  const paths = posts.map(({ fields: { slug } }) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
}

export default Article;
