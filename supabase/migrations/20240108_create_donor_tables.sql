-- Add donor preferences table
CREATE TABLE donor_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    preferred_categories TEXT[] DEFAULT '{}',
    preferred_payment_method TEXT,
    anonymous_donation BOOLEAN DEFAULT false,
    notification_preferences JSONB DEFAULT '{
        "email_notifications": true,
        "campaign_updates": true,
        "monthly_summary": true
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Add RLS policies for donor_preferences
ALTER TABLE donor_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
    ON donor_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON donor_preferences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON donor_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Add donation history view for easier querying
CREATE OR REPLACE VIEW donor_contribution_history AS
SELECT 
    d.donor_id,
    d.campaign_id,
    d.amount,
    d.status,
    d.payment_method,
    d.created_at,
    c.title as campaign_title,
    c.user_id as campaign_owner_id,
    p.full_name as campaign_owner_name
FROM donations d
JOIN campaigns c ON d.campaign_id = c.id
JOIN profiles p ON c.user_id = p.id
WHERE d.status = 'completed'
ORDER BY d.created_at DESC;

-- Add function to get donor statistics
CREATE OR REPLACE FUNCTION get_donor_statistics(donor_uuid UUID)
RETURNS TABLE (
    total_donations BIGINT,
    total_amount DECIMAL,
    campaigns_supported INTEGER,
    last_donation_date TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_donations,
        COALESCE(SUM(amount), 0)::DECIMAL as total_amount,
        COUNT(DISTINCT campaign_id)::INTEGER as campaigns_supported,
        MAX(created_at) as last_donation_date
    FROM donations
    WHERE donor_id = donor_uuid AND status = 'completed';
END;
$$;
