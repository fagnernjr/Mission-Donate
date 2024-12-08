-- Adicionar novos tipos
CREATE TYPE mission_type AS ENUM (
    'evangelismo',
    'assistencial',
    'educacional',
    'saude',
    'construcao',
    'traducao'
);

CREATE TYPE mission_urgency AS ENUM (
    'baixa',
    'media',
    'alta',
    'emergencial'
);

-- Adicionar campos na tabela de campanhas
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS mission_type mission_type;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS urgency mission_urgency DEFAULT 'media';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS location_coordinates POINT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Brasil';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS goals JSONB;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS updates JSONB[] DEFAULT '{}';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS testimonials JSONB[] DEFAULT '{}';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS media_gallery JSONB[] DEFAULT '{}';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Criar índices para busca
CREATE INDEX IF NOT EXISTS idx_campaigns_mission_type ON campaigns(mission_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_urgency ON campaigns(urgency);
CREATE INDEX IF NOT EXISTS idx_campaigns_region ON campaigns(region);
CREATE INDEX IF NOT EXISTS idx_campaigns_location ON campaigns USING GIST(location_coordinates);
CREATE INDEX IF NOT EXISTS idx_campaigns_featured ON campaigns(featured) WHERE featured = true;

-- Função para buscar campanhas próximas
CREATE OR REPLACE FUNCTION find_nearby_campaigns(
    lat double precision,
    lng double precision,
    radius_km double precision
) RETURNS TABLE (
    id uuid,
    title text,
    short_description text,
    current_amount integer,
    goal_amount integer,
    mission_type mission_type,
    urgency mission_urgency,
    distance double precision
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.short_description,
        c.current_amount,
        c.goal_amount,
        c.mission_type,
        c.urgency,
        ST_DistanceSphere(
            c.location_coordinates::geometry,
            ST_MakePoint(lng, lat)::geometry
        ) / 1000 as distance
    FROM campaigns c
    WHERE ST_DWithin(
        c.location_coordinates::geometry,
        ST_MakePoint(lng, lat)::geometry,
        radius_km * 1000
    )
    AND c.status = 'active'
    ORDER BY distance;
END;
$$;

-- Função para obter estatísticas da campanha
CREATE OR REPLACE FUNCTION get_campaign_statistics(campaign_uuid uuid)
RETURNS TABLE (
    total_donors bigint,
    total_donations bigint,
    average_donation decimal,
    largest_donation decimal,
    donation_velocity decimal, -- doações por dia
    estimated_completion_days integer
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    WITH campaign_stats AS (
        SELECT 
            COUNT(DISTINCT donor_id) as unique_donors,
            COUNT(*) as donation_count,
            COALESCE(AVG(amount), 0) as avg_donation,
            COALESCE(MAX(amount), 0) as max_donation,
            COALESCE(SUM(amount), 0) as total_raised,
            MIN(created_at) as first_donation,
            MAX(created_at) as last_donation,
            (SELECT goal_amount FROM campaigns WHERE id = campaign_uuid) as target
        FROM donations
        WHERE campaign_id = campaign_uuid AND status = 'completed'
    )
    SELECT 
        unique_donors,
        donation_count,
        ROUND(avg_donation, 2),
        max_donation,
        ROUND(donation_count::decimal / GREATEST(1, EXTRACT(DAY FROM (last_donation - first_donation))), 2),
        CASE 
            WHEN total_raised >= target THEN 0
            WHEN donation_count = 0 THEN NULL
            ELSE CEIL((target - total_raised) / (total_raised / GREATEST(1, EXTRACT(DAY FROM (last_donation - first_donation)))))::integer
        END
    FROM campaign_stats;
END;
$$;
