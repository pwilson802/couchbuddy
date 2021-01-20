import { useEffect, useState } from "react";
import Head from "next/head";
import MovieBlurb from "../../components/MovieBlurb";

const client = require("contentful").createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_KEY,
});

import { useRouter } from "next/router";

function Article() {
  const [blurbs, setBlurbs] = useState([]);
  const [article, setArticle] = useState([]);
  const router = useRouter();
  const { slug } = router.query;

  async function fetchEntries() {
    const entries = await client.getEntries({
      "fields.slug": slug,
      content_type: "movieBlurb",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  async function fetchArticle() {
    const entries = await client.getEntries({
      "fields.slug": slug,
      content_type: "articleTitle",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  useEffect(() => {
    async function getDetails() {
      const allBlurbs = await fetchEntries();
      const articleDetails = await fetchArticle();
      setBlurbs([...allBlurbs]);
      setArticle([...articleDetails]);
    }
    getDetails();
  }, []);
  console.log("blurbs", blurbs);
  console.log("article", article);

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
      {blurbs.length > 0
        ? blurbs.map((p) => (
            <MovieBlurb
              movieID={p.fields.movieId}
              body={p.fields.body}
              key={p.fields.movieId}
            />
          ))
        : null}
    </>
  );
}

export default Article;
