import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { OddsTable } from "../OddsTable/OddsTable";
import { OddsUpdateButton } from "../OddsUpdateButton";
import { BoatCanvas } from "../BoatCanvas";
import FixedYouTube from "../FixedYouTube";
import PredictionPanel from "../PredictionPanel/PredictionPanel";
import "./Odds.module.css";
import { DoubleOdds } from "@/app/api/boatrace/odds/route";
import { BoatSimulation } from "../BoatSimulation/BoatSimulation";
import NormalDistributionChart from "../OddsTable/NormalDistributionChart";
import RaceInfoTable from "../RaceInfoTable";
import TrifectaBoxOddsCalculator from "../TrifectaBoxOddsCalculator";
import CombinationOddsCalculator from "../CombinationOddsCalculator/CombinationOddsCalculator";
import TopOddsList from "../TopOddsList";
import DoubleOddsRanking from "../DoubleOddsRanking";
import CombinedOddsRanking from "../CombinedOddsRanking";
import {
  fetchAndSetOdds,
  generateIframeUrls,
  handleBeforeUnload,
  updateURL,
} from "./OddsHelpers";
import { RaceSelector } from "./RaceSelector";
import { IframeSection } from "./IframeSection";

export interface TrifectaOdds {
  [key: number]: {
    [key: number]: {
      [key: number]: number;
    };
  };
}

export default memo(function Odds({
  youtubeUrl,
  setOdds,
  odds,
  doubleOdds,
  setDoubleOdds,
  autoPlay,
}: {
  youtubeUrl: string;
  setOdds: React.Dispatch<React.SetStateAction<TrifectaOdds | null>>;
  odds: TrifectaOdds | null;
  doubleOdds: DoubleOdds | null;
  setDoubleOdds: React.Dispatch<React.SetStateAction<DoubleOdds | null>>;
  autoPlay: boolean;
}): React.ReactNode {
  const [oddsUpdatedTime, setOddsUpdatedTime] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<number>(22);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [tenjiSrc, setTenjiSrc] = useState<string>("");
  const [replaySrc, setReplaySrc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(60);

  const router = useRouter();
  const searchParams = useSearchParams();
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!searchParams) return;

    const rno = Number(searchParams.get("rno")) || 1;
    const jcd = Number(searchParams.get("jcd")) || 22;
    const hd = searchParams.get("hd") || dayjs().format("YYYY-MM-DD");
    setSelectedRace(rno);
    setSelectedCourse(jcd);
    setSelectedDate(hd);

    fetchAndSetOdds(
      rno,
      jcd,
      hd,
      setOdds,
      setDoubleOdds,
      setOddsUpdatedTime,
      setLoading
    );
  }, [searchParams, setOdds, setDoubleOdds]);

  useEffect(() => {
    const { tenjiUrl, replayUrl } = generateIframeUrls(
      selectedCourse,
      selectedRace,
      selectedDate
    );
    setTenjiSrc(tenjiUrl);
    setReplaySrc(replayUrl);
  }, [selectedCourse, selectedRace, selectedDate]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    fetchAndSetOdds(
      selectedRace,
      selectedCourse,
      selectedDate,
      setOdds,
      setDoubleOdds,
      setOddsUpdatedTime,
      setLoading
    ).finally(() => {
      setLoading(false);
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
      countdownInterval.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            handleRefresh();
            return 60;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    });
  }, [
    selectedRace,
    selectedCourse,
    selectedDate,
    setOdds,
    setDoubleOdds,
    setOddsUpdatedTime,
    setLoading,
  ]);

  useEffect(() => {
    if (oddsUpdatedTime === null || oddsUpdatedTime === "") {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    }
  }, [oddsUpdatedTime]);

  useEffect(() => {
    countdownInterval.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          handleRefresh();
          return 60;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, [handleRefresh]);

  const handleRaceChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const rno = Number(event.currentTarget.value);
      setSelectedRace(rno);
      updateURL(router, rno, selectedCourse, selectedDate);
      handleRefresh();
    },
    [router, selectedCourse, selectedDate, handleRefresh]
  );

  const handleCourseChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const jcd = Number(event.currentTarget.value);
      setSelectedCourse(jcd);
      updateURL(router, selectedRace, jcd, selectedDate);
      handleRefresh();
    },
    [router, selectedRace, selectedDate, handleRefresh]
  );

  const handleDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const hd = event.target.value;
      setSelectedDate(hd);
      updateURL(router, selectedRace, selectedCourse, hd);
      handleRefresh();
    },
    [router, selectedRace, selectedCourse, handleRefresh]
  );

  const handleIframeRefresh = useCallback(() => {
    const { tenjiUrl, replayUrl } = generateIframeUrls(
      selectedCourse,
      selectedRace,
      selectedDate
    );
    setTenjiSrc(tenjiUrl);
    setReplaySrc(replayUrl);
  }, [selectedCourse, selectedRace, selectedDate]);

  return (
    <div className="dashboard-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="tile p-4 bg-white shadow-md rounded-md sm:col-span-1 lg:col-span-2">
        <RaceSelector
          selectedCourse={selectedCourse}
          selectedRace={selectedRace}
          selectedDate={selectedDate}
          handleCourseChange={handleCourseChange}
          handleRaceChange={handleRaceChange}
          handleDateChange={handleDateChange}
        />
      </div>
      <div className="tile p-4 bg-white shadow-md rounded-md">
        <FixedYouTube videoUrl={youtubeUrl} autoPlay={autoPlay} />
      </div>

      {/* 予想メモ */}
      <div className="tile p-4 bg-white shadow-md rounded-md">
        <PredictionPanel odds={odds} doubleOdds={doubleOdds} />
      </div>

      <div className="tile p-4 bg-white shadow-md rounded-md md:col-span-2 lg:col-span-1">
        <RaceInfoTable
          rno={selectedRace}
          jcd={selectedCourse}
          hd={selectedDate}
        />
        {odds && doubleOdds && (
          <>
            <OddsUpdateButton handleRefresh={handleRefresh} />
            {loading && <p>Loading...</p>}
            <OddsTable
              odds={odds}
              doubleOdds={doubleOdds}
              oddsUpdatedTime={oddsUpdatedTime}
              countdown={countdown}
            />
          </>
        )}
      </div>
      {odds && doubleOdds && (
        <>
          <div className="tile p-4 bg-white shadow-md rounded-md">
            <div className="flex flex-row space-x-4">
              <TopOddsList odds={odds} />
              <DoubleOddsRanking doubleOdds={doubleOdds} />
              <CombinedOddsRanking
                trifectaOdds={odds}
                doubleOdds={doubleOdds}
              />
            </div>
            <NormalDistributionChart odds={odds} mean={1} stdDev={1} />
          </div>
          <div className="tile p-4 bg-white shadow-md rounded-md">
            <CombinationOddsCalculator odds={odds} />
          </div>
          <div className="tile p-4 bg-white shadow-md rounded-md">
            <TrifectaBoxOddsCalculator odds={odds} />
          </div>
        </>
      )}
      <div className="tile p-4 bg-white shadow-md rounded-md">
        <BoatCanvas />
        <BoatSimulation />
      </div>
      <div className="tile p-4 bg-white shadow-md rounded-md">
        <IframeSection
          tenjiSrc={tenjiSrc}
          replaySrc={replaySrc}
          handleIframeRefresh={handleIframeRefresh}
        />
      </div>
    </div>
  );
});
