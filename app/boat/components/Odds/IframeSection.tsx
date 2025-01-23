import React from "react";

export function IframeSection({
  tenjiSrc,
  replaySrc,
  handleIframeRefresh,
}: {
  tenjiSrc: string;
  replaySrc: string;
  handleIframeRefresh: () => void;
}) {
  return (
    <>
      <button
        onClick={handleIframeRefresh}
        className="refresh-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        リフレッシュ
      </button>
      <h2 className="text-lg font-bold mb-2">展示走行</h2>
      <iframe src={tenjiSrc} width="100%" height="450"></iframe>
      <h2 className="text-lg font-bold mb-2">リプレイ</h2>
      <iframe src={replaySrc} width="100%" height="450"></iframe>
    </>
  );
}
