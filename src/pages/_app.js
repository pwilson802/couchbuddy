import "./app.css";
import { useState, useEffect } from "react";
import Head from "next/head";
import CookieBanner from "../components/CookieBanner";

function MyApp({ Component, pageProps }) {
  const [location, setLocation] = useState(null);
  const [mode, setMode] = useState("dark");
  const [consent, setConsent] = useState("no");
  const [refine, setRefine] = useState(false);
  const [refineData, setRefineData] = useState({});

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
    if (con == "yes") {
      console.log("consented yes");
      window["ga-disable-G-HE4FSJS60K"] = false;
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-HE4FSJS60K");
    }
    setConsent(con);
  };

  useEffect(() => {
    async function pageLoad() {
      const consentStatus = getConsent();
      if (consentStatus == "yes") {
        window["ga-disable-G-HE4FSJS60K"] = false;
      } else {
        window["ga-disable-G-HE4FSJS60K"] = true;
      }
      setConsent(consentStatus);
      const currentLocation = location || (await getIPLocation());
      setLocation(currentLocation);
    }
    pageLoad();
  }, [location, consent]);

  function handleLocation(loc) {
    setRefine(false);
    setRefineData({});
    localStorage.setItem("backupLocation", loc.target.value);
    setLocation(loc.target.value);
  }

  return (
    <>
      <Head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HE4FSJS60K"
        />
        )
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
        )
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
        refineData={refineData}
        refine={refine}
        setRefine={setRefine}
        setRefineData={setRefineData}
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
    const response = await fetchRetry("https://ipapi.co/json/", 3);
    const json = await response.json();
    const countryCode = json["country_code"];
    if (validCodes.includes(countryCode)) {
      localStorage.setItem("backupLocation", countryCode);
      return countryCode;
    }
    return localStorage.getItem("backupLocation") || "AU";
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

const fetchRetry = async (url, n) => {
  try {
    return await fetch(url);
  } catch (err) {
    if (n === 1) throw err;
    return await fetchRetry(url, n - 1);
  }
};
