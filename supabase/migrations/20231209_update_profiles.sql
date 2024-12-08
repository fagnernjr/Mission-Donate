-- Atualizar a tabela de perfis para tornar full_name obrigatório
ALTER TABLE profiles
ALTER COLUMN full_name SET NOT NULL;

-- Adicionar restrição de tipo de usuário
ALTER TABLE profiles
ADD CONSTRAINT valid_role CHECK (role IN ('donor', 'organization'));

-- Adicionar índice para melhorar performance de busca por email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Atualizar as políticas de segurança
ALTER POLICY "Usuários podem ver seus próprios perfis" ON profiles
USING (auth.uid() = id);

ALTER POLICY "Usuários podem atualizar seus próprios perfis" ON profiles
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Adicionar política para permitir que organizações sejam visíveis publicamente
CREATE POLICY "Organizações são visíveis publicamente" ON profiles
FOR SELECT
USING (role = 'organization');
