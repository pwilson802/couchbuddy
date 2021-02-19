/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import LocationSelect from "./LocationSelect";
import Genres from "./Genres";
import Providers from "./Providers";
import Duration from "./Duration";
import DropDownGenres from "./DropDownGenres";
import DropDownProviders from "./DropDownProviders";
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
  Music: false,
  Mystery: false,
  Romance: false,
  "Science Fiction": false,
  Thriller: false,
  War: false,
  Western: false,
};

async function getIPLocation() {
  const validCodes = [
    "AR",
    "AT",
    "AU",
    "BE",
    "BR",
    "CA",
    "CL",
    "CO",
    "CZ",
    "DE",
    "DK",
    "EC",
    "EE",
    "ES",
    "FI",
    "FR",
    "GB",
    "GR",
    "HU",
    "ID",
    "IE",
    "IN",
    "IT",
    "JP",
    "KR",
    "LT",
    "LV",
    "MX",
    "MY",
    "NL",
    "NO",
    "NZ",
    "PE",
    "PH",
    "PL",
    "PT",
    "RO",
    "RU",
    "SE",
    "SG",
    "TH",
    "TR",
    "US",
    "VE",
    "ZA",
    "CH",
  ];
  const response = await fetch("https://ipapi.co/json/");
  const json = await response.json();
  console.log("country json response", json);
  const countryCode = json["country_code"];
  console.log(countryCode);
  if (validCodes.includes(countryCode)) {
    return countryCode;
  }
  return "US";
}

async function getLocalProviders(country) {
  const url = `https://couchbuddy.s3-ap-southeast-2.amazonaws.com/data/providers-${country}.json`;
  console.log(url);
  const response = await fetch(url);
  return await response.json();
}

function makeProvidersObj(data) {
  return Object.keys(data).reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, {});
}

async function getLocalCertifications(country) {
  const url = `https://couchbuddy.s3-ap-southeast-2.amazonaws.com/data/certifications-${country}.json`;
  console.log(url);
  const response = await fetch(url);
  return await response.json();
}

function makeCertificationsObj(data) {
  return Object.keys(data).reduce((acc, curr) => {
    if (curr === "") return acc;
    acc[curr] = true;
    return acc;
  }, {});
}

async function getAllProviderData() {
  const url = `https://couchbuddy.s3-ap-southeast-2.amazonaws.com/data/all-data-providers.json`;
  console.log(url);
  const response = await fetch(url);
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
  console.log(returedProviders);
  return returedProviders;
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
  const [location, setLocation] = useState("ZZ");
  const [selectedGenres, setSelectedGenres] = useState(genreObj);
  const [selectedProviders, setSelectedProviders] = useState({});
  const [localProviderMovies, setLocalProviderMovies] = useState({});
  const [allProviderData, setAllProviderData] = useState();
  const [selectedCertifications, setSelectedCertifications] = useState({});
  const [localCertificationMovies, setLocalCertificationMovies] = useState({});
  const [duration, setDuration] = useState(400);
  const [sortByVote, setSortByVote] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function configureProviders(location) {
    console.log("configuring providers");
    const localProviderData = await getLocalProviders(location);
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
  }

  async function configureCertifications(location) {
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
    async function pageLoad() {
      const cachedLocation = localStorage.getItem("country");
      const currentLocation = cachedLocation
        ? cachedLocation
        : await getIPLocation();
      setLocation(currentLocation);
      setSelectedGenres(genreObj);
      await configureProviders(currentLocation);
      await configureCertifications(currentLocation);
      setLoaded(true);
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
      "@media(min-width: 768px)": {
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
              mode={mode}
            />
          </div>
        </div>
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
            </div>
            <NavButton handleSubmit={handleSubmit} buttonText={"Get Movies"} />
          </div>
        )}
      </div>
    </div>
  );
}
