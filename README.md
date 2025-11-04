# DCPA Gestão - Sistema de Gestão Ambiental

Sistema de gestão para a Diretoria de Controle e Proteção Ambiental (DCPA), desenvolvido com React, TypeScript e Supabase.

## 🚀 Deploy no Vercel

### Pré-requisitos
- Conta no Vercel
- Projeto conectado ao GitHub/GitLab/Bitbucket

### Passos para Deploy

1. **Conectar Repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte seu repositório

2. **Configurações do Projeto**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Variáveis de Ambiente**
   ```
   VITE_SUPABASE_URL=https://abwwaojdxdlcgbskinzo.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFid3dhb2pkeGRsY2dic2tpbnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDMyMzUsImV4cCI6MjA3NTYxOTIzNX0.-d1H9shNP3Wa0vHga1C1lt6QjGWjQLsGbjdYuu3AcgE
   ```

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o processo de build
   - Acesse a URL fornecida

### 🔧 Configuração Local

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### 📱 Funcionalidades

- ✅ **Autenticação**: Login seguro com Supabase
- ✅ **Dashboard**: Visão geral dos projetos e atividades
- ✅ **Projetos**: Gestão completa de projetos ambientais
- ✅ **Atividades**: Controle de atividades e tarefas
- ✅ **Servidores**: Gestão da equipe
- ✅ **Gerências**: Organização por departamentos
- ✅ **Favoritos**: Projetos em destaque personalizados
- ✅ **Alteração de Senha**: Segurança da conta

### 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deploy**: Vercel
- **Build**: Vite

### 📊 Banco de Dados

O sistema utiliza Supabase com as seguintes tabelas principais:
- `projetos` - Projetos ambientais
- `atividades` - Atividades e tarefas
- `servidores` - Equipe da DCPA
- `gerencias` - Departamentos
- `cursos` - Capacitações

### 🔐 Segurança

- Autenticação via Supabase Auth
- RLS (Row Level Security) habilitado
- Senhas criptografadas
- Rotas protegidas

### 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.