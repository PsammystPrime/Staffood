-- Migration to update user_points table
-- Created: January 2026

USE staffoods;

-- Add columns if they don't already exist
ALTER TABLE user_points 
    ADD COLUMN IF NOT EXISTS username VARCHAR(100) AFTER user_id,
    ADD COLUMN IF NOT EXISTS points_spent INT DEFAULT 0 AFTER points;

-- Populate usernames from users table
UPDATE user_points up
JOIN users u ON up.user_id = u.id
SET up.username = u.username
WHERE up.username IS NULL OR up.username = '';

