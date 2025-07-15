-- Add foreign key constraints for found-item table
ALTER TABLE "found-item" 
ADD CONSTRAINT "found-item_user_id_fkey" 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Add foreign key constraints for lost-items table
ALTER TABLE "lost-items" 
ADD CONSTRAINT "lost-items_user_id_fkey" 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Update RLS policies to allow users to read all user_profiles for joins
CREATE POLICY "Allow read for all users" ON user_profiles
FOR SELECT USING (true);

-- Update RLS policies for found-item table
ALTER TABLE "found-item" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own found items" ON "found-item"
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all found items" ON "found-item"
FOR SELECT USING (true);

CREATE POLICY "Users can update their own found items" ON "found-item"
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own found items" ON "found-item"
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for lost-items table
ALTER TABLE "lost-items" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own lost items" ON "lost-items"
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all lost items" ON "lost-items"
FOR SELECT USING (true);

CREATE POLICY "Users can update their own lost items" ON "lost-items"
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lost items" ON "lost-items"
FOR DELETE USING (auth.uid() = user_id); 