"use client";
export function calculateArbitrageRate(oddsList: { [key: string]: number }) {
  const totalInverseOdds = Object.values(oddsList).reduce(
    (acc, odd) => acc + 1 / odd,
    0
  );
  return totalInverseOdds;
}
