-- Adicionar colunas faltantes na tabela campaigns
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS goal numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_amount numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS missionary_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS slug text;
