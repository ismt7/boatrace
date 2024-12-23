import React, { useState, useEffect } from "react";

const FixedYouTube = ({ videoUrl }: { videoUrl: string }) => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 600,
    height: 400,
  });

  const [isMobile, setIsMobile] = useState(false);

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
    if (typeof window !== "undefined") {
      const savedSize = localStorage.getItem("youtubeSize");
      if (savedSize) {
        setSize(JSON.parse(savedSize));
      }
    }
  }, []);

  const [isResizing, setIsResizing] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const aspectRatio = 600 / 400;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && lastMousePosition) {
      const deltaX = lastMousePosition.x - e.clientX;
      const newWidth = Math.max(300, size.width + deltaX);
      const newHeight = newWidth / aspectRatio;
      setSize({ width: newWidth, height: newHeight });
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setLastMousePosition(null);
    if (typeof window !== "undefined") {
      localStorage.setItem("youtubeSize", JSON.stringify(size));
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizing, lastMousePosition, size]);

  const extractVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v");
    } catch (e) {
      console.error("Invalid URL:", url);
      return null;
    }
  };

  const videoId = extractVideoId(videoUrl);

  if (isMobile) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        backgroundColor: "white",
        padding: "10px",
        border: "1px solid black",
        resize: "both",
        overflow: "hidden",
        width: size.width,
        height: size.height,
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "10px",
          height: "10px",
          backgroundColor: "gray",
          cursor: "nwse-resize",
        }}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default FixedYouTube;
