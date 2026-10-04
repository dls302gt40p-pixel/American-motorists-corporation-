export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatMiles(miles: number): string {
  return `${formatNumber(miles)} mi`;
}

export function formatDelta(delta: number): { text: string; isPositive: boolean; isNeutral: boolean } {
  if (delta === 0) {
    return { text: 'Equal to current', isPositive: false, isNeutral: true };
  }
  if (delta > 0) {
    return { text: `+${formatCurrency(delta)} higher`, isPositive: false, isNeutral: false };
  }
  return { text: `-${formatCurrency(Math.abs(delta))} lower`, isPositive: true, isNeutral: false };
}
