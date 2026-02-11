import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '../schema';

export const DATABASE_NAME = 'petshop_final_v2.db';

const sqlite = openDatabaseSync(DATABASE_NAME);

export const db = drizzle(sqlite, { schema });
