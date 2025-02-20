export const combination = (arr: Array<any>, r: number) => {
  if (arr.length < r) return [];
  if (r === 1) return arr.map((v) => [v]);

  const res = [];
  arr.forEach((v, idx, arr) => {
    const rest = arr.slice(idx + 1);
    const combinations = combination(rest, r - 1);
    const attach = combinations.map((c) => [v, ...c]);
    res.push(...attach);
  });
  return res;
};

/**
 * n번째 알파벳 (0부터 시작)
 */
export const nthAlphabet = (n: number) => {
  n += 1;
  const l: number[] = [];
  const a = 'A'.charCodeAt(0);
  while (n) {
    const q = n % 26;
    n = Math.floor(n / 26);
    if (q) l.push(a + q - 1);
  }
  return String.fromCharCode(...l.reverse());
};

export const getQuarter = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (month < 3) {
    const febLastDay = new Date(
      new Date(year, 2).toLocaleString('en', { timeZone: 'Asia/Seoul' }),
    );
    return {
      start: `${year - 1}-12-01`,
      end: febLastDay.toISOString().slice(0, 10),
    };
  } else if (month < 6) return { start: `${year}-03-01`, end: `${year}-05-31` };
  else if (month < 9) return { start: `${year}-06-01`, end: `${year}-08-31` };
  else return { start: `${year}-09-01`, end: `${year}-11-31` };
};

export const getCurrentQuarter = () => {
  return getQuarter(new Date());
};

const seasonStart = '2025-03-01';

export const getSeasonPeriod = (season?: number) => {
  if (season < 0) {
    throw new Error('Invalid season');
  }

  // Pre-season
  else if (season === 0) {
    return { start: '1970-01-01', end: '2025-03-31' };
  }

  const year = 2025 + Math.floor(season / 4);
  const month = ((season % 4) * 3) % 12; // 3 - 6 - 9 - 12
  return getQuarter(new Date(year, month, 1));
};

export const getSeason = (date: Date) => {
  const seasonStartDate = new Date(seasonStart);
  const seasonStartYear = seasonStartDate.getFullYear();
  const year = date.getFullYear();
  const month = date.getMonth();
  const season = (year - seasonStartYear) * 4 + Math.floor((month - 4) / 3) + 1;
  return Math.max(season, 0);
};

export const getCurrentSeason = () => {
  return getSeason(new Date());
};
