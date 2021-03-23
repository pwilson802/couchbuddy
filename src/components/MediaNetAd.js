/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect } from "react";

function MediaNetAd({ divId, size }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window._mNHandle.queue.push(function () {
          window._mNDetails.loadTag(divId, size, divId);
        });
      } catch (error) {}
    }
  }, [divId, size]);

  return <div id={divId} />;
}

export default MediaNetAd;
