/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import DateRangeSlider from "./DateRangeSlider";
import DateRangeDecades from "./DateRangeDecades";
import DropDownButton from "./DropDownButton";

const colors = {
  light: {
    text: "black",
    backgroundColor: "rgba(241, 136, 143,1)",
    headingText: "black",
  },
  dark: {
    text: "white",
    backgroundColor: "rgba(241, 136, 143,0.3)",
    headingText: "#F1888F",
  },
};

function DateRange({
  dateRange,
  mode,
  setDateRange,
  dateFilter,
  setDateFilter,
  width,
  view,
}) {
  const [show, setShow] = useState(false);
  const [dynamicKey, setDynamicKey] = useState(Date.now());

  const styles = {
    text: css({
      color: colors[mode]["text"],
    }),
    wrapper: css({
      //   margin: "20px 5%",
      marginTop: "10px",
      "@media(min-width: 700px)": {
        margin: "10px 15%",
      },
      "@media(min-width: 1024px)": {
        margin: "20px 25%",
      },
    }),
    textBox: css({
      // borderStyle: "solid",
      borderTopStyle: "solid",
      borderWidth: "1px",
      borderColor: "rgb(150,208,211)",
      width: "100%",
      cursor: "pointer",
      textAlign: "center",
      color: colors[mode]["text"],
      padding: "5px 0",
    }),
    textBoxEnabled: css({
      // borderStyle: "solid",
      borderTopStyle: "solid",
      borderWidth: "1px",
      borderColor: "rgb(150,208,211)",
      width: "100%",
      cursor: "pointer",
      textAlign: "center",
      // backgroundColor: "rgba(150,208,211, 0.3)",
      backgroundColor: "rgba(225, 44, 134, 0.7)",
      color: colors[mode]["text"],
      padding: "5px 0",
    }),
    boxWrap: css({
      display: "flex",
      alignItems: "center",
      marginBottom: "-8px",
    }),
    showBox: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 0,
      fontSize: 26,
      backgroundColor: colors[mode]["backgroundColor"],
      textAlign: "center",
      color: colors[mode]["headingText"],
      "&:hover": {
        cursor: "pointer",
      },
    }),
    showBoxSmall: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 0,
      fontSize: 26,
      backgroundColor: colors[mode]["backgroundColor"],
      textAlign: "center",
      color: colors[mode]["headingText"],
      "@media(min-width: 700px)": {
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
      },
      "&:hover": {
        cursor: "pointer",
      },
    }),
    dateFilterWrapper: css({
      margin: "0 1%",
      "@media(min-width: 700px)": {
        margin: "0 0",
      },
    }),
    dropDown: css({
      display: "flex",
      marginTop: "8px",
    }),
  };

  const handleDateRange = (item) => {
    setDateRange(item);
  };

  const handleDateFilter = (item) => {
    setDateFilter(item);
    if (item == "anytime") {
      setDateRange([1950, 2030]);
    }
  };

  return (
    <div css={styles.wrapper}>
      {width < 5000 ? (
        <div onClick={() => setShow(!show)} css={styles.showBoxSmall}>
          <div css={styles.dropDown}>
            <DropDownButton show={show} mode={mode} menu={"genres"} />
          </div>
          <span css={styles.headingText}>
            {dateFilter == "anytime"
              ? "ANY TIME"
              : dateFilter == "releaseDate"
              ? "Release Date"
              : "Aired In"}
            {"  "}
          </span>
          <span css={styles.headingText}>
            {dateFilter != "anytime"
              ? `\u00A0\u00A0(${dateRange[0]} - ${dateRange[1]})`
              : ""}
          </span>
          <div css={styles.dropDown}>
            <DropDownButton show={show} mode={mode} menu={"genres"} />
          </div>
        </div>
      ) : (
        <div onClick={() => setShow(!show)} css={styles.showBox}>
          <div css={styles.dropDown}>
            <DropDownButton show={show} mode={mode} menu={"genres"} />
          </div>
          <span css={styles.text}>
            {dateFilter == "anytime"
              ? "Any Time"
              : dateFilter == "releaseDate"
              ? "Release Date"
              : "Aired In"}
            {"  "}
          </span>
          <span css={styles.text}>
            {dateFilter != "anytime"
              ? `\u00A0\u00A0(${dateRange[0]} - ${dateRange[1]})`
              : ""}
          </span>
          <div css={styles.dropDown}>
            <DropDownButton show={show} mode={mode} menu={"genres"} />
          </div>
        </div>
      )}

      {show && (
        <div css={styles.dateFilterWrapper}>
          <div css={styles.boxWrap}>
            <div
              onClick={() => handleDateFilter("anytime")}
              css={
                dateFilter == "anytime" ? styles.textBoxEnabled : styles.textBox
              }
            >
              Any Time
            </div>
            <div
              onClick={() => handleDateFilter("releaseDate")}
              css={
                dateFilter == "releaseDate"
                  ? styles.textBoxEnabled
                  : styles.textBox
              }
            >
              Release Date
            </div>
            {view == "tv" && (
              <div
                onClick={() => handleDateFilter("airedIn")}
                css={
                  dateFilter == "airedIn"
                    ? styles.textBoxEnabled
                    : styles.textBox
                }
              >
                Aired in
              </div>
            )}
          </div>
          <DateRangeSlider
            dateRange={dateRange}
            handleDateRange={handleDateRange}
            mode={mode}
            dynamicKey={dynamicKey}
          />
          <DateRangeDecades
            mode={mode}
            dateRange={dateRange}
            handleDateRange={handleDateRange}
            setDynamicKey={setDynamicKey}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
        </div>
      )}
    </div>
  );
}

export default DateRange;
