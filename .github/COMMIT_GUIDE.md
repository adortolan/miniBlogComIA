# 📝 Guia de Commits - MiniBlog

## 🎯 Padrão: Conventional Commits

Todos os commits devem seguir o formato:

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

## 📋 Tipos Permitidos

### Features & Fixes
- **feat**: Nova funcionalidade
  ```
  feat(auth): add Google login
  feat(posts): implement markdown editor
  ```

- **fix**: Correção de bug
  ```
  fix(pagination): resolve infinite scroll issue
  fix(auth): handle token expiration
  ```

### Documentação & Estilo
- **docs**: Documentação
  ```
  docs: update README with setup instructions
  docs(api): add Firebase config guide
  ```

- **style**: Formatação (não afeta lógica)
  ```
  style: format code with prettier
  style(components): fix indentation
  ```

### Refatoração & Performance
- **refactor**: Refatoração
  ```
  refactor(hooks): extract auth logic to custom hook
  refactor: reorganize folder structure
  ```

- **perf**: Melhoria de performance
  ```
  perf(posts): optimize Firestore queries
  perf: implement lazy loading for images
  ```

### Testes & Builds
- **test**: Testes
  ```
  test(auth): add login component tests
  test: improve coverage for hooks
  ```

- **chore**: Manutenção
  ```
  chore: update dependencies
  chore(config): update tailwind config
  ```

- **ci**: CI/CD
  ```
  ci: add GitHub Actions workflows
  ci: update deployment config
  ```

## 🏷️ Escopos Sugeridos

- `auth`: Autenticação
- `posts`: Posts/CRUD
- `ui`: Interface/Componentes
- `hooks`: Custom Hooks
- `config`: Configurações
- `firebase`: Firebase/Backend
- `deps`: Dependências
- `tests`: Testes

## ✅ Exemplos Completos

### Commit Simples
```bash
git commit -m "feat(posts): add delete functionality"
```

### Commit com Corpo
```bash
git commit -m "feat(auth): add Google authentication

- Implement Firebase Google Auth
- Add login button component
- Update security rules
- Add user profile page"
```

### Commit com Breaking Change
```bash
git commit -m "feat(api)!: change post schema

BREAKING CHANGE: Posts now require 'slug' field.
Migration guide in docs/migrations/001-add-slug.md"
```

### Fix com Issue
```bash
git commit -m "fix(pagination): resolve infinite loop

Fixes #42"
```

## 🚫 Exemplos INCORRETOS

❌ `update code`  
✅ `refactor(hooks): optimize useAuth hook`

❌ `add new feature`  
✅ `feat(posts): add tag filtering`

❌ `fix bug`  
✅ `fix(auth): resolve token expiration issue`

❌ `WIP`  
✅ `chore: work in progress on settings page`

## 🔧 Configurar Git

### Alias Úteis
```bash
# Adicionar ao ~/.gitconfig
[alias]
  cm = commit -m
  cma = commit -am
  
  # Templates
  feat = "!f() { git commit -m \"feat($1): $2\"; }; f"
  fix = "!f() { git commit -m \"fix($1): $2\"; }; f"
```

**Uso:**
```bash
git feat auth "add Google login"
git fix posts "resolve date formatting"
```

### Commitizen (Opcional)
```bash
# Instalar
npm install -g commitizen
npm install -g cz-conventional-changelog

# Configurar
commitizen init cz-conventional-changelog --save-dev --save-exact

# Usar
git cz
```

## 📊 Validação Automática

### PR Title Validation
A pipeline valida automaticamente títulos de PRs:

✅ `feat(auth): add Google login`  
❌ `Add Google login`

### Commit Lint (Opcional)
```bash
# Instalar
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Configurar husky
npm install --save-dev husky
npx husky install
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

## 🎨 Mensagens Descritivas

### ✅ BOM
```
feat(posts): implement rich text editor

- Add TinyMCE integration
- Support images and links
- Add preview mode
- Update post schema
```

### ❌ RUIM
```
update
```

## 📏 Limites

- **Título:** Max 100 caracteres
- **Linha do corpo:** Max 72 caracteres
- **Descrição:** Clara e concisa

## 🔄 Workflow Típico

```bash
# 1. Criar branch
git checkout -b feat/google-auth

# 2. Fazer alterações
# ... código ...

# 3. Stage changes
git add src/components/LoginButton.jsx

# 4. Commit seguindo padrão
git commit -m "feat(auth): add Google login button"

# 5. Mais alterações
git add src/hooks/useAuth.js
git commit -m "feat(auth): implement useAuth hook"

# 6. Push
git push origin feat/google-auth

# 7. Abrir PR com título seguindo padrão
# Título: feat(auth): add Google authentication
```

## 🎯 Dicas

1. **Use o imperativo**: "add" não "added" ou "adds"
2. **Seja específico**: "fix login bug" → "fix(auth): resolve token expiration"
3. **Um commit = Uma mudança lógica**
4. **Teste antes de commitar**
5. **Use o corpo para explicar o "porquê"**

## 📚 Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Semantic Versioning](https://semver.org/)

---

**Seguir este guia garante:**
- ✅ PRs aprovados automaticamente
- ✅ Changelog automático
- ✅ Versionamento semântico
- ✅ Histórico limpo e navegável
