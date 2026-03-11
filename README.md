# 📊 Sistema ERP PWA

**Sistema de Gestão Empresarial Offline-First**

Sistema de gestão empresarial (ERP) offline-first desenvolvido como **Progressive Web App (PWA)**. Projetado para pequenos e médios negócios que precisam de controle administrativo local, simples e confiável, sem dependência de servidor ou conexão com a internet.

## ✨ Funcionalidades

O sistema oferece gestão completa das operações administrativas:

| Módulo                        | Descrição                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------- |
| 📋 **Cadastros**              | Gerenciamento de clientes, fornecedores, produtos e serviços                  |
| 💰 **Vendas**                 | Registro de vendas com controle de estoque e pagamentos parciais              |
| 🛒 **Compras**                | Registro de compras de produtos com controle financeiro                       |
| 💳 **Transações Financeiras** | Controle completo de entradas e saídas financeiras com histórico imutável     |
| 📅 **Agenda**                 | Gerenciamento de compromissos e eventos                                       |
| 📦 **Controle de Estoque**    | Movimentação automática de estoque vinculada a vendas e compras               |
| 🔍 **Busca e Filtros**        | Sistema robusto de busca textual e filtros estruturados em todas as entidades |
| 📊 **Histórico Financeiro**   | Registro imutável de todas as movimentações financeiras                       |

## 🚀 Como Utilizar

1. **📋 Cadastros**: Inicie cadastrando clientes, fornecedores, produtos e serviços
2. **💼 Vendas e Compras**: Registre transações comerciais com controle de estoque opcional
3. **💳 Pagamentos**: Adicione transactions financeiras vinculadas a vendas/compras ou registre transações manuais
4. **🔍 Consultas**: Use a barra de busca e filtros estruturados para encontrar registros específicos
5. **📅 Agenda**: Organize compromissos na visão de calendário

## 🛠️ Tecnologias Utilizadas

### 🎯 Core

- **React 19** - Interface declarativa e componentes reutilizáveis
- **TypeScript 5.9** - Tipagem estática e segurança de tipos
- **Vite** - Build tool otimizado para desenvolvimento
- **PWA** - Progressive Web App com suporte offline completo

### 🔄 Roteamento e Fluxo de Dados

- **React Router Data Mode** - Gerenciamento de estado via loaders e actions

### 💾 Persistência

- **IndexedDB** - Banco de dados local do navegador
- **Dexie 4.2** - Wrapper moderno para IndexedDB

### 🎨 UI e Estilização

- **TailwindCSS** - Framework CSS utility-first
- **Shadcn/UI** - Componentes reutilizáveis e acessíveis
- **Lucide React** - Biblioteca de ícones
- **TanStack Table** - Tabelas avançadas com ordenação e filtros
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **date-fns** - Manipulação de datas
- **Sonner** - Sistema de notificações toast

## 🏗️ Arquitetura

O projeto segue uma **arquitetura orientada ao domínio** com separação clara de responsabilidades em camadas:

### 📊 Fluxo de Dados

```
UI → Route (loader/action) → Service → Repository → Dexie
```

### 🔷 Camadas

| Camada                | Responsabilidade                                                                    |
| --------------------- | ----------------------------------------------------------------------------------- |
| **🖼️ UI**             | Renderização, coleta de entrada, exibição de dados do loader                        |
| **🛣️ Routes**         | Lê query parameters, extrai formData, chama services e retorna dados                |
| **⚙️ Services**       | Implementa TODAS as regras de negócio, validações, cálculos derivados, orquestração |
| **💾 Repositories**   | CRUD puro, queries indexadas, filtros simples                                       |
| **🔧 Infrastructure** | Configuração do Dexie, versionamento do banco, definição de índices                 |

## 📁 Estrutura do Projeto

```
src/
├── 🎯 domain/
│   ├── entities/         # Definições de entidades (Client, Sale, Transaction, etc.)
│   ├── types/            # Tipos auxiliares, enums e contratos
│   ├── services/         # Regras de negócio e orquestração
│   └── repositories/     # Acesso a dados e persistência
│
├── 🔧 infra/
│   └── database/         # Configuração do Dexie e IndexedDB
│       └── dexie.ts
│
└── 🎨 ui/
    ├── layout/           # Componentes de layout
    ├── components/       # Componentes reutilizáveis
    ├── hooks/            # Custom hooks
    ├── pages/            # Páginas da aplicação
    ├── routes/           # Loaders e actions do React Router
    └── styles/           # Estilos globais

📚 docs/                  # Documentação técnica e arquitetural
```

## 📖 Documentação Técnica

Para informações detalhadas sobre arquitetura, domínio e padrões de desenvolvimento, consulte:

| Documento                                              | Descrição                   |
| ------------------------------------------------------ | --------------------------- |
| 📋 [`PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md)   | Visão geral do projeto      |
| 🏗️ [`ARCHITECTURE.md`](docs/ARCHITECTURE.md)           | Arquitetura e camadas       |
| ⚙️ [`DOMAIN.md`](docs/DOMAIN.md)                       | Regras de negócio           |
| 💾 [`DATABASE.md`](docs/DATABASE.md)                   | Modelagem do banco de dados |
| 👨‍💻 [`DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md) | Guia de desenvolvimento     |
| 🔍 [`SEARCH_FILTERS.md`](docs/SEARCH_FILTERS.md)       | Sistema de busca e filtros  |

---