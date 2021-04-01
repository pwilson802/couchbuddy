/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect } from "react";

function AdResponsiveHorizontal() {
  const styles = {
    ad: css({
      display: "block",
    }),
  };

  useEffect(() => {
    try {
      if (typeof window === "object") {
        console
          .log("running the google ads variable")(
            (window.adsbygoogle = window.adsbygoogle || [])
          )
          .push({});
      }
    } catch {
      console.log("cathed the error");
      // Pass
    }
  }, []);
  return (
    <div>
      <ins
        styles={{ display: "block" }}
        className="adsbygoogle"
        data-ad-client="ca-pub-9245347946008848"
        data-ad-slot="5327454859"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

export default AdResponsiveHorizontal;
