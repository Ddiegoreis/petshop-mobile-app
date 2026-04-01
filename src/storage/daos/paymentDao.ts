import { and, desc, eq, getTableColumns, gte, lt, or } from 'drizzle-orm';
import { db } from '../database/connection';
import { owners, payments, type NewPayment, type Payment } from '../schema';

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export type PaymentWithOwner = Payment & {
    ownerName: string;
};

export const paymentDao = {
    async getByReferenceMonth(referenceMonth: string): Promise<PaymentWithOwner[]> {
        const result = await db
            .select({
                ...getTableColumns(payments),
                ownerName: owners.name,
            })
            .from(payments)
            .leftJoin(owners, eq(payments.ownerId, owners.id))
            .where(eq(payments.referenceMonth, referenceMonth))
            .orderBy(desc(payments.date), desc(payments.id))
            .all();

        return result as PaymentWithOwner[];
    },

    async create(data: NewPayment): Promise<Payment> {
        const result = await db.insert(payments).values(data).returning();
        return result[0];
    },

    async markAsPaid(paymentId: number, paidAt: Date): Promise<Payment> {
        const result = await db
            .update(payments)
            .set({ status: 'paid', paidAt })
            .where(eq(payments.id, paymentId))
            .returning();

        return result[0];
    },

    async markAsOpen(paymentId: number): Promise<Payment> {
        const result = await db
            .update(payments)
            .set({ status: 'pending', paidAt: null })
            .where(eq(payments.id, paymentId))
            .returning();

        return result[0];
    },

    async markOverdueBefore(referenceMonth: string): Promise<void> {
        await db
            .update(payments)
            .set({ status: 'overdue' })
            .where(
                and(
                    lt(payments.referenceMonth, referenceMonth),
                    eq(payments.status, 'pending')
                )
            );
    },

    async findMonthlyFee(ownerId: number, referenceMonth: string): Promise<Payment | undefined> {
        const result = await db
            .select()
            .from(payments)
            .where(
                and(
                    eq(payments.ownerId, ownerId),
                    eq(payments.type, 'monthly_fee'),
                    eq(payments.referenceMonth, referenceMonth)
                )
            )
            .limit(1)
            .all();

        return result[0];
    },

    async cancelFutureMonthlyFees(ownerId: number, fromReferenceMonth: string): Promise<void> {
        await db
            .update(payments)
            .set({ status: 'cancelled' })
            .where(
                and(
                    eq(payments.ownerId, ownerId),
                    eq(payments.type, 'monthly_fee'),
                    gte(payments.referenceMonth, fromReferenceMonth),
                    or(eq(payments.status, 'pending'), eq(payments.status, 'overdue'))
                )
            );
    },

    async updateFutureMonthlyFeesAmount(ownerId: number, fromReferenceMonth: string, amount: number): Promise<void> {
        await db
            .update(payments)
            .set({ amount })
            .where(
                and(
                    eq(payments.ownerId, ownerId),
                    eq(payments.type, 'monthly_fee'),
                    gte(payments.referenceMonth, fromReferenceMonth),
                    or(eq(payments.status, 'pending'), eq(payments.status, 'overdue'))
                )
            );
    },
};
