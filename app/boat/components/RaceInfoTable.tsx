"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchBeforeInfo } from "../lib/fetchBeforeInfo";
import { fetchRaceList } from "../lib/fetchRaceList";
import { fetchRacerSearch } from "../lib/fetchRacerSearch";
import { RaceList } from "@/app/api/boatrace/racelist/route";
import { raceCourses } from "../components/Odds/OddsHelpers";
import { BeforeInfo } from "@/app/api/boatrace/beforeinfo/route";
import { RacerStats } from "@/app/api/boatrace/racersearch/route";

interface RaceInfoTableProps {
  rno: number;
  jcd: number;
  hd: string;
}

const RaceInfoTable: React.FC<RaceInfoTableProps> = ({ rno, jcd, hd }) => {
  const [beforeInfo, setBeforeInfo] = useState<BeforeInfo | null>(null);
  const [raceList, setRaceList] = useState<RaceList | null>(null);
  const [racerSearchData, setRacerSearchData] = useState<RacerStats[]>([]);
  const [countdown, setCountdown] = useState<number>(60);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const restartInterval = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    intervalId.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          fetchData();
          return 60;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const fetchData = useCallback(async () => {
    try {
      const beforeInfoData = (await fetchBeforeInfo(
        rno,
        jcd,
        hd
      )) as BeforeInfo;
      const raceListData = (await fetchRaceList(rno, jcd, hd)) as RaceList;
      const racerSearchPromises = raceListData.racers.map((racer) =>
        fetchRacerSearch(racer.number.toString())
      );
      const racerSearchResults = await Promise.all(racerSearchPromises);
      setBeforeInfo(beforeInfoData);
      setRaceList(raceListData);
      setRacerSearchData(racerSearchResults);
      setCountdown(60);
      restartInterval();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [rno, jcd, hd]);

  useEffect(() => {
    fetchData();
    intervalId.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          fetchData();
          return 60;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [fetchData]);

  useEffect(() => {
    if (
      beforeInfo &&
      beforeInfo.exhibitionTimes.some((time) => time !== null)
    ) {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    }
  }, [beforeInfo]);

  const getMedian = useCallback((values: number[]) => {
    const sortedValues = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sortedValues.length / 2);

    if (sortedValues.length % 2 === 0) {
      return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
    } else {
      return sortedValues[middle];
    }
  }, []);

  const getMaxDeviation = useCallback(
    (values: number[]) => {
      const median = getMedian(values);
      return values.reduce(
        (max, value) => {
          const deviation = Math.abs(value - median);
          return deviation > max.deviation ? { value, deviation } : max;
        },
        { value: values[0], deviation: 0 }
      ).value;
    },
    [getMedian]
  );

  const buttonStyle = {
    margin: "5px",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const copyToClipboard = () => {
    const data = {
      beforeInfo,
      raceList,
      racerSearchData,
    };
    navigator.clipboard
      .writeText(JSON.stringify(data, null, 2))
      .then(() => {
        alert("データがクリップボードにコピーされました");
      })
      .catch((error) => {
        console.error("クリップボードへのコピーに失敗しました:", error);
      });
  };

  const getRaceCourseName = (jcd: number) => {
    const course = raceCourses.find((course) => course.id === jcd);
    return course ? course.name : "不明なレース場";
  };

  const copyInstructionsAndDataToClipboard = () => {
    const instructions = [
      "ボートレースの予想フォーカスを出すこと。有力選手をそれぞれ軸とする予想もすること。" +
        "軸選手を中心に、ズレ目や穴目、折り返しを考慮したフォーメーションを設定すること。" +
        "与えられたデータはバランスよく評価すること。" +
        "フォーメーション、ボックス、流し、穴狙い、点数絞り、セット買いなど。" +
        "ファイルデータがあれば必ず活用すること。",
    ].join("\n");
    const data = {
      raceNumber: rno,
      raceCourse: getRaceCourseName(jcd),
      beforeInfo,
      raceList,
    };
    const combinedData = {
      instructions,
      data,
    };
    const textToCopy = JSON.stringify(combinedData, null, 2);

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert("指示内容とデータがクリップボードにコピーされました");
        })
        .catch((error) => {
          console.error("クリップボードへのコピーに失敗しました:", error);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed"; // avoid scrolling to bottom
      textArea.style.opacity = "0"; // hide the textarea
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 99999); // for mobile devices
      try {
        document.execCommand("copy");
        alert("指示内容とデータがクリップボードにコピーされました");
      } catch (error) {
        console.error("クリップボードへのコピーに失敗しました:", error);
      }
      document.body.removeChild(textArea);
    }
  };

  if (!beforeInfo || !raceList) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <button style={buttonStyle} onClick={fetchData}>
        更新
      </button>
      <button style={buttonStyle} onClick={copyToClipboard}>
        データをコピー
      </button>
      <button style={buttonStyle} onClick={copyInstructionsAndDataToClipboard}>
        指示内容とデータをコピー
      </button>
      <div>次の自動更新まで: {countdown}秒</div>
      <table>
        <thead>
          <tr>
            <th />
            <th style={{ backgroundColor: "white" }}>1号艇</th>
            <th style={{ backgroundColor: "black", color: "white" }}>2号艇</th>
            <th style={{ backgroundColor: "red", color: "white" }}>3号艇</th>
            <th style={{ backgroundColor: "blue", color: "white" }}>4号艇</th>
            <th style={{ backgroundColor: "yellow" }}>5号艇</th>
            <th style={{ backgroundColor: "green", color: "white" }}>6号艇</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>登録番号</td>
            {raceList.racers.map((racer, index) => (
              <td key={index}>{racer.number}</td>
            ))}
          </tr>
          <tr>
            <td>選手名</td>
            {beforeInfo.playerNames.map((name, index) => (
              <td key={index}>{name}</td>
            ))}
          </tr>
          <tr>
            <td>ランク</td>
            {raceList.racers.map((racer, index) => (
              <td
                key={index}
                style={
                  racer.rank === "A1"
                    ? {
                        fontWeight: "bold",
                        color: "red",
                        backgroundColor: "yellow",
                      }
                    : {}
                }
              >
                {racer.rank}
              </td>
            ))}
          </tr>
          <tr>
            <td>
              モーター情報
              <br />
              (番号/2連率/3連率)
            </td>
            {raceList.motorInfo.map((info, index) => {
              const twoConsectiveWinsValues = raceList.motorInfo.map(
                (info) => info.twoConsectiveWins
              );
              const threeConsectiveWinsValues = raceList.motorInfo.map(
                (info) => info.threeConsectiveWins
              );
              const maxDeviationTwoConsectiveWins = getMaxDeviation(
                twoConsectiveWinsValues
              );
              const maxDeviationThreeConsectiveWins = getMaxDeviation(
                threeConsectiveWinsValues
              );
              return (
                <td key={index}>
                  No.{info.number}
                  <br />
                  <span
                    style={
                      info.twoConsectiveWins === maxDeviationTwoConsectiveWins
                        ? info.twoConsectiveWins >
                          getMedian(twoConsectiveWinsValues)
                          ? {
                              fontWeight: "bold",
                              color: "red",
                              backgroundColor: "yellow",
                            }
                          : { fontWeight: "bold", color: "blue" }
                        : {}
                    }
                  >
                    {info.twoConsectiveWins.toFixed(2)}%
                  </span>
                  <br />
                  <span
                    style={
                      info.threeConsectiveWins ===
                      maxDeviationThreeConsectiveWins
                        ? info.threeConsectiveWins >
                          getMedian(threeConsectiveWinsValues)
                          ? {
                              fontWeight: "bold",
                              color: "red",
                              backgroundColor: "yellow",
                            }
                          : { fontWeight: "bold", color: "blue" }
                        : {}
                    }
                  >
                    {info.threeConsectiveWins.toFixed(2)}%
                  </span>
                </td>
              );
            })}
          </tr>
          <tr>
            <td>展示タイム</td>
            {beforeInfo.exhibitionTimes.map((info, index) => {
              const filteredValues = beforeInfo.exhibitionTimes.filter(
                (value) => value !== 0 && value !== null
              );
              const sortedValues = [...filteredValues].sort((a, b) => a - b);
              const minValue = sortedValues[0];
              const secondMinValue = sortedValues[1];
              return (
                <td
                  key={index}
                  style={
                    info === minValue && info !== 0 && info !== null
                      ? {
                          fontWeight: "bold",
                          color: "red",
                          backgroundColor: "yellow",
                        }
                      : info === secondMinValue && info !== 0 && info !== null
                        ? {
                            fontWeight: "bold",
                          }
                        : {}
                  }
                >
                  {info !== null ? info.toFixed(2) : "-"}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>まくりアラート</td>
            {beforeInfo.exhibitionTimes.map((info, index) => (
              <td
                key={index}
                style={
                  index === 0
                    ? {}
                    : beforeInfo.exhibitionTimes[index - 1] !== null &&
                        info !== null &&
                        beforeInfo.exhibitionTimes[index - 1] - info > 1.5
                      ? {
                          fontWeight: "bold",
                          color: "red",
                          backgroundColor: "yellow",
                        }
                      : beforeInfo.exhibitionTimes[index - 1] !== null &&
                          info !== null &&
                          beforeInfo.exhibitionTimes[index - 1] - info > 0.1
                        ? {
                            fontWeight: "bold",
                            color: "red",
                            backgroundColor: "yellow",
                          }
                        : {}
                }
              >
                <span>
                  {index === 0 ||
                  beforeInfo.exhibitionTimes[index - 1] === null ||
                  info === null
                    ? "-"
                    : beforeInfo.exhibitionTimes[index - 1] - info > 1.5
                      ? "◎"
                      : beforeInfo.exhibitionTimes[index - 1] - info > 0.1
                        ? "○"
                        : "×"}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td>平均ST</td>
            {raceList.startTimings.map((info, index) => {
              const sortedValues = [...raceList.startTimings].sort(
                (a, b) => a - b
              );
              const minValue = sortedValues[0];
              const secondMinValue = sortedValues[1];
              return (
                <td
                  key={index}
                  style={
                    info === minValue
                      ? {
                          fontWeight: "bold",
                          color: "red",
                          backgroundColor: "yellow",
                        }
                      : info === secondMinValue
                        ? {
                            fontWeight: "bold",
                          }
                        : {}
                  }
                >
                  {info !== null ? info.toFixed(2) : "-"}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>チルト角度</td>
            {beforeInfo.tiltAngles.map((angle, index) => (
              <td
                key={index}
                style={
                  angle !== null && angle >= 1.0
                    ? {
                        fontWeight: "bold",
                        color: "red",
                        backgroundColor: "yellow",
                      }
                    : {}
                }
              >
                {angle !== null ? angle.toFixed(1) : "-"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default RaceInfoTable;
