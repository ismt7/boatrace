"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Motor } from "../lib/prisma";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

const TableHeader = () => (
  <thead>
    <tr>
      <th className="py-2 whitespace-nowrap text-center w-1/3">登録番号</th>
      <th className="py-2 whitespace-nowrap text-center w-1/3">モーター番号</th>
      <th className="py-2 whitespace-nowrap text-center w-1/3">2連対率</th>
      <th className="py-2 whitespace-nowrap text-center w-1/3">前検タイム</th>
    </tr>
  </thead>
);

const TableBody = ({ motors }: { motors: Motor[] }) => (
  <tbody>
    {motors.length === 0 ? (
      <tr>
        <td colSpan={4} className="border px-4 py-2 text-center">
          表示するデータがありません
        </td>
      </tr>
    ) : (
      motors.map((motor) => (
        <tr key={motor.id}>
          <td className="border px-4 py-2 text-center">{motor.toban}</td>
          <td className="border px-4 py-2 text-center">{motor.motorNumber}</td>
          <td className="border px-4 py-2 text-center">
            {`${(motor.quinellaPairRate * 100).toFixed(2)}%`}
          </td>
          <td className="border px-4 py-2 text-center">
            {motor.preRaceInspectionTime.toFixed(2)}
          </td>
        </tr>
      ))
    )}
  </tbody>
);

const MotorPage = () => {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotors = async () => {
      try {
        const response = await axios.get("/api/motor");
        setMotors(response.data);
      } catch (error) {
        console.error("Error fetching motors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMotors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">モーター情報一覧</h1>
      <table className="w-full max-w-4xl bg-white table-fixed mx-auto">
        <TableHeader />
        <TableBody motors={motors} />
      </table>
    </div>
  );
};

export default MotorPage;
