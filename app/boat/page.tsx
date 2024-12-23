"use client";

import React, { Suspense, useState, useEffect } from "react";
import "./styles.css";
import Odds, { TrifectaOdds } from "./components/Odds/Odds";
import MenuBar from "./components/MenuBar";
import SettingsDialog from "./components/SettingsDialog";
import PredictionsDialog from "./components/PredictionsDialog/PredictionsDialog"; // 予想ダイアログをインポート

const Page: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPredictionsOpen, setIsPredictionsOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [odds, setOdds] = useState<TrifectaOdds | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedYoutubeUrl = localStorage.getItem("youtubeUrl");
      setYoutubeUrl(
        storedYoutubeUrl || "https://www.youtube.com/watch?v=KjxXJFk1R1U"
      );
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
          <Odds youtubeUrl={youtubeUrl} setOdds={setOdds} odds={odds} />
        </Suspense>
      </div>
      {isSettingsOpen && (
        <SettingsDialog
          youtubeUrl={youtubeUrl}
          onClose={handleSettingsClose}
          onYoutubeUrlChange={handleYoutubeUrlChange}
        />
      )}
      {isPredictionsOpen && (
        <PredictionsDialog odds={odds} onClose={handlePredictionsClose} />
      )}
    </>
  );
};

export default Page;
