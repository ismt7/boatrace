"use client";
export function calculateTotalInvestment(betDistribution: {
  [key: string]: number;
}) {
  return Object.values(betDistribution).reduce(
    (acc, bet) => acc + bet * 100,
    0
  );
}
