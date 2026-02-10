import { eq, sql } from 'drizzle-orm';
import { db } from '../database/connection';
import { pets, owners, type Pet, type NewPet } from '../schema';

export type PetWithOwner = Pet & { ownerName: string };

export const petDao = {
    async getAll(): Promise<PetWithOwner[]> {
        const result = await db
            .select({
                ...pets._.columns,
                ownerName: owners.name,
            })
            .from(pets)
            .leftJoin(owners, eq(pets.ownerId, owners.id))
            .all();

        // Cast result to PetWithOwner since leftJoin might return null ownerName if integrity is broken, 
        // but our schema enforces notNull foreign key so it should be safe.
        return result as PetWithOwner[];
    },

    async getByOwnerId(ownerId: number): Promise<Pet[]> {
        return db.select().from(pets).where(eq(pets.ownerId, ownerId)).all();
    },

    async getById(id: number): Promise<PetWithOwner | undefined> {
        const result = await db
            .select({
                ...pets._.columns,
                ownerName: owners.name,
            })
            .from(pets)
            .leftJoin(owners, eq(pets.ownerId, owners.id))
            .where(eq(pets.id, id))
            .all();

        return result[0] as PetWithOwner | undefined;
    },

    async create(data: NewPet): Promise<Pet> {
        const results = await db.insert(pets).values(data).returning();
        return results[0];
    },

    async update(id: number, data: Partial<NewPet>): Promise<Pet> {
        const results = await db.update(pets).set(data).where(eq(pets.id, id)).returning();
        return results[0];
    },

    async delete(id: number): Promise<void> {
        await db.delete(pets).where(eq(pets.id, id));
    },
};
