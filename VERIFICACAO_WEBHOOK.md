# 🔍 Verificação do Webhook no Coolify

## 📋 O que verificar no Coolify

### 1. **Acessar Git Source**

1. Faça login no Coolify: `http://linhasdemapeamento.com.br:8000`
2. Navegue até: **Dashboard** > **dcpa** > **production** > **[sua aplicação]**
3. Clique em **"Git Source"** no menu lateral

### 2. **Verificar Configurações**

Na página **Git Source**, verifique:

#### ✅ Repository
- Deve mostrar: `diegohemk/dcpa-gestao`
- Ou URL completa: `https://github.com/diegohemk/dcpa-gestao.git`

#### ✅ Branch
- Deve estar configurado como: `main`

#### ✅ Auto Deploy
- Toggle deve estar **ON** (habilitado/verde)
- Se estiver OFF, habilite clicando no toggle

#### ✅ Webhook URL
- Deve aparecer uma URL como: `http://linhasdemapeamento.com.br:8000/api/v1/webhooks/...`
- **COPIE ESSA URL** - você precisará dela para configurar no GitHub

### 3. **Verificar Webhooks no GitHub**

1. Acesse: `https://github.com/diegohemk/dcpa-gestao/settings/hooks`
2. Verifique se existe um webhook configurado
3. Se não existir, clique em **"Add webhook"**
4. Configure:
   - **Payload URL**: Cole a URL do webhook do Coolify
   - **Content type**: `application/json`
   - **Secret**: (deixe vazio ou use o secret do Coolify se houver)
   - **Which events**: Selecione **"Just the push event"**
   - **Active**: ✅ Marcado
5. Clique em **"Add webhook"**

### 4. **Testar o Webhook**

Após configurar:

1. No GitHub, clique no webhook que você criou
2. Vá em **"Recent Deliveries"**
3. Faça um pequeno commit e push:
   ```bash
   git add .
   git commit -m "Teste webhook"
   git push origin main
   ```
4. Volte ao GitHub e verifique se apareceu uma nova entrega (delivery)
5. Se aparecer um ✅ verde, o webhook está funcionando
6. Se aparecer um ❌ vermelho, clique para ver o erro

### 5. **Verificar Deployments**

No Coolify:

1. Vá em **"Deployments"** no menu da aplicação
2. Verifique o histórico de deploys
3. O último deploy deve corresponder ao último commit do GitHub
4. Se houver um deploy antigo, clique em **"Redeploy"** para forçar atualização

## 🔧 Troubleshooting

### Problema: Auto Deploy está OFF

**Solução:**
1. Vá em **Git Source**
2. Habilite o toggle **Auto Deploy**
3. Salve as alterações

### Problema: Webhook não existe no GitHub

**Solução:**
1. Copie a URL do webhook do Coolify (Git Source)
2. Crie um novo webhook no GitHub com essa URL
3. Configure para eventos "push"

### Problema: Webhook retorna erro 404 ou 500

**Solução:**
1. Verifique se a URL do webhook está correta
2. Verifique se o Coolify está acessível (`http://linhasdemapeamento.com.br:8000`)
3. Tente fazer um redeploy manual primeiro

### Problema: Webhook funciona mas não inicia deploy

**Solução:**
1. Verifique se o Auto Deploy está habilitado
2. Verifique se está fazendo push para o branch correto (`main`)
3. Veja os logs do Coolify em **"Logs"** para identificar erros

## 📝 Checklist de Verificação

- [ ] Git Source configurado com repositório correto
- [ ] Branch configurado como `main`
- [ ] Auto Deploy habilitado (ON)
- [ ] Webhook URL copiada do Coolify
- [ ] Webhook criado no GitHub com a URL correta
- [ ] Webhook configurado para eventos "push"
- [ ] Webhook ativo e funcionando (teste feito)
- [ ] Último deploy corresponde ao último commit

## 🎯 URLs Importantes

- **Coolify**: `http://linhasdemapeamento.com.br:8000`
- **GitHub Repo**: `https://github.com/diegohemk/dcpa-gestao`
- **GitHub Webhooks**: `https://github.com/diegohemk/dcpa-gestao/settings/hooks`
- **Aplicação**: `http://dcpa.linhasdemapeamento.com.br`

