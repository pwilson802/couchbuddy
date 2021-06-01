/** @jsxRuntime classic */
/** @jsx jsx */
import Head from "next/head";
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import Footer from "../components/Footer";

export default function Home({
  location,
  handleLocation,
  mode,
  changeMode,
  consent,
  refine,
  setRefine,
  refineData,
  setRefineData,
}) {
  // useEffect(() => {
  //   const currentMode = localStorage.getItem("mode") || "dark";
  //   changeMode(currentMode);
  // }, []);

  return (
    <div>
      <Head>
        <title>Couch Buddy - Find Movies to Watch</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Find a movie to watch when you don’t know what to watch. Filter by streaming providers, genre, age classification and duration, then let us do the searching"
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
          content="https://couchbuddy-images.s3.amazonaws.com/twitter-card-main4.png"
        />
        <meta property="og:title" content="CouchBuddy" />
        <meta
          property="og:description"
          content="Not sure what to watch? CouchBuddy's got you sorted"
        />
        <meta
          property="og:image"
          content="https://couchbuddy-images.s3.amazonaws.com/twitter-card-main4.png"
        />
        <meta property="og:url" content="https://couchbuddy.info" />
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="840" />
        <meta property="og:image:height" content="440" />
      </Head>

      <main>
        <App
          mode={mode}
          changeMode={changeMode}
          location={location}
          handleLocation={handleLocation}
          consent={consent}
          refineData={refineData}
          refine={refine}
          setRefine={setRefine}
          setRefineData={setRefineData}
        />
      </main>
    </div>
  );
}
