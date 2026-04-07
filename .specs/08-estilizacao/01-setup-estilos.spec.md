# 8.1 Setup de Estilos

## Descrição
Configurar sistema de estilização e criar o layout base da aplicação.

## Dependências
- 1.1 Setup do Projeto

## Etapas

### Etapa 1 — Escolher e configurar framework CSS
- **Opção A: TailwindCSS**
  - Instalar: `npm install -D tailwindcss @tailwindcss/typography postcss autoprefixer`
  - Executar: `npx tailwindcss init -p`
  - Configurar `tailwind.config.js` com paths dos componentes
  - Adicionar diretivas no CSS principal
- **Opção B: CSS Modules**
  - Já suportado pelo Vite nativamente
  - Criar arquivos `.module.css` por componente

### Etapa 2 — Reset e estilos globais
- Criar `src/styles/global.css`
- Reset CSS básico (box-sizing, margin, padding)
- Definir variáveis CSS (cores, fontes, espaçamentos)
- Tipografia base (font-family, line-height)

### Etapa 3 — Layout base
- Criar componente `Layout.jsx` com:
  - `Navbar` (topo)
  - `<main>` com `<Outlet />` (conteúdo central)
  - `Footer` (rodapé)
- Min-height de 100vh para ocupar tela inteira
- Conteúdo centralizado com max-width

### Etapa 4 — Responsividade
- Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- Grid responsivo para listagem de posts
- Formulários com largura adequada em cada breakpoint

### Etapa 5 — Tema de cores
- Definir paleta de cores consistente:
  - Primária, secundária, acento
  - Texto, background, bordas
  - Sucesso, erro, alerta
- Modo claro como padrão

## Critérios de Aceite
- [ ] Framework CSS configurado e funcionando
- [ ] Estilos globais aplicados (reset, tipografia, cores)
- [ ] Layout base com Navbar + conteúdo + Footer
- [ ] Aplicação é responsiva em mobile, tablet e desktop
- [ ] Variáveis de tema acessíveis em toda a aplicação
