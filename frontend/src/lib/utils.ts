export const formatDate = (date: string) => {
  const now = new Date();
  // ms unit
  const gap: number = now.getTime() - new Date(date).getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (gap < minute) return "방금";
  else if (gap < hour) return `${Math.trunc(gap / minute)}분 전`;
  else if (gap < day) return `${Math.trunc(gap / hour)}시간 전`;
  else if (gap < month) return `${Math.trunc(gap / day)}일 전`;
  else if (gap < year) return `${Math.trunc(gap / month)}달 전`;
  else return `${Math.trunc(gap / year)}년 전`;
};

export const getCurrentQuarter = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (month < 3) return { start: `${year}-01-01`, end: `${year}-03-31` };
  else if (month < 6) return { start: `${year}-04-01`, end: `${year}-06-30` };
  else if (month < 9) return { start: `${year}-07-01`, end: `${year}-09-30` };
  else return { start: `${year}-10-01`, end: `${year}-12-31` };
};
