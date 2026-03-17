# Realce Seu Brilho App

Aplicação frontend para o e-commerce Realce Seu Brilho, construída com **React 19**, **TypeScript** e **Vite**.

## Tecnologias

React 19, TypeScript, Vite, Tailwind CSS 4, Zustand para gerenciamento de estado, React Query para data fetching, React Router para navegação, React Hook Form com Zod para validação, Framer Motion para animações, Recharts para visualização de dados, Axios para requisições HTTP e PWA com vite-plugin-pwa.

## Funcionalidades

- 🛍️ **Catálogo de Produtos**: Navegação e busca de produtos por categoria
- 🛒 **Carrinho**: Adição, remoção e gerenciamento de itens
- 👤 **Autenticação**: Login, registro e gerenciamento de perfil
- 📦 **Pedidos**: Histórico e acompanhamento de compras
- 📱 **PWA**: Aplicação instalável com suporte offline
- 🎨 **UI Moderna**: Design responsivo com animações fluidas

## Requisitos

- Node.js 20+
- npm ou yarn
- API backend rodando (realceseubrilho-api)

## Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Configurar URL da API no arquivo .env
```

## Rodando o projeto

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## Estrutura do Projeto

```
src/
├── api/              # Configuração do Axios e endpoints
├── components/       # Componentes reutilizáveis
├── hooks/            # Custom React hooks
├── pages/            # Páginas da aplicação
├── store/            # Stores do Zustand (estado global)
├── types/            # Tipos TypeScript
├── utils/            # Funções utilitárias
├── assets/           # Imagens, ícones e recursos estáticos
├── App.tsx           # Componente raiz
├── main.tsx          # Entry point
└── service-worker.ts # Service Worker para PWA
```

## Variáveis de Ambiente

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Principais Bibliotecas

| Biblioteca | Finalidade |
|-----------|-----------|
| `zustand` | Gerenciamento de estado global |
| `@tanstack/react-query` | Data fetching e cache |
| `react-router-dom` | Roteamento e navegação |
| `react-hook-form` | Gerenciamento de formulários |
| `zod` | Validação de schemas |
| `framer-motion` | Animações e transições |
| `recharts` | Gráficos e dashboards |
| `react-toastify` | Notificações e toasts |
| `react-icons` | Ícones |
| `tailwindcss` | Estilização utilitária |

## PWA (Progressive Web App)

A aplicação é um PWA completo com:
- Instalação em dispositivos móveis e desktop
- Atualização automática de service worker
- Ícones e manifest configurados

## Build e Deploy

```bash
# Build de produção
npm run build

# Os arquivos estáticos são gerados em /dist
# Faça upload para seu hosting de preferência (Vercel, Netlify, AWS S3, etc.)
```

## Licença

UNLICENSED - Todos os direitos reservados.
