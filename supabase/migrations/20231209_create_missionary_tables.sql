-- Criar extensão para geolocalização
CREATE EXTENSION IF NOT EXISTS postgis;

-- Atualizar enum de roles
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'missionary';

-- Tabela de documentos
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('identity', 'mission_proof', 'certification', 'support')),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de missões
CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    objective TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'active', 'completed', 'suspended')),
    total_budget DECIMAL(10,2) NOT NULL,
    current_donations DECIMAL(10,2) DEFAULT 0,
    featured_image TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de localização
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    coordinates GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de mídia
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de necessidades da missão
CREATE TABLE mission_needs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'partial', 'fulfilled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de itens do orçamento
CREATE TABLE budget_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    frequency TEXT CHECK (frequency IN ('one_time', 'monthly', 'yearly')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'funded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Adicionar campos ao perfil para missionários
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS document_number TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB,
ADD COLUMN IF NOT EXISTS bank_info JSONB;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_locations_mission_id ON locations(mission_id);
CREATE INDEX IF NOT EXISTS idx_media_mission_id ON media(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_needs_mission_id ON mission_needs(mission_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_mission_id ON budget_items(mission_id);
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations USING GIST(coordinates);

-- Políticas de segurança

-- Documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Documentos visíveis pelo próprio usuário"
ON documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem gerenciar seus documentos"
ON documents FOR ALL
USING (auth.uid() = user_id);

-- Missions
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Missões são visíveis publicamente quando ativas"
ON missions FOR SELECT
USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Missionários podem gerenciar suas missões"
ON missions FOR ALL
USING (auth.uid() = user_id);

-- Locations
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Localizações são visíveis publicamente"
ON locations FOR SELECT
USING (TRUE);

CREATE POLICY "Missionários podem gerenciar localizações de suas missões"
ON locations FOR ALL
USING (EXISTS (
    SELECT 1 FROM missions
    WHERE missions.id = locations.mission_id
    AND missions.user_id = auth.uid()
));

-- Media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mídia é visível publicamente"
ON media FOR SELECT
USING (TRUE);

CREATE POLICY "Missionários podem gerenciar mídia de suas missões"
ON media FOR ALL
USING (EXISTS (
    SELECT 1 FROM missions
    WHERE missions.id = media.mission_id
    AND missions.user_id = auth.uid()
));

-- Mission Needs
ALTER TABLE mission_needs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Necessidades são visíveis publicamente"
ON mission_needs FOR SELECT
USING (TRUE);

CREATE POLICY "Missionários podem gerenciar necessidades de suas missões"
ON mission_needs FOR ALL
USING (EXISTS (
    SELECT 1 FROM missions
    WHERE missions.id = mission_needs.mission_id
    AND missions.user_id = auth.uid()
));

-- Budget Items
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Itens do orçamento são visíveis publicamente"
ON budget_items FOR SELECT
USING (TRUE);

CREATE POLICY "Missionários podem gerenciar itens do orçamento de suas missões"
ON budget_items FOR ALL
USING (EXISTS (
    SELECT 1 FROM missions
    WHERE missions.id = budget_items.mission_id
    AND missions.user_id = auth.uid()
));
