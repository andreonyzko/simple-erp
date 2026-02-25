# ARCHITECTURE.md  
## Arquitetura do Sistema ERP PWA

---

# 1. Visão geral da arquitetura

Este projeto adota uma **arquitetura orientada ao domínio**, projetada especificamente para um **frontend offline-first**, sem backend e sem dependência de servidores externos.

Toda a aplicação roda integralmente no client, e o **IndexedDB** é a **única fonte de persistência de dados**.

A arquitetura foi desenhada para garantir:

- Baixo acoplamento conceitual
- Clareza de responsabilidades
- Regras de negócio explícitas
- Facilidade de evolução e refatoração
- Fluxo previsível de dados

Respeitando as seguintes premissas fundamentais:

- Toda a aplicação roda no navegador
- Não existe backend
- IndexedDB é a fonte única de verdade
- Regras de negócio não pertencem à UI
- Infraestrutura não define regras do domínio
- A URL é a fonte de verdade do estado de navegação

---

# 2. Princípios arquiteturais

## 2.1 Separação clara de responsabilidades

Cada camada possui uma responsabilidade única e bem definida. Sobreposições de responsabilidade são consideradas violações arquiteturais.

---

## 2.2 Domínio em primeiro lugar

O domínio é o núcleo do sistema. Todas as regras de negócio, validações e decisões conceituais residem na camada de **services** do domínio.

A UI e a infraestrutura são consideradas detalhes de implementação.

---

## 2.3 Dependência unidirecional

As dependências fluem sempre da camada mais externa para a mais interna:

UI → Route (loader/action) → Services → Repositories → Infra

Nenhuma camada interna conhece ou depende de camadas externas.

- Services não conhecem UI
- Repositories não conhecem Services
- Infra não conhece domínio
- Routes não contêm regras de negócio

---

## 2.4 Simplicidade consciente

A arquitetura evita abstrações desnecessárias. Decisões simples, explícitas e previsíveis são preferidas a soluções genéricas ou altamente abstratas.

---

# 3. Camadas do sistema

## 3.1 UI (Interface do Usuário)

Responsável exclusivamente por:

- Renderização de telas
- Interação com o usuário
- Coleta de dados de entrada
- Exibição de resultados
- Controle de estado visual

A UI:

- Não contém regras de negócio
- Não acessa o banco de dados
- Não chama repositories diretamente
- Não executa mutações diretamente nos services

A UI comunica-se apenas com a camada de Routes por meio de:

- Navegação
- `<Form>`
- `fetcher`
- Atualização de query parameters

A UI é declarativa e orientada à rota.

---

## 3.2 Routes (Data Router Layer)

As rotas utilizam o React Router Data Mode e atuam como orquestradoras do fluxo de dados.

Cada rota pode declarar:

- `loader` → leitura de dados
- `action` → mutações
- `errorElement` → tratamento de erro técnico
- `children` → rotas aninhadas

Responsabilidades das Routes:

- Interpretar a URL
- Extrair query parameters
- Executar loaders
- Executar actions
- Chamar services
- Garantir revalidação automática
- Propagar erros técnicos

As Routes:

- Não implementam regras de negócio
- Não acessam Dexie diretamente
- Não contêm lógica financeira

Elas apenas coordenam o fluxo entre UI e Services.

---

## 3.3 Domain Services

Os services constituem o núcleo do sistema.

Responsabilidades:

- Implementar e garantir todas as regras de negócio
- Validar estados e transições das entidades
- Orquestrar fluxos complexos (ex: vendas + pagamentos + estoque)
- Criar e controlar Transactions
- Aplicar regras de estoque
- Calcular dados derivados (ex: paymentStatus)
- Validar consistência financeira

Os services:

- Não conhecem UI
- Não conhecem rotas
- Não conhecem Dexie diretamente
- Não contêm lógica de renderização

Nenhuma regra de negócio deve existir fora desta camada.

---

## 3.4 Repositories

Os repositories são responsáveis exclusivamente pelo acesso e persistência de dados.

Funções principais:

