import { paymentDao, type PaymentStatus, type PaymentWithOwner } from '../storage/daos/paymentDao';
import { expenseDao, type ExpenseStatus } from '../storage/daos/expenseDao';
import { ownerDao } from '../storage/daos/ownerDao';
import { petDao } from '../storage/daos/petDao';
import { ReceiptService } from './ReceiptService';

type CreateServicePaymentInput = {
    ownerId: number;
    description: string;
    amount: number;
    status?: PaymentStatus;
    referenceMonth: string;
};

type CreateExpenseInput = {
    description: string;
    amount: number;
    status?: ExpenseStatus;
    referenceMonth: string;
};

export type FinanceEntry =
    | ({ kind: 'service' } & PaymentWithOwner)
    | {
          kind: 'expense';
          id: number;
          description: string;
          amount: number;
          date: Date;
          status: ExpenseStatus;
          referenceMonth: string;
      };

export type MonthlyFinanceSummary = {
    revenue: number;
    expenses: number;
    balance: number;
    paid: number;
    open: number;
    cancelled: number;
};

function getReferenceMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

function addMonths(referenceMonth: string, delta: number): string {
    const [yearText, monthText] = referenceMonth.split('-');
    const year = Number(yearText);
    const monthIndex = Number(monthText) - 1;
    const base = new Date(year, monthIndex, 1);
    base.setMonth(base.getMonth() + delta);
    return getReferenceMonth(base);
}

function calculateSummary(payments: PaymentWithOwner[]): MonthlyFinanceSummary {
    const revenue = payments.reduce((acc, current) => (current.status === 'cancelled' ? acc : acc + current.amount), 0);
    return payments.reduce<MonthlyFinanceSummary>(
        (acc, current) => {
            if (current.status === 'paid') {
                acc.paid += current.amount;
            }
            if (current.status === 'pending' || current.status === 'overdue') {
                acc.open += current.amount;
            }
            if (current.status === 'cancelled') {
                acc.cancelled += current.amount;
            }
            return acc;
        },
        { revenue, expenses: 0, balance: revenue, paid: 0, open: 0, cancelled: 0 }
    );
}

