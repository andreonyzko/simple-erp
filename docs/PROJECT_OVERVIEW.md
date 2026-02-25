# PROJECT_OVERVIEW.md  
## Visão Geral do Projeto – Sistema ERP PWA

---

# 1. O que é este projeto

Este projeto é um **Sistema ERP (Enterprise Resource Planning) Web**, desenvolvido como uma **PWA (Progressive Web App)**, com funcionamento **100% offline**, **sem backend** e **sem dependência de servidor**.

Toda a aplicação roda integralmente no navegador e utiliza **IndexedDB**, por meio da biblioteca **Dexie**, como **fonte única de persistência de dados**.

O sistema foi concebido para pequenos e médios negócios que precisam de um controle administrativo **local, simples, confiável e previsível**, sem complexidade desnecessária.

---

# 2. Objetivo do projeto

O objetivo principal é fornecer um **ERP modular, extensível e de fácil manutenção**, capaz de gerenciar operações administrativas comuns, mantendo como premissas centrais:

- Funcionamento offline-first  
- Arquitetura clara e previsível  
- Domínio explícito e bem definido  
- Histórico financeiro imutável  
- Evolução segura do código  

O projeto **não busca competir com ERPs corporativos em nuvem**, nem atender cenários complexos de múltiplos usuários ou sincronização.

---

# 3. Princípios fundamentais

## 3.1 Offline-first

O sistema deve funcionar integralmente sem conexão com a internet. Nenhuma funcionalidade essencial depende de serviços externos.

---

## 3.2 Client-side only

Toda a lógica de negócio, validações e persistência de dados ocorrem no client.

Não existe backend, API, sincronização ou comunicação com servidores.

---

## 3.3 Domínio em primeiro lugar

As regras de negócio são tratadas como o **núcleo do sistema**. A interface do usuário e a infraestrutura são consideradas detalhes de implementação.

Qualquer decisão ambígua deve ser resolvida no domínio.

---

## 3.4 Simplicidade consciente

A arquitetura evita abstrações desnecessárias. Soluções simples, explícitas e previsíveis são preferidas a generalizações prematuras.

---

## 3.5 URL como fonte da verdade

A aplicação utiliza **React Router no modo Data Router**.

A URL é considerada a **fonte de verdade do estado de navegação e listagem**.

Busca textual, filtros estruturados e paginação (quando aplicável) são representados como **query parameters**, permitindo:

- Deep link funcional  
- Navegação previsível  
- Back/forward consistentes  
- Estado sincronizado com a rota  

A interface não mantém estado duplicado de dados de listagem.

---

# 4. Núcleo financeiro

O núcleo do sistema é o **controle de movimentações financeiras**, modelado explicitamente através da entidade **Transaction**.

Eventos comerciais, como vendas e compras, existem para **gerar movimentações financeiras**, e não o contrário.

Essa abordagem garante:

- Histórico financeiro imutável  
- Rastreabilidade completa de entradas e saídas  
- Suporte nativo a pagamentos parciais  
- Cancelamentos explícitos via lançamentos corretivos  

O sistema **nunca edita nem remove registros financeiros**. Correções e estornos são sempre representados por novas Transactions.

---

# 5. Escopo funcional

## 5.1 Funcionalidades contempladas

- Cadastro de clientes  
- Cadastro de fornecedores  
- Cadastro de produtos  
- Cadastro de serviços  
- Registro de vendas  
- Registro de compras  
- Controle de pagamentos por meio de Transactions  
- Agenda de compromissos (calendar)  
- Relacionamentos lógicos entre entidades  

---

## 5.2 Funcionalidades fora de escopo

As seguintes funcionalidades **não fazem parte do projeto**, por decisão arquitetural consciente:

- Backend ou API  
- Autenticação de usuários  
- Multiusuário  
- Controle de permissões  
- Sincronização em nuvem  
- Integrações externas  
- Emissão fiscal  
- Contabilidade formal  

---

# 6. Arquitetura geral

A aplicação é organizada em camadas bem definidas:
UI → Route (loader/action) → Service → Repository → Dexie


## 6.1 UI

Responsável exclusivamente por:

- Renderização de telas  
- Coleta de entrada do usuário  
- Exibição de dados  
- Controle de estado visual  

A UI **não contém regras de negócio** e **não executa mutações diretamente nos services**.

---

## 6.2 Routes (Data Router)

Cada rota é responsável por:

- Definir um `loader` para carregar dados  
- Definir uma `action` para executar mutações  
- Controlar revalidação automática  
- Declarar `errorElement` quando necessário  

As rotas orquestram a comunicação entre UI e Services.

---

## 6.3 Services

Os services implementam todas as regras de negócio:

- Validações  
- Transições de estado  
- Orquestração de fluxos complexos  
- Criação de Transactions  
- Cálculo de dados derivados  

Nenhuma regra de negócio é implementada na UI ou nos repositories.

---

## 6.4 Repositories

Responsáveis exclusivamente por persistência e consulta de dados.

Não contêm regras de negócio.

---

## 6.5 Infraestrutura

Responsável apenas por:

- Configuração do Dexie  
- Versionamento do banco  
- Definição de tabelas e índices  

---

# 7. Tecnologias

## 7.1 Core

- TypeScript 5.9  
- React 19  
- Vite  
- PWA  

---

## 7.2 Roteamento e Fluxo de Dados

- React Router (Data Router Mode)  

O React Router é utilizado como orquestrador de fluxo de dados:

- `loader` para leitura  
- `action` para mutações  
- `useNavigation` para estados de navegação  
- Revalidação automática após mutações  

---

## 7.3 Persistência

- IndexedDB  
- Dexie 4.2  

---

## 7.4 UI e Estilização

- TailwindCSS  
- Shadcn/UI  
- Lucide React  
- TanStack Table  
- React Hook Form  
- Zod  
- date-fns  
- Sonner  

As tecnologias de UI são consideradas **detalhes de implementação** e não fazem parte do domínio.

---

# 8. Filosofia de evolução

O projeto foi modelado para:

- Crescer de forma incremental  
- Permitir refatorações seguras  
- Manter regras de negócio explícitas  
- Evitar acoplamentos acidentais  
- Facilitar o entendimento por novos desenvolvedores  

A documentação é parte essencial do projeto e deve evoluir junto com o código.

---

# 9. Leitura recomendada

Para compreender completamente o projeto, a leitura recomendada é:

1. PROJECT_OVERVIEW.md (este documento)  
2. ARCHITECTURE.md  
3. DOMAIN.md  
4. DATABASE.md  
5. DEVELOPMENT_GUIDE.md  
6. SEARCH_FILTERS.md  
7. UI_ARCHITECTURE.md  

---

Este documento define **o que o projeto é, o que ele não é e quais princípios norteiam todas as decisões técnicas, arquiteturais e de domínio**.
