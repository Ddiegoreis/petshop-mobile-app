CREATE TABLE `expenses` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `description` text NOT NULL,
  `amount` real NOT NULL,
  `date` integer NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `reference_month` text NOT NULL
);
