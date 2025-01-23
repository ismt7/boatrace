import React, { useEffect, useRef, useState } from "react";

type Mode = "select" | "draw" | "erase";

interface BoatPosition {
  x: number;
  y: number;
}

const initialBoatPositions: BoatPosition[] = [
  { x: 40, y: 20 },
  { x: 80, y: 20 },
  { x: 120, y: 20 },
  { x: 160, y: 20 },
  { x: 200, y: 20 },
  { x: 240, y: 20 },
];

const initialBoatRotations = [0, 0, 0, 0, 0, 0];

const saveToLocalStorage = (
  positions: { x: number; y: number }[],
  rotations: number[],
  drawPaths: { x: number; y: number }[][]
) => {
  localStorage.setItem("boatPositions", JSON.stringify(positions));
  localStorage.setItem("boatRotations", JSON.stringify(rotations));
  localStorage.setItem("drawPaths", JSON.stringify(drawPaths));
};

const loadFromLocalStorage = () => {
  const positions = localStorage.getItem("boatPositions");
  const rotations = localStorage.getItem("boatRotations");
  const drawPaths = localStorage.getItem("drawPaths");
  return {
    positions: positions ? JSON.parse(positions) : initialBoatPositions,
    rotations: rotations ? JSON.parse(rotations) : initialBoatRotations,
    drawPaths: drawPaths ? JSON.parse(drawPaths) : [],
  };
};

