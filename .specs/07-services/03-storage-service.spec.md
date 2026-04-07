# 7.3 storageService

## Descrição
Implementar camada de serviço para operações de upload e gerenciamento de imagens no Firebase Storage.

## Dependências
- 1.2 Configuração do Firebase

## Etapas

### Etapa 1 — Criar arquivo de serviço
- Criar `src/services/storageService.js`
- Importar `storage` de `src/config/firebase.js`
- Importar métodos: `ref`, `uploadBytes`, `getDownloadURL`, `deleteObject`

### Etapa 2 — uploadImage(file, path)
- Criar referência no Storage: `ref(storage, path)`
  - Path sugerido: `posts/{postId}/{filename}` ou `posts/covers/{timestamp}_{filename}`
- Fazer upload com `uploadBytes(storageRef, file)`
- Retornar URL pública via `getDownloadURL(snapshot.ref)`

### Etapa 3 — deleteImage(path)
- Criar referência: `ref(storage, path)`
- Deletar com `deleteObject(storageRef)`
- Tratar erro caso arquivo não exista (não lançar exceção)

### Etapa 4 — getImageURL(path)
- Criar referência: `ref(storage, path)`
- Retornar URL com `getDownloadURL(storageRef)`

### Etapa 5 — Validações utilitárias
- `validateImageFile(file)`:
  - Verificar tipo: apenas `image/jpeg`, `image/png`, `image/webp`
  - Verificar tamanho: máximo 5MB
  - Retornar `{ valid: boolean, error?: string }`

## Critérios de Aceite
- [ ] `uploadImage` faz upload e retorna URL pública
- [ ] `deleteImage` remove arquivo do Storage sem erro em caso de inexistência
- [ ] `getImageURL` retorna URL válida
- [ ] Validação rejeita arquivos não-imagem e maiores que 5MB
- [ ] Paths são organizados logicamente no Storage
