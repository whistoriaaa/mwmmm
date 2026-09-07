ALTER TABLE `photos` ADD `source_path` text;--> statement-breakpoint
CREATE UNIQUE INDEX `photos_source_path` ON `photos` (`source_path`);