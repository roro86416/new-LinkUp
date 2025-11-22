-- AlterTable
ALTER TABLE `announcements` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `event_guests` MODIFY `bio` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `event_rating` MODIFY `comment` TEXT NULL;

-- AlterTable
ALTER TABLE `events` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `notification_templates` MODIFY `message` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `notifications` MODIFY `message` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `organizers` MODIFY `org_description` TEXT NULL;

-- AlterTable
ALTER TABLE `post_reviews` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `reviews` MODIFY `reason` TEXT NULL;

-- AlterTable
ALTER TABLE `user_posts` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `user_providers` MODIFY `access_token` TEXT NULL,
    MODIFY `refresh_token` TEXT NULL;
