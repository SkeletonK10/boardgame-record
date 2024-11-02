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
