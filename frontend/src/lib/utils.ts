import { MahjongSeasonDto } from "@/types/mahjong";

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

export const getRunningSeasons = (seasons: MahjongSeasonDto[]) => {
  const now = new Date();
  return seasons.filter(
    (season) =>
      new Date(season.startDate) < now &&
      (season.endDate === null || now < new Date(season.endDate))
  );
};
