/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchPage from "./SearchPage";
import ResultsPage from "./ResultsPage";
import SpinnerMovie from "./SpinnerMovie";
import Footer from "./Footer";
import { searchDetailsToQuery, searchDetailsFromQuery } from "../lib/searchQuery";

function App({
  mode,
  changeMode,
  location,
  handleLocation,
  consent,
  refine,
  setRefine,
  refineData,
  setRefineData,
}) {
  const router = useRouter();
  const [width, setWidth] = useState(0);
  const [screenSize, setScreenSize] = useState("small");
  const [view, setView] = useState("movie");
  const [restoredProviderData, setRestoredProviderData] = useState(null);

  // The results page is derived entirely from the URL query string (rather
  // than kept in local state) so it can be refreshed, bookmarked, shared,
  // or returned to with the browser's back button - "/" with no query is
  // SearchPage, "/?view=movie&genres=..." is ResultsPage for that search.
  // Deliberately NOT gated on router.isReady: "/" is statically generated
  // with an empty query, so the first client render must also treat the
  // query as empty (-> SearchPage) to match that HTML, or React throws a
  // hydration mismatch. router.query naturally starts at {} and updates to
  // the real query right after hydration, which is just a normal
  // post-hydration re-render into ResultsPage, not part of the initial
  // hydration pass.
  const queryDetails = searchDetailsFromQuery(router.query);
  const page = queryDetails ? "ResultsPage" : "SearchPage";

  const handleSearchDetails = (searchData) => {
    const query = searchDetailsToQuery(searchData);
    router.push({ pathname: "/", query }, undefined, { shallow: true });
  };

  const handleViewChange = () => {
    setRefine(false);
    if (view == "movie") {
      setView("tv");
    } else {
      setView("movie");
    }
  };

  // SearchPage/ResultsPage/Footer already call setPage("SearchPage") /
  // setPage("ResultsPage") directly - keep that contract, just route
  // "SearchPage" back to a bare "/" (clearing the search). Reaching
  // "ResultsPage" always happens via handleSearchDetails above, whose push
  // is what makes `page` derive to "ResultsPage" in the first place.
  const setPage = (target) => {
    if (target === "SearchPage") {
      router.push("/", undefined, { shallow: true });
    }
  };

  // A results URL can be opened directly (refresh, back/forward, a shared
  // link) without ever passing through SearchPage - the only other place
  // that fetches allProviderData - so fetch our own copy whenever we land
  // on a results URL this way.
  useEffect(() => {
    if (!queryDetails || !location) {
      setRestoredProviderData(null);
      return;
    }
    let cancelled = false;
    async function loadProviders() {
      const response = await fetch(
        `/api/providers?country=${location}&view=${queryDetails.view}`
      );
      const data = await response.json();
      if (!cancelled) setRestoredProviderData(data);
    }
    loadProviders();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDetails && queryDetails.view, location]);

  useEffect(() => {
    const currentMode = localStorage.getItem("mode") || "dark";
    changeMode(currentMode);
    const handleResizeWindow = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      if (newWidth < 600) {
        setScreenSize("small");
      } else {
        setScreenSize("large");
      }
    };
    handleResizeWindow();
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  return (
    <div>
      {page === "SearchPage" && (
        <SearchPage
          handleSearchDetails={handleSearchDetails}
          setPage={setPage}
          width={width}
          screenSize={screenSize}
          mode={mode}
          changeMode={changeMode}
          location={location}
          handleLocation={handleLocation}
          refine={refine}
          refineData={refineData}
          consent={consent}
          view={view}
          setView={setView}
          handleViewChange={handleViewChange}
        />
      )}
      {page === "ResultsPage" && (
        restoredProviderData ? (
          <ResultsPage
            searchDetails={{ ...queryDetails, allProviderData: restoredProviderData }}
            setPage={setPage}
            width={width}
            screenSize={screenSize}
            mode={mode}
            changeMode={changeMode}
            location={location}
            handleLocation={handleLocation}
            setRefine={setRefine}
            setRefineData={setRefineData}
            view={view}
          />
        ) : (
          <SpinnerMovie view={queryDetails.view} mode={mode} />
        )
      )}
    </div>
  );
}

export default App;
