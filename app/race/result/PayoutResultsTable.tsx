import React from "react";
import { Payout } from "@/app/lib/prisma";

const PayoutResultsTable = ({ payoutResults }: { payoutResults: Payout[] }) => {
  const formatPayout = (amount: number) => {
    return amount >= 10000 ? (
      <span className="font-bold text-red-500">¥{amount.toLocaleString()}</span>
    ) : (
      `¥${amount.toLocaleString()}`
    );
  };

  return (
    <>
      <h2 className="text-2xl font-bold mt-8">払戻金</h2>
      <table className="w-full max-w-8xl bg-white table-fixed mx-auto mt-4">
        <thead>
          <tr>
            <th className="py-2 whitespace-nowrap text-center w-1/6">レース</th>
            <th className="py-2 whitespace-nowrap text-center w-1/3">3連単</th>
            <th className="py-2 whitespace-nowrap text-center w-1/3">2連単</th>
          </tr>
        </thead>
        <tbody>
          {payoutResults.length === 0 ? (
            <tr>
              <td colSpan={3} className="border px-4 py-2 text-center">
                表示するデータがありません
              </td>
            </tr>
          ) : (
            payoutResults.map((payout) => (
              <tr key={payout.id}>
                <td className="border px-4 py-2 text-center">
                  {payout.raceNumber}R
                </td>
                <td className="border px-4 py-2 text-right">
                  {payout.firstPlace} - {payout.secondPlace} -{" "}
                  {payout.thirdPlace} <br />
                  {formatPayout(payout.trifectaPayout)}
                </td>
                <td className="border px-4 py-2 text-right">
                  {payout.firstPlace} - {payout.secondPlace} <br />
                  {formatPayout(payout.exactaPayout)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default PayoutResultsTable;
