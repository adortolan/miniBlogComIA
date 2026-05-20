# Testes Unitários - MiniBlog

## 📋 Visão Geral

Este diretório contém a configuração e testes unitários do projeto MiniBlog, utilizando **Vitest** e **React Testing Library**.

## 🛠️ Stack de Testes

- **Vitest**: Framework de testes rápido e moderno, otimizado para Vite
- **React Testing Library**: Biblioteca para testar componentes React
- **@testing-library/jest-dom**: Matchers customizados para assertions
- **@testing-library/user-event**: Simular interações do usuário
- **jsdom**: Ambiente DOM para testes

## 📁 Estrutura de Testes

```
src/
├── components/
│   ├── AuthStatus.jsx
│   ├── AuthStatus.test.jsx
│   ├── Navbar.jsx
│   └── Navbar.test.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── AuthContext.test.jsx
├── hooks/
│   ├── useLogin.js
│   ├── useLogin.test.js
│   ├── useLogout.js
│   └── useLogout.test.js
├── pages/
│   ├── Login.jsx
│   └── Login.test.jsx
└── test/
    ├── setup.js          # Configuração global dos testes
    └── README.md         # Esta documentação
```

## 🧪 Cobertura de Testes

### AuthContext (`contexts/AuthContext.test.jsx`)
- ✅ Fornece valores iniciais corretos
- ✅ Lança erro quando usado fora do Provider
- ✅ Inicializa com loading true

### useLogin (`hooks/useLogin.test.js`)
- ✅ Login com email/senha bem-sucedido
- ✅ Tratamento de erros: usuário não encontrado
- ✅ Tratamento de erros: senha incorreta
- ✅ Tratamento de erros: email inválido
- ✅ Login com Google bem-sucedido
- ✅ Tratamento de erros: popup bloqueado
- ✅ Tratamento de erros: usuário cancela popup
- ✅ Gerenciamento correto de loading

### useLogout (`hooks/useLogout.test.js`)
- ✅ Logout bem-sucedido
- ✅ Tratamento de erro em logout
- ✅ Gerenciamento correto de loading
- ✅ Limpeza de erro em nova tentativa

### AuthStatus (`components/AuthStatus.test.jsx`)
- ✅ Exibe loading durante verificação
- ✅ Exibe status não autenticado corretamente
- ✅ Exibe informações do usuário quando autenticado
- ✅ Link para login presente quando não autenticado
- ✅ Classes CSS aplicadas corretamente

### Navbar (`components/Navbar.test.jsx`)
- ✅ Renderiza logo e links básicos
- ✅ Mostra links corretos quando não autenticado
- ✅ Mostra links corretos quando autenticado
- ✅ Exibe nome/email do usuário
- ✅ Executa logout corretamente
- ✅ Links com hrefs corretos

### Login (`pages/Login.test.jsx`)
- ✅ Renderiza formulário completo
- ✅ Botão de login com Google presente
- ✅ Link para registro presente
- ✅ Validação: email vazio
- ✅ Validação: formato de email
- ✅ Validação: senha vazia
- ✅ Validação: tamanho mínimo da senha
- ✅ Chama login com credenciais corretas
- ✅ Login com Google funciona
- ✅ Navegação após login bem-sucedido
- ✅ Não navega se login falhar

## 🚀 Comandos

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm test -- --watch
```

### Executar testes com UI
```bash
npm run test:ui
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

### Executar testes específicos
```bash
# Por arquivo
npm test AuthContext.test

# Por padrão
npm test -- login

# Por describe/it
npm test -- -t "deve validar email"
```

## 📝 Padrões de Teste

### Nomenclatura
- Arquivos de teste: `*.test.jsx` ou `*.test.js`
- Describe blocks: Nome do componente/hook
- It blocks: Descrição clara do comportamento esperado

### Estrutura de Teste
```javascript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  });

  it('deve comportamento esperado', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Mocks
- Firebase Auth é mockado globalmente em `setup.js`
- Hooks e contextos são mockados individualmente em cada teste
- React Router é mockado quando necessário

## 🎯 Boas Práticas

1. **Testar comportamento, não implementação**
   - Foque no que o usuário vê e faz
   - Evite testar detalhes internos

2. **Usar queries semânticas**
   - Preferir `getByRole`, `getByLabelText`
   - Usar `getByTestId` apenas quando necessário

3. **Cleanup automático**
   - Configurado em `setup.js`
   - Não precisa cleanup manual

4. **Asserções claras**
   - Use matchers específicos do jest-dom
   - Mensagens de erro descritivas

5. **Testes isolados**
   - Cada teste deve ser independente
   - Use beforeEach para reset de mocks

## 🔍 Debugging

### Visualizar DOM renderizado
```javascript
import { render, screen } from '@testing-library/react';

const { debug } = render(<Component />);
debug(); // Imprime todo o DOM
screen.debug(); // Imprime elemento específico
```

### Ver queries disponíveis
```javascript
const { container } = render(<Component />);
screen.logTestingPlaygroundURL();
```

## 📊 Métricas de Qualidade

- **Cobertura mínima esperada**: 80%
- **Testes devem ser rápidos**: < 100ms por teste
- **Testes devem ser determinísticos**: Sem flakiness

## 🔄 CI/CD

Os testes são executados automaticamente em:
- Push para branches
- Pull Requests
- Antes do merge para develop/main

## 📚 Referências

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
