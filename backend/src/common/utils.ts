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

/**
 * startDate, endDate 쿼리 스트링 포매팅.
 * @param startDate? 시작 날짜
 * @param endDate? 끝 날짜 (포함할 날짜)
 *
 * 날짜가 주어지지 않을 경우, 기본값은 1970-01-01, 9999-12-31
 * endDate는 포함할 날짜이므로, 하루 더해준다.
 *
 * @returns { startDate, endDate }
 * @example { start: '2021-01-01', end: '2021-01-31' }
 */
export const formatDate = (startDate?: string, endDate?: string) => {
  if (!startDate) startDate = '1970-01-01';
  if (endDate) {
    const endDateObj = new Date(endDate);
    endDateObj.setDate(endDateObj.getDate() + 1);
    endDate = endDateObj.toISOString().split('T')[0];
  } else endDate = '9999-12-31';
  return { start: startDate, end: endDate };
};
