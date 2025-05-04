
# FlowTask - Gerenciador de Tarefas e Produtividade

FlowTask é um aplicativo desktop moderno para gerenciamento de tarefas, pensamentos e conquistas, desenvolvido para ajudar você a manter o foco e aumentar sua produtividade.

![FlowTask Screenshot](public/screenshot.png)

## 🚀 Tecnologias Utilizadas

- **React** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Ferramenta de build rápida
- **Electron** - Framework para criação de aplicações desktop
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI customizáveis
- **React Query** - Gerenciamento de estado e requisições
- **React Router** - Navegação entre páginas
- **Zod** - Validação de schema
- **Lucide React** - Ícones
- **Recharts** - Biblioteca de gráficos

## 📋 Funcionalidades

- Gerenciamento completo de tarefas
- Modo foco para maior concentração
- Registro de pensamentos e ideias
- Acompanhamento de façanhas/conquistas
- Interface intuitiva com tema neon
- Aplicativo desktop executável

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js (v16 ou superior)
- npm ou bun

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Entrar na pasta do projeto
cd flowtask

# Instalar dependências
npm install
# ou
bun install
```

### Execução

```bash
# Modo desenvolvimento web
npm run dev

# Modo desenvolvimento desktop (electron)
npm run electron:dev

# Compilar versão de produção
npm run build

# Construir executável desktop
npm run electron:build
```

## 📱 Interface

### Página de Tarefas
![Tarefas](public/tarefas.png)

### Modo Foco
![Modo Foco](public/foco.png)

### Façanhas
![Façanhas](public/facanhas.png)

### Pensamentos
![Pensamentos](public/pensamentos.png)

## 🔍 Estrutura do Projeto

```
flowtask/
├── electron/            # Configuração Electron
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilitários
│   ├── pages/           # Páginas
│   ├── types/           # Definições de tipos TypeScript
│   └── utils/           # Funções auxiliares
├── README.md            # Documentação do projeto
└── package.json         # Dependências
```

## 🧪 Scripts Disponíveis

- `dev`: Inicia o servidor de desenvolvimento
- `build`: Compila o projeto para produção
- `lint`: Executa a verificação de linting
- `format`: Formata o código-fonte
- `electron:dev`: Inicia o Electron em modo desenvolvimento
- `electron:build`: Cria executáveis para desktop

## 📄 Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo LICENSE para obter detalhes.

