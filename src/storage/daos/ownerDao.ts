import { eq } from 'drizzle-orm';
import { db } from '../database/connection';
import { owners, type Owner, type NewOwner } from '../schema';

export const ownerDao = {
    async getAll(): Promise<Owner[]> {
        return db.select().from(owners).all();
    },

    async getById(id: number): Promise<Owner | undefined> {
        const results = await db.select().from(owners).where(eq(owners.id, id));
        return results[0];
    },

    async create(data: NewOwner): Promise<Owner> {
        const results = await db.insert(owners).values(data).returning();
        return results[0];
    },

    async update(id: number, data: Partial<NewOwner>): Promise<Owner> {
        const results = await db.update(owners).set(data).where(eq(owners.id, id)).returning();
        return results[0];
    },

    async delete(id: number): Promise<void> {
        await db.delete(owners).where(eq(owners.id, id));
    },
};
