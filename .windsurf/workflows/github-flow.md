---
description: Seguir as práticas do GitHub Flow para desenvolvimento
---

# GitHub Flow - Workflow de Desenvolvimento

Este workflow descreve o processo completo de desenvolvimento seguindo as melhores práticas do GitHub Flow.

## 1. Sincronizar com o repositório remoto

Antes de iniciar qualquer trabalho, certifique-se de estar com a branch `main` atualizada:

```bash
git checkout main
git pull origin main
```

## 2. Criar uma nova branch de feature/fix

Crie uma branch descritiva a partir da `main`:

```bash
git checkout -b feature/nome-da-funcionalidade
```

**Convenção de nomes de branches:**
- `feature/` - Novas funcionalidades (ex: `feature/auth-google`)
- `fix/` - Correções de bugs (ex: `fix/login-redirect`)
- `hotfix/` - Correções urgentes em produção (ex: `hotfix/security-patch`)
- `refactor/` - Refatorações (ex: `refactor/posts-service`)
- `docs/` - Documentação (ex: `docs/readme-update`)

## 3. Desenvolver e commitar

Faça commits atômicos e descritivos seguindo o padrão Conventional Commits:

```bash
git add .
git commit -m "feat: adiciona autenticação com Google"
```

**Tipos de commits:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `refactor:` - Refatoração de código
- `docs:` - Documentação
- `style:` - Formatação, espaços em branco
- `test:` - Adição/correção de testes
- `chore:` - Tarefas de build, configs

## 4. Executar testes localmente

Antes de fazer push, execute os testes localmente:

// turbo
```bash
npm run lint
```

// turbo
```bash
npm test
```

// turbo
```bash
npm run build
```

## 5. Fazer push da branch

Envie sua branch para o repositório remoto:

```bash
git push origin feature/nome-da-funcionalidade
```

## 6. Abrir Pull Request (PR)

1. Acesse o GitHub e abra um Pull Request da sua branch para `main`
2. Preencha o template de PR com:
   - **Título descritivo** (ex: "feat: Implementa autenticação com Google")
   - **Descrição detalhada** do que foi feito
   - **Screenshots** (se aplicável)
   - **Como testar**
   - **Checklist** de verificação

**Template de PR:**
```markdown
## 📝 Descrição
Breve descrição das mudanças implementadas.

## 🎯 Objetivo
Por que essa mudança é necessária?

## 🧪 Como testar
1. Passo 1
2. Passo 2
3. Resultado esperado

## 📸 Screenshots
(Se aplicável)

## ✅ Checklist
- [ ] Código testado localmente
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] ESLint sem erros
- [ ] Build executado com sucesso
```

## 7. Code Review

Aguarde a revisão de código:
- Responda aos comentários
- Faça as alterações solicitadas
- Commit e push das correções

```bash
git add .
git commit -m "fix: corrige feedback do code review"
git push origin feature/nome-da-funcionalidade
```

## 8. CI/CD - Validação Automatizada

O pipeline de CI/CD será executado automaticamente:
1. ✅ Lint (ESLint)
2. ✅ Testes (Jest/Vitest)
3. ✅ Build
4. ✅ Deploy Preview (Firebase Hosting - apenas para PRs)

Aguarde todos os checks passarem antes de fazer merge.

## 9. Merge do Pull Request

Após aprovação e CI verde:
1. **Squash and Merge** - Recomendado para manter histórico limpo
2. Delete a branch após o merge
3. O deploy para produção será acionado automaticamente

## 10. Limpeza local

Após merge, limpe suas branches locais:

```bash
git checkout main
git pull origin main
git branch -d feature/nome-da-funcionalidade
```

## 11. Hotfix (Correções Urgentes)

Para correções urgentes em produção:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/descricao-do-problema
# Faça as correções necessárias
git add .
git commit -m "hotfix: corrige problema crítico"
git push origin hotfix/descricao-do-problema
```

Abra PR e solicite revisão rápida. Após merge, a correção será deployada automaticamente.

---

## 📋 Resumo do Fluxo

```
main → criar branch → desenvolver → commit → push → 
PR → code review → CI/CD → merge → deploy → deletar branch
```

## 🔒 Regras de Proteção da Branch Main

- ❌ Push direto bloqueado
- ✅ Requer PR
- ✅ Requer aprovação de 1+ revisores
- ✅ Requer CI/CD passar
- ✅ Requer branch atualizada antes do merge

## 🚀 Ambientes de Deploy

| Branch   | Ambiente   | URL                              | Deploy        |
|----------|------------|----------------------------------|---------------|
| `main`   | Production | https://your-app.web.app         | Automático    |
| `develop`| Staging    | https://your-app-staging.web.app | Automático    |
| PR       | Preview    | URL temporária                   | Por PR        |

## 💡 Boas Práticas

1. **Branches pequenas** - Prefira PRs menores e focados
2. **Commits frequentes** - Commit early, commit often
3. **Descrições claras** - Facilita o code review
4. **Testes sempre** - Nunca pule os testes
5. **Sincronize regularmente** - Evite conflitos grandes
6. **Delete branches** - Mantenha o repositório limpo
7. **Code review construtivo** - Seja gentil e específico
8. **Documente decisões** - Use comments no PR para decisões importantes
