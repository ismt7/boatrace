import React from "react";

const PatternButtons = ({
  groupedPatterns,
  handlePatternButtonClick,
  getButtonClass,
}: {
  groupedPatterns: {
    [key: string]: { label: string; value: string; category: string }[];
  };
  handlePatternButtonClick: (pattern: string) => void;
  getButtonClass: (pattern: string) => string;
}) => {
  return (
    <div className="button-group mt-2">
      {Object.keys(groupedPatterns).map((category) => (
        <div key={category}>
          <h3 className="font-bold">{category}</h3>
          {groupedPatterns[category].map((pattern) => (
            <button
              key={pattern.value}
              onClick={() => handlePatternButtonClick(pattern.value)}
              className={`font-bold px-2 rounded m-1 ${getButtonClass(pattern.value)}`}
            >
              {pattern.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PatternButtons;
