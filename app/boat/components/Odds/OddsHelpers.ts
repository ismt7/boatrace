import { fetchOdds } from "../../lib/fetchOdds";
import { DoubleOdds } from "@/app/api/boatrace/odds/route";
import { TrifectaOdds } from "./Odds";

export const raceCourses = [
  { id: 1, name: "桐生" },
  { id: 2, name: "戸田" },
  { id: 3, name: "江戸川" },
  { id: 4, name: "平和島" },
  { id: 5, name: "多摩川" },
  { id: 6, name: "浜名湖" },
  { id: 7, name: "蒲郡" },
  { id: 8, name: "常滑" },
  { id: 9, name: "津" },
  { id: 10, name: "三国" },
  { id: 11, name: "びわこ" },
  { id: 12, name: "住之江" },
  { id: 13, name: "尼崎" },
  { id: 14, name: "鳴門" },
  { id: 15, name: "丸亀" },
  { id: 16, name: "児島" },
  { id: 17, name: "宮島" },
  { id: 18, name: "徳山" },
  { id: 19, name: "下関" },
  { id: 20, name: "若松" },
  { id: 21, name: "芦屋" },
  { id: 22, name: "福岡" },
  { id: 23, name: "唐津" },
  { id: 24, name: "大村" },
];

export const handleBeforeUnload = () => {
  localStorage.removeItem("odds");
  localStorage.removeItem("oddsUpdatedTime");
  localStorage.removeItem("prediction");
};

export const fetchAndSetOdds = async (
  rno: number,
  jcd: number,
  hd: string,
  setOdds: React.Dispatch<React.SetStateAction<TrifectaOdds | null>>,
  setDoubleOdds: React.Dispatch<React.SetStateAction<DoubleOdds | null>>,
  setOddsUpdatedTime: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const res = await fetchOdds(rno, jcd, hd);
    setOdds(res.odds);
    setDoubleOdds(res.doubleOdds);
    setOddsUpdatedTime(res.oddsUpdatedTime);
    localStorage.setItem("odds", JSON.stringify(res.odds));
    localStorage.setItem("oddsUpdatedTime", res.oddsUpdatedTime);
    localStorage.setItem("doubleOdds", JSON.stringify(res.doubleOdds));
  } catch (err) {
    console.error(err);
    setOdds(null);
  } finally {
    setLoading(false);
  }
};

export const updateURL = (
  router: any,
  rno: number,
  jcd: number,
  hd: string
) => {
  const params = new URLSearchParams();
  params.set("rno", rno.toString());
  params.set("jcd", jcd.toString());
  params.set("hd", hd);
  router.push(`?${params.toString()}`);
};

export const generateIframeUrls = (
  selectedCourse: number,
  selectedRace: number,
  selectedDate: string
) => {
  const tenjiUrl = `https://live.boatcast.jp/boatcastsp/streamer/streamer.php?tenji=1&jo=${selectedCourse}&race=${selectedRace}&date=${selectedDate}&m=1`;
  const replayUrl = `https://live.boatcast.jp/boatcastsp/streamer/streamer.php?jo=${selectedCourse}&race=${selectedRace}&date=${selectedDate}&m=1`;
  return { tenjiUrl, replayUrl };
};

export const getRaceCourseNames = () => {
  return raceCourses.map((course) => course.name);
};
