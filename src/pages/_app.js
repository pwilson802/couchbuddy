import "./app.css";
import { useState, useEffect } from "react";
import SpinnerMovie from "../components/SpinnerMovie";

function MyApp({ Component, pageProps }) {
  const [location, setLocation] = useState(null);
  const [mode, setMode] = useState("dark");

  const changeMode = (mode) => {
    localStorage.setItem("mode", mode);
    changeBackground(mode);
    setMode(mode);
  };

  useEffect(() => {
    async function pageLoad() {
      const currentLocation = location || (await getIPLocation());
      setLocation(currentLocation);
    }
    pageLoad();
  }, [location]);

  function handleLocation(loc) {
    setLocation(loc.target.value);
  }

  return (
    <Component
      {...pageProps}
      location={location}
      handleLocation={handleLocation}
      mode={mode}
      changeMode={changeMode}
    />
  );
}

export default MyApp;

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
  const countryCode = json["country_code"];
  if (validCodes.includes(countryCode)) {
    return countryCode;
  }
  return "US";
}

function changeBackground(mode) {
  if (mode === "dark") {
    document.body.style = "background: #15202A";
  } else {
    document.body.style = "background: white";
  }
}
