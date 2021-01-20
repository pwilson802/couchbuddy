import { useEffect, useState } from "react";
import Head from "next/head";
import PostPreview from "../../components/PostPreview";

const client = require("contentful").createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_KEY,
});

function HomePage() {
  async function fetchEntries() {
    const entries = await client.getEntries({
      content_type: "articleTitle",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  const [previews, setPreviews] = useState([]);

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
