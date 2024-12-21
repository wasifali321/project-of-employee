export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthYear(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export function getMonthsBetweenDates(startDate: Date, endDate: Date): string[] {
  const months: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    months.push(currentDate.toISOString().slice(0, 7));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
}

export function calculatePendingMonths(
  startDate: Date,
  currentDate: Date,
  paidMonths: Set<string>
): string[] {
  const allMonths = getMonthsBetweenDates(startDate, currentDate);
  return allMonths.filter(month => !paidMonths.has(month));
}