"use client";
import dayjs from "dayjs";

export async function fetchOdds(rno: number, jcd: number, hd: string) {
  try {
    const formattedDate = dayjs(hd).format("YYYYMMDD");
    const response = await fetch(
      `/api/boatrace/odds?rno=${rno}&jcd=${jcd}&hd=${formattedDate}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch odds");
  }
}
