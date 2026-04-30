CREATE TABLE `managed_service_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`business_type` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending',
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `opening_hours` (
	`id` text PRIMARY KEY NOT NULL,
	`site_id` text NOT NULL,
	`day_of_week` integer NOT NULL,
	`time_start` text,
	`time_end` text,
	`crosses_midnight` integer DEFAULT false,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `wizard_drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`industry` text,
	`step` integer DEFAULT 0,
	`answers` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `sections` ADD `translation_state` text DEFAULT 'original';--> statement-breakpoint
ALTER TABLE `sections` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `sites` ADD `description` text;--> statement-breakpoint
ALTER TABLE `sites` ADD `logo` text;--> statement-breakpoint
ALTER TABLE `sites` ADD `favicon` text;--> statement-breakpoint
ALTER TABLE `sites` ADD `custom_domain` text;--> statement-breakpoint
ALTER TABLE `sites` ADD `seo_title` text;--> statement-breakpoint
ALTER TABLE `sites` ADD `seo_description` text;--> statement-breakpoint
ALTER TABLE `sites` ADD `published_at` integer;--> statement-breakpoint
ALTER TABLE `sites` ADD `draft_state` text;--> statement-breakpoint
ALTER TABLE `sites` ADD `client_updated_at` integer;--> statement-breakpoint
ALTER TABLE `sites` ADD `completeness_cache` text;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `users` ADD `company` text;--> statement-breakpoint
ALTER TABLE `users` ADD `country` text;--> statement-breakpoint
ALTER TABLE `users` ADD `timezone` text DEFAULT 'UTC';--> statement-breakpoint
ALTER TABLE `users` ADD `language` text DEFAULT 'en';--> statement-breakpoint
ALTER TABLE `users` ADD `onboarding_complete` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` integer NOT NULL;