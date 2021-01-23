import Amplify from "aws-amplify";
import config from "../../aws-exports";
Amplify.configure(config);
import { useEffect, useState } from "react";
import Head from "next/head";
import PostPreview from "../../components/PostPreview";

function changeBackground(mode) {
  if (mode === "dark") {
    document.body.style = "background: #15202A";
  } else {
    document.body.style = "background: white";
  }
}

const client = require("contentful").createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_KEY,
});

function HomePage() {
  const [location, setLocation] = useState("AU");
  const [previews, setPreviews] = useState([]);
  const [mode, setMode] = useState("dark");

  const changeMode = (mode) => {
    localStorage.setItem("mode", mode);
    changeBackground(mode);
    setMode(mode);
  };

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
  }, []);

  useEffect(() => {
    async function getPreviews() {
      const allPreviews = await fetchEntries();
      setPreviews([...allPreviews]);
    }
    getPreviews();
  }, []);
  console.log(previews);

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
      {previews.length > 0
        ? previews.map((p) => (
            <PostPreview
              key={p.fields.slug}
              articleType={p.fields.articleType}
              heading={p.fields.heading}
              introduction={p.fields.introduction}
              sharingImage={p.fields.sharingImage}
              slug={p.fields.slug}
            />
          ))
        : null}
    </>
  );
}

export default HomePage;
