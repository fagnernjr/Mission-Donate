-- Criar tipo de usuário se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('missionary', 'donor', 'admin');
    END IF;
END $$;

-- Criar tabela de campanhas
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    goal NUMERIC(10, 2) NOT NULL,
    current_amount NUMERIC(10, 2) DEFAULT 0,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    end_date DATE,
    image_url TEXT,
    slug TEXT UNIQUE NOT NULL
);

-- Criar tabela de doações
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    donor_id UUID REFERENCES auth.users(id),
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')),
    payment_intent_id TEXT UNIQUE,
    donor_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de assinaturas
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    donor_id UUID REFERENCES auth.users(id),
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
    stripe_subscription_id TEXT UNIQUE,
    interval TEXT CHECK (interval IN ('month', 'year')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurações de Storage
CREATE EXTENSION IF NOT EXISTS "storage";

-- Criar tabela storage.objects se não existir
CREATE TABLE IF NOT EXISTS storage.objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bucket_id TEXT NOT NULL,
    name TEXT NOT NULL,
    owner UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    path_tokens TEXT[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
    version TEXT
);

-- Criar bucket para imagens de campanhas
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-images', 'campaign-images', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar CORS e limites para o bucket
UPDATE storage.buckets
SET public = true,
    file_size_limit = 5242880, -- 5MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    cors_origins = ARRAY['*']
WHERE id = 'campaign-images';

-- Políticas de Storage
CREATE POLICY "Usuários autenticados podem fazer upload de imagens" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'campaign-images' AND
  owner = auth.uid()
);

CREATE POLICY "Qualquer pessoa pode visualizar imagens" ON storage.objects
FOR SELECT USING (
  bucket_id = 'campaign-images'
);

CREATE POLICY "Usuários podem deletar suas próprias imagens" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'campaign-images' AND
  owner = auth.uid()
);

-- Políticas de segurança para campanhas
CREATE POLICY "Usuários podem criar suas próprias campanhas" 
ON campaigns FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver todas as campanhas ativas" 
ON campaigns FOR SELECT 
USING (is_active = TRUE);

-- Políticas de segurança para doações
CREATE POLICY "Usuários podem ver suas próprias doações" 
ON donations FOR SELECT 
USING (auth.uid() = donor_id);

CREATE POLICY "Administradores podem ver todas as doações" 
ON donations FOR SELECT 
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Políticas de segurança para assinaturas
CREATE POLICY "Usuários podem ver suas próprias assinaturas" 
ON subscriptions FOR SELECT 
USING (auth.uid() = donor_id);

-- Função para atualizar valor atual da campanha
CREATE OR REPLACE FUNCTION update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE campaigns
        SET current_amount = current_amount + NEW.amount
        WHERE id = NEW.campaign_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar valor da campanha quando uma doação é concluída
CREATE TRIGGER update_campaign_total
AFTER INSERT OR UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_campaign_amount();

-- Adicionar campos de atualização
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE donations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_is_active ON campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_campaign_id ON subscriptions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_donor_id ON subscriptions(donor_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
    BEFORE UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
