"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Race } from "../lib/prisma";
import { raceCourses } from "../boat/components/Odds/OddsHelpers";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

const RacePage = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultJcd = raceCourses[0].id;
  const jcd = searchParams.get("jcd") || defaultJcd;
  const defaultDate = dayjs().tz().format("YYYYMMDD");
  const hd = searchParams.get("hd") || defaultDate;
  const [selectedDate, setSelectedDate] = useState<string>(hd);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await axios.get(
          `/api/race?jcd=${jcd}&hd=${selectedDate}`
        );
        setRaces(response.data);
      } catch (error) {
        console.error("Error fetching races:", error);
      }
    };

    fetchRaces();
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
      const walk = (x - startX) * 2; // スクロール速度を調整
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

  useEffect(() => {
    const interval = setInterval(() => {
      const today = dayjs().tz().format("YYYYMMDD");
      if (dayjs(selectedDate).isBefore(today)) {
        if (
          confirm(
            "選択されている日付が過去の日付です。今日の日付に変更しますか？"
          )
        ) {
          setSelectedDate(today);
          router.push(`?jcd=${jcd}&hd=${today}`);
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedDate, jcd, router]);

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
      <h1 className="text-2xl font-bold mb-4">レースページ</h1>
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
      <table className="w-full max-w-4xl bg-white table-fixed mx-auto">
        <thead>
          <tr>
            <th className="py-2 whitespace-nowrap text-center w-1/2">
              レース番号
            </th>
            <th className="py-2 whitespace-nowrap text-center w-1/2">
              レース時間
            </th>
          </tr>
        </thead>
        <tbody>
          {races.length === 0 ? (
            <tr>
              <td colSpan={2} className="border px-4 py-2 text-center">
                表示するデータがありません
              </td>
            </tr>
          ) : (
            races.map((race) => (
              <tr
                key={race.id}
                className={race.isFinished ? "bg-gray-200" : ""}
              >
                <td className="border px-4 py-2 text-center">
                  {race.raceNumber}
                </td>
                <td className="border px-4 py-2 text-center">
                  {race.raceTime}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RacePage;
