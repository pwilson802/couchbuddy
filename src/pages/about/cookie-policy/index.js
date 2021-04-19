/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Logo from "../../../components/Logo";
import Image from "next/image";
import Footer from "../../../components/Footer";

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
  },
  dark: {
    text: "rgba(255,255,255,0.8)",
  },
};

function CookiePolicy({ consent, updateConsent }) {
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

  const styles = {
    text: css({
      color: colors[mode]["text"],
      fontSize: 14,
    }),
    nav: css({
      display: "flex",
      margin: 10,
      flexDirection: "row",
      justifyContent: "space-evenly",
    }),
    aboutWrapper: css({
      color: colors[mode]["text"],
      margin: "0 5%",
      display: "flex",
      alignItems: "flex-start",
      flexDirection: "column",
      "@media(min-width: 778px)": {
        margin: "0 20%",
      },
    }),
    tmdImage: css({
      width: "70px",
      marginTop: 0,
    }),
    mailLink: css({
      color: "#E12C86",
    }),
    logoWrap: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    }),
    buttonWraper: css({
      display: "flex",
      justifyContent: "flex-end",
    }),
    cookieButton: css({
      background: "transparent",
      border: "solid",
      borderColor: colors[mode]["text"],
      color: colors[mode]["text"],
      padding: "8px 30px",
      fontSize: "14px",
      margin: "0 16px 16px 16px",
      borderRadius: "2px",
      cursor: "pointer",
      outline: "none",
    }),
    cookieButtonEnabled: css({
      background: "#FDD782",
      border: "0",
      color: "f5f6fa",
      padding: "8px 30px",
      fontSize: "14px",
      margin: "0 16px 16px 16px",
      borderRadius: "2px",
      cursor: "pointer",
      outline: "none",
    }),
  };
  return (
    <>
      <Head>
        <title>Couch Buddy / About</title>
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
      <main css={styles.aboutWrapper}>
        <div css={styles.logoWrap}>
          <Logo logo={"main"} width={250} />
        </div>
        <h1>Cookie policy</h1>
        <p>
          This cookie policy (&quot;Policy&quot;) describes what cookies are and
          how and they&#039;re being used by the{" "}
          <a target="_blank" rel="nofollow" href="https://couchbuddy.info">
            couchbuddy.info
          </a>{" "}
          website (&quot;Website&quot; or &quot;Service&quot;) and any of its
          related products and services (collectively, &quot;Services&quot;).
          This Policy is a legally binding agreement between you
          (&quot;User&quot;, &quot;you&quot; or &quot;your&quot;) and this
          Website operator (&quot;Operator&quot;, &quot;we&quot;, &quot;us&quot;
          or &quot;our&quot;). You should read this Policy so you can understand
          the types of cookies we use, the information we collect using cookies
          and how that information is used. It also describes the choices
          available to you regarding accepting or declining the use of cookies.
          For further information on how we use, store and keep your personal
          data secure, see our{" "}
          <a
            target="_blank"
            rel="nofollow"
            href="https://couchbuddy.info/about/privacy-policy"
          >
            privacy policy
          </a>
          .
        </p>
        <h2>What are cookies?</h2>
        <p>
          Cookies are small pieces of data stored in text files that are saved
          on your computer or other devices when websites are loaded in a
          browser. They are widely used to remember you and your preferences,
          either for a single visit (through a &quot;session cookie&quot;) or
          for multiple repeat visits (using a &quot;persistent cookie&quot;).
        </p>
        <p>
          Session cookies are temporary cookies that are used during the course
          of your visit to the Website, and they expire when you close the web
          browser.
        </p>
        <p>
          Persistent cookies are used to remember your preferences within our
          Website and remain on your desktop or mobile device even after you
          close your browser or restart your computer. They ensure a consistent
          and efficient experience for you while visiting the Website and
          Services.
        </p>
        <p>
          Cookies may be set by the Website (&quot;first-party cookies&quot;),
          or by third parties, such as those who serve content or provide
          advertising or analytics services on the Website (&quot;third party
          cookies&quot;). These third parties can recognize you when you visit
          our website and also when you visit certain other websites.{" "}
          <a
            target="_blank"
            href="https://www.websitepolicies.com/blog/cookies"
          >
            Click here
          </a>{" "}
          to learn more about cookies and how they work.
        </p>
        <h2>What type of cookies do we use?</h2>
        <h3>Necessary cookies</h3>
        <p>
          Necessary cookies allow us to offer you the best possible experience
          when accessing and navigating through our Website and using its
          features. For example, these cookies let us recognize that you have
          created an account and have logged into that account to access the
          content.
        </p>
        <h3>Functionality cookies</h3>
        <p>
          Functionality cookies let us operate the Website and Services in
          accordance with the choices you make. For example, we will remember
          how you customized the Website and Services during future visits.
        </p>
        <h3>Analytical cookies</h3>
        <p>
          These cookies enable us and third party services to collect aggregated
          data for statistical purposes on how our visitors use the Website.
          These cookies do not contain personal information such as names and
          email addresses and are used to help us improve your user experience
          of the Website.
        </p>
        <h3>Advertising cookies</h3>
        <p>
          Advertising cookies allow us and third parties serve relevant ads to
          you more effectively and help us collect aggregated audit data,
          research, and performance reporting for advertisers. They also enable
          us to understand and improve the delivery of ads to you and know when
          certain ads have been shown to you.
        </p>
        <p>
          Your web browser may request advertisements directly from ad network
          servers, these networks can view, edit, or set their own cookies, just
          as if you had requested a web page from their website.
        </p>
        <p>
          Although we do not use cookies to create a profile of your browsing
          behavior on third party websites, we do use aggregate data from third
          parties to show you relevant, interest-based advertising. We do not
          provide any personal information that we collect to advertisers.
        </p>
        <h2>What are your cookie options?</h2>
        <p>
          If you don't like the idea of cookies or certain types of cookies, you
          can change your browser's settings to delete cookies that have already
          been set and to not accept new cookies. To learn more about how to do
          this, visit{" "}
          <a target="_blank" href="https://www.internetcookies.com">
            internetcookies.com
          </a>
        </p>
        <p>
          Please note, however, that if you delete cookies or do not accept
          them, you might not be able to use all of the features the Website and
          Services offer.
        </p>
        <p>
          You may adjust your cookie options for this website by using the below
          buttons.
        </p>
        <div css={styles.buttonWraper}>
          <button
            onClick={() => updateConsent("yes")}
            css={
              consent == "yes"
                ? styles.cookieButtonEnabled
                : styles.cookieButton
            }
          >
            ACCEPT COOKIES
          </button>
          <button
            onClick={() => updateConsent("no")}
            css={
              consent == "no" ? styles.cookieButtonEnabled : styles.cookieButton
            }
          >
            DENY COOKIES
          </button>
        </div>
        <h2>Changes and amendments</h2>
        <p>
          We reserve the right to modify this Policy or its terms relating to
          the Website and Services at any time, effective upon posting of an
          updated version of this Policy on the Website. When we do, we will
          revise the updated date at the bottom of this page. Continued use of
          the Website and Services after any such changes shall constitute your
          consent to such changes.
        </p>
        <h2>Acceptance of this policy</h2>
        <p>
          You acknowledge that you have read this Policy and agree to all its
          terms and conditions. By accessing and using the Website and Services
          you agree to be bound by this Policy. If you do not agree to abide by
          the terms of this Policy, you are not authorized to access or use the
          Website and Services.
        </p>
        <h2>Contacting us</h2>
        <p>
          If you would like to contact us to understand more about this Policy
          or wish to contact us concerning any matter relating to our use of
          cookies, you may send an email to
          &#105;&#110;f&#111;&#64;c&#111;&#117;c&#104;&#98;&#117;&#100;dy&#46;&#105;n&#102;o.
        </p>
        <p>This document was last updated on April 17, 2021</p>
      </main>
      <footer>
        <Footer activePage="about" mode={mode} />
      </footer>
    </>
  );
}

export default CookiePolicy;
