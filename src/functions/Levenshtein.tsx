// Levenshtein Distance to compare strings resemblance to order for 
export function levenshteinDistance(a: string, b: string): number {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const aNorm = normalize(a);
  const bNorm = normalize(b);

  if (aNorm.includes(bNorm) || bNorm.includes(aNorm)) {
    return 0; // test
  }

  const dp = Array.from({ length: aNorm.length + 1 }, (_, i) =>
    Array(bNorm.length + 1).fill(0),
  );

  for (let i = 0; i <= aNorm.length; i++) dp[i][0] = i;
  for (let j = 0; j <= bNorm.length; j++) dp[0][j] = j;

  for (let i = 1; i <= aNorm.length; i++) {
    for (let j = 1; j <= bNorm.length; j++) {
      const cost = aNorm[i - 1] === bNorm[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[aNorm.length][bNorm.length];
}
