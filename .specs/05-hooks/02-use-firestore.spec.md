# 5.2 useFirestore

## Descrição
Criar hook customizado genérico para operações CRUD no Firestore.

## Dependências
- 1.2 Configuração do Firebase

## Etapas

### Etapa 1 — Criar hook useFirestore
- Criar `src/hooks/useFirestore.js`
- Receber nome da coleção como parâmetro: `useFirestore(collectionName)`

### Etapa 2 — Implementar addDocument
- `addDocument(data)`: adiciona documento à coleção
- Adicionar `createdAt: serverTimestamp()` automaticamente
- Retornar referência do documento criado

### Etapa 3 — Implementar updateDocument
- `updateDocument(id, data)`: atualiza campos do documento
- Adicionar `updatedAt: serverTimestamp()` automaticamente
- Merge parcial (não sobrescrever campos não informados)

### Etapa 4 — Implementar deleteDocument
- `deleteDocument(id)`: remove documento da coleção

### Etapa 5 — Implementar listener em tempo real
- `subscribeToCollection(queryConstraints, callback)`:
  - Usar `onSnapshot` para escutar mudanças
  - Aceitar constraints opcionais (`where`, `orderBy`, `limit`)
  - Retornar função de `unsubscribe` para cleanup

### Etapa 6 — Gerenciar estado
- Estado: `loading`, `error`
- Resetar estados a cada operação
- Cleanup do listener no `useEffect` return

### Etapa 7 — Retornar interface do hook
- Retornar: `{ addDocument, updateDocument, deleteDocument, subscribeToCollection, loading, error }`

## Critérios de Aceite
- [ ] CRUD genérico funciona para qualquer coleção
- [ ] `createdAt` e `updatedAt` são adicionados automaticamente
- [ ] Listener em tempo real funciona e faz cleanup correto
- [ ] `loading` e `error` refletem o estado das operações
- [ ] Hook é reutilizável para coleções diferentes
