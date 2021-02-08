/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Amplify from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";
import config from "../../aws-exports";
Amplify.configure(config);
import React, { useEffect, useState } from "react";
import Head from "next/head";
import MovieBlurb from "../../components/MovieBlurb";
import { useRouter } from "next/router";
import NavBlog from "../../components/NavBlog";

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
    author: "#878787",
    heading: "black",
  },
  dark: {
    text: "white",
    author: "rgba(225,44,134, 0.8)",
    heading: "rgba(150,208,211, 1)",
  },
};

function Article({ blurbs, article }) {
  const [location, setLocation] = useState("AU");
  const [mode, setMode] = useState("dark");
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const {
    heading,
    sharingDescription,
    sharingTitle,
    sharingImage,
    articleType,
    introduction,
    author,
  } = article[0].fields;

  const changeMode = (mode) => {
    localStorage.setItem("mode", mode);
    changeBackground(mode);
    setMode(mode);
  };

  function handleLocation(loc) {
    localStorage.setItem("country", loc.target.value);
    setLocation(loc.target.value);
  }

  useEffect(() => {
    const currentMode = localStorage.getItem("mode") || "dark";
    changeMode(currentMode);
    const currentLocation = localStorage.getItem("country") || "US";
    setLocation(currentLocation);
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
      margin: "1rem 3%",
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
      marginTop: "0.5rem",
    }),
    articlesWrapper: css({
      "@media(min-width: 1024px)": {
        margin: "0 20%",
      },
      "@media(min-width: 768px)": {
        margin: "0 10%",
      },
    }),
  };

  return (
    <>
      <Head>
        <title>{article.length > 0 ? article[0].fields.heading : ""}</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content={
            article.length > 0 ? article[0].fields.sharingDescription : ""
          }
        />
        <meta
          name="twitter:title"
          content={article.length > 0 ? article[0].fields.sharingTitle : ""}
        />
        <meta name="twitter:site" content="@couch_buddy" />
        <meta
          name="twitter:image"
          content={article.length > 0 ? article[0].fields.sharingImage : ""}
        />
      </Head>
      <NavBlog
        handleLocation={handleLocation}
        location={location}
        mode={mode}
      />
      <div css={styles.pageWrapper}>
        <div css={styles.imageWrapper}>
          <img css={styles.image} src={sharingImage} alt={heading} />
        </div>
        <div css={styles.articlesWrapper}>
          <h1 css={styles.heading}>{articleType + " " + heading}</h1>
          <p css={styles.author}>by {author}</p>
          <p css={styles.introduction}>{introduction}</p>
          {blurbs.length > 0
            ? blurbs.map((p) => (
                <MovieBlurb
                  id={p.fields.movieId}
                  body={p.fields.body}
                  key={p.fields.movieId}
                  providers={p.fields.providers[location]}
                  movieDetails={p.fields.movieDetails}
                  mode={mode}
                />
              ))
            : null}
        </div>
      </div>
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
  // getMovieDetails("127585").then((data) => console.log(data));

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
  console.log();
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
