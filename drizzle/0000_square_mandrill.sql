CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pet_id` integer NOT NULL,
	`date` integer NOT NULL,
	`service_type` text NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`price` real,
	FOREIGN KEY (`pet_id`) REFERENCES `pets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `owners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`address` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` integer NOT NULL,
	`amount` real NOT NULL,
	`date` integer NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`reference_month` text,
	FOREIGN KEY (`owner_id`) REFERENCES `owners`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` integer NOT NULL,
	`name` text NOT NULL,
	`breed` text,
	`dob` text,
	`notes` text,
	FOREIGN KEY (`owner_id`) REFERENCES `owners`(`id`) ON UPDATE no action ON DELETE cascade
);
