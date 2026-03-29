import { paymentDao, type PaymentStatus, type PaymentWithOwner } from '../storage/daos/paymentDao';
import { ownerDao } from '../storage/daos/ownerDao';

type CreateServicePaymentInput = {
    ownerId: number;
    description: string;
    amount: number;
    status?: PaymentStatus;
    referenceMonth: string;
};

export type MonthlyFinanceSummary = {
    total: number;
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
    return payments.reduce<MonthlyFinanceSummary>(
        (acc, current) => {
            if (current.status !== 'cancelled') {
                acc.total += current.amount;
            }
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
        { total: 0, paid: 0, open: 0, cancelled: 0 }
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

    async markPaymentAsPaid(paymentId: number, paidAt: Date = new Date()) {
        return paymentDao.markAsPaid(paymentId, paidAt);
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
};
