"use client";
export function generateCombinations(line: string): string[] {
  const pattern = /^[1-6]{1,6}-[1-6]{1,6}-[1-6]{1,6}$/;
  if (pattern.test(line)) {
    const [first, second, third] = line.split("-");
    const firstNumbers = first.split("").map(Number);
    const secondNumbers = second.split("").map(Number);
    const thirdNumbers = third.split("").map(Number);

    const combinations = firstNumbers
      .flatMap((firstNumber) =>
        secondNumbers
          .filter((secondNumber) => secondNumber !== firstNumber)
          .flatMap((secondNumber) =>
            thirdNumbers
              .filter(
                (thirdNumber) =>
                  thirdNumber !== firstNumber && thirdNumber !== secondNumber
              )
              .map(
                (thirdNumber) => `${firstNumber}-${secondNumber}-${thirdNumber}`
              )
          )
      )
      .sort()
      .filter((value, index, self) => self.indexOf(value) === index);

    return combinations;
  }

  {
    const patterns = [
      /^([1-6]{2,4})(=|-)([1-6])(-|=)([1-6])$/,
      /^([1-6])(=|-)([1-6]{2,4})(-|=)([1-6])$/,
      /^([1-6])(=|-)([1-6])(-|=)([1-6]{2,4})$/,
      /^([1-6]{2,4})(=|-)([1-6]{2,4})(-|=)([1-6])$/,
      /^([1-6]{2,4})(=|-)([1-6])(-|=)([1-6]{2,4})$/,
      /^([1-6])(=|-)([1-6]{2,6})(-|=)([1-6]{2,6})$/,
      /^([1-6]{2,4})(=|-)([1-6]{2,4})(-|=)([1-6]{2,4})$/,
    ];

    const pattern = patterns.find((pattern) => pattern.test(line));
    if (pattern) {
      const match = line.match(pattern);
      if (!match) {
        return [];
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, first, split1, second, split2, third] = match;
      if (split1 === "=") {
        const firstNumbers = first.split("").map(Number) as number[];
        const secondNumbers = second.split("").map(Number) as number[];
        const thirdNumbers = third.split("").map(Number) as number[];

        const combinations = firstNumbers.flatMap((firstNumber) =>
          secondNumbers
            .filter((secondNumber) => secondNumber !== firstNumber)
            .flatMap((secondNumber) =>
              thirdNumbers
                .filter(
                  (thirdNumber) =>
                    thirdNumber !== firstNumber && thirdNumber !== secondNumber
                )
                .map(
                  (thirdNumber) =>
                    `${firstNumber}-${secondNumber}-${thirdNumber}`
                )
            )
        );

        combinations.push(
          ...secondNumbers.flatMap((secondNumber) =>
            firstNumbers
              .filter((firstNumber) => firstNumber !== secondNumber)
              .flatMap((firstNumber) =>
                thirdNumbers
                  .filter(
                    (thirdNumber) =>
                      thirdNumber !== firstNumber &&
                      thirdNumber !== secondNumber
                  )
                  .map(
                    (thirdNumber) =>
                      `${secondNumber}-${firstNumber}-${thirdNumber}`
                  )
              )
          )
        );

        return combinations;
      }

      if (split2 === "=") {
        const firstNumbers = first.split("").map(Number);
        const secondNumbers = second.split("").map(Number);
        const thirdNumbers = third.split("").map(Number);

        const combinations = firstNumbers.flatMap((firstNumber) =>
          secondNumbers
            .filter((secondNumber) => secondNumber !== firstNumber)
            .flatMap((secondNumber) =>
              thirdNumbers
                .filter(
                  (thirdNumber) =>
                    thirdNumber !== firstNumber && thirdNumber !== secondNumber
                )
                .map(
                  (thirdNumber) =>
                    `${firstNumber}-${secondNumber}-${thirdNumber}`
                )
            )
        );

        combinations.push(
          ...firstNumbers.flatMap((firstNumber) =>
            thirdNumbers
              .filter((thirdNumber) => thirdNumber !== firstNumber)
              .flatMap((thirdNumber) =>
                secondNumbers
                  .filter(
                    (secondNumber) =>
                      secondNumber !== firstNumber &&
                      secondNumber !== thirdNumber
                  )
                  .map(
                    (secondNumber) =>
                      `${firstNumber}-${thirdNumber}-${secondNumber}`
                  )
              )
          )
        );

        return combinations;
      }
    }
  }

  {
    const match = line.match(/^([1-6]{2,6})Box$/);
    if (match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, numberStr] = match;

      const numbers = numberStr.split("").map(Number);

      const result: string[] = [];

      function permute(arr: number[], current: number[]): void {
        if (current.length === 3) {
          result.push(current.join("-"));
          return;
        }

        for (let i = 0; i < arr.length; i++) {
          const next = arr.slice(); // 配列をコピー
          const num = next.splice(i, 1)[0]; // i番目の要素を取り出す
          permute(next, [...current, num]); // 再帰的に次の要素を構築
        }
      }

      permute(numbers, []);
      return result;
    }
  }

  const match = line.match(/^([1-6])(-|=)([1-6])(-|=)([1-6])$/);
  if (match) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, first, split1, second, split2, third] = match;

    if (first === second || second === third || third === first) {
      return [];
    }

    if (split1 === "=") {
      return [`${first}-${second}-${third}`, `${second}-${first}-${third}`];
    }

    if (split2 === "=") {
      return [`${first}-${second}-${third}`, `${first}-${third}-${second}`];
    }
  }

  return [];
}
