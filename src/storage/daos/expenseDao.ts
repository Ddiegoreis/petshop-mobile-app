import { and, desc, eq } from 'drizzle-orm';
import { db } from '../database/connection';
import { expenses, type Expense, type NewExpense } from '../schema';

export type ExpenseStatus = 'pending' | 'paid';

export const expenseDao = {
    async getByReferenceMonth(referenceMonth: string): Promise<Expense[]> {
        return db
            .select()
            .from(expenses)
            .where(eq(expenses.referenceMonth, referenceMonth))
            .orderBy(desc(expenses.date), desc(expenses.id))
            .all();
    },

    async create(data: NewExpense): Promise<Expense> {
        const result = await db.insert(expenses).values(data).returning();
        return result[0];
    },

    async markAsPaid(expenseId: number): Promise<Expense> {
        const result = await db
            .update(expenses)
            .set({ status: 'paid' })
            .where(eq(expenses.id, expenseId))
            .returning();

        return result[0];
    },

    async markAsOpen(expenseId: number): Promise<Expense> {
        const result = await db
            .update(expenses)
            .set({ status: 'pending' })
            .where(eq(expenses.id, expenseId))
            .returning();

        return result[0];
    },
};
