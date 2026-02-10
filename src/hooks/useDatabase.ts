import { useEffect, useState } from 'react';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '../storage/database/connection';
import migrations from '../../drizzle/migrations';

export function useDatabase() {
    const { success, error } = useMigrations(db, migrations);

    useEffect(() => {
        if (error) {
            console.error('Migration error:', error);
        }
    }, [error]);

    return { isReady: success, error };
}
