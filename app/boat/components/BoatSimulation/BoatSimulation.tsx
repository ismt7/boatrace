import React, { useState, useRef, useEffect } from "react";
import { initialBoatWakePositionPattarns } from "./initialBoatWakePositionPattarns";

const initialBoatPositions = [
  { x: 310, y: 200 },
  { x: 310, y: 235 },
  { x: 310, y: 270 },
  { x: 310, y: 305 },
  { x: 310, y: 340 },
  { x: 310, y: 375 },
];

const initialBoatRotations = [90, 90, 90, 90, 90, 90];

function ControlPointForm({
  index,
  controlPoint,
  endPoint,
  show,
  onControlPointChange,
  onEndPointChange,
  onToggleShow,
}: {
  index: number;
  controlPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  show: boolean;
  onControlPointChange: (index: number, axis: "x" | "y", value: string) => void;
  onEndPointChange: (index: number, axis: "x" | "y", value: string) => void;
  onToggleShow: (index: number) => void;
}) {
  return (
    <div className="mr-4 mb-4 p-2 border border-gray-300 rounded">
      <h2 className="text-lg font-medium text-gray-700 mb-2">
        ボート{index + 1}
      </h2>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        航跡表示
      </label>
      <label className="flex items-center cursor-pointer mb-2">
        <div className="relative">
          <input
            type="checkbox"
            checked={show}
            onChange={() => onToggleShow(index)}
            className="sr-only"
          />
          <div
            className={`block w-14 h-8 rounded-full transition ${
              show ? "bg-green-500" : "bg-gray-600"
            }`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
              show ? "transform translate-x-full" : ""
            }`}
          ></div>
        </div>
      </label>
      <label className="block text-sm font-medium text-gray-700">制御点X</label>
      <input
        type="number"
        step="1"
        value={controlPoint.x}
        onChange={(e) => onControlPointChange(index, "x", e.target.value)}
        className="border border-gray-300 p-1 text-sm w-16 mb-2"
      />
      <label className="block text-sm font-medium text-gray-700">制御点Y</label>
      <input
        type="number"
        step="1"
        value={controlPoint.y}
        onChange={(e) => onControlPointChange(index, "y", e.target.value)}
        className="border border-gray-300 p-1 text-sm w-16 mb-2"
      />
      <label className="block text-sm font-medium text-gray-700">終点X</label>
      <input
        type="number"
        step="1"
        value={endPoint.x}
        onChange={(e) => onEndPointChange(index, "x", e.target.value)}
        className="border border-gray-300 p-1 text-sm w-16 mb-2"
      />
      <label className="block text-sm font-medium text-gray-700">終点Y</label>
      <input
        type="number"
        step="1"
        value={endPoint.y}
        onChange={(e) => onEndPointChange(index, "y", e.target.value)}
        className="border border-gray-300 p-1 text-sm w-16 mb-2"
      />
    </div>
  );
}

const FEATURE_FLAGS = {
  showJsonOutput: false,
  enableBoatWakeInput: false,
};

export const BoatSimulation: React.FC = () => {
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boatPositions, setBoatPositions] = useState(initialBoatPositions);
  const [boatRotations, setBoatRotations] = useState(initialBoatRotations);
  const [startTimes, setStartTimes] = useState<number[]>([
    0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
  ]);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [controlPoints, setControlPoints] = useState(
    initialBoatWakePositionPattarns[selectedPattern].positions.map(
      (pos) => pos.controlPoint
    )
  );
  const [endPoints, setEndPoints] = useState(
    initialBoatWakePositionPattarns[selectedPattern].positions.map(
      (pos) => pos.endPoint
    )
  );
  const [showBoatWakes, setShowBoatWakes] = useState(
    initialBoatWakePositionPattarns[selectedPattern].positions.map(
      (pos) => pos.show
    )
  );
  const [jsonOutput, setJsonOutput] = useState("");

  const handleStartSimulation = () => {
    setSimulationRunning(true);
    // シミュレーションロジックをここに追加
  };

  const handleStopSimulation = () => {
    setSimulationRunning(false);
    // シミュレーション停止ロジックをここに追加
  };

  const handleStartTimeChange = (index: number, value: string) => {
    const newStartTimes = [...startTimes];
    newStartTimes[index] = parseFloat(value);
    setStartTimes(newStartTimes);
  };

  const handleControlPointChange = (
    boatIndex: number,
    axis: "x" | "y",
    value: string
  ) => {
    const newControlPoints = [...controlPoints];
    newControlPoints[boatIndex] = {
      ...newControlPoints[boatIndex],
      [axis]: parseFloat(value),
    };
    setControlPoints(newControlPoints);
  };

  const handleEndPointChange = (
    boatIndex: number,
    axis: "x" | "y",
    value: string
  ) => {
    const newEndPoints = [...endPoints];
    newEndPoints[boatIndex] = {
      ...newEndPoints[boatIndex],
      [axis]: parseFloat(value),
    };
    setEndPoints(newEndPoints);
  };

  const handlePatternChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const patternIndex = parseInt(event.target.value, 10);
    setSelectedPattern(patternIndex);
    setControlPoints(
      initialBoatWakePositionPattarns[patternIndex].positions.map(
        (pos) => pos.controlPoint
      )
    );
    setEndPoints(
      initialBoatWakePositionPattarns[patternIndex].positions.map(
        (pos) => pos.endPoint
      )
    );
    setShowBoatWakes(
      initialBoatWakePositionPattarns[patternIndex].positions.map(
        (pos) => pos.show
      )
    );
  };

  const handleToggleBoatWake = (index: number) => {
    const newShowBoatWakes = [...showBoatWakes];
    newShowBoatWakes[index] = !newShowBoatWakes[index];
    setShowBoatWakes(newShowBoatWakes);
  };

  const generateJsonOutput = () => {
    const output = controlPoints.map((cp, index) => ({
      controlPoint: cp,
      endPoint: endPoints[index],
      show: showBoatWakes[index],
    }));
    setJsonOutput(JSON.stringify(output, null, 2));
  };

  useEffect(() => {
    generateJsonOutput();
  }, [controlPoints, endPoints, showBoatWakes]);

  useEffect(() => {
    const newBoatPositions = boatPositions.map((pos, index) => ({
      ...pos,
      x: initialBoatPositions[index].x - startTimes[index] * 200,
    }));
    setBoatPositions(newBoatPositions);
  }, [startTimes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const centerLineY = canvas.height / 2.5;
      const turnMarkSize = 10;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // キャンバスの初期化
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 中心線の描画
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5; // 中心線を太くする
        ctx.beginPath();
        ctx.moveTo(canvas.width / 6, centerLineY);
        ctx.lineTo((canvas.width * 2.5) / 4, centerLineY);
        ctx.stroke();
        ctx.lineWidth = 1; // ボートの図形の線を元に戻す

        // ターンマークの描画
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(canvas.width / 6, centerLineY, turnMarkSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          (canvas.width * 2.5) / 4,
          centerLineY,
          turnMarkSize,
          0,
          2 * Math.PI
        );
        ctx.fill();

        // スタートラインの描画
        ctx.strokeStyle = "blue";
        ctx.setLineDash([5, 5]); // 波線を作成
        ctx.beginPath();
        ctx.moveTo((canvas.width * 2.5) / 6 - 20, centerLineY);
        ctx.lineTo((canvas.width * 2.5) / 6 - 20, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]); // 波線をリセット

        // ボート航跡
        boatPositions.forEach((pos, index) => {
          drawBoatWake(
            ctx,
            pos.y,
            controlPoints[index],
            endPoints[index],
            showBoatWakes[index]
          );
        });

        // ボートの描画
        boatPositions.forEach((pos, index) => {
          ctx.save();
          ctx.translate(pos.x, pos.y);
          ctx.rotate((boatRotations[index] * Math.PI) / 180);
          switch (index) {
            case 0:
              ctx.strokeStyle = "black";
              ctx.fillStyle = "white";
              break;
            case 1:
              ctx.fillStyle = "black";
              break;
            case 2:
              ctx.fillStyle = "red";
              break;
            case 3:
              ctx.fillStyle = "blue";
              break;
            case 4:
              ctx.strokeStyle = "black";
              ctx.fillStyle = "yellow";
              break;
            case 5:
              ctx.fillStyle = "green";
              break;
          }
          drawIsoscelesTriangle(ctx, 0, 0, index === 0 || index === 4);
          ctx.restore();
        });
      }
    }
  }, [
    simulationRunning,
    boatPositions,
    boatRotations,
    controlPoints,
    endPoints,
    showBoatWakes,
  ]);

  const drawIsoscelesTriangle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    stroke: boolean = false
  ) => {
    const width = 20;
    const height = 30; // 縦長にするために高さを増やす
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - width / 2, y + height);
    ctx.lineTo(x + width / 2, y + height);
    ctx.closePath();
    ctx.fill();
    if (stroke) {
      ctx.stroke();
    }
  };

  const drawBoatWake = (
    ctx: CanvasRenderingContext2D,
    lineY: number,
    controlPoint: { x: number; y: number },
    endPoint: { x: number; y: number },
    isShow: boolean
  ) => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(230, lineY);
    ctx.lineTo(480, lineY);
    if (isShow) {
      ctx.moveTo(480, lineY);
      ctx.quadraticCurveTo(
        controlPoint.x,
        lineY + controlPoint.y,
        endPoint.x,
        lineY + endPoint.y
      );
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
  };

  return (
    <div>
      <h1>ボートシミュレーションツール</h1>
      <button
        onClick={handleStartSimulation}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        シミュレーション開始
      </button>
      <button
        onClick={handleStopSimulation}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
      >
        シミュレーション停止
      </button>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          パターン選択
        </label>
        <select
          value={selectedPattern}
          onChange={handlePatternChange}
          className="border border-gray-300 p-1 text-sm"
        >
          {initialBoatWakePositionPattarns.map((pattern, index) => (
            <option key={index} value={index}>
              {pattern.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap">
        {startTimes.map((time, index) => (
          <div key={index} className="mr-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">
              ボート{index + 1}
            </label>
            <input
              type="number"
              step="0.01"
              value={time}
              onChange={(e) => handleStartTimeChange(index, e.target.value)}
              className="border border-gray-300 p-1 text-sm w-16"
            />
          </div>
        ))}
      </div>
      {FEATURE_FLAGS.enableBoatWakeInput && (
        <div className="flex flex-wrap mb-4">
          {controlPoints.map((cp, index) => (
            <ControlPointForm
              key={index}
              index={index}
              controlPoint={cp}
              endPoint={endPoints[index]}
              show={showBoatWakes[index]}
              onControlPointChange={handleControlPointChange}
              onEndPointChange={handleEndPointChange}
              onToggleShow={handleToggleBoatWake}
            />
          ))}
        </div>
      )}
      {FEATURE_FLAGS.showJsonOutput && (
        <textarea
          value={jsonOutput}
          readOnly
          className="w-full h-64 border border-gray-300 p-2 text-sm"
        />
      )}
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border border-gray-300 mb-4"
      ></canvas>
    </div>
  );
};
