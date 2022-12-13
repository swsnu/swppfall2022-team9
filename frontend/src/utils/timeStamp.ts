export const compareTimeStampWtihinDay = (
  timeStampA: string,
  timeStampB: string,
) => {
  const dateA = new Date(timeStampA);
  const dateB = new Date(timeStampB);
  const hourA = dateA.getHours();
  const hourB = dateB.getHours();
  const minuteA = dateA.getMinutes();
  const minuteB = dateB.getMinutes();

  return hourA === hourB && minuteA === minuteB;
};

const monthWith31Days = [1, 3, 5, 7, 8, 10, 12];
const monthWith30Days = [4, 6, 9, 11];

export const timeStampToString = (timestamp: string): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // January is 0
  const day = date.getDate();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // January is 0
  const currentDay = now.getDate();

  if (year !== currentYear) {
    if (
      currentYear - year === 1 &&
      month === 12 &&
      day === 31 &&
      currentMonth === 1 &&
      currentDay === 1
    )
      return "어제";
    else return `${month}월 ${day}일`;
  }
  if (month !== currentMonth) {
    if (
      currentMonth - month === 1 &&
      currentDay === 1 &&
      ((monthWith31Days.find(m => m === month) && day === 31) ||
        (monthWith30Days.find(m => m === month) && day === 30) ||
        (month === 2 && (day === 28 || day === 29)))
    )
      return "어제";
    else return `${month}월 ${day}일`;
  }
  if (currentDay - day === 1) return "어제";

  const hour = date.getHours();
  const minutes = date.getMinutes();
  const isAM = hour < 12;
  const prefix = isAM ? "오전" : "오후";
  const displayedHour = isAM ? (hour === 0 ? 12 : hour) : hour - 12;
  const displayedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${prefix} ${displayedHour}:${displayedMinutes}`;
};
