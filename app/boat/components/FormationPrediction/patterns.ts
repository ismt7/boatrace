export enum OddspredictionGroup {
  Combination = "コンビネーション",
  FormationA = "x+1",
  First = "1-",
  FistSecond = "1-2-",
  FirstThird = "1-3-",
  FirstFourth = "1-4-",
  FirstFifth = "1-5-",
  FirstSixth = "1-6-",
  Second = "2-",
  Third = "3-",
  Fourth = "4-",
  Fifth = "5-",
  Sixth = "6-",
}

export const predefinedPatterns = [
  {
    label: "12-123-123456(x+1)",
    value: "12-123-123456",
    category: OddspredictionGroup.FormationA,
  },
  {
    label: "13-134-123456(x+1)",
    value: "13-134-123456",
    category: OddspredictionGroup.FormationA,
  },
  {
    label: "14-145-123456(x+1)",
    value: "14-145-123456",
    category: OddspredictionGroup.FormationA,
  },
  {
    label: "23-234-123456(x+1)",
    value: "23-234-123456",
    category: OddspredictionGroup.FormationA,
  },
  {
    label: "1-234-234",
    value: "1-234-234",
    category: OddspredictionGroup.Combination,
  },
  {
    label: "1-345-345",
    value: "1-345-345",
    category: OddspredictionGroup.Combination,
  },
  {
    label: "1-456-456",
    value: "1-456-456",
    category: OddspredictionGroup.Combination,
  },
  {
    label: "1-3=245(住之江)",
    value: "1-3=245",
    category: OddspredictionGroup.Combination,
  },
  {
    label: "1-2-全",
    value: "1-2-3456",
    category: OddspredictionGroup.FistSecond,
  },
  {
    label: "1-全-2",
    value: "1-3456-2",
    category: OddspredictionGroup.FistSecond,
  },
  {
    label: "1-3-全",
    value: "1-3-2456",
    category: OddspredictionGroup.FirstThird,
  },
  {
    label: "1-全-3",
    value: "1-2456-3",
    category: OddspredictionGroup.FirstThird,
  },
  {
    label: "1-4-全",
    value: "1-4-2356",
    category: OddspredictionGroup.FirstFourth,
  },
  {
    label: "1-全-4",
    value: "1-2356-4",
    category: OddspredictionGroup.FirstFourth,
  },
  {
    label: "1-5-全",
    value: "1-5-2346",
    category: OddspredictionGroup.FirstFifth,
  },
  {
    label: "1-全-5",
    value: "1-2346-5",
    category: OddspredictionGroup.FirstFifth,
  },
  {
    label: "1-6-全",
    value: "1-6-2345",
    category: OddspredictionGroup.FirstSixth,
  },
  {
    label: "1-全-6",
    value: "1-2345-6",
    category: OddspredictionGroup.FirstSixth,
  },
  {
    label: "2-1-全",
    value: "2-1-3456",
    category: OddspredictionGroup.Second,
  },
  {
    label: "2-3-全",
    value: "2-3-1456",
    category: OddspredictionGroup.Second,
  },
  { label: "3-1-全", value: "3-1-2456", category: OddspredictionGroup.Third },
  { label: "3-4-全", value: "3-4-1256", category: OddspredictionGroup.Third },
  { label: "4-1-全", value: "4-1-2356", category: OddspredictionGroup.Fourth },
  { label: "4-5-全", value: "4-5-1236", category: OddspredictionGroup.Fourth },
  { label: "5-1-全", value: "5-1-2346", category: OddspredictionGroup.Fifth },
  {
    label: "6-1-全",
    value: "6-1-12345",
    category: OddspredictionGroup.Sixth,
  },
];
