import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const owners = sqliteTable('owners', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    address: text('address').notNull(),
    isClubinho: integer('is_clubinho', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const pets = sqliteTable('pets', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    ownerId: integer('owner_id').notNull().references(() => owners.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    breed: text('breed'),
    dob: text('dob'), // Date of Birth as string
    notes: text('notes'),
});

export const appointments = sqliteTable('appointments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    petId: integer('pet_id').notNull().references(() => pets.id, { onDelete: 'cascade' }),
    date: text('date').notNull(), // ISO 8601 string
    serviceType: text('service_type').notNull(),
    notes: text('notes'),
    status: text('status').notNull().default('PENDING'), // PENDING, COMPLETED, CANCELLED
    calendarEventId: text('calendar_event_id'),
    recurrenceRule: text('recurrence_rule'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const payments = sqliteTable('payments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    ownerId: integer('owner_id').notNull().references(() => owners.id, { onDelete: 'cascade' }),
    amount: real('amount').notNull(),
    date: integer('date', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    type: text('type', { enum: ['service', 'monthly_fee'] }).notNull(),
    status: text('status', { enum: ['pending', 'paid', 'overdue'] }).notNull().$default(() => 'pending'),
    referenceMonth: text('reference_month'), // e.g., '2026-02'
});

export type Owner = typeof owners.$inferSelect;
export type NewOwner = typeof owners.$inferInsert;
export type Pet = typeof pets.$inferSelect;
export type NewPet = typeof pets.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
