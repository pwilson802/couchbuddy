import "./app.css";
import { useState, useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [location, setLocation] = useState(null);

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
  console.log("APP-Location", location);

  return (
    <Component
      {...pageProps}
      location={location}
      handleLocation={handleLocation}
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
