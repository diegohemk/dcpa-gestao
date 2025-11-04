# 🚀 Guia de Deploy no Coolify - DCPA Gestão

Este guia mostra como configurar o deploy automático do DCPA Gestão no Coolify usando GitHub.

## 📋 Pré-requisitos

- ✅ VPS com Coolify instalado e funcionando
- ✅ Repositório GitHub: `https://github.com/diegohemk/dcpa-gestao.git`
- ✅ Acesso ao painel do Coolify na sua VPS

## 🔧 Passo a Passo - Configuração no Coolify

### 1. **Acessar o Coolify**

1. Acesse o painel do Coolify na sua VPS (geralmente `http://seu-ip:8000` ou domínio configurado)
2. Faça login no Coolify

### 2. **Criar Novo Resource**

1. No painel do Coolify, clique em **"New Resource"** ou **"Novo Recurso"**
2. Escolha **"Docker Compose"** ou **"GitHub Repository"** (dependendo da versão do Coolify)

### 3. **Configurar Conexão com GitHub**

#### Opção A: Via Interface Web (Recomendado)

1. **GitHub Integration:**
   - Clique em **"Connect GitHub"** ou **"GitHub Repository"**
   - Autorize o Coolify a acessar seu GitHub
   - Selecione o repositório: `diegohemk/dcpa-gestao`
   - Escolha a branch: `main`

#### Opção B: Via Git URL

1. **Repository URL:**
   ```
   https://github.com/diegohemk/dcpa-gestao.git
   ```
2. **Branch:** `main`
3. **Build Pack:** `Dockerfile` (detectado automaticamente)

### 4. **Configurações do Build**

Configure as seguintes opções:

| Campo | Valor |
|-------|-------|
| **Build Pack** | `Dockerfile` |
| **Dockerfile Path** | `Dockerfile` (raiz do projeto) |
| **Build Command** | (Não necessário - já no Dockerfile) |
| **Port** | `80` |
| **Auto Deploy** | ✅ Habilitado (deploy automático em push) |

### 5. **Variáveis de Ambiente**

Adicione as seguintes variáveis de ambiente no Coolify:

```
VITE_SUPABASE_URL=https://abwwaojdxdlcgbskinzo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFid3dhb2pkeGRsY2dic2tpbnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDMyMzUsImV4cCI6MjA3NTYxOTIzNX0.-d1H9shNP3Wa0vHga1C1lt6QjGWjQLsGbjdYuu3AcgE
```

**Como adicionar:**
1. Vá em **"Environment Variables"** ou **"Variáveis de Ambiente"**
2. Clique em **"Add Variable"**
3. Adicione cada variável uma por uma
4. **IMPORTANTE:** Marque como **"Build-time variable"** ou **"Runtime variable"** conforme necessário

> ⚠️ **Nota:** Como são variáveis `VITE_*`, elas precisam estar disponíveis durante o build. No Coolify, isso geralmente significa configurá-las como variáveis de build.

### 6. **Configurações de Rede e Domínio**

1. **Porta:** `80` (já configurada no Dockerfile)
2. **Domínio (opcional):**
   - Se tiver domínio, configure em **"Domains"**
   - Exemplo: `dcpa.seusite.com.br`
3. **SSL/HTTPS:**
   - O Coolify pode configurar SSL automaticamente via Let's Encrypt
   - Habilite em **"SSL"** ou **"HTTPS"**

### 7. **Deploy Inicial**

1. Clique em **"Deploy"** ou **"Deploy Now"**
2. O Coolify irá:
   - Clonar o repositório do GitHub
   - Construir a imagem Docker usando o Dockerfile
   - Iniciar o container com nginx
   - Expor a aplicação na porta configurada

### 8. **Verificar Deploy**

1. Aguarde o build completar (pode levar alguns minutos)
2. Verifique os logs em **"Logs"** ou **"View Logs"**
3. Acesse a aplicação pela URL fornecida pelo Coolify

## 🔄 Deploy Automático (Auto Deploy)

Com o **Auto Deploy** habilitado, toda vez que você fizer push para o branch `main` no GitHub:

1. O Coolify detecta automaticamente a mudança
2. Inicia um novo build
3. Faz deploy da nova versão
4. (Opcional) Encerra a versão antiga após sucesso

## 📝 Estrutura do Projeto

O projeto já está configurado com:

```
dcpa-gestao/
├── Dockerfile          # Build multi-stage (Node + Nginx)
├── nginx.conf          # Configuração do Nginx para SPA
├── package.json        # Dependências e scripts
├── vite.config.ts      # Configuração do Vite
└── src/                # Código fonte React
```

## 🐳 Dockerfile

O Dockerfile usa build multi-stage:

1. **Stage 1 (builder):** Instala dependências e faz build com Vite
2. **Stage 2 (production):** Copia arquivos buildados para Nginx Alpine

## 🔍 Troubleshooting

### Problema: Build falha

**Solução:**
- Verifique os logs do build no Coolify
- Confirme que as variáveis de ambiente estão configuradas
- Verifique se o Dockerfile está na raiz do projeto

### Problema: Variáveis VITE_ não funcionam

**Solução:**
- Variáveis `VITE_*` precisam estar disponíveis durante o build
- No Coolify, configure como variáveis de build-time
- Alternativamente, você pode criar um arquivo `.env` no repositório (não recomendado para secrets)

### Problema: Página em branco ou erro 404

**Solução:**
- Verifique se o `nginx.conf` está sendo copiado corretamente
- Confirme que o build gerou arquivos na pasta `dist/`
- Verifique os logs do container nginx

### Problema: Deploy automático não funciona

**Solução:**
- Verifique se o webhook do GitHub está configurado no Coolify
- Confirme que está fazendo push para o branch `main`
- Verifique os logs do Coolify para erros de webhook

## 📚 Recursos Adicionais

- [Documentação do Coolify](https://coolify.io/docs)
- [Dockerfile do projeto](./Dockerfile)
- [Configuração Nginx](./nginx.conf)

## ✅ Checklist Final

- [ ] Repositório conectado ao Coolify
- [ ] Branch `main` selecionado
- [ ] Variáveis de ambiente configuradas
- [ ] Porta 80 configurada
- [ ] Auto Deploy habilitado
- [ ] Deploy inicial executado com sucesso
- [ ] Aplicação acessível via URL do Coolify
- [ ] SSL/HTTPS configurado (opcional mas recomendado)

## 🎉 Pronto!

Após seguir todos os passos, sua aplicação estará rodando na VPS com deploy automático do GitHub!

