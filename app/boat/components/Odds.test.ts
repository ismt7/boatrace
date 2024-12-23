import { generateCombinations } from "./generateCombinations";

describe("generateCombinations", () => {
  test("1-2-3", () => {
    expect(generateCombinations("1-2-3")).toEqual(["1-2-3"]);
  });
});
