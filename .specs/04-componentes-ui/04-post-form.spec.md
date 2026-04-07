# 4.4 PostForm

## Descrição
Implementar formulário reutilizável para criação e edição de posts.

## Dependências
- Nenhuma (componente puro de UI/formulário)

## Etapas

### Etapa 1 — Criar componente PostForm
- Criar `src/components/PostForm.jsx`
- Props esperadas:
  - `initialData`: objeto com dados do post (vazio para criação, preenchido para edição)
  - `onSubmit`: callback chamado ao salvar
  - `loading`: boolean para desabilitar formulário durante envio
  - `error`: mensagem de erro a exibir

### Etapa 2 — Campo de título
- Input text para o título do post
- Obrigatório, com validação
- Placeholder: "Título do post"

### Etapa 3 — Campo de conteúdo (Markdown)
- Textarea para edição de conteúdo em Markdown
- Altura mínima generosa para escrita confortável
- (Opcional) Preview lado a lado com `react-markdown`
- Placeholder: "Escreva seu post em Markdown..."

### Etapa 4 — Campo de tags
- Input para adicionar tags
- Ao pressionar Enter ou vírgula, adicionar tag como chip
- Cada chip com botão "x" para remover
- Limite máximo de tags (ex: 5)

### Etapa 5 — Upload de imagem de capa
- Input file para selecionar imagem
- Preview da imagem selecionada
- Se editando, exibir imagem atual com opção de trocar
- Validar tipo (apenas imagens) e tamanho (máx 5MB)

### Etapa 6 — Botões de ação
- Botão "Publicar" / "Salvar" (submit do formulário)
- Botão "Cancelar" (navega de volta)
- Desabilitar durante loading

### Etapa 7 — Validação
- Título obrigatório (mín 3 caracteres)
- Conteúdo obrigatório (mín 10 caracteres)
- Exibir mensagens de erro inline nos campos

## Critérios de Aceite
- [ ] Formulário funciona para criação (campos vazios) e edição (campos pré-preenchidos)
- [ ] Validação inline em campos obrigatórios
- [ ] Tags podem ser adicionadas/removidas como chips
- [ ] Preview de imagem funciona
- [ ] Botões são desabilitados durante loading
- [ ] `onSubmit` é chamado com os dados corretos do formulário
- [ ] Componente é reutilizável (sem lógica de negócio acoplada)
