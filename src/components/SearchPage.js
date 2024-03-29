/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Genres from "./Genres";
import Providers from "./Providers";
import Duration from "./Duration";
import Seasons from "./Seasons";
import DateRange from "./DateRange";
import DropDownGenres from "./DropDownGenres";
import DropDownProviders from "./DropDownProviders";
import NavButton from "./NavButton";
import GeneralButton from "./GeneralButton";
import SpinnerMovie from "./SpinnerMovie";
import Footer from "./Footer";
import Burger from "./Burger";
import LocationSelectSmall from "./LocationSelectSmall";
const DATA_URL = process.env.NEXT_PUBLIC_DATA_URL;
import CookieBanner from "../components/CookieBanner";
import SelectionItem from "./SelectionItem";
import SearchSwitch from "./SearchSwitch";

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
  Music: false,
  Mystery: false,
  Romance: false,
  "Science Fiction": false,
  Thriller: false,
  War: false,
  Western: false,
};

const tvGenreObj = {
  Animation: false,
  Comedy: false,
  Kids: false,
  "Action & Adventure": false,
  "Sci-Fi & Fantasy": false,
  Reality: false,
  Drama: false,
  Crime: false,
  Mystery: false,
  Soap: false,
  Family: false,
  Documentary: false,
  News: false,
  Talk: false,
  "War & Politics": false,
  Western: false,
  Romance: false,
};

async function getLocalProviders(country, view) {
  const url = `${DATA_URL}/${view == "tv" ? "tv_" : ""
    }providers-${country}.json`;
  const response = await fetchRetry(url, 3);
  return await response.json();
}

function sortProviders(json) {
  const result = Object.keys(json).sort((a, b) => {
    if (json[a].length > json[b].length) {
      return -1;
    }
    if (json[a].length < json[b].length) {
      return 1;
    }
    return 0;
  });
  return result;
}

function makeProvidersObj(data) {
  return Object.keys(data).reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, {});
}

async function getLocalCertifications(country, view) {
  const url = `${DATA_URL}/${view == "tv" ? "tv_" : ""
    }certifications-${country}.json`;
  const response = await fetchRetry(url, 3);
  return await response.json();
}

function makeCertificationsObj(data) {
  return Object.keys(data).reduce((acc, curr) => {
    if (curr === "") return acc;
    acc[curr] = false;
    return acc;
  }, {});
}

