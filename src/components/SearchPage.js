/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  getCouchmovie,
  getWatchOn,
  listProviders,
  getCertification,
} from "../graphql/queries";
import Logo from "./Logo";
import LocationSelect from "./LocationSelect";
import Genres from "./Genres";
import Providers from "./Providers";
import Duration from "./Duration";
import DropDownGenres from "./DropDownGenres";
import DropDownProviders from "./DropDownProviders";
import TheMovieDatabase from "./TheMovieDatabase";
import NavButton from "./NavButton";
import GeneralButton from "./GeneralButton";

const genreObj = {
  Action: false,
  Adventure: false,
  Animation: false,
  Comedy: false,
  Crime: false,
  Documentary: false,
  Drama: false,
  Family: false,
  Fantasy: false,
  History: false,
  Horror: false,
  Mystery: false,
  Romance: false,
  "Science Fiction": false,
  Thriller: false,
  War: false,
  Western: false,
};

async function getLocalProviders(country) {
  const locProviders = await API.graphql({
    query: getWatchOn,
    variables: { country: country },
  });
  return JSON.parse(locProviders.data.getWatchOn.data);
}

function makeProvidersObj(data) {
  return Object.keys(data).reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, {});
}

async function getLocalCertifications(country) {
  const locProviders = await API.graphql({
    query: getCertification,
    variables: { country: country },
  });
  // console.log("certifications", locProviders);
  return JSON.parse(locProviders.data.getCertification.data);
}

function makeCertificationsObj(data) {
  return Object.keys(data).reduce((acc, curr) => {
    if (curr === "") return acc;
    acc[curr] = true;
    return acc;
  }, {});
}

async function getAllProviderData() {
  const allProviders = await API.graphql({
    query: listProviders,
  });
  const providerList = allProviders.data.listProviders.items;
  const result = providerList.reduce((acc, curr) => {
    let providerID = curr["providerID"];
    let providerName = curr["providerName"];
    let providerLogo = curr["providerLogo"];
    acc[providerID] = {};
    acc[providerID]["name"] = providerName;
    acc[providerID]["logo"] = "http://image.tmdb.org/t/p/w185" + providerLogo;
    return acc;
  }, {});
  return result;
}

function makeSelectedProviders(selectedProviders, localProviderMovies) {
  const selected = Object.keys(selectedProviders).reduce((acc, curr) => {
    if (selectedProviders[curr]) {
      acc[curr] = localProviderMovies[curr];
    }
    return acc;
  }, {});
  return selected;
}

function getSelectedProviders(location) {
  const localItem = "selectedProviders" + location;
  const selectedProviders = localStorage.getItem(localItem);
  if (selectedProviders === null) {
    return [];
  }
  return JSON.parse(selectedProviders);
}

function updateLocalSelectedProviders(location, providers) {
  const localItem = "selectedProviders" + location;
  const enabledProviders = Object.keys(providers).filter(
    (item) => providers[item]
  );
  localStorage.setItem(localItem, JSON.stringify(enabledProviders));
}

