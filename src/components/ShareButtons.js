/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share";

// `href` is the page's own relative path (e.g. movieHref/tvHref's output) -
// every caller has one. Without it this used to share a bare link to the
// homepage instead of the title being viewed, on every movie/TV page and
// every card's hover panel.
//
// No `quote`/text prefill for Facebook: the installed react-share version
// no longer forwards a `quote` prop to sharer.php at all (it only reads
// `hashtag` now), and Facebook itself deprecated arbitrary pre-filled post
// text industry-wide years ago as an anti-spam measure - on mobile this is
// why tapping the button opens the Facebook app without a pre-written
// post. There's no code-level fix for that; the best we can do is make
// sure the shared URL is correct so Facebook's own link preview (which it
// builds from that page's og:title/og:description/og:image) looks right.
function ShareButtons({ movie, tagline, href }) {
  const styles = {
    shareButtons: css({
      display: "flex",
      flexDirection: "row",
    }),
    shareButton: css({
      marginRight: 15,
    }),
    image: css({
      width: 32,
      height: 32,
    }),
  };
  const shareUrl = `https://couchbuddy.info${href || ""}`;
  const twitterShareMessage = `I'm watching ${movie}.\n${tagline}\n\n@couch_buddy\n`;
  const shareURLTwitter =
    "https://twitter.com/intent/tweet?url=" +
    encodeURIComponent(shareUrl) +
    "&text=" +
    encodeURIComponent(twitterShareMessage);
  return (
    <div css={styles.shareButtons}>
      <div css={styles.shareButton}>
        <a href={shareURLTwitter} target="_blank">
          <img css={styles.image} src="/share/twitter.png" alt="twitter logo" />
        </a>
      </div>
      <div css={styles.shareButton}>
        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </div>
    </div>
  );
}

export default ShareButtons;
