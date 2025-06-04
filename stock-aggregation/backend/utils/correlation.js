function calculateCorrelation(prices1, prices2) {
  if (prices1.length !== prices2.length || prices1.length === 0) {
    return 0; 
  }

  const n = prices1.length;
  const avg1 = prices1.reduce((a, b) => a + b, 0) / n;
  const avg2 = prices2.reduce((a, b) => a + b, 0) / n;

  let numerator = 0, denom1 = 0, denom2 = 0;

  for (let i = 0; i < n; i++) {
    const x = prices1[i] - avg1;
    const y = prices2[i] - avg2;
    numerator += x * y;
    denom1 += x * x;
    denom2 += y * y;
  }

  const denominator = Math.sqrt(denom1 * denom2);
  return denominator === 0 ? 0 : numerator / denominator;
}

module.exports = { calculateCorrelation };