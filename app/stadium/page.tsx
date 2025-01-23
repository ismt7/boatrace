"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Stadium } from "../lib/prisma";
import { raceCourses } from "../boat/components/Odds/OddsHelpers";
import "./scrollbar.css"; // カスタムスクロールバーのスタイルをインポート
import RaceCourseButtonList from "../components/RaceCourseButtonList";

function getHeatMapColor(value: number) {
  const percentage = value * 100;
  if (percentage >= 90) return "bg-red-600";
  if (percentage >= 75) return "bg-red-500";
  if (percentage >= 60) return "bg-red-400";
  if (percentage >= 45) return "bg-red-300";
  if (percentage >= 30) return "bg-red-200";
  if (percentage >= 15) return "bg-red-100";
  if (percentage > 0) return "bg-red-50";
  return "bg-white";
}

function HeatMapCell({ value }: { value: number }) {
  return (
    <td className={`border px-4 py-2 text-right ${getHeatMapColor(value)}`}>
      {(value * 100).toFixed(2)}%
    </td>
  );
}

function StadiumTable({ stadiums }: { stadiums: Stadium[] }) {
  return (
    <table className="w-full max-w-4xl bg-white table-fixed mx-auto">
      <thead>
        <tr>
          <th className="py-2 whitespace-nowrap text-center w-1/7">コース</th>
          <th className="py-2 whitespace-nowrap text-center w-1/7">1着率</th>
          <th className="py-2 whitespace-nowrap text-center w-1/7">2着率</th>
          <th className="py-2 whitespace-nowrap text-center w-1/7">3着率</th>
          <th className="py-2 whitespace-nowrap text-center w-1/7">4着率</th>
          <th className="py-2 whitespace-nowrap text-center w-1/7">5着率</th>
          <th className="py-2 whitespace-nowrap text-center w-1/7">6着率</th>
        </tr>
      </thead>
      <tbody>
        {stadiums.length === 0 ? (
          <tr>
            <td colSpan={7} className="border px-4 py-2 text-center">
              表示するデータがありません
            </td>
          </tr>
        ) : (
          stadiums.map((stadium) => (
            <tr key={stadium.id}>
              <td className="border px-4 py-2">{stadium.course}</td>
              <HeatMapCell value={stadium.first} />
              <HeatMapCell value={stadium.second} />
              <HeatMapCell value={stadium.third} />
              <HeatMapCell value={stadium.fourth} />
              <HeatMapCell value={stadium.fifth} />
              <HeatMapCell value={stadium.sixth} />
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default function StadiumPage() {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultJcd = raceCourses[0].id;
  const jcd = Number(searchParams.get("jcd")) || defaultJcd;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchStadiums() {
      const response = await fetch(`/api/stadium?jcd=${jcd}`);
      const data = await response.json();
      setStadiums(data);
    }
    fetchStadiums();
  }, [jcd]);

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

  const handleButtonClick = (id: number) => {
    router.push(`?jcd=${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ボートレース場</h1>
      <RaceCourseButtonList
        courses={raceCourses}
        selectedId={jcd}
        onClick={handleButtonClick}
        scrollRef={scrollRef}
      />
      <StadiumTable stadiums={stadiums} />
    </div>
  );
}
