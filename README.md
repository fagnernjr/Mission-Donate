# Mission Donate

Plataforma de doações para missionários desenvolvida com Next.js 14 e Supabase.

## Tecnologias Principais

- Next.js 14 (App Router)
- TypeScript
- Supabase (Banco de dados e Autenticação)
- Tailwind CSS
- Shadcn/ui (Componentes)

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.local.example` para `.env.local`
- Preencha as variáveis com suas credenciais

4. Configure o Supabase:
- Crie um projeto no [Supabase](https://supabase.com)
- Copie as credenciais para o `.env.local`

5. Rode o projeto:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── app/                 # App router e páginas
├── components/          # Componentes React reutilizáveis
├── lib/                 # Utilitários e configurações
│   └── supabase.ts     # Cliente Supabase
├── hooks/              # Custom hooks
└── types/              # Definições de tipos TypeScript
```

## Funcionalidades Principais

- Autenticação de usuários
- Criação e gestão de campanhas
- Dashboard para missionários
- Página pública de campanhas