- Criar registros
- Ler registros
- Atualizar registros permitidos
- Listar e filtrar dados persistidos
- Traduzir entidades do domínio para persistência

Os repositories:

- Não validam regras de negócio
- Não calculam valores financeiros
- Não decidem estados
- Não criam Transactions
- Não aplicam regras derivadas

São determinísticos e previsíveis.

---

## 3.5 Infraestrutura

A camada de infraestrutura fornece suporte técnico ao sistema.

Responsabilidades:

- Configuração do IndexedDB
- Instância e versionamento do Dexie
- Definição de tabelas e índices
- Migrações de schema

A infraestrutura:

- Não contém regras de negócio
- Não interpreta domínio
- Não conhece UI

---

# 4. Fluxo oficial de dados

O fluxo obrigatório do sistema é:

UI  
↓  
Route (loader/action)  
↓  
Service  
↓  
Repository  
↓  
Dexie  

Regras fundamentais:

- UI nunca acessa services diretamente para mutações
- UI nunca acessa repositories
- Routes nunca contêm regras de negócio
- Services nunca conhecem UI
- Repositories nunca chamam services

Qualquer desvio desse fluxo é considerado erro arquitetural.

---

# 5. Estrutura de pastas

src/  
 ├─ domain/  
 │   ├─ entities/  
 │   ├─ types/  
 │   ├─ services/  
 │   └─ repositories/  
 │  
 ├─ infra/  
 │   └─ database/  
 │       └─ dexie.ts  
 │  
 └─ ui/  
     ├─ layout/  
     ├─ components/  
     ├─ hooks/  
     ├─ pages/  
     ├─ routes/  
     └─ styles/  

Observação:

- A pasta `routes` contém a camada de orquestração (loaders e actions).
- Pages são componentes visuais.
- A organização reflete explicitamente os limites arquiteturais.

---

# 6. Entities e Types

## 6.1 Entities

Entities representam conceitos centrais do negócio, possuem identidade e são persistidas.

Exemplos:

- Client
- Supplier
- Product
- Service
- Sale
- Purchase
- Transaction
- CalendarEvent

Entities descrevem o que existe no domínio e possuem vida longa no sistema.

---

## 6.2 Types

Types representam estruturas auxiliares e contratos de dados.

Exemplos:

- Inputs de criação
- Filtros
- Enums
- Tipos derivados

Types não possuem identidade própria.

---

# 7. Gerenciamento de dependências

Os repositories são expostos como instâncias singleton.

Os services importam diretamente essas instâncias.

Essa decisão foi tomada para:

- Reduzir boilerplate
- Simplificar leitura
- Adequar ao contexto offline e single-user

Apesar do uso de singletons:

- Services não conhecem UI
- Repositories não contêm regras de negócio
- Infra não conhece domínio

---

# 8. Decisões arquiteturais conscientes

## 8.1 Sem backend

Decisão intencional para garantir simplicidade, previsibilidade e funcionamento offline.

---

## 8.2 Histórico imutável

Registros financeiros nunca são editados ou removidos.

Correções e cancelamentos são sempre representados por novos lançamentos.

---

## 8.3 Dados derivados não persistidos

Dados que podem ser calculados a partir de outras fontes (ex: paymentStatus) não são armazenados.

Esses dados são sempre calculados dinamicamente pelos services.

---

## 8.4 URL como estado da aplicação

Busca, filtros e navegação são representados na URL.

A alteração da URL dispara automaticamente:

- Execução do loader
- Revalidação de dados
- Atualização da interface

Não existe estado duplicado entre UI e rota.

---

# 9. Evolução da arquitetura

Esta arquitetura foi projetada para:

- Crescimento incremental
- Refatorações seguras
- Clareza conceitual
- Facilidade de entendimento por novos desenvolvedores
- Manutenção explícita de regras de negócio

O domínio permanece soberano.

A camada de Routes fortalece a previsibilidade do fluxo.

A UI permanece declarativa e livre de regras de negócio.

---

Este documento define como o sistema está organizado e quais limites arquiteturais devem ser respeitados durante todo o desenvolvimento.
