import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { TrifectaOdds } from "../Odds/Odds";

interface NormalDistributionChartProps {
  odds: TrifectaOdds;
  mean: number;
  stdDev: number;
  width?: number;
  height?: number;
}

const NormalDistributionChart: React.FC<NormalDistributionChartProps> = ({
  odds,
}) => {
  const data: number[] = [];
  const boatNumbers = Object.keys(odds).map(Number);
  boatNumbers.forEach((firstBoat) => {
    boatNumbers
      .filter((secondBoat) => secondBoat !== firstBoat)
      .forEach((secondBoat) => {
        boatNumbers
          .filter(
            (thirdBoat) => thirdBoat !== firstBoat && thirdBoat !== secondBoat
          )
          .forEach((thirdBoat) => {
            if (
              odds[firstBoat][secondBoat][thirdBoat] > 0 &&
              odds[firstBoat][secondBoat][thirdBoat] <= 200
            ) {
              data.push(odds[firstBoat][secondBoat][thirdBoat]);
            }
          });
      });
  });

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // SVGの設定
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // SVGの内容をリセット
    svg.selectAll("*").remove();

    // ヒストグラムのビンを設定
    const bins = d3.bin().thresholds(d3.range(1, 201, 5))(data);

    // スケール設定
    const xScale = d3
      .scaleLinear()
      .domain([1, 200])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length) ?? 0])
      .range([height - margin.bottom, margin.top]);

    // X軸とY軸
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    // ヒストグラムのバーを描画
    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.x0 ?? 0) + 1)
      .attr("y", (d) => yScale(d.length))
      .attr("width", (d) => xScale(d.x1 ?? 0) - xScale(d.x0 ?? 0) - 1)
      .attr("height", (d) => height - margin.bottom - yScale(d.length))
      .attr("fill", "steelblue");
  }, [odds]);

  return <svg ref={svgRef}></svg>;
};

export default NormalDistributionChart;
