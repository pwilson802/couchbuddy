/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, {useState} from "react";
import DateRangeSlider from "./DateRangeSlider"
import DateRangeDecades from "./DateRangeDecades"

const colors = {
    light: {
      text: "black",
    },
    dark: {
      text: "#FEF4E1",
    },
  };

function DateRange({dateRange, mode, setDateRange, dateFilter, setDateFilter}){
    const [dynamicKey, setDynamicKey] = useState(Date.now())

    const styles = {
        wrapper: css({
            margin: "20px 5%",
            "@media(min-width: 700px)": {
                margin: "20px 25%",
              },
        }),
        textBox: css({
            borderStyle: "solid",
            borderColor: "rgb(150,208,211)",
            width: "100%",
            cursor: "pointer",
            textAlign: "center",
            color: colors[mode]['text'],
        }),
        textBoxEnabled: css({
            borderStyle: "solid",
            borderColor: "rgb(150,208,211)",
            width: "100%",
            cursor: "pointer",
            textAlign: "center",
            backgroundColor: "rgba(150,208,211, 0.3)",
            color: colors[mode]['text'],
        }),
        boxWrap: css({
            display: "flex",
            alignItems: "center",
            marginBottom: "-8px"
        })
    }

    const handleDateRange = (item) => {
        setDateRange(item)
      }
    
    const handleDateFilter = (item) => {
          setDateFilter(item)
          if (item == "anytime"){
              setDateRange([1950,2030])
          }
      }

    return (
        <div css={styles.wrapper}>
            <div css={styles.boxWrap}>
                <div onClick={() => handleDateFilter("anytime")} css={dateFilter == "anytime" ? styles.textBoxEnabled : styles.textBox}>Any Time</div>
                <div onClick={() => handleDateFilter("releaseDate")} css={dateFilter == "releaseDate" ? styles.textBoxEnabled : styles.textBox}>Release Date</div>
                <div onClick={() => handleDateFilter("airedIn")} css={dateFilter == "airedIn" ? styles.textBoxEnabled : styles.textBox}>Aired in</div>
            </div>
            <DateRangeSlider dateRange={dateRange} handleDateRange={handleDateRange} mode={mode} dynamicKey={dynamicKey}/>
            <DateRangeDecades mode={mode} dateRange={dateRange} handleDateRange={handleDateRange} setDynamicKey={setDynamicKey} />
        </div>
    )
}

export default DateRange