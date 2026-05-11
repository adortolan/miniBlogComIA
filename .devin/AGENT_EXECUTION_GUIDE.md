# Guia de Execução para Agentes - Migração TypeScript com PRs e Testes Web

## Instruções para Execução Autônoma

Este guia fornece instruções específicas para agentes de IA executarem a migração TypeScript com Pull Requests e Testes Web Manuais em cada fase.

## Setup Inicial do Agente

### 1. Preparação do Ambiente
```bash
# Verificar branch atual
git branch --show-current

# Garantir que está em develop
git checkout develop
git pull origin develop

# Verificar estado atual dos testes
npm test
```

### 2. Validação Pré-Migração
- Confirmar que todos os testes passam
- Verificar que não há alterações não commitadas
- Confirmar versão do Node.js (>= 18)

## Estrutura de Execução por Fases com PRs e Testes Web

### Fluxo Padrão para Cada Fase

1. **Preparação:** Criar branch específico da fase
2. **Execução:** Realizar mudanças da fase
3. **Commit:** Commit das mudanças com mensagem padrão
4. **Push:** Push para branch remoto
5. **Pull Request:** Criar PR com template padrão
6. **CI/CD:** Aguardar testes automatizados passarem
7. **Testes Web:** Executar testes manuais no navegador
8. **Validação:** Verificar critérios de sucesso da fase
9. **Report:** Reportar resultados e aguardar aprovação
10. **Merge:** Merge PR para develop
11. **Preparação Próxima Fase:** Criar branch para próxima fase

## Instruções por Fase

### FASE 1: Preparação e Configuração

**Preparação:**
```bash
git checkout -b feature/ts-phase-1-config
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 1.1-1.5

**Commit e Push:**
```bash
git add .
git commit -m "feat(phase-1): adicionar configuração TypeScript base

- Instalar dependências TypeScript
- Criar tsconfig.json e tsconfig.node.json
- Migrar vite.config.js para TypeScript
- Atualizar ESLint para TypeScript
- Adicionar scripts de type-check e build

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-1-config
```

**Pull Request:** Criar PR com título e descrição do plano

**Testes Web:** Consultar plano seção 1.8

**Report:** "FASE 1 concluída. PR criado, testes web executados, aguardando aprovação."

**Pós-Merge:**
```bash
git checkout develop
git merge feature/ts-phase-1-config
git push origin develop
```

---

### FASE 2: Definição de Tipos Base

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-2-types
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 2.1-2.2

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 2 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 3: Utils e Config

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-3-utils
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 3.1-3.2

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 3 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 4: Services

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-4-services
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 4.1

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 4 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 5: Contexts

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-5-contexts
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 5.1

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 5 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 6: Hooks

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-6-hooks
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 6.1-6.2

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 6 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 7: Components

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-7-components
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 7.1-7.2

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 7 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 8: Pages

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-8-pages
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 8.1

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 8 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 9: Arquivos Principais

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-9-main
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 9.1-9.2

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 9 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 10: Testes

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-10-tests
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 10.1-10.3

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 10 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 11: Validação Final

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-11-validation
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 11.1-11.2

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 11 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 12: Limpeza e Refinamento

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-12-cleanup
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 12.1-12.4

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 12 concluída. PR criado, testes web executados, aguardando aprovação."

---

### FASE 13: Documentação e Finalização

**Preparação:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ts-phase-13-final
```

**Execução:** Consultar `TYPESCRIPT_MIGRATION_PLAN.md` seção 13.1-13.2

**Commit, Push, PR, Testes Web:** Seguir padrão da FASE 1

**Report:** "FASE 13 concluída. PR criado, testes web executados, aguardando aprovação."

**Merge Final:**
```bash
git checkout develop
git merge feature/ts-phase-13-final
git push origin develop

# Opcional: Merge para main
git checkout main
git merge develop
git push origin main

# Limpar branches
git branch -D feature-ts-phase-*
git push origin --delete feature-ts-phase-*
```

## Protocolo de Comunicação

### Mensagens Padrão por Fase

**Início da Fase:**
```
Iniciando FASE X: [Nome da Fase]
- Branch: feature/ts-phase-X-[nome]
- Objetivo: [breve descrição]
```

**Pós-Commit:**
```
Commit realizado: [mensagem do commit]
- Arquivos modificados: [lista]
- Branch pronto para push
```

**Pós-Push:**
```
Push realizado para origin/feature-ts-phase-X-[nome]
- PR criado: [título do PR]
- Link: [URL do PR]
```

**Pós-Testes Web:**
```
Testes web concluídos para FASE X:
✅ [Validação 1]
✅ [Validação 2]
❌ [Validação com problema - se houver]
Resultado: [APROVADO/REPROVADO]
```

