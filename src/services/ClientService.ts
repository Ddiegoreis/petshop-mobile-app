import { ownerDao } from '../storage/daos/ownerDao';
import { type Owner } from '../storage/schema';
import { FinanceService } from './FinanceService';

type SaveOwnerInput = {
    name: string;
    phone: string;
    address: string;
    isClubinho: boolean;
    clubinhoMonthlyFee: number;
};

function normalizeInput(input: SaveOwnerInput): SaveOwnerInput {
    return {
        name: input.name.trim(),
        phone: input.phone.trim(),
        address: input.address.trim(),
        isClubinho: input.isClubinho,
        clubinhoMonthlyFee: input.isClubinho ? Number(input.clubinhoMonthlyFee) : 0,
    };
}

function nextReferenceMonth(referenceMonth: string): string {
    return FinanceService.getNextReferenceMonth(referenceMonth);
}

function hasFeeChanged(previousFee: number, nextFee: number): boolean {
    return Number(previousFee.toFixed(2)) !== Number(nextFee.toFixed(2));
}

async function ensureCurrentMonthClubinhoIfNeeded(ownerId: number, isClubinho: boolean): Promise<void> {
    if (!isClubinho) {
        return;
    }
    await FinanceService.ensureClubinhoMonthlyPayment(ownerId, FinanceService.getCurrentReferenceMonth());
}

export const ClientService = {
    async createOwner(input: SaveOwnerInput): Promise<Owner> {
        const data = normalizeInput(input);
        const owner = await ownerDao.create(data);
        await ensureCurrentMonthClubinhoIfNeeded(owner.id, data.isClubinho);
        return owner;
    },

    async updateOwner(ownerId: number, input: SaveOwnerInput): Promise<Owner> {
        const previous = await ownerDao.getById(ownerId);
        if (!previous) {
            throw new Error('Tutor não encontrado');
        }

        const data = normalizeInput(input);
        const owner = await ownerDao.update(ownerId, data);

        const currentReferenceMonth = FinanceService.getCurrentReferenceMonth();

        if (!previous.isClubinho && data.isClubinho) {
            await FinanceService.ensureClubinhoMonthlyPayment(ownerId, currentReferenceMonth);
        }

        if (previous.isClubinho && !data.isClubinho) {
            await FinanceService.cancelFutureClubinhoPayments(ownerId, nextReferenceMonth(currentReferenceMonth));
        }

        if (previous.isClubinho && data.isClubinho) {
            await FinanceService.ensureClubinhoMonthlyPayment(ownerId, currentReferenceMonth);

            if (hasFeeChanged(previous.clubinhoMonthlyFee, data.clubinhoMonthlyFee)) {
                await FinanceService.updateFutureClubinhoPaymentsAmount(
                    ownerId,
                    nextReferenceMonth(currentReferenceMonth),
                    data.clubinhoMonthlyFee
                );
            }
        }

        return owner;
    },
};
