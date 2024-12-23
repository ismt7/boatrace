import React from "react";
import Link from "next/link";
import "./MenuBar.css";

const MenuBar: React.FC<{
  onSettingsOpen: () => void;
  onPredictionsOpen: () => void;
}> = ({ onSettingsOpen, onPredictionsOpen }) => {
  return (
    <nav className="menu-bar">
      <ul>
        <li>
          <Link href="/">ホーム</Link>
        </li>
        <li>
          <button className="menu-button" onClick={onSettingsOpen}>
            設定
          </button>
        </li>
        <li>
          <button className="menu-button" onClick={onPredictionsOpen}>
            予想
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default MenuBar;
