import "./app.css";
import { useState, useEffect } from "react";
import Head from "next/head";
import CookieBanner from "../components/CookieBanner";

function MyApp({ Component, pageProps }) {
  const [location, setLocation] = useState(null);
  const [mode, setMode] = useState("dark");
  const [consent, setConsent] = useState("no");

  const changeMode = (mode) => {
    if (consent == "yes") {
      localStorage.setItem("mode", mode);
    }
    changeBackground(mode);
    setMode(mode);
  };

  const getConsent = () => {
    return localStorage.getItem("consent") || "new";
  };

  const updateConsent = (con) => {
    localStorage.setItem("consent", con);
    setConsent(con);
  };

  useEffect(() => {
    async function pageLoad() {
      const consentStatus = getConsent();
      setConsent(consentStatus);
      const currentLocation = location || (await getIPLocation());
      setLocation(currentLocation);
    }
    pageLoad();
  }, [location]);

  function handleLocation(loc) {
    localStorage.setItem("backupLocation", loc.target.value);
    setLocation(loc.target.value);
  }

  return (
    <>
      <Head>
        {consent == "yes" && (
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-JEN15TQ9KZ"
          />
        )}
        {consent == "yes" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-HE4FSJS60K');
          `,
            }}
          />
        )}
      </Head>
      <Component
        {...pageProps}
        location={location}
        handleLocation={handleLocation}
        mode={mode}
        changeMode={changeMode}
        consent={consent}
        updateConsent={updateConsent}
        setConsent={setConsent}
      />
      {consent === "new" && <CookieBanner updateConsent={updateConsent} />}
    </>
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
  try {
    const response = await fetch("https://ipapi.co/json/");
    const json = await response.json();
    const countryCode = json["country_code"];
    if (validCodes.includes(countryCode)) {
      localStorage.setItem("backupLocation", countryCode);
      return countryCode;
    }
    return "AU";
  } catch {
    return localStorage.getItem("backupLocation") || "AU";
  }
}

function changeBackground(mode) {
  if (mode === "dark") {
    document.body.style = "background: #15202A";
  } else {
    document.body.style = "background: white";
  }
}
