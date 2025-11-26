export function getActiveWeekIndices(
  startDate: string,
  totalWeeks: number,
  holidays: string[]
) {
  const active: number[] = [];
  const current = new Date(startDate);
  let addedWeeks = 0;

  while (addedWeeks < totalWeeks) {
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(current);
      d.setDate(d.getDate() + i);
      return d.toISOString().split("T")[0];
    });

    const isHolidayWeek = weekDays.every((d) => holidays.includes(d));
    if (!isHolidayWeek) active.push(addedWeeks);
    addedWeeks++;
    current.setDate(current.getDate() + 7);
  }

  return active;
}

export function getWeekLabels(startDate: string, activeWeeks: number[]) {
  return activeWeeks.map((i) => {
    const s = new Date(startDate);
    s.setDate(s.getDate() + i * 7);
    const e = new Date(s);
    e.setDate(s.getDate() + 6);
    return `${s.toLocaleDateString()} - ${e.toLocaleDateString()}`;
  });
}
