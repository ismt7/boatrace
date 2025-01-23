import React from "react";
import { raceCourses } from "./OddsHelpers";

export function RaceSelector({
  selectedCourse,
  selectedRace,
  selectedDate,
  handleCourseChange,
  handleRaceChange,
  handleDateChange,
}: {
  selectedCourse: number;
  selectedRace: number;
  selectedDate: string;
  handleCourseChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleRaceChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-4 mb-4 max-w-3xl">
      <div>
        <div
          id="course-select"
          className="flex flex-wrap gap-2 overflow-x-auto"
        >
          {raceCourses.map((course) => (
            <button
              key={course.id}
              value={course.id}
              onClick={handleCourseChange}
              className={`p-2 border rounded ${selectedCourse === course.id ? "bg-blue-500 text-white" : "bg-white text-black"}`}
            >
              {course.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div id="race-select" className="flex flex-wrap gap-2 overflow-x-auto">
          {Array.from({ length: 12 }, (_, i) => (
            <button
              key={i + 1}
              value={i + 1}
              onClick={handleRaceChange}
              className={`p-2 border rounded ${selectedRace === i + 1 ? "bg-blue-500 text-white" : "bg-white text-black"}`}
            >
              {i + 1}R
            </button>
          ))}
        </div>
      </div>
      <div>
        <input
          type="date"
          id="date-select"
          value={selectedDate}
          onChange={handleDateChange}
          className="select-dropdown p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
}