export const FinanceService = {
    getCurrentReferenceMonth(): string {
        return getReferenceMonth(new Date());
    },

    getPreviousReferenceMonth(referenceMonth: string): string {
        return addMonths(referenceMonth, -1);
    },

    getNextReferenceMonth(referenceMonth: string): string {
        return addMonths(referenceMonth, 1);
    },

    formatReferenceMonthLabel(referenceMonth: string): string {
        const [yearText, monthText] = referenceMonth.split('-');
        const date = new Date(Number(yearText), Number(monthText) - 1, 1);
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    },

    async getMonthlyPayments(referenceMonth: string): Promise<{ payments: PaymentWithOwner[]; summary: MonthlyFinanceSummary }> {
        const currentMonth = this.getCurrentReferenceMonth();
        if (referenceMonth >= currentMonth) {
            const owners = await ownerDao.getAll();
            for (const owner of owners) {
                if (owner.isClubinho && owner.clubinhoMonthlyFee > 0) {
                    await this.ensureClubinhoMonthlyPayment(owner.id, referenceMonth);
                }
            }
        }
        await paymentDao.markOverdueBefore(currentMonth);
        const payments = await paymentDao.getByReferenceMonth(referenceMonth);
        const summary = calculateSummary(payments);
        return { payments, summary };
    },

    async getMonthlyFinance(referenceMonth: string): Promise<{ entries: FinanceEntry[]; summary: MonthlyFinanceSummary }> {
        if (referenceMonth >= this.getCurrentReferenceMonth()) {
            const owners = await ownerDao.getAll();
            for (const owner of owners) {
                if (owner.isClubinho && owner.clubinhoMonthlyFee > 0) {
                    await this.ensureClubinhoMonthlyPayment(owner.id, referenceMonth);
                }
            }
        }

        await paymentDao.markOverdueBefore(this.getCurrentReferenceMonth());
        const payments = await paymentDao.getByReferenceMonth(referenceMonth);
        const paymentsData = { payments, summary: calculateSummary(payments) };
        const expensesData = await expenseDao.getByReferenceMonth(referenceMonth);

        const entries: FinanceEntry[] = [
            ...paymentsData.payments.map((payment) => ({ kind: 'service' as const, ...payment })),
            ...expensesData.map((expense) => ({ kind: 'expense' as const, ...expense })),
        ].sort((left, right) => {
            const leftTime = new Date(left.date).getTime();
            const rightTime = new Date(right.date).getTime();
            if (rightTime !== leftTime) return rightTime - leftTime;
            return right.id - left.id;
        });

        const summary = {
            ...paymentsData.summary,
            expenses: expensesData.reduce((acc, current) => acc + current.amount, 0),
        };
        summary.balance = summary.revenue - summary.expenses;

        return { entries, summary };
    },

    async createServicePayment(input: CreateServicePaymentInput) {
        return paymentDao.create({
            ownerId: input.ownerId,
            description: input.description.trim(),
            amount: input.amount,
            type: 'service',
            status: input.status ?? 'pending',
            date: new Date(),
            referenceMonth: input.referenceMonth,
            paidAt: input.status === 'paid' ? new Date() : null,
        });
    },

    async createExpense(input: CreateExpenseInput) {
        return expenseDao.create({
            description: input.description.trim(),
            amount: input.amount,
            status: input.status ?? 'pending',
            date: new Date(),
            referenceMonth: input.referenceMonth,
        });
    },

    async markPaymentAsPaid(paymentId: number, paidAt: Date = new Date()) {
        return paymentDao.markAsPaid(paymentId, paidAt);
    },

    async markPaymentAsOpen(paymentId: number) {
        return paymentDao.markAsOpen(paymentId);
    },

    async markExpenseAsPaid(expenseId: number) {
        return expenseDao.markAsPaid(expenseId);
    },

    async markExpenseAsOpen(expenseId: number) {
        return expenseDao.markAsOpen(expenseId);
    },

    async generateAndShareReceipt(payment: PaymentWithOwner): Promise<void> {
        if (payment.status !== 'paid' || !payment.paidAt) {
            throw new Error('Somente pagamentos marcados como pagos podem emitir recibo.');
        }

        const pets = await petDao.getByOwnerId(payment.ownerId);
        await ReceiptService.generateAndShare({
            paymentId: payment.id,
            ownerName: payment.ownerName,
            ownerPhone: payment.ownerPhone,
            petNames: pets.map((pet) => pet.name),
            description: payment.description,
            amount: payment.amount,
            paidAt: new Date(payment.paidAt),
            referenceMonth: payment.referenceMonth,
        });

        await paymentDao.markReceiptIssued(payment.id, new Date());
    },

    async ensureClubinhoMonthlyPayment(ownerId: number, referenceMonth: string): Promise<void> {
        const owner = await ownerDao.getById(ownerId);
        if (!owner || !owner.isClubinho || owner.clubinhoMonthlyFee <= 0) {
            return;
        }

        const existing = await paymentDao.findMonthlyFee(ownerId, referenceMonth);
        if (existing) {
            return;
        }

        await paymentDao.create({
            ownerId,
            description: 'Mensalidade Clubinho',
            amount: owner.clubinhoMonthlyFee,
            type: 'monthly_fee',
            status: 'pending',
            date: new Date(),
            referenceMonth,
            paidAt: null,
        });
    },

    async cancelFutureClubinhoPayments(ownerId: number, fromReferenceMonth: string): Promise<void> {
        await paymentDao.cancelFutureMonthlyFees(ownerId, fromReferenceMonth);
    },

    async updateFutureClubinhoPaymentsAmount(ownerId: number, fromReferenceMonth: string, amount: number): Promise<void> {
        await paymentDao.updateFutureMonthlyFeesAmount(ownerId, fromReferenceMonth, amount);
    },
};
