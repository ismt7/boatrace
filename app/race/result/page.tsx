"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { BoatResult, CourseResult, RaceResult, Payout } from "@/app/lib/prisma";
import { raceCourses } from "@/app/boat/components/Odds/OddsHelpers";
import RaceResultsTable from "./RaceResultsTable";
import CourseResultsTable from "./CourseResultsTable";
import BoatResultsTable from "./BoatResultsTable";
import PayoutResultsTable from "./PayoutResultsTable";

const RaceResultPage = () => {
  const [raceResults, setRaceResults] = useState<RaceResult[]>([]);
  const [courseResults, setCourseResults] = useState<CourseResult[]>([]);
  const [boatResults, setBoatResults] = useState<BoatResult[]>([]);
  const [payoutResults, setPayoutResults] = useState<Payout[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultJcd = raceCourses[0].id;
  const jcd = searchParams.get("jcd") || defaultJcd;
  const defaultDate = dayjs().format("YYYYMMDD");
  const hd = searchParams.get("hd") || defaultDate;
  const [selectedDate, setSelectedDate] = useState<string>(hd);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRaceResults = async () => {
      try {
        const response = await axios.get(
          `/api/race/result?jcd=${jcd}&hd=${selectedDate}`
        );
        setRaceResults(response.data.raceResults);
        setCourseResults(response.data.courseResults);
        setBoatResults(response.data.boatResults);
        setPayoutResults(response.data.payoutResults);
      } catch (error) {
        console.error("Error fetching race results:", error);
      }
    };

    fetchRaceResults();
  }, [jcd, selectedDate]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    scrollContainer.addEventListener("mousedown", handleMouseDown);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("mouseup", handleMouseUp);
    scrollContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      scrollContainer.removeEventListener("mousedown", handleMouseDown);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("mouseup", handleMouseUp);
      scrollContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleButtonClick = (id: number) => {
    router.push(`?jcd=${id}&hd=${selectedDate}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = dayjs(e.target.value).format("YYYYMMDD");
    setSelectedDate(newDate);
    router.push(`?jcd=${jcd}&hd=${newDate}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">レース結果ページ</h1>
      <div
        className="flex mb-4 border-b overflow-x-auto custom-scrollbar"
        ref={scrollRef}
      >
        {raceCourses.map((course) => (
          <button
            key={course.id}
            className={`py-2 px-4 m-1 whitespace-nowrap ${
              jcd === course.id.toString()
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-700"
            }`}
            onClick={() => handleButtonClick(course.id)}
          >
            {course.name}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <label htmlFor="race-date" className="mr-2">
          日付を選択:
        </label>
        <input
          type="date"
          id="race-date"
          value={dayjs(selectedDate).format("YYYY-MM-DD")}
          onChange={handleDateChange}
          className="border p-2"
        />
      </div>

      <PayoutResultsTable payoutResults={payoutResults} />
      <RaceResultsTable raceResults={raceResults} />
      <CourseResultsTable courseResults={courseResults} />
      <BoatResultsTable boatResults={boatResults} />
    </div>
  );
};

export default RaceResultPage;
