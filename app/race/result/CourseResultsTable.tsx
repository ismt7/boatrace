import React from "react";
import { CourseResult } from "@/app/lib/prisma";

const getBackgroundColor = (percentage: number) => {
  if (percentage >= 90) return "bg-red-600";
  if (percentage >= 75) return "bg-red-500";
  if (percentage >= 60) return "bg-red-400";
  if (percentage >= 45) return "bg-red-300";
  if (percentage >= 30) return "bg-red-200";
  if (percentage >= 15) return "bg-red-100";
  if (percentage > 0) return "bg-red-50";
  return "bg-white";
};

const CourseResultsTable = ({
  courseResults,
}: {
  courseResults: CourseResult[];
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mt-8">進入コース別 結果</h2>
      <table className="w-full max-w-8xl bg-white table-fixed mx-auto mt-4">
        <thead>
          <tr>
            <th className="py-2 whitespace-nowrap text-center w-1/6">着順</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">
              1コース
            </th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">
              2コース
            </th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">
              3コース
            </th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">
              4コース
            </th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">
              5コース
            </th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">
              6コース
            </th>
          </tr>
        </thead>
        <tbody>
          {courseResults.length === 0 ? (
            <tr>
              <td colSpan={7} className="border px-4 py-2 text-center">
                表示するデータがありません
              </td>
            </tr>
          ) : (
            courseResults.map((course) => (
              <tr key={course.id}>
                <td className="border px-4 py-2 text-center">
                  {course.orderOfFinish}着
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(course.firstCourse * 100)}`}
                >
                  {(course.firstCourse * 100).toFixed(1)}%
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(course.secondCourse * 100)}`}
                >
                  {(course.secondCourse * 100).toFixed(1)}%
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(course.thirdCourse * 100)}`}
                >
                  {(course.thirdCourse * 100).toFixed(1)}%
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(course.fourthCourse * 100)}`}
                >
                  {(course.fourthCourse * 100).toFixed(1)}%
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(course.fifthCourse * 100)}`}
                >
                  {(course.fifthCourse * 100).toFixed(1)}%
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(course.sixthCourse * 100)}`}
                >
                  {(course.sixthCourse * 100).toFixed(1)}%
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default CourseResultsTable;
