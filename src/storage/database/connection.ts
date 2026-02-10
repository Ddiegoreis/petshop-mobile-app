import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '../schema';

export const DATABASE_NAME = 'petshop.db';

const sqlite = openDatabaseSync(DATABASE_NAME);

export const db = drizzle(sqlite, { schema });

// Initial setup or migration could be handled here
// For local MVP, we can use drizzle-kit to push schema or manually run create table queries if needed
// A common pattern with expo-sqlite is to check/init tables on start
