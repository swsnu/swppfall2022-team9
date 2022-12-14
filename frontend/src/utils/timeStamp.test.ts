import { timeStampToString } from "./timeStamp";

describe("timeStamp", () => {
  it("tests different year", () => {
    const now = new Date("2022/01/01 12:12:12");
    let timeStamp = "2021/12/31 12:12:12";
    expect(timeStampToString(timeStamp, now)).toBe("어제");
    timeStamp = "2021/12/30 12:12:12";
    expect(timeStampToString(timeStamp, now)).toBe("12월 30일");
  });

  it("tests different month", () => {
    let now = new Date("2022/03/01 12:12:12");
    let timeStamp = "2022/2/28 12:12:12";
    expect(timeStampToString(timeStamp, now)).toBe("어제");
    now = new Date("2024/03/01 12:12:12");
    timeStamp = "2024/2/29 12:12:12";
    expect(timeStampToString(timeStamp, now)).toBe("어제");
    now = new Date("2022/04/01 12:12:12");
    timeStamp = "2022/3/31 12:12:12";
    expect(timeStampToString(timeStamp, now)).toBe("어제");
    now = new Date("2022/05/01 12:12:12");
    timeStamp = "2022/4/30 12:12:12";
    expect(timeStampToString(timeStamp, now)).toBe("어제");
    now = new Date("2022/05/01 12:12:12");
    timeStamp = "2022/4/29 12:12:12";
    expect(timeStampToString(timeStamp, now)).toBe("4월 29일");
  });

  it("tests different day", () => {
    let now = new Date("2022/12/25 12:12:12");
    let timeStamp = "2022/12/24 12:12:12";
    expect(timeStampToString(timeStamp, now)).toBe("어제");
    now = new Date("2022/12/25 12:12:12");
    timeStamp = "2022/12/23 12:12:12";
    expect(timeStampToString(timeStamp, now)).toBe("12월 23일");
  });

  it("tests different time", () => {
    const now = new Date("2022/12/25 12:12:12");
    let timeStamp = "2022/12/25 0:1:12";
    expect(timeStampToString(timeStamp, now)).toBe("오전 12:01");
    timeStamp = "2022/12/25 0:11:12";
    expect(timeStampToString(timeStamp, now)).toBe("오전 12:11");
    timeStamp = "2022/12/25 3:11:12";
    expect(timeStampToString(timeStamp, now)).toBe("오전 3:11");
    timeStamp = "2022/12/25 12:1:12";
    expect(timeStampToString(timeStamp, now)).toBe("오후 12:01");
    timeStamp = "2022/12/25 12:11:12";
    expect(timeStampToString(timeStamp, now)).toBe("오후 12:11");
    timeStamp = "2022/12/25 13:1:12";
    expect(timeStampToString(timeStamp, now)).toBe("오후 1:01");
    timeStamp = "2022/12/25 13:11:12";
    expect(timeStampToString(timeStamp, now)).toBe("오후 1:11");
  });
});
