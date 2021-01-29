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
import {
  getCouchmovie,
  getWatchOn,
  listProviders,
  getCertification,
} from "../../graphql/queries";

function changeBackground(mode) {
  if (mode === "dark") {
    document.body.style = "background: #15202A";
  } else {
    document.body.style = "background: white";
  }
}

async function getLocalProviders(country) {
  const locProviders = await API.graphql({
    query: getWatchOn,
    variables: { country: country },
  });
  return JSON.parse(locProviders.data.getWatchOn.data);
}

async function getAllProviderData() {
  const allProviders = await API.graphql({
    query: listProviders,
  });
  const providerList = allProviders.data.listProviders.items;
  const result = providerList.reduce((acc, curr) => {
    let providerID = curr["providerID"];
    let providerName = curr["providerName"];
    let providerLogo = curr["providerLogo"];
    acc[providerID] = {};
    acc[providerID]["name"] = providerName;
    acc[providerID]["logo"] = "http://image.tmdb.org/t/p/w185" + providerLogo;
    return acc;
  }, {});
  return result;
}

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function Article({ blurbs, article }) {
  const [location, setLocation] = useState("AU");
  const [mode, setMode] = useState("dark");
  const [loaded, setLoaded] = useState(false);
  const [localProviderMovies, setLocalProviderMovies] = useState({});
  const [allProviderData, setAllProviderData] = useState();
  const router = useRouter();
  const { slug } = router.query;

  const changeMode = (mode) => {
    localStorage.setItem("mode", mode);
    changeBackground(mode);
    setMode(mode);
  };

  function handleLocation(loc) {
    localStorage.setItem("country", loc.target.value);
    setLocation(loc.target.value);
  }

  async function configureProviders() {
    const localProviderData = await getLocalProviders(location);
    const allProviderData = await getAllProviderData();
    setLocalProviderMovies(localProviderData);
    setAllProviderData(allProviderData);
    setLoaded(true);
  }

  useEffect(() => {
    const currentMode = localStorage.getItem("mode") || "dark";
    changeMode(currentMode);
    const currentLocation = localStorage.getItem("country") || "US";
    setLocation(currentLocation);
    configureProviders();
  }, []);

  console.log("allProviderData", allProviderData);

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
      <h1>{article[0].fields.heading}</h1>
      {blurbs.length > 0
        ? blurbs.map((p) => (
            <MovieBlurb
              id={p.fields.movieId}
              body={p.fields.body}
              key={p.fields.movieId}
              mode={mode}
            />
          ))
        : null}
    </>
  );
}

export async function getStaticProps(context) {
  const client = require("contentful").createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_KEY,
  });

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