export default function SearchPage({
  handleSearchDetails,
  setPage,
  width,
  mode,
}) {
  const [location, setLocation] = useState("AU");
  const [selectedGenres, setSelectedGenres] = useState(genreObj);
  const [selectedProviders, setSelectedProviders] = useState({});
  const [localProviderMovies, setLocalProviderMovies] = useState({});
  const [allProviderData, setAllProviderData] = useState();
  const [selectedCertifications, setSelectedCertifications] = useState({});
  const [localCertificationMovies, setLocalCertificationMovies] = useState({});
  const [duration, setDuration] = useState(400);
  const [sortByVote, setSortByVote] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function configureProviders() {
    const localProviderData = await getLocalProviders(location);
    const providersObj = makeProvidersObj(localProviderData);
    const allProviderData = await getAllProviderData();
    const cachedProviders = getSelectedProviders(location);
    for (let provider of cachedProviders) {
      providersObj[provider] = true;
    }
    // console.log("providersObj", providersObj);
    setLocalProviderMovies(localProviderData);
    setSelectedProviders(providersObj);
    setAllProviderData(allProviderData);
    setLoaded(true);
  }

  async function configureCertifications() {
    const localCertificationData = await getLocalCertifications(location);
    const certificationsObj = await makeCertificationsObj(
      localCertificationData
    );
    setLocalCertificationMovies(localCertificationData);
    setSelectedCertifications(certificationsObj);
  }

  function handleLocation(loc) {
    localStorage.setItem("country", loc.target.value);
    setLocation(loc.target.value);
  }

  const handleGenre = (genre) => {
    const newGenreObj = {
      ...selectedGenres,
    };
    newGenreObj[genre] = !selectedGenres[genre];
    setSelectedGenres(newGenreObj);
  };

  const handleCertifications = (certification) => {
    const newObj = {
      ...selectedCertifications,
    };
    newObj[certification] = !selectedCertifications[certification];
    setSelectedCertifications(newObj);
  };

  const handleProvider = (provider) => {
    // console.log("handleProvider", provider);
    const newProviderObj = {
      ...selectedProviders,
    };
    newProviderObj[provider] = !selectedProviders[provider];
    updateLocalSelectedProviders(location, newProviderObj);
    setSelectedProviders(newProviderObj);
  };

  const handleDuration = (num) => {
    setDuration(num);
  };

  const handleSubmit = () => {
    const providerMovies = makeSelectedProviders(
      selectedProviders,
      localProviderMovies
    );
    const certificationsChange = Object.values(selectedCertifications).some(
      (i) => i === false
    );
    const certificationMovies = certificationsChange
      ? makeSelectedProviders(selectedCertifications, localCertificationMovies)
      : true;
    const searchData = {
      selectedProviders: providerMovies,
      allProviderData: allProviderData,
      selectedGenres: selectedGenres,
      duration: duration,
      certificationMovies: certificationMovies,
      sortByVote: sortByVote,
    };
    handleSearchDetails(searchData);
    setPage("ResultsPage");
  };

  useEffect(() => {
    setLoaded(false);
    const currentLocation = localStorage.getItem("country") || "US";
    setLocation(currentLocation);
    setSelectedGenres(genreObj);
    async function pageLoad() {
      await configureProviders(location);
      await configureCertifications();
    }
    pageLoad();
  }, [location]);

  const styles = {
    wrapper: css({
      width: "100%",
    }),
    nav: css({
      display: "flex",
      margin: 10,
      flexDirection: "row",
      "@media(min-width: 700px)": {
        justifyContent: "center",
      },
    }),
    locationWrap: css({
      position: "absolute",
      top: 0,
      right: 0,
    }),
    submitButton: css({
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 16,
      borderRadius: 10,
      borderColor: "#FDD782",
      borderWidth: 1,
      backgroundColor: "#FDD782",
      alignSelf: "center",
    }),
    introText: css({
      color: "rgba(255,255,255,0.6)",
      textAlign: "center",
      fontSize: 12,
      marginBottom: 5,
    }),
    logoWrap: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    }),
    voteButton: css({
      padding: 10,
      borderRadius: 10,
      margin: 10,
      borderColor: "rgba(254,244,225,.2)",
      borderWidth: 1,
      color: "#FEF4E1",
      backgroundColor: "Transparent",
      cursor: "pointer",
      outline: "none",
      "&focus": {
        outline: 0,
      },
      "&:hover": {
        backgroundColor: "rgba(253,215,130,.1)",
        borderColor: "rgba(253,215,130,.1)",
        color: "#FDD782",
      },
    }),
    voteButtonSelected: css({
      padding: 10,
      borderRadius: 10,
      margin: 10,
      borderColor: "rgba(253,215,130,.1)",
      borderWidth: 1,
      backgroundColor: "rgba(253,215,130,.1)",
      color: "#FDD782",
      cursor: "pointer",
      outline: "none",
    }),
    sortButtonWrap: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    }),
  };
  // console.log("selectedCertifications", selectedCertifications);
  // console.log("allProviderData", allProviderData);
  return (
    <div>
      <div css={styles.wrapper}>
        <div css={styles.nav}>
          <div css={styles.logoWrap}>
            <Logo setPage={setPage} logo={"main"} />
          </div>
          <div css={styles.locationWrap}>
            <LocationSelect
              handleLocation={handleLocation}
              location={location}
            />
          </div>
        </div>
        {/* <p css={styles.introText}>
          Not sure what movie to watch tonight? Let couch buddy help you out
          with some suggestions.
        </p> */}
        {loaded && (
          <div>
            {width < 700 ? (
              <DropDownGenres
                selectedGenres={selectedGenres}
                handleGenre={handleGenre}
                mode={mode}
              />
            ) : (
              <Genres
                selectedGenres={selectedGenres}
                handleGenre={handleGenre}
                mode={mode}
              />
            )}
            {width < 700 ? (
              <DropDownProviders
                selectedProviders={selectedProviders}
                handleProvider={handleProvider}
                allProviderData={allProviderData}
                mode={mode}
              />
            ) : (
              <Providers
                selectedProviders={selectedProviders}
                handleProvider={handleProvider}
                allProviderData={allProviderData}
                mode={mode}
              />
            )}
            <Genres
              selectedGenres={selectedCertifications}
              handleGenre={handleCertifications}
              mode={mode}
            />
            <Duration
              duration={duration}
              handleDuration={handleDuration}
              mode={mode}
            />
            <div css={styles.sortButtonWrap}>
              <GeneralButton
                handleClick={() => setSortByVote(!sortByVote)}
                selected={sortByVote}
                mode={mode}
                buttonText={"Sort by Rating"}
              />
              {/* <button
                css={sortByVote ? styles.voteButtonSelected : styles.voteButton}
                onClick={() => setSortByVote(!sortByVote)}
                value={sortByVote}
              >
                Sort by Rating
              </button> */}
            </div>
            <NavButton handleSubmit={handleSubmit} buttonText={"Get Movies"} />
          </div>
        )}
      </div>
    </div>
  );
}