async function getAllProviderData() {
  const url = `${DATA_URL}/all-data-providers.json`;
  const response = await fetchRetry(url, 3);
  return await response.json();
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

function getSelectedProviders(location, allProviders) {
  // Getting providers from the local storage, filtering it with the providers from the json in case some of the selected providers are no longer active.
  // Because if the providers were in the cache and no longer valid they would be undefined and cause an error on the result page
  const localItem = "selectedProviders" + location;
  const selectedProvidersJson = localStorage.getItem(localItem);
  const selectedProviders = JSON.parse(selectedProvidersJson);
  if (selectedProviders === null) {
    return [];
  }
  const returedProviders = selectedProviders.filter((item) =>
    allProviders.includes(item)
  );
  return returedProviders;
}

function updateLocalSelectedProviders(location, providers, consent) {
  const localItem = "selectedProviders" + location;
  const enabledProviders = Object.keys(providers).filter(
    (item) => providers[item]
  );
  if (consent == "yes") {
    localStorage.setItem(localItem, JSON.stringify(enabledProviders));
  }
}

export default function SearchPage({
  handleSearchDetails,
  setPage,
  width,
  mode,
  changeMode,
  location,
  handleLocation,
  refine,
  refineData,
  consent,
  view,
  setView,
  handleViewChange,
}) {
  const [selectedGenres, setSelectedGenres] = useState(genreObj);
  const [selectedProviders, setSelectedProviders] = useState({});
  const [localProviderMovies, setLocalProviderMovies] = useState({});
  const [allProviderData, setAllProviderData] = useState();
  const [sortedProviders, setSortedProviders] = useState();
  const [selectedCertifications, setSelectedCertifications] = useState({});
  const [localCertificationMovies, setLocalCertificationMovies] = useState({});
  const [duration, setDuration] = useState(400);
  const [sortByVote, setSortByVote] = useState(false);
  const [seasons, setSeasons] = useState([1, 50]);
  const [dateRange, setDateRange] = useState([1950, 2030]);
  const [dateFilter, setDateFilter] = useState("anytime");
  const [loaded, setLoaded] = useState(false);
  const [onlyfinishedTv, setOnlyFinishedTv] = useState(false);

  async function configureProviders(location) {
    const localProviderData = await getLocalProviders(location, view);
    const providersObj = makeProvidersObj(localProviderData);
    const allProviderData = await getAllProviderData();
    const cachedProviders = getSelectedProviders(
      location,
      Object.keys(providersObj)
    );
    for (let provider of cachedProviders) {
      providersObj[provider] = true;
    }
    setLocalProviderMovies(localProviderData);
    setSelectedProviders(providersObj);
    setAllProviderData(allProviderData);
    setSortedProviders(sortProviders(localProviderData));
  }

  async function configureCertifications(location) {
    const localCertificationData = await getLocalCertifications(location, view);
    const certificationsObj = await makeCertificationsObj(
      localCertificationData
    );
    setLocalCertificationMovies(localCertificationData);
    setSelectedCertifications(certificationsObj);
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
    const newProviderObj = {
      ...selectedProviders,
    };
    newProviderObj[provider] = !selectedProviders[provider];
    updateLocalSelectedProviders(location, newProviderObj, consent);
    setSelectedProviders(newProviderObj);
  };

  const handleDuration = (num) => {
    setDuration(num);
  };

  const handleSeasons = (item) => {
    setSeasons(item);
  };

  const handleSubmit = () => {
    const dataMissing = CheckMissingData();
    if (dataMissing) {
      return;
    }
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
      providerMovies: providerMovies,
      allProviderData: allProviderData,
      selectedGenres: selectedGenres,
      certificationMovies: certificationMovies,
      sortByVote: sortByVote,
      selectedCertifications: selectedCertifications,
      selectedProviders: selectedProviders,
      dateRange: dateRange,
      dateFilter: dateFilter,
      onlyfinishedTv: onlyfinishedTv,
    };
    if (view == "movie") {
      searchData["view"] = "movie";
      searchData["duration"] = duration;
    } else {
      searchData["view"] = "tv";
      searchData["seasons"] = seasons;
    }
    handleSearchDetails(searchData);
    setPage("ResultsPage");
  };

  const CheckMissingData = () => {
    // checking not all Genres are empty
    const genreAllFalse = Object.values(selectedGenres).every(
      (item) => item === false
    );
    if (genreAllFalse) {
      window.alert("Make sure you select a genre");
      return true;
    }
    // checking not all providers are empty
    const providerAllFalse = Object.values(selectedProviders).every(
      (item) => item === false
    );
    if (providerAllFalse) {
      window.alert("Make sure you select a steraming provider");
      return true;
    }
    // checking not all cartifications are empty
    // If a certification is empty this is check is not performed.
    if (Object.values(selectedCertifications).length === 0) {
      return false;
    }
    const certificationAllFalse = Object.values(selectedCertifications).every(
      (item) => item === false
    );
    if (certificationAllFalse) {
      window.alert("Make sure you select an age classification rating");
      return true;
    }
    return false;
  };

  useEffect(() => {
    setLoaded(false);
    async function pageLoad() {
      if (refine == true) {
        await configureProviders(location);
        await configureCertifications(location);
        setSelectedCertifications(refineData.selectedCertifications);
        setSelectedProviders(refineData.selectedProviders);
        setSelectedGenres(refineData.selectedGenres);
        setSortByVote(refineData.sortByVote);
        setDateRange(refineData.dateRange);
        setDateFilter(refineData.dateFilter);
        if (view == "tv") {
          setSeasons(refineData.seasons);
          setOnlyFinishedTv(refineData.onlyfinishedTv);
        } else {
          setDuration(refineData.duration);
          setSeasons([1, 50]);
        }
      } else {
        setDateRange([1950, 2030]);
        setSeasons([1, 50]);
        setDateFilter("anytime");
        setSortByVote(false);
        setOnlyFinishedTv(false);
        if (view == "movie") {
          setSelectedGenres(genreObj);
        } else {
          setSelectedGenres(tvGenreObj);
        }
        await configureProviders(location);
        await configureCertifications(location);
      }
      setLoaded(true);
    }
    if (location != null) {
      pageLoad();
    }
  }, [location, view]);

  const styles = {
    wrapper: css({
      width: "100%",
    }),
    nav: css({
      display: "flex",
      margin: 10,
      flexDirection: "row",
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
      marginTop: "20px",
      "@media(min-width: 700px)": {
        position: "absolute",
        top: "5px",
        left: "75%",
        width: "250px",
        transform: "translate(-50%, -50%)",
        display: "block",
      },
      "@media(min-width: 1080px)": {
        position: "absolute",
        top: "5px",
        left: "50%",
        width: "250px",
        transform: "translate(-50%, -50%)",
        display: "block",
      },
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
      marginTop: 10,
    }),
    locationWrap: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "50px",
    }),
    adWrap: css({
      marginTop: 10,
    }),
    app: css({
      "@media(min-width: 700px)": {
        marginTop: "30px",
      },
    }),
    locationSmall: css({
      display: "none",
      "@media(min-width: 700px)": {
        display: "block",
      },
    }),
    selectionWrapper: css({
      display: "flex",
      justifyContent: "center",
      marginTop: 5,
    }),
    searchSwitchWrap: css({
      width: "100%",
      "@media(min-width: 700px)": {
        width: "auto",
      },
    }),
  };
  return (
    <div>
      <div css={styles.wrapper}>
        <div css={styles.nav}>
          {location && (
            <div css={styles.locationSmall}>
              <LocationSelectSmall
                mode={mode}
                location={location}
                handleLocation={handleLocation}
              />
            </div>
          )}
          {width > 700 && (
            <div css={styles.logoWrap}>
              <Logo setPage={setPage} logo={"main"} width={250} />
            </div>
          )}
          <div css={styles.searchSwitchWrap}>
            <SearchSwitch
              view={view}
              mode={mode}
              handleViewChange={handleViewChange}
            />
          </div>
          <Burger
            handleLocation={handleLocation}
            location={location}
            mode={mode}
            changeMode={changeMode}
          />
        </div>
        {loaded ? (
          <div css={styles.app}>
            {width < 700 ? (
              <DropDownGenres
                selectedGenres={selectedGenres}
                handleGenre={handleGenre}
                mode={mode}
                setSelected={setSelectedGenres}
              />
            ) : (
              <Genres
                selectedGenres={selectedGenres}
                handleGenre={handleGenre}
                mode={mode}
                setSelected={setSelectedGenres}
              />
            )}
            {width < 700 ? (
              <DropDownProviders
                selectedProviders={selectedProviders}
                handleProvider={handleProvider}
                allProviderData={allProviderData}
                sortedProviders={sortedProviders}
                mode={mode}
              />
            ) : (
              <Providers
                selectedProviders={selectedProviders}
                handleProvider={handleProvider}
                allProviderData={allProviderData}
                sortedProviders={sortedProviders}
                mode={mode}
              />
            )}
            <DateRange
              dateRange={dateRange}
              mode={mode}
              setDateRange={setDateRange}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              width={width}
              view={view}
            />
            <Genres
              selectedGenres={selectedCertifications}
              handleGenre={handleCertifications}
              mode={mode}
              setSelected={setSelectedCertifications}
            />
            {view === "movie" && (
              <Duration
                duration={duration}
                handleDuration={handleDuration}
                mode={mode}
              />
            )}
            {view == "tv" && (
              <Seasons
                seasons={seasons}
                handleSeasons={handleSeasons}
                mode={mode}
              />
            )}
            <div css={styles.selectionWrapper}>
              <div css={styles.selections}>
                <SelectionItem
                  selection={"Sort by Vote"}
                  enabled={sortByVote}
                  handleSwitch={() => setSortByVote(!sortByVote)}
                  mode={mode}
                  refine={refine}
                />
                {view == "tv" && (
                  <SelectionItem
                    selection={"Finished Only"}
                    enabled={onlyfinishedTv}
                    handleSwitch={() => setOnlyFinishedTv(!onlyfinishedTv)}
                    mode={mode}
                    refine={refine}
                  />
                )}
              </div>
            </div>
            <NavButton
              handleSubmit={handleSubmit}
              buttonText={view == "movie" ? "Get Movies" : "Get TV"}
            />
            <Footer
              activePage="app"
              setPage={setPage}
              mode={mode}
              location={location}
              handleLocation={handleLocation}
            />
            {width < 700 && (
              <div css={styles.logoWrap}>
                <Logo setPage={setPage} logo={"main"} width={250} />
              </div>
            )}
          </div>
        ) : (
          <SpinnerMovie view={view} mode={mode} />
        )}
      </div>
    </div>
  );
}

const fetchRetry = async (url, n) => {
  try {
    return await fetch(url);
  } catch (err) {
    if (n === 1) throw err;
    return await fetchRetry(url, n - 1);
  }
};
