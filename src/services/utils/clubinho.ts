export function normalizeDueDay(dueDay: number): number {
    if (!Number.isFinite(dueDay)) {
        return 10;
    }

    const integerDay = Math.trunc(dueDay);
    return Math.min(31, Math.max(1, integerDay));
}
