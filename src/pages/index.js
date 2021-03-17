/** @jsxRuntime classic */
/** @jsx jsx */
import Head from "next/head";
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "../components/App";

// function changeBackground(mode) {
//   if (mode === "dark") {
//     document.body.style = "background: #15202A";
//   } else {
//     document.body.style = "background: white";
//   }
// }

export default function Home({ location, handleLocation, mode, changeMode }) {
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

  return (
    <div>
      <Head>
        <title>Couch Buddy</title>
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
          content="https://couchbuddy-images.s3.amazonaws.com/twitter-card-main.png"
        />
        <meta property="og:title" content="CouchBuddy" />
        <meta
          property="og:description"
          content="Not sure what to watch? CouchBuddy's got you sorted"
        />
        <meta
          property="og:image"
          content="https://couchbuddy-images.s3.amazonaws.com/twitter-card-main.png"
        />
      </Head>

      <main>
        <App
          mode={mode}
          changeMode={changeMode}
          location={location}
          handleLocation={handleLocation}
        />
      </main>
    </div>
  );
}
