/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

function Providers({
  selectedProviders,
  handleProvider,
  allProviderData,
  sortedProviders,
}) {
  const providerIDs = Object.keys(selectedProviders).filter((item) =>
    Object.keys(allProviderData).includes(item)
  );
  const styles = {
    genreWrapper: css({
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
    }),
    button: {
      borderRadius: 10,
      margin: 10,
      borderWidth: 0,
      display: "inline",
      opacity: 0.2,
      width: 50,
      height: 50,
      cursor: "pointer",
    },
    buttonSelected: {
      borderRadius: 10,
      margin: 10,
      borderWidth: 0,
      display: "inline",
      width: 50,
      height: 50,
      cursor: "pointer",
    },
  };
  providerIDs.sort((a, b) => {
    const optionA = selectedProviders[a];
    const optionB = selectedProviders[b];
    const rankA = sortedProviders.indexOf(a);
    const rankB = sortedProviders.indexOf(b);
    if (optionA > optionB) {
      return -1;
    } else if (optionA < optionB) {
      return 1;
    }
    if (rankA > rankB) {
      return 1;
    } else if (rankA < rankB) {
      return -1;
    }

    return 0;
  });
  // console.log("Providers - allProviderData", allProviderData);
  // console.log("Providers - ProviderIDs", providerIDs);
  return (
    <div css={styles.genreWrapper}>
      {providerIDs.map((item) => (
        <img
          key={item}
          css={selectedProviders[item] ? styles.buttonSelected : styles.button}
          onClick={() => handleProvider(item)}
          src={allProviderData[item]["logo"]}
          alt={allProviderData[item]["name"]}
        />
      ))}
    </div>
  );
}

export default Providers;

function compare(a, b) {
  const voteA = Number(a.vote_average);
  const voteB = Number(b.vote_average);

  let comparison = 0;
  if (voteA > voteB) {
    comparison = -1;
  } else if (voteA < voteB) {
    comparison = 1;
  }
  return comparison;
}