export const BoatCanvas: React.FC = () => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [draggedBoatIndex, setDraggedBoatIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("select");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [erasing, setErasing] = useState<boolean>(false);
  const [drawPaths, setDrawPaths] = useState<{ x: number; y: number }[][]>([]);
  const [boatPositions, setBoatPositions] =
    useState<BoatPosition[]>(initialBoatPositions);
  const [boatRotations, setBoatRotations] = useState<number[]>(
    Array.from({ length: 6 }, () => 0)
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const { positions, rotations, drawPaths } = loadFromLocalStorage();
    setBoatPositions(positions || initialBoatPositions);
    setBoatRotations(rotations || initialBoatRotations);
    setDrawPaths(drawPaths || []);
  }, [setBoatPositions, setBoatRotations]);

  useEffect(() => {
    saveToLocalStorage(boatPositions, boatRotations, drawPaths);
  }, [boatPositions, boatRotations, drawPaths]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // キャンバスの初期化
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 中心線の描画
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5; // 中心線を太くする
        ctx.beginPath();
        ctx.moveTo(canvas.width / 4, canvas.height / 1.5);
        ctx.lineTo((canvas.width * 3) / 4, canvas.height / 1.5);
        ctx.stroke();
        ctx.lineWidth = 1; // ボートの図形の線を元に戻す

        // ターンマークの描画
        const turnMarkSize = 10; // ターンマークのサイズを小さくする
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(
          canvas.width / 4,
          canvas.height / 1.5,
          turnMarkSize,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          (canvas.width * 3) / 4,
          canvas.height / 1.5,
          turnMarkSize,
          0,
          2 * Math.PI
        );
        ctx.fill();

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

        // Draw freehand paths
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        drawPaths.forEach((path) => {
          ctx.beginPath();
          path.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        });

        // Draw eraser guide
        if (mode === "erase" && mousePosition) {
          ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(mousePosition.x, mousePosition.y, 10, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }
  }, [boatPositions, boatRotations, drawPaths, mode, mousePosition]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        const boatIndex = (() => {
          switch (event.code) {
            case "Digit1":
              return 0;
            case "Digit2":
              return 1;
            case "Digit3":
              return 2;
            case "Digit4":
              return 3;
            case "Digit5":
              return 4;
            case "Digit6":
              return 5;
            default:
              return -1;
          }
        })();
        if (boatIndex >= 0 && boatIndex < boatPositions.length) {
          if (mousePosition) {
            setBoatPositions((prevPositions) =>
              prevPositions.map((pos, index) =>
                index === boatIndex
                  ? { x: mousePosition.x, y: mousePosition.y }
                  : pos
              )
            );
          }
          setDragging(true);
          setDraggedBoatIndex(boatIndex);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [boatPositions.length, mousePosition]);

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

  const handleCanvasMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (mode === "select") {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        boatPositions.forEach((pos, index) => {
          const width = 20;
          const height = 30; // 縦長にするために高さを増やす
          const angle = (boatRotations[index] * Math.PI) / 180;
          const rotatedX =
            Math.cos(angle) * (x - pos.x) +
            Math.sin(angle) * (y - pos.y) +
            pos.x;
          const rotatedY =
            -Math.sin(angle) * (x - pos.x) +
            Math.cos(angle) * (y - pos.y) +
            pos.y;
          if (
            rotatedX >= pos.x - width / 2 &&
            rotatedX <= pos.x + width / 2 &&
            rotatedY >= pos.y &&
            rotatedY <= pos.y + height
          ) {
            setDragging(true);
            setDraggedBoatIndex(index);
          }
        });
      }
    } else if (mode === "draw") {
      setDrawing(true);
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setDrawPaths((prevPaths) => [...prevPaths, [{ x, y }]]);
      }
    } else if (mode === "erase") {
      setErasing(true);
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setDrawPaths((prevPaths) =>
          prevPaths.flatMap((path) => {
            const newPath = [];
            let segment = [];
            for (let i = 0; i < path.length; i++) {
              const point = path[i];
              if (Math.hypot(point.x - x, point.y - y) > 10) {
                segment.push(point);
              } else {
                if (segment.length > 0) {
                  newPath.push(segment);
                  segment = [];
                }
              }
            }
            if (segment.length > 0) {
              newPath.push(segment);
            }
            return newPath;
          })
        );
      }
    }
  };

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setMousePosition({ x, y });
    }

    if (mode === "select" && dragging && draggedBoatIndex !== null) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (event.altKey) {
          // optionキーに対応
          const deltaX = event.movementX;
          setBoatRotations((prevRotations) =>
            prevRotations.map((rotation, index) =>
              index === draggedBoatIndex ? rotation + deltaX : rotation
            )
          );
        } else {
          setBoatPositions((prevPositions) =>
            prevPositions.map((pos, index) =>
              index === draggedBoatIndex ? { x, y } : pos
            )
          );
        }
      }
    } else if (mode === "draw" && drawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setDrawPaths((prevPaths) => {
          const newPaths = [...prevPaths];
          newPaths[newPaths.length - 1].push({ x, y });
          return newPaths;
        });
      }
    } else if (mode === "erase" && erasing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setDrawPaths((prevPaths) =>
          prevPaths.flatMap((path) => {
            const newPath = [];
            let segment = [];
            for (let i = 0; i < path.length; i++) {
              const point = path[i];
              if (Math.hypot(point.x - x, point.y - y) > 10) {
                segment.push(point);
              } else {
                if (segment.length > 0) {
                  newPath.push(segment);
                  segment = [];
                }
              }
            }
            if (segment.length > 0) {
              newPath.push(segment);
            }
            return newPath;
          })
        );
      }
    }
  };

  const handleCanvasMouseUp = () => {
    if (mode === "select") {
      setDragging(false);
      setDraggedBoatIndex(null);
    } else if (mode === "draw") {
      setDrawing(false);
    } else if (mode === "erase") {
      setErasing(false);
    }
  };

  const handleReset = () => {
    setBoatPositions(initialBoatPositions);
    setBoatRotations(initialBoatRotations);
    localStorage.removeItem("boatPositions");
    localStorage.removeItem("boatRotations");
    localStorage.removeItem("drawPaths");
    setDrawPaths([]);
  };

  const toggleMode = (newMode: Mode) => {
    setMode(newMode);
  };

  if (isMobile) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleReset}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        リセット
      </button>
      <button
        onClick={() => toggleMode("select")}
        className={`${
          mode === "select" ? "bg-green-500" : "bg-gray-500"
        } hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2`}
      >
        選択モード
      </button>
      <button
        onClick={() => toggleMode("draw")}
        className={`${
          mode === "draw" ? "bg-green-500" : "bg-gray-500"
        } hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2`}
      >
        ペンモード
      </button>
      <button
        onClick={() => toggleMode("erase")}
        className={`${
          mode === "erase" ? "bg-green-500" : "bg-gray-500"
        } hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2`}
      >
        消しゴムモード
      </button>
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="border border-gray-300 mb-4"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      ></canvas>
    </>
  );
};
