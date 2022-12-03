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

export const timeStampToString = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const isAM = hour < 12;
  const prefix = isAM ? "오전" : "오후";
  const displayedHour = isAM ? (hour === 0 ? 12 : hour) : hour - 12;
  const displayedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${prefix} ${displayedHour}:${displayedMinutes}`;
};
