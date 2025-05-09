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
