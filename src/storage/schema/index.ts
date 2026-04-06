import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const owners = sqliteTable('owners', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    address: text('address').notNull(),
    isClubinho: integer('is_clubinho', { mode: 'boolean' }).notNull().default(false),
    clubinhoMonthlyFee: real('clubinho_monthly_fee').notNull().default(0),
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
    description: text('description').notNull(),
    amount: real('amount').notNull(),
    date: integer('date', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    type: text('type', { enum: ['service', 'monthly_fee'] }).notNull(),
    status: text('status', { enum: ['pending', 'paid', 'overdue', 'cancelled'] }).notNull().$default(() => 'pending'),
    paidAt: integer('paid_at', { mode: 'timestamp' }),
    receiptIssuedAt: integer('receipt_issued_at', { mode: 'timestamp' }),
    referenceMonth: text('reference_month'), // e.g., '2026-02'
});

export const expenses = sqliteTable('expenses', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    description: text('description').notNull(),
    amount: real('amount').notNull(),
    date: integer('date', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    status: text('status', { enum: ['pending', 'paid'] }).notNull().default('pending'),
    referenceMonth: text('reference_month').notNull(),
});

export type Owner = typeof owners.$inferSelect;
export type NewOwner = typeof owners.$inferInsert;
export type Pet = typeof pets.$inferSelect;
export type NewPet = typeof pets.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
