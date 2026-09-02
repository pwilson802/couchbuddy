/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Logo from "./Logo";
import Burger from "./Burger";
import LocationSelectSmall from "./LocationSelectSmall";

// Shared top nav for standalone detail pages (movie/tv/person) - mirrors
// the rest of the site's chrome (location, logo, hamburger). Uses a
// 3-column grid rather than SearchPage's own absolute-position + translate
// centering trick, since that depends on an ancestor positioning context
// SearchPage happens to have and these pages don't (it was clipping the
// logo against the viewport top here).
function DetailPageNav({ mode, changeMode, location, handleLocation }) {
  const styles = {
    topBar: css({
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      margin: 10,
    }),
    locationWrap: css({
      display: "none",
      "@media(min-width: 700px)": {
        display: "block",
        justifySelf: "start",
      },
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
  };

  return (
    <div css={styles.topBar}>
      {location && (
        <div css={styles.locationWrap}>
          <LocationSelectSmall
            mode={mode}
            location={location}
            handleLocation={handleLocation}
          />
        </div>
      )}
      <div css={styles.logoWrapMobile}>
        <Logo logo="main" width={250} />
      </div>
      <div css={styles.logoWrap}>
        <Logo logo="main" width={250} />
      </div>
      <Burger
        handleLocation={handleLocation}
        location={location}
        mode={mode}
        changeMode={changeMode}
      />
    </div>
  );
}

export default DetailPageNav;
