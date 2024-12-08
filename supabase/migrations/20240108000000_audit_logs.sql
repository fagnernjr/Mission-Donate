-- Create audit_logs table
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  resource_id UUID,
  details JSONB,
  level VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX audit_logs_user_id_idx ON audit_logs(user_id);
CREATE INDEX audit_logs_action_idx ON audit_logs(action);
CREATE INDEX audit_logs_resource_idx ON audit_logs(resource);
CREATE INDEX audit_logs_created_at_idx ON audit_logs(created_at);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs
CREATE POLICY "Audit logs are viewable by admins only"
ON audit_logs FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Audit logs can be created by the system"
ON audit_logs FOR INSERT
WITH CHECK (true);

-- Function to get user's audit logs
CREATE OR REPLACE FUNCTION get_user_audit_logs(
  user_id UUID,
  from_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  to_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  log_level VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  action VARCHAR,
  resource VARCHAR,
  resource_id UUID,
  details JSONB,
  level VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.id,
    al.action,
    al.resource,
    al.resource_id,
    al.details,
    al.level,
    al.created_at
  FROM audit_logs al
  WHERE al.user_id = $1
    AND ($2 IS NULL OR al.created_at >= $2)
    AND ($3 IS NULL OR al.created_at <= $3)
    AND ($4 IS NULL OR al.level = $4)
  ORDER BY al.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
