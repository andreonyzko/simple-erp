# Sistema ERP PWA

Sistema de gestão empresarial (ERP) offline-first desenvolvido como Progressive Web App (PWA). Projetado para pequenos e médios negócios que precisam de controle administrativo local, simples e confiável, sem dependência de servidor ou conexão com a internet.

## Funcionalidades

O sistema oferece gestão completa das operações administrativas:

- **Cadastros**: Gerenciamento de clientes, fornecedores, produtos e serviços
- **Vendas**: Registro de vendas com controle de estoque e pagamentos parciais
- **Compras**: Registro de compras de produtos com controle financeiro
- **Transações Financeiras**: Controle completo de entradas e saídas financeiras com histórico imutável
- **Agenda**: Gerenciamento de compromissos e eventos
- **Controle de Estoque**: Movimentação automática de estoque vinculada a vendas e compras
- **Busca e Filtros**: Sistema robusto de busca textual e filtros estruturados em todas as entidades
- **Histórico Financeiro**: Registro imutável de todas as movimentações financeiras

## Tecnologias Utilizadas

### Core
- **React 19**: Interface declarativa e componentes reutilizáveis
- **TypeScript 5.9**: Tipagem estática e segurança de tipos
- **Vite**: Build tool otimizado para desenvolvimento
- **PWA**: Progressive Web App com suporte offline completo

### Roteamento e Fluxo de Dados
- **React Router Data Mode**: Gerenciamento de estado via loaders e actions

### Persistência
- **IndexedDB**: Banco de dados local do navegador
- **Dexie 4.2**: Wrapper moderno para IndexedDB

### UI e Estilização
- **TailwindCSS**: Framework CSS utility-first
- **Shadcn/UI**: Componentes reutilizáveis e acessíveis
- **Lucide React**: Biblioteca de ícones
- **TanStack Table**: Tabelas avançadas com ordenação e filtros
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas
- **date-fns**: Manipulação de datas
- **Sonner**: Sistema de notificações toast

## Arquitetura

O projeto segue uma **arquitetura orientada ao domínio** com separação clara de responsabilidades em camadas:

### Fluxo de Dados

```
UI → Route (loader/action) → Service → Repository → Dexie
```

### Camadas

#### **UI (Interface do Usuário)**
- **Responsabilidades**: Renderização, coleta de entrada, exibição de dados do loader
- **Limitações**: Não acessa repositories, não implementa regras de negócio, não chama services diretamente para mutações
- **Comunicação**: Utiliza `<Form>` ou `fetcher` para mutações via actions

#### **Routes (Data Router Layer)**
- **Loader**: Lê query parameters, chama services, retorna dados
- **Action**: Extrai formData, chama services, retorna resultados
- **Limitações**: Não implementa regras de negócio, não acessa Dexie diretamente

#### **Services (Domínio)**
- **Responsabilidades**: Implementa TODAS as regras de negócio, validações, cálculos derivados, orquestração de fluxos complexos
- **Limitações**: Não conhece UI, não conhece rotas, não acessa Dexie diretamente
- **Integração**: Importa repositories como singletons

#### **Repositories (Persistência)**
- **Responsabilidades**: CRUD puro, queries indexadas, filtros simples
- **Limitações**: Não valida regras, não calcula dados financeiros, não decide estados
- **Isolamento**: Não chama services

#### **Infrastructure**
- **Responsabilidades**: Configuração do Dexie, versionamento do banco, definição de índices

### Princípios Fundamentais

1. **URL como fonte da verdade**: Busca e filtros são query parameters
2. **Histórico imutável**: Transactions nunca são editadas ou removidas
3. **Dados derivados não persistidos**: `paymentStatus` é calculado dinamicamente
4. **Dependência unidirecional**: Camadas externas dependem de internas, nunca o contrário

## Estrutura do Projeto

```
src/
├── domain/
│   ├── entities/         # Definições de entidades (Client, Sale, Transaction, etc.)
│   ├── types/            # Tipos auxiliares, enums e contratos
│   ├── services/         # Regras de negócio e orquestração
│   └── repositories/     # Acesso a dados e persistência
│
├── infra/
│   └── database/         # Configuração do Dexie e IndexedDB
│       └── dexie.ts
│
└── ui/
    ├── layout/           # Componentes de layout
    ├── components/       # Componentes reutilizáveis
    ├── hooks/            # Custom hooks
    ├── pages/            # Páginas da aplicação
    ├── routes/           # Loaders e actions do React Router
    └── styles/           # Estilos globais

docs/                     # Documentação técnica e arquitetural
```

## Como Utilizar

1. **Cadastros**: Inicie cadastrando clientes, fornecedores, produtos e serviços
2. **Vendas e Compras**: Registre transações comerciais com controle de estoque opcional
3. **Pagamentos**: Adicione transactions financeiras vinculadas a vendas/compras ou registre transações manuais
4. **Consultas**: Use a barra de busca e filtros estruturados para encontrar registros específicos
5. **Agenda**: Organize compromissos na visão de calendário

## Documentação Técnica

Para informações detalhadas sobre arquitetura, domínio e padrões de desenvolvimento, consulte:

- `docs/PROJECT_OVERVIEW.md` - Visão geral do projeto
- `docs/ARCHITECTURE.md` - Arquitetura e camadas
- `docs/DOMAIN.md` - Regras de negócio
- `docs/DATABASE.md` - Modelagem do banco de dados
- `docs/DEVELOPMENT_GUIDE.md` - Guia de desenvolvimento
- `docs/SEARCH_FILTERS.md` - Sistema de busca e filtros

