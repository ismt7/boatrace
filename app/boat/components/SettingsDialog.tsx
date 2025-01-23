import React, { useState } from "react";
import "./SettingsDialog.css";

const SettingsDialog: React.FC<{
  youtubeUrl: string;
  autoPlay: boolean;
  onClose: () => void;
  onYoutubeUrlChange: (url: string) => void;
  onAutoPlayChange: (autoPlay: boolean) => void;
}> = ({
  youtubeUrl,
  autoPlay,
  onClose,
  onYoutubeUrlChange,
  onAutoPlayChange,
}) => {
  const [url, setUrl] = useState(youtubeUrl);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleAutoPlayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAutoPlayChange(event.target.checked);
  };

  const handleSave = () => {
    onYoutubeUrlChange(url);
    onAutoPlayChange(autoPlay);
    onClose();
  };

  return (
    <div className="settings-dialog-overlay">
      <div className="settings-dialog">
        <div className="settings-dialog-content">
          <h2>Settings</h2>
          <label htmlFor="youtube-url">YouTube URL:</label>
          <input
            type="text"
            id="youtube-url"
            className="youtube-url-input"
            value={url}
            onChange={handleUrlChange}
          />
          <label htmlFor="auto-play">Auto Play:</label>
          <input
            type="checkbox"
            id="auto-play"
            checked={autoPlay}
            onChange={handleAutoPlayChange}
          />
          <div className="settings-dialog-buttons">
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
