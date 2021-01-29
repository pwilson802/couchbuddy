/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Link from "next/link";
// import logoImage from "../assets/tv-ex-small.png";

function Logo({ setPage, logo, width }) {
  const styles = {
    logo: css({
      display: "inline-flex",
      flexDirection: "row",
      alignItems: "flex-end",
      "&:hover": {
        cursor: "pointer",
      },
    }),
  };
  const logoImage =
    logo === "main" ? "/CouchBuddyLogo.png" : "/CouchBuddyBlogLogo.png";

  return (
    <div>
      {logo === "main" && (
        <Link href={"/"}>
          <div css={styles.logo}>
            <img src={logoImage} alt="CouchBuddy Logo" width={width} />
          </div>
        </Link>
      )}
      {logo === "blog" && (
        <Link href={"/blog"}>
          <div css={styles.logo}>
            <img src={logoImage} alt="CouchBuddy Logo" width={width} />
          </div>
        </Link>
      )}
    </div>
  );
}

export default Logo;
