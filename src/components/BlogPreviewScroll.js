/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import PostPreview from "./PostPreview";
import InfiniteScroll from "react-infinite-scroll-component";
import MovieCardLoading from "./MovieCardLoading";
import FakeAd from "./FakeAd";

function BlogPreviewScroll({ previews, mode }) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const styles = {
    otherPreviews: css({
      display: "flex",
      flexBasis: "100%",
      flexWrap: "wrap",
      margin: "0 -1%",
    }),
    otherPreviewWrapper: css({
      marginTop: "2rem",
      width: "100%",
      margin: "1rem 1%",
      "@media(min-width: 768px)": {
        width: "48%",
      },
      "@media(min-width: 1366px)": {
        width: "31%",
      },
    }),
    loader: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    }),
  };

  const fetchMoreData = () => {
    const newItems = previews.slice(items.length, items.length + 6);
    if (items.length + 6 >= previews.length) {
      setHasMore(false);
    }
    setItems([...items, ...newItems]);
  };

  useEffect(() => {
    const startingItems = previews.slice(0, 6);
    if (previews.length <= 6) {
      setHasMore(false);
    }
    setItems(startingItems);
  }, []);
  //console.log()(items);

  return (
    <InfiniteScroll
      css={styles.otherPreviews}
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <div css={styles.loader}>
          <MovieCardLoading mode={mode} />
        </div>
      }
    >
      {items.map((p) => {
        return (
          <div css={styles.otherPreviewWrapper} key={p.fields.slug}>
            <PostPreview
              key={p.fields.slug}
              articleType={p.fields.articleType}
              heading={p.fields.heading}
              introduction={p.fields.introduction}
              sharingImage={p.fields.sharingImage}
              slug={p.fields.slug}
              topPost={false}
              mode={mode}
            />
          </div>
        );
      })}
    </InfiniteScroll>
  );
}

export default BlogPreviewScroll;
