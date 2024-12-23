import React, { useState } from "react";
import "./SettingsDialog.css";

const SettingsDialog: React.FC<{
  youtubeUrl: string;
  onClose: () => void;
  onYoutubeUrlChange: (url: string) => void;
}> = ({ youtubeUrl, onClose, onYoutubeUrlChange }) => {
  const [url, setUrl] = useState(youtubeUrl);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleSave = () => {
    onYoutubeUrlChange(url);
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
