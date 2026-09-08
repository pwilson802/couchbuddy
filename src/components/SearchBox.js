/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import OutsideClickHandler from "react-outside-click-handler";

const colors = {
  light: {
    text: "black",
    subtleText: "rgba(0,0,0,0.6)",
    background: "white",
    border: "rgba(150,208,211,1)",
  },
  dark: {
    text: "white",
    subtleText: "rgba(255,255,255,0.6)",
    background: "#15202A",
    border: "rgba(150,208,211,0.5)",
  },
};

const MEDIA_LABELS = { movie: "Movie", tv: "TV Show", person: "Actor" };

function SearchIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
      <line
        x1="21"
        y1="21"
        x2="16.65"
        y2="16.65"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Self-contained icon-that-expands-into-an-input, dropped into any nav
// (DetailPageNav, NavResults, SearchPage) - it's always `position: fixed`
// (like Burger's own icon - see corner's comment below) so it never needs
// bespoke flex/grid layout work in whichever nav it sits in; it just
// toggles its own open state and positions its own results dropdown below.
//
// corner:
//   "right"       - always top-right, next to Burger (NavResults, and the
//                   default - anywhere with no free top-left corner).
//   "left"        - always top-left (SearchPage: nothing else ever sits in
//                   that literal corner there, at any width).
//   "left-desktop"- top-right below 700px (DetailPageNav: the mobile logo
//                   occupies the left corner there), top-left at 700px+
//                   (that corner is free once there's no logo competing
//                   for it).
function SearchBox({ mode, location, corner = "right" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const palette = colors[mode] || colors.dark;

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: trimmed });
        if (location) params.set("country", location);
        const response = await fetch(`/api/search?${params.toString()}`);
        const data = await response.json();
        if (!cancelled) setResults(data.results || []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, location]);

  function close() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  const showDropdown = open && query.trim().length >= 2;

  const styles = {
    // Burger's own icon (see Burger.js) is `position: fixed; top: 0; right:
    // 3px` regardless of which nav it sits in, rather than laid out in
    // flow - matching that (rather than trying to vertically center this
    // within each nav's own, differently-sized flex row) is what keeps the
    // two icons pixel-aligned. Being always-fixed also means the icon
    // never collides with, or gets pushed around by, sibling content in
    // whatever flex/grid row it's dropped into (see `corner` above for
    // which fixed offset each caller gets).
    wrapper: css({
      position: "fixed",
      top: 0,
      zIndex: 100,
      ...(corner === "left"
        ? { left: 12 }
        : corner === "left-desktop"
        ? {
            right: 51,
            "@media(min-width: 700px)": { right: "auto", left: 12 },
          }
        : { right: 51 }),
    }),
    // The hamburger's own drawn lines sit in the upper-middle of its 40px
    // box (leaving more empty space below than above), not dead centre -
    // centering this icon glyph geometrically within the same 40px box
    // makes it look visibly lower by comparison. paddingTop nudges the
    // glyph up to match that same visual weight instead.
    iconButton: css({
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingTop: 4,
      width: 40,
      height: 40,
      borderRadius: "50%",
      border: "none",
      backgroundColor: "transparent",
      color: palette.text,
      cursor: "pointer",
    }),
    // marginTop keeps the box's own top border/shadow clear of the
    // viewport edge - the wrapper is pinned at top:0 (see `wrapper` below)
    // so with no offset here this pill's top edge would render flush
    // against the very top of the page.
    inputWrapper: css({
      display: "flex",
      alignItems: "center",
      gap: 6,
      width: "min(80vw, 280px)",
      padding: "6px 10px",
      marginTop: 6,
      borderRadius: 20,
      backgroundColor: palette.background,
      border: `1px solid ${palette.border}`,
      color: palette.text,
    }),
    input: css({
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      color: palette.text,
      fontSize: 14,
      minWidth: 0,
    }),
    closeButton: css({
      border: "none",
      background: "transparent",
      color: palette.text,
      opacity: 0.6,
      cursor: "pointer",
      fontSize: 18,
      lineHeight: 1,
      padding: 0,
    }),
    dropdown: css({
      position: "absolute",
      top: "calc(100% + 8px)",
      width: "min(85vw, 320px)",
      maxHeight: 360,
      overflowY: "auto",
      backgroundColor: palette.background,
      border: `1px solid ${palette.border}`,
      borderRadius: 12,
      boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
      zIndex: 50,
      ...(corner === "left"
        ? { left: 0 }
        : corner === "left-desktop"
        ? { right: 0, "@media(min-width: 700px)": { right: "auto", left: 0 } }
        : { right: 0 }),
    }),
    status: css({
      margin: 0,
      padding: "14px 16px",
      fontSize: 13,
      color: palette.subtleText,
    }),
    resultRow: css({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      textDecoration: "none",
      "&:hover": {
        backgroundColor: "rgba(150,208,211,0.15)",
      },
    }),
    resultImage: css({
      width: 40,
      height: 40,
      borderRadius: 6,
      objectFit: "cover",
      flexShrink: 0,
      backgroundColor: "rgba(150,208,211,0.2)",
    }),
    resultTitle: css({
      margin: 0,
      fontSize: 13,
      fontWeight: "bold",
      color: palette.text,
    }),
    resultSubtitle: css({
      margin: "2px 0 0 0",
      fontSize: 11,
      color: palette.subtleText,
    }),
  };

  return (
    <OutsideClickHandler onOutsideClick={close}>
      <div css={styles.wrapper}>
        {!open ? (
          <button
            css={styles.iconButton}
            onClick={() => setOpen(true)}
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        ) : (
          <div css={styles.inputWrapper}>
            <span css={{ display: "flex", color: palette.text, opacity: 0.6 }}>
              <SearchIcon size={15} />
            </span>
            <input
              ref={inputRef}
              css={styles.input}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") close();
              }}
              placeholder="Search movies, shows, people"
            />
            <button
              css={styles.closeButton}
              onClick={close}
              aria-label="Close search"
            >
              &times;
            </button>
          </div>
        )}
        {showDropdown && (
          <div css={styles.dropdown}>
            {loading && <p css={styles.status}>Searching...</p>}
            {!loading && results.length === 0 && (
              <p css={styles.status}>No matches for &ldquo;{query}&rdquo;</p>
            )}
            {!loading &&
              results.map((item) => (
                <Link
                  key={`${item.mediaType}-${item.id}`}
                  href={item.href}
                  css={styles.resultRow}
                  onClick={close}
                >
                  {item.imagePath ? (
                    <img
                      css={styles.resultImage}
                      src={`https://image.tmdb.org/t/p/w92${item.imagePath}`}
                      alt={item.title}
                    />
                  ) : (
                    <div css={styles.resultImage} />
                  )}
                  <div>
                    <p css={styles.resultTitle}>{item.title}</p>
                    <p css={styles.resultSubtitle}>
                      {MEDIA_LABELS[item.mediaType]}
                      {item.subtitle ? ` · ${item.subtitle}` : ""}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
}

export default SearchBox;
