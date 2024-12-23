export function adjustBetDistribution(
  oddsList: { [key: string]: number },
  initialBetDistribution: { [key: string]: number },
  minRecoveryRate: number
) {
  // initialBetDistributionをコピーして新しい分布を作成
  const adjustedBetDistribution = { ...initialBetDistribution };

  // 賭け数の初期値を1に設定
  for (const key in oddsList) {
    adjustedBetDistribution[key] = 1;
  }

  let totalInvestment =
    Object.values(adjustedBetDistribution).reduce((sum, bet) => sum + bet, 0) *
    100;

  while (totalInvestment < 3000) {
    let addedBet = false;
    for (const key in adjustedBetDistribution) {
      if (adjustedBetDistribution.hasOwnProperty(key)) {
        const payout = oddsList[key] * adjustedBetDistribution[key];
        const returnRate = (payout / totalInvestment) * 100;

        if (returnRate < minRecoveryRate) {
          adjustedBetDistribution[key] += 1;
          totalInvestment += 100;
          addedBet = true;
          if (totalInvestment >= 3000) break;
        }
      }
    }
    if (!addedBet) break;
  }

  return adjustedBetDistribution;
}
