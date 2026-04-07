# 4.3 PostCard

## Descrição
Implementar componente de card para exibição resumida de posts na listagem.

## Dependências
- Nenhuma (componente puro de UI)

## Etapas

### Etapa 1 — Criar componente PostCard
- Criar `src/components/PostCard.jsx`
- Props esperadas:
  - `title`: título do post
  - `content`: conteúdo completo (será truncado)
  - `slug`: para link de navegação
  - `tags`: array de tags
  - `authorName`: nome do autor
  - `createdAt`: timestamp de criação
  - `imageURL`: URL da imagem de capa (opcional)

### Etapa 2 — Layout do card
- Imagem de capa no topo (se existir)
- Título do post (link para `/posts/:slug`)
- Trecho do conteúdo (primeiros ~150 caracteres, sem Markdown)
- Tags como badges/chips
- Autor e data de criação no rodapé do card

### Etapa 3 — Formatação de dados
- Criar função utilitária para truncar texto e remover Markdown
- Formatar data com `toLocaleDateString('pt-BR')`
- Tags com estilização de badge

### Etapa 4 — Estilização
- Card com sombra, bordas arredondadas
- Hover com efeito visual (sombra maior, scale sutil)
- Responsivo: grid adaptável (1 coluna mobile, 2-3 colunas desktop)

## Critérios de Aceite
- [ ] Card exibe título, trecho, tags, autor e data
- [ ] Imagem de capa é exibida quando presente
- [ ] Clicar no card navega para a página de detalhe do post
- [ ] Tags são clicáveis (navegam para filtro)
- [ ] Texto é truncado corretamente
- [ ] Card é responsivo e tem efeito de hover
