-- Migration script to update User table structure
-- Run this script to migrate from complex role structure to simplified role field
-- 
-- WARNING: This will modify existing data. Please backup your database before running.

-- Step 1: Add the new role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50);

-- Step 2: Migrate existing role data from user_roles junction table to the new role column
-- This sets the role to the first role found for each user, defaulting to 'CUSTOMER' if no role exists
UPDATE users 
SET role = COALESCE(
    (SELECT r.name 
     FROM user_roles ur 
     JOIN roles r ON ur.role_id = r.id 
     WHERE ur.user_id = users.id 
     LIMIT 1), 
    'CUSTOMER'
)
WHERE role IS NULL;

-- Step 3: Set default value and NOT NULL constraint for role column
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'CUSTOMER';
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- Step 4: Remove unused columns from users table
ALTER TABLE users DROP COLUMN IF EXISTS dob;
ALTER TABLE users DROP COLUMN IF EXISTS door_no;
ALTER TABLE users DROP COLUMN IF EXISTS locality;
ALTER TABLE users DROP COLUMN IF EXISTS location;

-- Step 5: Make phone_number NOT NULL (if not already)
ALTER TABLE users ALTER COLUMN phone_number SET NOT NULL;

-- Step 6: Drop the user_roles junction table (after confirming role migration)
-- UNCOMMENT THE FOLLOWING LINE AFTER VERIFYING THE MIGRATION IS SUCCESSFUL:
-- DROP TABLE IF EXISTS user_roles;

-- Step 7: Optional - You can keep the roles table for reference or drop it if not needed
-- UNCOMMENT THE FOLLOWING LINE IF YOU WANT TO REMOVE THE ROLES TABLE:
-- DROP TABLE IF EXISTS roles;

-- Verification queries to check the migration:
-- SELECT COUNT(*) FROM users WHERE role IS NULL; -- Should return 0
-- SELECT role, COUNT(*) FROM users GROUP BY role; -- Should show role distribution
-- SELECT * FROM users LIMIT 5; -- Verify the structure looks correct