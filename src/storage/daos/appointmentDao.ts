import { eq, and, gte, lte, desc, getTableColumns } from 'drizzle-orm';
import { db } from '../database/connection';
import { appointments, pets, owners, type Appointment, type NewAppointment } from '../schema';

export type AppointmentWithDetails = Appointment & {
    petName: string;
    ownerName: string;
    ownerId: number;
};

export const appointmentDao = {
    async create(data: NewAppointment): Promise<Appointment> {
        const results = await db.insert(appointments).values(data).returning();
        return results[0];
    },

    async update(id: number, data: Partial<NewAppointment>): Promise<Appointment> {
        const results = await db.update(appointments).set(data).where(eq(appointments.id, id)).returning();
        return results[0];
    },

    async delete(id: number): Promise<void> {
        await db.delete(appointments).where(eq(appointments.id, id));
    },

    async getById(id: number): Promise<AppointmentWithDetails | undefined> {
        const result = await db
            .select({
                ...getTableColumns(appointments),
                petName: pets.name,
                ownerName: owners.name,
                ownerId: owners.id,
            })
            .from(appointments)
            .leftJoin(pets, eq(appointments.petId, pets.id))
            .leftJoin(owners, eq(pets.ownerId, owners.id))
            .where(eq(appointments.id, id))
            .all();

        return result[0] as AppointmentWithDetails | undefined;
    },

    async getByDateRange(startDate: string, endDate: string): Promise<AppointmentWithDetails[]> {
        const result = await db
            .select({
                ...getTableColumns(appointments),
                petName: pets.name,
                ownerName: owners.name,
                ownerId: owners.id,
            })
            .from(appointments)
            .leftJoin(pets, eq(appointments.petId, pets.id))
            .leftJoin(owners, eq(pets.ownerId, owners.id))
            .where(
                and(
                    gte(appointments.date, startDate),
                    lte(appointments.date, endDate)
                )
            )
            .orderBy(appointments.date)
            .all();

        return result as AppointmentWithDetails[];
    },

    async getByPetId(petId: number): Promise<Appointment[]> {
        return db
            .select()
            .from(appointments)
            .where(eq(appointments.petId, petId))
            .orderBy(desc(appointments.date))
            .all();
    }
};
