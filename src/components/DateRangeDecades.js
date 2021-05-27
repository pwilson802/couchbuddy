/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

const colors = {
    light: {
      text: "black",
    },
    dark: {
      text: "rgb(150,208,211)",
    },
  };

function DateRangeDecades({mode, dateRange, handleDateRange, setDynamicKey, dateFilter, setDateFilter}){

    const updateRange = (item) => {
        if (item == dateRange[0] - 10){
            // new decade is directly below the current range to add to the bottom
            handleDateRange([item, dateRange[1]])
        } else if (item == dateRange[1]){
            // new decade is directly above the current range to add to the top
            handleDateRange([dateRange[0], item+10]) 
        } else {
            handleDateRange([item, item+10])
        }
        setDynamicKey(Date.now())
        if (dateFilter == "anytime"){
            setDateFilter("releaseDate")
        }
    }


    const styles = {
        wrapper: css({
            display: "flex",
            alignItems: "space-evenly",
            marginTop: "25px",
        }),
        dateBox: css({
            borderRightStyle: "solid",
            borderWidth: "1px",
            borderColor: "rgb(150,208,211)",
            width: "100%",
            cursor: "pointer",
            textAlign: "center",
            color: colors[mode]['text'],
            zIndex: "99"
        }),
        firstBox: css({
            borderLeftStyle: "solid",
        })

    }

    return <div css={styles.wrapper}>
        <div onClick={() => updateRange(1950)} css={[styles.dateBox, styles.firstBox]}>50s</div>
        <div onClick={() => updateRange(1960)} css={styles.dateBox}>60s</div>
        <div onClick={() => updateRange(1970)} css={styles.dateBox}>70s</div>
        <div onClick={() => updateRange(1980)} css={styles.dateBox}>80s</div>
        <div onClick={() => updateRange(1990)} css={styles.dateBox}>90s</div>
        <div onClick={() => updateRange(2000)} css={styles.dateBox}>00s</div>
        <div onClick={() => updateRange(2010)} css={styles.dateBox}>10s</div>
        <div onClick={() => updateRange(2020)} css={styles.dateBox}>20s</div>
    </div>
}

export default DateRangeDecades