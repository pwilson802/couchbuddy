/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";

function CookieBanner({ updateConsent }) {
  const styles = {
    cookieContainer: css({
      position: "fixed",
      bottom: "0",
      left: "0",
      right: "0",
      width: "100%",
      background: "#2f3640",
      color: "#f5f6fa",
      padding: "0 32px",
      boxShadow: "0 -2px 16px rgba(47,54,64,0.39)",
      zIndex: "999",
      transition: "400ms",
    }),
    policyLink: css({
      textDecoration: "none",
      color: "#f5f6fa",
    }),
    cookieParapraph: css({
      margin: "24px 0",
      lineHeight: "2",
    }),
    cookieButtonAccept: css({
      background: "#FDD782",
      border: "0",
      color: "f5f6fa",
      padding: "12px 48px",
      fontSize: "18px",
      margin: "0 16px 16px 16px",
      borderRadius: "8px",
      cursor: "pointer",
    }),
    cookieButtonDeny: css({
      background: "#E12C86",
      border: "0",
      color: "f5f6fa",
      padding: "12px 48px",
      fontSize: "18px",
      margin: "0 16px 16px 16px",
      borderRadius: "8px",
      cursor: "pointer",
    }),
    buttonWraper: css({
      display: "flex",
      justifyContent: "flex-end",
    }),
  };
  return (
    <div css={styles.cookieContainer}>
      <p css={styles.cookieParapraph}>
        This website uses cookies or similar technologies. Some cookies are
        necessary for the website to function properly and cannot be refused if
        you want to visit this site. We use other cookies for creatig a better
        experience by saving your prefrences and analysis purposes. You can
        refuse this if you wish. For more read our{" "}
        <a css={styles.policyLink} href="/about/privacy-policy" target="_blank">
          {" "}
          privacy policy
        </a>{" "}
        and{" "}
        <a css={styles.policyLink} href="/about/cookie-policy" target="_blank">
          cookie Policy
        </a>
      </p>
      <div css={styles.buttonWraper}>
        <button
          onClick={() => updateConsent("yes")}
          css={styles.cookieButtonAccept}
        >
          Accept
        </button>
        <button
          onClick={() => updateConsent("yes")}
          css={styles.cookieButtonDeny}
        >
          Deny
        </button>
      </div>
    </div>
  );
}

export default CookieBanner;