**Aguardando Aprovação:**
```
Aguardando aprovação do PR FASE X
- PR: [título]
- Link: [URL]
- Status CI/CD: [passing/failing]
```

**Pós-Merge:**
```
FASE X mergeada para develop com sucesso
- Merge commit: [hash]
- Branch develop atualizado
- Preparando próxima fase
```

**Erro/Bloqueio:**
```
ERRO na FASE X: [descrição do erro]
- Tipo: [tipo de erro]
- Tentativa de resolução: [descrição]
- Próxima ação: [solicitar ajuda/proposta de solução]
```

## Tratamento de Erros

### Erros de Tipo
```typescript
// Adicionar tipagem apropriada
// Ou usar any temporariamente com comentário
const data: any = response; // TODO: fix type
```

### Erros de Build
- Verificar configuração do tsconfig.json
- Verificar se todos os arquivos foram migrados
- Verificar imports e exports

### Erros de Teste
- Atualizar mocks para TypeScript
- Adicionar tipos às variáveis de teste
- Verificar assertions

### Erros em Testes Web
- Investigar funcionalidade específica
- Verificar console do navegador
- Reportar para decisão humana se necessário

### Rollback por Fase
```bash
# Reverter merge da fase
git checkout develop
git revert <merge-commit-hash>

# Ou voltar ao estado antes da fase
git checkout develop
git reset --hard <commit-before-phase>
```

## Padrões de Código TypeScript

### Interfaces vs Types
- Usar `interface` para objetos que podem ser extendidos
- Usar `type` para unions, tuples, tipos primitivos

### Naming Conventions
- Interfaces: PascalCase (e.g., `PostCardProps`)
- Types: PascalCase (e.g., `Post`, `FirebaseUser`)
- Generics: T (e.g., `UseMutationResult<T>`)

### Imports
- Sempre usar imports nomeados de types
- Agrupar imports: React → third-party → local types → local components

### Comments
- Remover JSDoc se o tipo já é auto-explicativo
- Manter JSDoc apenas para lógica complexa

## Validações por Fase

### FASE 1: Configuração
- [ ] TypeScript instalado
- [ ] tsconfig.json criado
- [ ] Vite config migrado
- [ ] ESLint atualizado
- [ ] Type-check executando

### FASE 2: Tipos
- [ ] Types criados
- [ ] Types reconhecidos
- [ ] Zero erros de sintaxe

### FASE 3-10: Migração
- [ ] Arquivos migrados
- [ ] Type-check passando
- [ ] Testes unitários passando
- [ ] Funcionalidades testadas manualmente

### FASE 11: Validação
- [ ] Type-check sem erros
- [ ] Lint sem erros
- [ ] Todos os testes passando
- [ ] Build funcionando
- [ ] Todas as features funcionando

### FASE 12: Limpeza
- [ ] PropTypes removido
- [ ] Zero arquivos JS/JSX
- [ ] Comentários redundantes removidos

### FASE 13: Finalização
- [ ] Documentação atualizada
- [ ] Projeto pronto para produção

## Tempo Estimado por Fase

- FASE 1: 30-45 min execução + 30-45 min testes web
- FASE 2: 1-2 horas execução + 30-45 min testes web
- FASE 3: 1 hora execução + 30-45 min testes web
- FASE 4: 1-2 horas execução + 30-45 min testes web
- FASE 5: 1 hora execução + 30-45 min testes web
- FASE 6: 2-3 horas execução + 30-45 min testes web
- FASE 7: 3-4 horas execução + 30-45 min testes web
- FASE 8: 2-3 horas execução + 30-45 min testes web
- FASE 9: 30 min execução + 30-45 min testes web
- FASE 10: 2-3 horas execução + 30-45 min testes web
- FASE 11: 1 hora execução + 30-45 min testes web
- FASE 12: 1 hora execução + 30-45 min testes web
- FASE 13: 30 min execução + 30-45 min testes web

**Total:** 18-26 horas + tempo de aprovação de PRs

## Notas Importantes

1. **NUNCA pular fases:** Cada fase depende da anterior
2. **SEMPRE validar:** Não prosseguir sem validar checkpoint
3. **Commits freqüentes:** Facilita rollback se necessário
4. **Documentar tudo:** Registrar desvios e decisões
5. **Pedir ajuda:** Se encontrar erro não documentado

## Referência Principal

Para instruções detalhadas de cada fase, consulte:
- `TYPESCRIPT_MIGRATION_PLAN.md` - Plano completo com detalhes técnicos
- `TYPESCRIPT_MIGRATION_CHECKLIST.md` - Checklist de acompanhamento