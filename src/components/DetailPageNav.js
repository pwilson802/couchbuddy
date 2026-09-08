/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Logo from "./Logo";
import Burger from "./Burger";
import SearchBox from "./SearchBox";

// Shared top nav for standalone detail pages (movie/tv/person) - mirrors
// the rest of the site's chrome (location, logo, hamburger). Uses a
// 3-column grid rather than SearchPage's own absolute-position + translate
// centering trick, since that depends on an ancestor positioning context
// SearchPage happens to have and these pages don't (it was clipping the
// logo against the viewport top here).
//
// No desktop-visible location selector here (unlike the mobile Footer
// widget) - country is rarely changed, and it's still reachable through
// the burger menu (which shows it by default) without needing its own
// permanent spot in the nav.
function DetailPageNav({ mode, changeMode, location, handleLocation }) {
  const styles = {
    topBar: css({
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      margin: 10,
    }),
    logoWrap: css({
      display: "none",
      "@media(min-width: 700px)": {
        display: "block",
        justifySelf: "center",
      },
    }),
    logoWrapMobile: css({
      justifySelf: "start",
      "@media(min-width: 700px)": {
        display: "none",
      },
    }),
    rightWrap: css({
      justifySelf: "end",
    }),
  };

  return (
    <div css={styles.topBar}>
      <div css={styles.logoWrapMobile}>
        <Logo logo="main" width={250} />
      </div>
      <div css={styles.logoWrap}>
        <Logo logo="main" width={250} />
      </div>
      <div css={styles.rightWrap}>
        <Burger
          handleLocation={handleLocation}
          location={location}
          mode={mode}
          changeMode={changeMode}
        />
      </div>
      {/* Fixed positioning (see SearchBox's own `corner` prop), so its DOM
          position here doesn't matter - top-right below 700px (the mobile
          logo above occupies the left corner there), top-left at 700px+
          (free once the logo re-centers and there's no desktop location
          selector any more). */}
      <SearchBox mode={mode} location={location} corner="left-desktop" />
    </div>
  );
}

export default DetailPageNav;
