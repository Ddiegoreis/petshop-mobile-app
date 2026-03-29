ALTER TABLE `owners` ADD `clubinho_monthly_fee` real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `payments` ADD `description` text DEFAULT 'Pagamento' NOT NULL;
--> statement-breakpoint
ALTER TABLE `payments` ADD `paid_at` integer;
