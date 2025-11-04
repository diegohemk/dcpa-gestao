# 🔄 Como Configurar Auto-Deploy no Coolify

Se sua aplicação não está atualizando automaticamente quando você faz push no GitHub, siga estes passos:

## ✅ Passos para Configurar Auto-Deploy

### 1. **Verificar Configuração do Git Source**

1. Acesse o Coolify: `http://linhasdemapeamento.com.br:8000`
2. Vá até sua aplicação: **dcpa** > **production** > **[sua aplicação]**
3. Clique em **"Git Source"** no menu lateral

### 2. **Configurar Auto-Deploy**

Na página **Git Source**, verifique:

- ✅ **Branch**: Deve estar configurado como `main`
- ✅ **Auto Deploy**: Deve estar **habilitado** (toggle ON)
- ✅ **Webhook URL**: Deve estar configurado

### 3. **Configurar Webhook no GitHub**

Para que o GitHub notifique o Coolify quando houver push:

1. Acesse seu repositório no GitHub: `https://github.com/diegohemk/dcpa-gestao`
2. Vá em **Settings** > **Webhooks**
3. Clique em **"Add webhook"**
4. Configure:
   - **Payload URL**: Copie a URL do webhook que aparece no Coolify (Git Source)
   - **Content type**: `application/json`
   - **Which events**: Selecione **"Just the push event"**
   - **Active**: ✅ Marcado
5. Clique em **"Add webhook"**

### 4. **Verificar Status do Deploy**

No Coolify, verifique:

1. Vá em **"Deployments"** no menu da aplicação
2. Veja o histórico de deploys
3. Confirme se há um deploy para o commit mais recente: `6a6fa6f`

### 5. **Fazer Deploy Manual (Se Necessário)**

Se o auto-deploy não funcionar imediatamente:

1. No Coolify, vá na página da aplicação
2. Clique no botão **"Redeploy"** (ícone de refresh)
3. Isso fará um novo build com o código mais recente do GitHub

## 🔍 Troubleshooting

### Problema: Webhook não está funcionando

**Solução:**
1. Verifique se o webhook no GitHub está ativo (verde)
2. Clique no webhook e veja os "Recent Deliveries"
3. Se houver erros (vermelho), verifique a URL do webhook

### Problema: Auto-deploy está habilitado mas não atualiza

**Solução:**
1. Verifique se está fazendo push para o branch correto (`main`)
2. Verifique se o commit está realmente no GitHub
3. Tente fazer um push novamente: `git push origin main`
4. Se ainda não funcionar, faça um deploy manual

### Problema: Build falha

**Solução:**
1. Vá em **"Logs"** no Coolify
2. Verifique os logs do build para identificar o erro
3. Verifique se as variáveis de ambiente estão configuradas corretamente

## 📝 Comandos Úteis

Para verificar o último commit no GitHub:

```bash
git log --oneline -1
```

Para fazer push e forçar atualização:

```bash
git add .
git commit -m "Atualização"
git push origin main
```

## ✅ Checklist de Verificação

- [ ] Git Source configurado com branch `main`
- [ ] Auto Deploy habilitado no Coolify
- [ ] Webhook configurado no GitHub
- [ ] Webhook ativo e funcionando (verde no GitHub)
- [ ] Último commit está no GitHub
- [ ] Deploy manual funciona quando necessário

## 🎯 Configuração Recomendada

**Git Source:**
- Repository: `diegohemk/dcpa-gestao`
- Branch: `main`
- Auto Deploy: ✅ **ON**

**GitHub Webhook:**
- Event: `push`
- Active: ✅ **Sim**

Após configurar tudo, faça um teste:
1. Faça uma pequena alteração no código
2. Faça commit e push: `git push origin main`
3. Aguarde alguns segundos
4. Verifique no Coolify se um novo deploy foi iniciado automaticamente

