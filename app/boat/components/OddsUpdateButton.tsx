import React from "react";

export function OddsUpdateButton({
  handleRefresh,
}: {
  handleRefresh: () => void;
}) {
  return (
    <button
      onClick={handleRefresh}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      更新
    </button>
  );
}
