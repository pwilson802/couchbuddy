/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import Image from "next/image";

const colors = {
  light: {
    text: "#96D0D3",
  },
  dark: {
    text: "white",
  },
};

function CouchBuddyAd({ mode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const styles = {
    adwrapper: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }),
    link: css({
      textDecoration: "none",
      display: "block", // Ensure the link is a block element
    }),
    image: css({
      maxWidth: 350,
      height: "auto",
      "@media(min-width: 1024px)": {
        maxWidth: 300,
      },
      "@media(min-width: 1600px)": {
        maxWidth: 400,
      },
    }),
  };

  if (!mounted) {
    return <div css={styles.adwrapper}></div>; // Return an empty wrapper for SSR
  }

  return (
    <div css={styles.adwrapper}>
      <a href="/" css={styles.link}>
        <Image
          src="/couchbyddyad1.png"
          alt="An ad for Couch Buddy"
          width={350}
          height={200} // Adjust this value based on your image's aspect ratio
          layout="responsive"
        />
      </a>
    </div>
  );
}

export default CouchBuddyAd;
