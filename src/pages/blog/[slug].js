/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import MovieBlurb from "../../components/MovieBlurb";
import NavBlog from "../../components/NavBlog";
import Footer from "../../components/Footer";
import BlogSocials from "../../components/BlogSocials";
import BlogMovieList from "../../components/BlogMovieList";
import BlogPreviewScroll from "../../components/BlogPreviewScroll";
import BlogQuiz from "../../components/BlogQuiz";
import BlogStory from "../../components/BlogStory";
import BlogRandomMovieQuiz from "../../components/BlogRandomMovieQuiz";

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
  pageDetails,
  previews,
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
  } = pageDetails.article[0].fields;

  // const authorImage = `/people/${author.toLowerCase().replace(" ", "")}.png`;

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
      "@media(min-width: 768px)": {
        margin: "70px  10%",
      },
    }),
    pageWrapperRandomQuiz: css({
      margin: "70px 3%",
      "@media(min-width: 768px)": {
        margin: "70px  8%",
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
    articlesWrapperRandomQuiz: css({
      // "@media(min-width: 1024px)": {
      //   margin: "0 40%",
      // },
      "@media(min-width: 1024px)": {
        margin: "0 10%",
      },
    }),
    articlesWrapper: css({
      // "@media(min-width: 1024px)": {
      //   margin: "0 40%",
      // },
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
    text: css({
      color: colors[mode]["text"],
    }),
  };

  return (
    <>
      <Head>
        <title>
          {pageDetails.article.length > 0 ? articleType + " " + heading : ""}
        </title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={pageDetails.article.length > 0 ? metaDescription : ""}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content={pageDetails.article.length > 0 ? sharingDescription : ""}
        />
        <meta
          name="twitter:title"
          content={pageDetails.article.length > 0 ? sharingTitle : ""}
        />
        <meta name="twitter:site" content="@couch_buddy" />
        <meta
          name="twitter:image"
          content={pageDetails.article.length > 0 ? sharingImage : ""}
        />
        <meta
          property="og:title"
          content={pageDetails.article.length > 0 ? sharingTitle : ""}
        />
        <meta
          property="og:description"
          content={pageDetails.article.length > 0 ? sharingDescription : ""}
        />
        <meta
          property="og:image"
          content={pageDetails.article.length > 0 ? sharingImage : ""}
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
      <main
        css={
          pageDetails.type.includes("random-movie")
            ? styles.pageWrapperRandomQuiz
            : styles.pageWrapper
        }
      >
        {(pageDetails.type === "What to watch" ||
          pageDetails.type === "quiz" ||
          pageDetails.type === "story") && (
            <div css={styles.imageWrapper}>
              <img css={styles.image} src={sharingImage} alt={heading} />
            </div>
          )}
        <div
          css={
            pageDetails.type.includes("random-movie")
              ? styles.articlesWrapperRandomQuiz
              : styles.articlesWrapper
          }
        >
          {pageDetails.type === "What to watch" && (
            <BlogMovieList
              articleType={articleType}
              author={author}
              heading={heading}
              slug={slug}
              introduction={introduction}
              pageDetails={pageDetails}
              mode={mode}
              location={location}
            />
          )}
          {pageDetails.type === "quiz" && (
            <BlogQuiz
              heading={heading}
              slug={slug}
              introduction={introduction}
              pageDetails={pageDetails}
              mode={mode}
              location={location}
            />
          )}
          {pageDetails.type === "story" && (
            <BlogStory
              articleType={articleType}
              author={author}
              heading={heading}
              slug={slug}
              introduction={introduction}
              pageDetails={pageDetails}
              mode={mode}
              location={location}
            />
          )}
          {pageDetails.type.includes("random-movie") && (
            <BlogRandomMovieQuiz
              articleType={articleType}
              author={author}
              heading={heading}
              slug={slug}
              introduction={introduction}
              pageDetails={pageDetails}
              mode={mode}
              location={location}
              previews={previews}
              handleLocation={handleLocation}
            />
          )}
          {(pageDetails.type === "What to watch" ||
            pageDetails.type === "quiz" ||
            pageDetails.type === "story") && (
              <div>
                <h5 css={styles.text}>More from Couch Buddy...</h5>
                <BlogPreviewScroll mode={mode} previews={previews} />
              </div>
            )}
        </div>
      </main>
      {(pageDetails.type === "What to watch" ||
        pageDetails.type === "quiz" ||
        pageDetails.type === "story") && (
          <footer>
            <Footer
              activePage="blog"
              mode={mode}
              location={location}
              handleLocation={handleLocation}
            />
          </footer>
        )}
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
      content_type: "articleTitle",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  async function getPreviews() {
    const allPreviews = await fetchEntries();
    shuffle(allPreviews);
    return allPreviews;
  }

  async function getMovieProviders(id) {
    let TMB_KEY = process.env.TMB_KEY;
    let url = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${TMB_KEY}`;
    const response = await fetchRetry(url, 3);
    const providers = await response.json();
    return providers.results;
  }

  async function getMovieDetails(id) {
    let TMB_KEY = process.env.TMB_KEY;
    let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMB_KEY}&language=en-US`;
    const response = await fetchRetry(url, 3);
    const movieDetails = await response.json();
    return movieDetails;
  }

  async function fetchWhattoWatchEntries() {
    const entries = await client.getEntries({
      "fields.slug": context.params.slug,
      content_type: "movieBlurb",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  async function fetchQuizEntries() {
    const entries = await client.getEntries({
      "fields.slug": context.params.slug,
      content_type: "quizQuestion",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  async function fetchQuizRanks() {
    const entries = await client.getEntries({
      "fields.slug": context.params.slug,
      content_type: "quizRanking",
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

  async function fetchParagraphs() {
    const entries = await client.getEntries({
      "fields.slug": context.params.slug,
      content_type: "storyParagraph",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  async function fetchMedias() {
    const entries = await client.getEntries({
      "fields.slug": context.params.slug,
      content_type: "storyMedia",
    });
    if (entries.items) return entries.items;
    console.log(`Error getting Entries for ${contentType.name}.`);
  }

  async function makeWhattoWatch(article) {
    const response = {};
    const blurbs = await fetchWhattoWatchEntries();
    for (let i = 0; i < blurbs.length; i++) {
      let id = blurbs[i].fields.movieId;
      let providers = await getMovieProviders(id);
      let movieDetails = await getMovieDetails(id);
      blurbs[i].fields.providers = providers;
      blurbs[i].fields.movieDetails = movieDetails;
    }
    const blurbsSorted = blurbs.sort((a, b) => a.fields.order - b.fields.order);
    response["type"] = "What to watch";
    response["article"] = article;
    response["blurbs"] = blurbsSorted;
    return response;
  }

  async function makeQuiz(article) {
    const response = {};
    const questions = await fetchQuizEntries();
    const ranks = await fetchQuizRanks();
    const questionsList = questions.map((item) => {
      const fields = item.fields;
      return {
        slug: fields.slug,
        answer: fields.answer,
        question: fields.question,
        order: fields.order,
      };
    });
    const sortedQuestions = questionsList.sort((a, b) => a.order - b.order);
    response["type"] = "quiz";
    response["article"] = article;
    response["questions"] = sortedQuestions;
    response["ranks"] = ranks;
    return response;
  }

  async function makeRandomMovieQuiz(article) {
    const response = {};
    response["article"] = article;
    response["type"] = "random-movie-quiz";
    return response;
  }

  async function makeRandomMoviePictureQuiz(article) {
    const response = {};
    response["article"] = article;
    response["type"] = "random-movie-picture-quiz";
    return response;
  }

  async function makeRandomMovieChristmasPictureQuiz(article) {
    const response = {};
    response["article"] = article;
    response["type"] = "random-movie-christmas-picture-quiz";
    return response;
  }

  async function makeStory(article) {
    const response = {};
    const paragraphs = await fetchParagraphs();
    const media = await fetchMedias();
    const paragraphList = paragraphs.map((item) => {
      const fields = item.fields;
      return {
        slug: fields.slug,
        paragraph: fields.paragraph,
        order: fields.order,
      };
    });
    const mediaList = media.map((item) => {
      const fields = item.fields;
      return {
        slug: fields.slug,
        address: fields.address,
        type: fields.type,
        order: fields.order,
        imageText: fields.imageText,
      };
    });
    response["type"] = "story";
    response["article"] = article;
    response["paragraphs"] = paragraphList;
    response["medias"] = mediaList;
    return response;
  }

  const article = await fetchArticle();
  const articleType = article[0].fields.articleType;

  let pageDetails = {};

  if (articleType === "What to watch") {
    pageDetails = await makeWhattoWatch(article);
  }

  if (articleType === "quiz") {
    pageDetails = await makeQuiz(article);
  }

  if (articleType == "story") {
    pageDetails = await makeStory(article);
  }

  if (articleType == "random-movie-quiz") {
    pageDetails = await makeRandomMovieQuiz(article);
  }

  if (articleType == "random-movie-picture-quiz") {
    pageDetails = await makeRandomMoviePictureQuiz(article);
  }

  if (articleType == "random-movie-christmas-picture-quiz") {
    pageDetails = await makeRandomMovieChristmasPictureQuiz(article);
  }

  const allPreviews = await getPreviews();
  const previews = allPreviews.filter(
    (item) => item.fields.slug != context.params.slug
  );

  return {
    props: {
      pageDetails,
      previews,
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

const fetchRetry = async (url, n) => {
  try {
    return await fetch(url);
  } catch (err) {
    console.log("failed to fetch", n);
    if (n === 1) throw err;
    return await fetch_retry(url, n - 1);
  }
};

function shuffle(data) {
  // shuffle the questions using Fisher-Yates Algorithm
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = data[i];
    data[i] = data[j];
    data[j] = temp;
  }
  return data;
}
