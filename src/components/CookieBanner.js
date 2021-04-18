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
      textDecoration: "underline",
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
      outline: "none",
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
      outline: "none",
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
        necessary to the function of the website and therefore cannot be
        refused. We use other cookies for creating a better user experience by
        saving your preferences and analysing how you use the site. You can deny
        this if you wish. For more information read our{" "}
        <a css={styles.policyLink} href="/about/privacy-policy" target="_blank">
          {" "}
          privacy policy
        </a>{" "}
        and{" "}
        <a css={styles.policyLink} href="/about/cookie-policy" target="_blank">
          cookie policy
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
          onClick={() => updateConsent("no")}
          css={styles.cookieButtonDeny}
        >
          Deny
        </button>
      </div>
    </div>
  );
}

export default CookieBanner;
