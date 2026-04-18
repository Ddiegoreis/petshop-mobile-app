export function buildMonthlyDueDate(referenceMonth: string, dueDay: number): Date {
    const [yearText, monthText] = referenceMonth.split('-');
    const year = Number(yearText);
    const monthIndex = Number(monthText) - 1;
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();
    const safeDueDay = Math.trunc(Number.isFinite(dueDay) ? dueDay : 10);
    const effectiveDay = Math.min(Math.max(safeDueDay, 1), lastDayOfMonth);
    return new Date(year, monthIndex, effectiveDay);
}
