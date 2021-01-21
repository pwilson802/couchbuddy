/** @jsxRuntime classic */
/** @jsx jsx */
import Head from "next/head";
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import Amplify from "aws-amplify";
import config from "../aws-exports";
Amplify.configure(config);

function changeBackground(mode) {
  if (mode === "dark") {
    document.body.style = "background: #15202A";
  } else {
    document.body.style = "background: white";
  }
}

export default function Home() {
  const [mode, setMode] = useState("dark");

  const changeMode = (mode) => {
    localStorage.setItem("mode", mode);
    changeBackground(mode);
    setMode(mode);
  };

  useEffect(() => {
    const currentMode = localStorage.getItem("mode") || "dark";
    changeMode(currentMode);
  }, []);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
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

      <main>
        <App mode={mode} changeMode={changeMode} />
      </main>
    </div>
  );
}
