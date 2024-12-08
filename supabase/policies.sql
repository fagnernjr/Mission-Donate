-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Campaigns Policies
CREATE POLICY "Campaigns are viewable by everyone"
ON campaigns FOR SELECT
USING (true);

CREATE POLICY "Campaigns can be created by missionaries"
ON campaigns FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'missionary'
  )
);

CREATE POLICY "Campaigns can be updated by their owners"
ON campaigns FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  missionary_id = auth.uid()
);

CREATE POLICY "Campaigns can be deleted by their owners"
ON campaigns FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  missionary_id = auth.uid()
);

-- Donations Policies
CREATE POLICY "Donations are viewable by the donor and recipient"
ON donations FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  (
    donor_id = auth.uid() OR
    campaign_id IN (
      SELECT id FROM campaigns
      WHERE missionary_id = auth.uid()
    )
  )
);

CREATE POLICY "Donations can be created by authenticated users"
ON donations FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  donor_id = auth.uid()
);

CREATE POLICY "Donations can be updated by their owners"
ON donations FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  donor_id = auth.uid()
);

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Organizations Policies
CREATE POLICY "Organizations are viewable by everyone"
ON organizations FOR SELECT
USING (true);

CREATE POLICY "Organizations can be created by authenticated users"
ON organizations FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'missionary'
  )
);

CREATE POLICY "Organizations can be updated by their owners"
ON organizations FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  owner_id = auth.uid()
);

-- Function to check if user is missionary
CREATE OR REPLACE FUNCTION is_missionary(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = $1
    AND profiles.role = 'missionary'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is donor
CREATE OR REPLACE FUNCTION is_donor(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = $1
    AND profiles.role = 'donor'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns campaign
CREATE OR REPLACE FUNCTION owns_campaign(user_id uuid, campaign_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM campaigns
    WHERE campaigns.id = $2
    AND campaigns.missionary_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
