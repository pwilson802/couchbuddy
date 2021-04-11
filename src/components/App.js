/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import SearchPage from "./SearchPage";
import ResultsPage from "./ResultsPage";
import Footer from "./Footer";

function App({ mode, changeMode, location, handleLocation }) {
  const [page, setPage] = useState("SearchPage");
  const [width, setWidth] = useState(0);
  const [screenSize, setScreenSize] = useState("small");
  const [searchDetails, setSearchDetails] = useState({});
  const [refine, setRefine] = useState(false);
  const [refineData, setRefineData] = useState({});

  const handleSearchDetails = (item) => {
    setSearchDetails(item);
  };

  const changePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
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
        />
      )}
      {page === "ResultsPage" && (
        <ResultsPage
          searchDetails={searchDetails}
          setPage={setPage}
          width={width}
          screenSize={screenSize}
          mode={mode}
          changeMode={changeMode}
          location={location}
          handleLocation={handleLocation}
          setRefine={setRefine}
          setRefineData={setRefineData}
        />
      )}
    </div>
  );
}

export default App;
