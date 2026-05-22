# 005 - Convenções e Padrões

**Tags:** conventions, patterns  
**Criado:** 2026-05-22

## Padrão de Hooks Customizados

Todos os hooks seguem o mesmo padrão:
```typescript
export const useXxx = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const action = async (...args) => {
    // 1. Validação local (throw + setError)
    // 2. setLoading(true), setError(null)
    // 3. try { ... } catch { setError(msg) } finally { setLoading(false) }
  };

  return { action, loading, error };
};
```

## Padrão de Resultado de Auth

Hooks de auth retornam `{ success: boolean, error?: string }`:
```typescript
interface LoginResult {
  success: boolean;
  error?: string;
}
```

## Tratamento de Erros Firebase

- Switch por `authErr.code` para erros de auth
- Mensagens em português para o usuário
- Detecção especial de CORS/network errors com mensagens descritivas
- Pattern: `if (code === 'unavailable' || message.includes('CORS'))`

## Tipagem

- **Strict mode** habilitado no tsconfig
- Sem uso de `any` (regra do projeto)
- Tipos centralizados em `src/types/index.ts`
- DTOs separados: `CreatePostDTO`, `UpdatePostDTO`
- Interface de serviço: `PostService`
- Props tipadas em cada componente

## Estilização

- **TailwindCSS** exclusivamente (sem CSS modules)
- Theme dark por padrão: fundo `bg-dark-800`, texto `text-white`/`text-gray-xxx`
- Cor primária: `primary-400` (cyan #00D9FF)
- Cor de ação: `purple-600` para botões de ação
- Cor de perigo: `red-600` para exclusão
- Borders: `border-dark-600`/`border-dark-700`
- Cards: `bg-dark-700 rounded-lg border border-dark-600`
- Hover em cards: `hover:border-primary-400`
- Responsividade: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Grid de posts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## Exports

- Componentes de página: `export const` (named export)
- Componentes de UI com guard: `export default`
- Hooks: `export const` sempre
- Services: `export const` (objeto singleton)

## Naming

- Arquivos: PascalCase para componentes/páginas, camelCase para hooks/services/utils
- Hooks: prefixo `use` + verbo + substantivo (ex: `useCreatePost`, `usePostsByTag`)
- Componentes: PascalCase descritivo (ex: `DeleteConfirmModal`, `PostCard`)
- Tipos/Interfaces: PascalCase + sufixo descritivo (`Props`, `DTO`, `Result`)

## Estados de UI

Todos os componentes de listagem/detalhe implementam:
1. **Loading** → spinner centralizado com texto
2. **Error** → card vermelho com mensagem
3. **Empty** → ícone + texto + CTA
4. **Success** → conteúdo normal

## Commits

Segue Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`

## Testes

- Framework: Vitest + Testing Library
- Ambiente: jsdom
- Cada arquivo tem seu `.test.ts(x)` correspondente no mesmo diretório
- Testes excluídos do build TypeScript principal (tsconfig exclude)
- Coverage via `@vitest/coverage-v8`

## Referências

- `package.json`: Scripts e dependências
- `tsconfig.json`: Configuração TypeScript
- `tailwind.config.js`: Tema customizado
- `eslint.config.js`: Regras de lint
- `vite.config.ts`: Build e dev server
