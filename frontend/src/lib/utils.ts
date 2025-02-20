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

export const getQuarter = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (month < 3) {
    const febLastDay = new Date(
      new Date(year, 2).toLocaleString("en", { timeZone: "Asia/Seoul" })
    );
    return {
      start: `${year}-12-01`,
      end: febLastDay.toISOString().slice(0, 10),
    };
  } else if (month < 6) return { start: `${year}-03-01`, end: `${year}-05-31` };
  else if (month < 9) return { start: `${year}-06-01`, end: `${year}-08-31` };
  else return { start: `${year}-09-01`, end: `${year}-11-31` };
};

export const getCurrentQuarter = () => {
  return getQuarter(new Date());
};

const seasonStart = "2025-03-01";

export const getSeasonPeriod = (season: number) => {
  if (season < 0) {
    throw new Error("Invalid season");
  }

  // Pre-season
  else if (season === 0) {
    return { start: "1970-01-01", end: "2025-03-31" };
  }

  const year = 2025 + Math.floor(season / 4);
  const month = (4 + (season % 4) * 3) % 12; //4 - 7 - 10 - 1
  return getQuarter(new Date(year, month, 1));
};

export const getSeason = (date: Date) => {
  const seasonStartDate = new Date(seasonStart);
  const seasonStartYear = seasonStartDate.getFullYear();
  const year = date.getFullYear();
  const month = date.getMonth();
  const season = (year - seasonStartYear) * 4 + Math.floor((month - 4) / 3);
  return Math.max(season, 0);
};

export const getCurrentSeason = () => {
  return getSeason(new Date());
};
