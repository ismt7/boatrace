import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { OddsTable } from "../OddsTable/OddsTable";
import { OddsUpdateButton } from "../OddsUpdateButton";
import { fetchOdds } from "../../lib/fetchOdds";
import { BoatCanvas } from "../BoatCanvas";
import FixedYouTube from "../FixedYouTube";
import PredictionPanel from "../PredictionPanel/PredictionPanel";
import "./Odds.module.css";

export interface TrifectaOdds {
  [key: number]: {
    [key: number]: {
      [key: number]: number;
    };
  };
}

export const raceCourses = [
  { id: 1, name: "桐生" },
  { id: 2, name: "戸田" },
  { id: 3, name: "江戸川" },
  { id: 4, name: "平和島" },
  { id: 5, name: "多摩川" },
  { id: 6, name: "浜名湖" },
  { id: 7, name: "蒲郡" },
  { id: 8, name: "常滑" },
  { id: 9, name: "津" },
  { id: 10, name: "三国" },
  { id: 11, name: "びわこ" },
  { id: 12, name: "住之江" },
  { id: 13, name: "尼崎" },
  { id: 14, name: "鳴門" },
  { id: 15, name: "丸亀" },
  { id: 16, name: "児島" },
  { id: 17, name: "宮島" },
  { id: 18, name: "徳山" },
  { id: 19, name: "下関" },
  { id: 20, name: "若松" },
  { id: 21, name: "芦屋" },
  { id: 22, name: "福岡" },
  { id: 23, name: "唐津" },
  { id: 24, name: "大村" },
];

export default function Odds({
  youtubeUrl,
  setOdds,
  odds,
}: {
  youtubeUrl: string;
  setOdds: React.Dispatch<React.SetStateAction<TrifectaOdds | null>>;
  odds: TrifectaOdds | null;
}): React.ReactNode {
  const [oddsUpdatedTime, setOddsUpdatedTime] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<number>(22);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [prediction, setPrediction] = useState<string>("");

  const [tenjiSrc, setTenjiSrc] = useState<string>("");
  const [replaySrc, setReplaySrc] = useState<string>("");

  useEffect(() => {
    const storedPrediction = localStorage.getItem("prediction");
    if (storedPrediction) {
      setPrediction(storedPrediction);
    }
  }, []);

  const handlePredictionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newPrediction = event.target.value;
    setPrediction(newPrediction);
    localStorage.setItem("prediction", newPrediction);
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("odds");
      localStorage.removeItem("oddsUpdatedTime");
      localStorage.removeItem("prediction");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const rno = Number(searchParams.get("rno")) || 1;
    const jcd = Number(searchParams.get("jcd")) || 22;
    const hd = searchParams.get("hd") || dayjs().format("YYYY-MM-DD");
    setSelectedRace(rno);
    setSelectedCourse(jcd);
    setSelectedDate(hd);

    const storedOdds = localStorage.getItem("odds");
    const storedOddsUpdatedTime = localStorage.getItem("oddsUpdatedTime");

    if (storedOdds && storedOddsUpdatedTime) {
      const parsedOdds = JSON.parse(storedOdds);
      setOdds(parsedOdds);
      setOddsUpdatedTime(storedOddsUpdatedTime);
    } else {
      fetchOdds(rno, jcd, hd).then((res) => {
        setOdds(res.odds);
        setOddsUpdatedTime(res.oddsUpdatedTime);
        localStorage.setItem("odds", JSON.stringify(res.odds));
        localStorage.setItem("oddsUpdatedTime", res.oddsUpdatedTime);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const tenjiUrl = `https://live.boatcast.jp/boatcastsp/streamer/streamer.php?tenji=1&jo=${selectedCourse}&race=${selectedRace}&date=${selectedDate}&m=1`;
    const replayUrl = `https://live.boatcast.jp/boatcastsp/streamer/streamer.php?jo=${selectedCourse}&race=${selectedRace}&date=${selectedDate}&m=1`;
    setTenjiSrc(tenjiUrl);
    setReplaySrc(replayUrl);
  }, [selectedCourse, selectedRace, selectedDate]);

  const handleRaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const rno = Number(event.target.value);
    setSelectedRace(rno);
    updateURL(rno, selectedCourse, selectedDate);
  };

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const jcd = Number(event.target.value);
    setSelectedCourse(jcd);
    updateURL(selectedRace, jcd, selectedDate);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hd = event.target.value;
    setSelectedDate(hd);
    updateURL(selectedRace, selectedCourse, hd);
  };

  const handleRefresh = () => {
    setOdds(null);
    fetchOdds(selectedRace, selectedCourse, selectedDate).then((res) => {
      setOdds(res.odds);
      setOddsUpdatedTime(res.oddsUpdatedTime);
      localStorage.setItem("odds", JSON.stringify(res.odds));
      localStorage.setItem("oddsUpdatedTime", res.oddsUpdatedTime);
    });
  };

  const handleIframeRefresh = () => {
    const tenjiUrl = `https://live.boatcast.jp/boatcastsp/streamer/streamer.php?tenji=1&jo=${selectedCourse}&race=${selectedRace}&date=${selectedDate}&m=1`;
    const replayUrl = `https://live.boatcast.jp/boatcastsp/streamer/streamer.php?jo=${selectedCourse}&race=${selectedRace}&date=${selectedDate}&m=1`;
    setTenjiSrc(tenjiUrl);
    setReplaySrc(replayUrl);
  };

  const updateURL = (rno: number, jcd: number, hd: string) => {
    const params = new URLSearchParams();
    params.set("rno", rno.toString());
    params.set("jcd", jcd.toString());
    params.set("hd", hd);
    router.push(`?${params.toString()}`);
  };
  return (
    <div>
      <div className="container flex">
        <div className="left-side w-1/2 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 max-w-xl">
            <div>
              <label htmlFor="course-select" className="block mb-2">
                レース場:
              </label>
              <select
                id="course-select"
                className="select-dropdown w-full p-2 border border-gray-300 rounded"
                value={selectedCourse}
                onChange={handleCourseChange}
              >
                {raceCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="race-select" className="block mb-2">
                レース番号:
              </label>
              <select
                id="race-select"
                className="select-dropdown w-full p-2 border border-gray-300 rounded"
                value={selectedRace}
                onChange={handleRaceChange}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}R
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date-select" className="block mb-2">
                日付:
              </label>
              <input
                type="date"
                id="date-select"
                value={selectedDate}
                onChange={handleDateChange}
                className="select-dropdown w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <OddsUpdateButton handleRefresh={handleRefresh} />
          {odds ? (
            <OddsTable odds={odds} oddsUpdatedTime={oddsUpdatedTime} />
          ) : (
            <p>Loading...</p>
          )}
          <button
            onClick={handleIframeRefresh}
            className="refresh-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            リフレッシュ
          </button>
          <h2 className="text-lg font-bold mb-2">展示走行</h2>
          <iframe src={tenjiSrc} width="700" height="450"></iframe>
          <h2 className="text-lg font-bold mb-2">リプレイ</h2>
          <iframe src={replaySrc} width="700" height="450"></iframe>
          <FixedYouTube videoUrl={youtubeUrl} />
        </div>
        <div className="right-side w-1/2 pl-4">
          <BoatCanvas />
          <PredictionPanel />
        </div>
      </div>
    </div>
  );
}
