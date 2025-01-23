"use client";

import React, { Suspense, useState, useEffect } from "react";
import "./styles.css";
import Odds, { TrifectaOdds } from "./components/Odds/Odds";
import { DoubleOdds } from "../api/boatrace/odds/route";
import MenuBar from "./components/MenuBar";
import SettingsDialog from "./components/SettingsDialog";
import PredictionsDialog from "./components/PredictionsDialog/PredictionsDialog"; // 予想ダイアログをインポート

const Page: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPredictionsOpen, setIsPredictionsOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [odds, setOdds] = useState<TrifectaOdds | null>(null);
  const [doubleOdds, setDoubleOdds] = useState<DoubleOdds | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedYoutubeUrl = localStorage.getItem("youtubeUrl");
      setYoutubeUrl(
        storedYoutubeUrl || "https://www.youtube.com/watch?v=KjxXJFk1R1U"
      );
      setAutoPlay(localStorage.getItem("autoPlay") === "true");
    }
  }, []);

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  const handlePredictionsOpen = () => {
    setIsPredictionsOpen(true);
  };

  const handlePredictionsClose = () => {
    setIsPredictionsOpen(false);
  };

  const handleYoutubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    if (typeof window !== "undefined") {
      localStorage.setItem("youtubeUrl", url);
    }
  };

  const handleAutoPlayChange = (autoPlay: boolean) => {
    setAutoPlay(autoPlay);
    if (typeof window !== "undefined") {
      localStorage.setItem("autoPlay", autoPlay ? "true" : "false");
    }
  };

  return (
    <>
      <div className="fixed-menu-bar">
        <MenuBar
          onSettingsOpen={handleSettingsOpen}
          onPredictionsOpen={handlePredictionsOpen}
        />
      </div>
      <div className="content" style={{ margin: "20px" }}>
        <Suspense>
          <Odds
            youtubeUrl={youtubeUrl}
            setOdds={setOdds}
            odds={odds}
            doubleOdds={doubleOdds}
            setDoubleOdds={setDoubleOdds}
            autoPlay={autoPlay}
          />
        </Suspense>
      </div>
      {isSettingsOpen && (
        <SettingsDialog
          youtubeUrl={youtubeUrl}
          autoPlay={autoPlay}
          onClose={handleSettingsClose}
          onYoutubeUrlChange={handleYoutubeUrlChange}
          onAutoPlayChange={handleAutoPlayChange}
        />
      )}
      {isPredictionsOpen && (
        <PredictionsDialog odds={odds} onClose={handlePredictionsClose} />
      )}
    </>
  );
};

export default Page;
