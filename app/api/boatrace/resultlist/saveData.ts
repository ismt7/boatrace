import { PrismaClient } from "../../../lib/prisma";
import { ResultList, Payout } from "./route";

const prisma = new PrismaClient();

export async function saveResultListData(
  jcd: number,
  hd: string,
  resultList: ResultList[]
): Promise<void> {
  for (const result of resultList) {
    const { raceNumber, raceType, winType } = result;

    await prisma.raceResult.upsert({
      where: {
        jcd_raceDate_raceNumber: {
          jcd,
          raceDate: hd,
          raceNumber,
        },
      },
      update: {
        jcd,
        raceDate: hd,
        raceNumber: raceNumber,
        raceType: raceType,
        winType: winType,
        firstPlace: result.boats[0].boatNumber,
        secondPlace: result.boats[1].boatNumber,
        thirdPlace: result.boats[2].boatNumber,
        fourthPlace: result.boats[3].boatNumber,
        fifthPlace: result.boats[4].boatNumber,
        sixthPlace: result.boats[5].boatNumber,
        firstRacer: result.boats[0].racerName,
        secondRacer: result.boats[1].racerName,
        thirdRacer: result.boats[2].racerName,
        fourthRacer: result.boats[3].racerName,
        fifthRacer: result.boats[4].racerName,
        sixthRacer: result.boats[5].racerName,
      },
      create: {
        jcd,
        raceDate: hd,
        raceNumber,
        raceType,
        winType,
        firstPlace: result.boats[0].boatNumber,
        secondPlace: result.boats[1].boatNumber,
        thirdPlace: result.boats[2].boatNumber,
        fourthPlace: result.boats[3].boatNumber,
        fifthPlace: result.boats[4].boatNumber,
        sixthPlace: result.boats[5].boatNumber,
        firstRacer: result.boats[0].racerName,
        secondRacer: result.boats[1].racerName,
        thirdRacer: result.boats[2].racerName,
        fourthRacer: result.boats[3].racerName,
        fifthRacer: result.boats[4].racerName,
        sixthRacer: result.boats[5].racerName,
      },
    });
  }
}

export async function saveCourseResultData(
  jcd: number,
  hd: string,
  courseResults: number[][]
): Promise<void> {
  for (const [index, courseResult] of courseResults.entries()) {
    await prisma.courseResult.upsert({
      where: {
        jcd_raceDate_orderOfFinish: {
          jcd,
          raceDate: hd,
          orderOfFinish: index + 1,
        },
      },
      update: {
        firstCourse: courseResult[0],
        secondCourse: courseResult[1],
        thirdCourse: courseResult[2],
        fourthCourse: courseResult[3],
        fifthCourse: courseResult[4],
        sixthCourse: courseResult[5],
      },
      create: {
        jcd,
        raceDate: hd,
        orderOfFinish: index + 1,
        firstCourse: courseResult[0],
        secondCourse: courseResult[1],
        thirdCourse: courseResult[2],
        fourthCourse: courseResult[3],
        fifthCourse: courseResult[4],
        sixthCourse: courseResult[5],
      },
    });
  }
}

export async function saveBoatResultData(
  jcd: number,
  hd: string,
  boatResults: number[][]
): Promise<void> {
  for (const [index, boatResult] of boatResults.entries()) {
    await prisma.boatResult.upsert({
      where: {
        jcd_raceDate_orderOfFinish: {
          jcd,
          raceDate: hd,
          orderOfFinish: index + 1,
        },
      },
      update: {
        firstBoat: boatResult[0],
        secondBoat: boatResult[1],
        thirdBoat: boatResult[2],
        fourthBoat: boatResult[3],
        fifthBoat: boatResult[4],
        sixthBoat: boatResult[5],
      },
      create: {
        jcd,
        raceDate: hd,
        orderOfFinish: index + 1,
        firstBoat: boatResult[0],
        secondBoat: boatResult[1],
        thirdBoat: boatResult[2],
        fourthBoat: boatResult[3],
        fifthBoat: boatResult[4],
        sixthBoat: boatResult[5],
      },
    });
  }
}

export async function savePayoutData(
  jcd: number,
  hd: string,
  resultList: ResultList[],
  payouts: Payout[]
): Promise<void> {
  for (const [index, payout] of payouts.entries()) {
    const result = resultList[index];
    if (!result) {
      continue;
    }
    const { raceNumber, boats } = result;

    await prisma.payout.upsert({
      where: {
        jcd_raceDate_raceNumber: {
          jcd,
          raceDate: hd,
          raceNumber,
        },
      },
      update: {
        firstPlace: boats[0].boatNumber,
        secondPlace: boats[1].boatNumber,
        thirdPlace: boats[2].boatNumber,
        trifectaPayout: payout.trifecta,
        exactaPayout: payout.exacta,
      },
      create: {
        jcd,
        raceDate: hd,
        raceNumber,
        firstPlace: boats[0].boatNumber,
        secondPlace: boats[1].boatNumber,
        thirdPlace: boats[2].boatNumber,
        trifectaPayout: payout.trifecta,
        exactaPayout: payout.exacta,
      },
    });
  }
}
