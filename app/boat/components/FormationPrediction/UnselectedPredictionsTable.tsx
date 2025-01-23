import React from "react";

const UnselectedPredictionsTable = ({
  predictions,
}: {
  predictions: string[];
}) => {
  const boatNumbers = [1, 2, 3, 4, 5, 6];
  return (
    <table>
      <tbody>
        {boatNumbers.slice(0, 5).map((row, index) => (
          <tr key={row}>
            {boatNumbers.map((firstBoat) => (
              <td key={firstBoat}>
                {(() => {
                  const list = boatNumbers
                    .filter((secondBoat) => secondBoat !== firstBoat)
                    .slice(index, row)
                    .map((secondBoat) => {
                      return boatNumbers
                        .filter(
                          (thirdBoat) =>
                            thirdBoat !== firstBoat && thirdBoat !== secondBoat
                        )
                        .map(
                          (thirdBoat) =>
                            `${firstBoat}-${secondBoat}-${thirdBoat}`
                        );
                    })
                    .flat();
                  return list.map((prediction) => {
                    const isPrediction = predictions.includes(prediction);
                    return (
                      <div
                        key={prediction}
                        style={
                          isPrediction
                            ? { color: "lightgray" }
                            : { fontWeight: "bold" }
                        }
                      >
                        {isPrediction ? <s>{prediction}</s> : prediction}
                      </div>
                    );
                  });
                })()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UnselectedPredictionsTable;
