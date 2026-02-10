// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';

const m0000 = `CREATE TABLE \`appointments\` (
\t\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
\t\`pet_id\` integer NOT NULL,
\t\`date\` integer NOT NULL,
\t\`service_type\` text NOT NULL,
\t\`status\` text NOT NULL,
\t\`notes\` text,
\t\`price\` real,
\tFOREIGN KEY (\`pet_id\`) REFERENCES \`pets\`(\`id\`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE \`owners\` (
\t\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
\t\`name\` text NOT NULL,
\t\`phone\` text,
\t\`address\` text,
\t\`created_at\` integer
);
--> statement-breakpoint
CREATE TABLE \`payments\` (
\t\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
\t\`owner_id\` integer NOT NULL,
\t\`amount\` real NOT NULL,
\t\`date\` integer NOT NULL,
\t\`type\` text NOT NULL,
\t\`status\` text NOT NULL,
\t\`reference_month\` text,
\tFOREIGN KEY (\`owner_id\`) REFERENCES \`owners\`(\`id\`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE \`pets\` (
\t\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
\t\`owner_id\` integer NOT NULL,
\t\`name\` text NOT NULL,
\t\`breed\` text,
\t\`dob\` text,
\t\`notes\` text,
\tFOREIGN KEY (\`owner_id\`) REFERENCES \`owners\`(\`id\`) ON UPDATE no action ON DELETE cascade
);`;

export default {
  journal,
  migrations: {
    m0000,
  },
};