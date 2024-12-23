"use client";
export function calculateTotalOdds(oddsList: number[]) {
  if (oddsList.length === 0) return 0.0;
  const total = oddsList.reduce((acc, odd) => acc + 1 / odd, 0);
  return 1 / total;
}
