/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function BlogProviders({ providers, mode }) {
  let { flatrate, buy, rent } = providers;
  flatrate = flatrate || [];
  buy = buy || [];
  rent = rent || [];
  const allProviders = [...buy, ...rent, ...flatrate];
  const uniqProviders = allProviders.reduce((acc, curr) => {
    let providerID = curr.provider_id;
    if (acc.some((item) => item.provider_id === providerID)) {
      return acc;
    }
    acc.push(curr);
    return acc;
  }, []);

  const styles = {
    pageWrapper: css({
      display: "flex",
      justifyContent: "center",
      marginTop: "0.5rem",
    }),
    wrapper: css({
      fontSize: "0.8rem",
      lineHeight: "0.8rem",
      display: "inline",
      color: colors[mode]["text"],
    }),
    image: css({
      borderRadius: 10,
      margin: 10,
      borderWidth: 0,
      display: "inline",
      width: 50,
      height: 50,
    }),
  };

  return (
    <div css={styles.pageWrapper}>
      <div css={styles.wrapper}>
        <div>Available on:</div>
        {uniqProviders.reverse().map((item) => {
          const image = "http://image.tmdb.org/t/p/w185" + item.logo_path;
          return (
            <img
              key={item.provider_id}
              css={styles.image}
              src={image}
              alt={item.provider_name}
            />
          );
        })}
      </div>
    </div>
  );
}

export default BlogProviders;
