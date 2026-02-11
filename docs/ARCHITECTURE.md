# Arquitetura do Sistema ERP PWA

## 1. Visão geral da arquitetura

Este projeto adota uma **arquitetura orientada ao domínio**, projetada especificamente para um **frontend offline-first**, sem backend e sem dependência de servidores externos.

Toda a aplicação roda integralmente no client, e o **IndexedDB** é a **única fonte de persistência de dados**.

A arquitetura foi desenhada para garantir:

* Baixo acoplamento conceitual
* Clareza de responsabilidades
* Regras de negócio explícitas
* Facilidade de evolução e refatoração

Respeitando as seguintes premissas fundamentais:

* Toda a aplicação roda no navegador
* Não existe backend
* IndexedDB é a fonte única de verdade
* Regras de negócio não pertencem à UI
* Infraestrutura não define regras do domínio

---

## 2. Princípios arquiteturais

### 2.1 Separação clara de responsabilidades

Cada camada possui uma responsabilidade única e bem definida. Sobreposições de responsabilidade são consideradas violações arquiteturais.

---

### 2.2 Domínio em primeiro lugar

O domínio é o núcleo do sistema. Todas as regras de negócio, validações e decisões conceituais residem na camada de **services** do domínio.

A UI e a infraestrutura são consideradas detalhes de implementação.

---

### 2.3 Dependência unidirecional

As dependências fluem sempre da camada mais externa para a mais interna:

```
UI → Services → Repositories → Infra
```

Nenhuma camada interna conhece ou depende de camadas externas.

---

### 2.4 Simplicidade consciente

A arquitetura evita abstrações desnecessárias. Decisões simples, explícitas e previsíveis são preferidas a soluções genéricas ou altamente abstratas.

---

## 3. Camadas do sistema

### 3.1 UI (Interface do Usuário)

Responsável exclusivamente por:

* Renderização de telas
* Interação com o usuário
* Coleta de dados de entrada
* Exibição de resultados
* Controle de estado visual

A UI **não contém regras de negócio** e **não acessa o banco de dados diretamente**.

A UI comunica-se apenas com os **services** do domínio.

Exemplos:

* Pages
* Componentes visuais
* Hooks de UI

---

### 3.2 Domain Services

Os **services** constituem o núcleo do sistema.

Responsabilidades:

* Implementar e garantir todas as regras de negócio
* Validar estados e transições das entidades
* Orquestrar fluxos complexos (ex: vendas + pagamentos + estoque)
* Criar e controlar Transactions
* Aplicar regras de estoque
* Calcular dados derivados (ex: paymentStatus)

Os services **não conhecem a UI** e **não conhecem detalhes técnicos da infraestrutura**.

Nenhuma regra de negócio deve ser implementada fora desta camada.

---

### 3.3 Repositories

Os **repositories** são responsáveis exclusivamente pelo acesso e persistência de dados.

Funções principais:

* Criar registros
* Ler registros
* Atualizar registros permitidos
* Listar e filtrar dados
* Traduzir entidades do domínio para persistência

Os repositories pertencem conceitualmente ao domínio, pois definem **como o negócio precisa acessar os dados**, mesmo utilizando IndexedDB internamente.

#### Limites dos repositories

Repositories **não devem**:

* Validar regras de negócio
* Decidir estados ou transições
* Criar ou interpretar Transactions
* Calcular valores financeiros
* Aplicar regras derivadas

Toda decisão de negócio pertence exclusivamente aos services.

---

### 3.4 Infraestrutura

A camada de infraestrutura fornece suporte técnico ao sistema.

Responsabilidades:

* Configuração do IndexedDB
* Instância e versionamento do Dexie
* Definição de tabelas e índices
* Migrações de schema

A infraestrutura **não contém regras de negócio** e **não toma decisões de domínio**.

---

## 4. Estrutura de pastas

```txt
src/
 ├─ domain/
 │   ├─ entities/
 │   ├─ types/
 │   ├─ services/
 │   └─ repositories/
 ├─ infra/
 │   └─ database/
 │       └─ dexie.ts
 └─ ui/
     ├─ pages/
     └─ components/
```

---

## 5. Entities e Types

### 5.1 Entities

Entities representam conceitos centrais do negócio, possuem identidade e são persistidas.

Exemplos:

* Client
* Supplier
* Product
* Service
* Sale
* Purchase
* Transaction
* CalendarEvent

Entities descrevem **o que existe no domínio** e possuem vida longa no sistema.

---

### 5.2 Types

Types representam estruturas auxiliares e contratos de dados.

Exemplos:

* Inputs de criação
* Filtros
* Enums
* Tipos derivados

Types **não representam conceitos isolados do negócio** e não possuem identidade própria.

---

## 6. Comunicação entre camadas

### Regra de ouro

* UI nunca acessa repositories diretamente
* UI nunca acessa Dexie
* Repositories nunca chamam services

Toda comunicação segue obrigatoriamente o fluxo:

```
UI → Service → Repository → Dexie
```

Qualquer desvio desse fluxo é considerado erro arquitetural.

---

## 7. Gerenciamento de dependências

Os repositories são expostos como **instâncias singleton**.

Os services **importam diretamente** essas instâncias, ao invés de recebê-las por parâmetros.

Essa decisão foi tomada para:

* Reduzir boilerplate
* Simplificar a leitura do código
* Adequar a arquitetura ao contexto offline e single-user do projeto

Apesar do uso de singletons, os limites arquiteturais permanecem inalterados:

* Services não conhecem a UI
* Repositories não contêm regras de negócio
* Infra não conhece o domínio

---

## 8. Decisões arquiteturais conscientes

### 8.1 Sem backend

Decisão intencional para garantir simplicidade, previsibilidade e funcionamento offline.

---

### 8.2 Histórico imutável

Registros financeiros nunca são editados ou removidos.

Correções e cancelamentos são sempre representados por novos lançamentos.

---

### 8.3 Dados derivados não persistidos

Dados que podem ser calculados a partir de outras fontes (ex: paymentStatus) **não são armazenados**.

Esses dados são sempre calculados dinamicamente pelos services.

---

## 9. Evolução da arquitetura

Esta arquitetura foi projetada para:

* Crescimento incremental
* Refatorações seguras
* Clareza conceitual
* Facilidade de entendimento por novos desenvolvedores
* Manutenção de regras de negócio explícitas

Este documento define **como o sistema está organizado** e **quais limites arquiteturais devem ser respeitados durante todo o desenvolvimento**.
