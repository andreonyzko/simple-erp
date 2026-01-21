# Arquitetura do Sistema ERP PWA

## 1. Visão geral da arquitetura

Este projeto adota uma arquitetura **orientada ao domínio**, adaptada para um **frontend offline-first**, sem backend.

A arquitetura foi desenhada para manter **baixo acoplamento**, **alta legibilidade** e **facilidade de evolução**, respeitando as seguintes premissas:

* Toda a aplicação roda no client
* IndexedDB é a única fonte de persistência
* Regras de negócio não pertencem à UI
* Infraestrutura não define regras do domínio

---

## 2. Princípios arquiteturais

### 2.1 Separação de responsabilidades

Cada camada possui uma responsabilidade clara e única.

### 2.2 Domínio em primeiro lugar

As regras de negócio são tratadas como o núcleo do sistema.

### 2.3 Dependência unidirecional

As dependências sempre fluem da camada mais externa para a mais interna:

```
UI → Services → Repositories → Infra
```

### 2.4 Simplicidade consciente

A arquitetura evita abstrações desnecessárias, priorizando clareza e produtividade.

---

## 3. Camadas do sistema

### 3.1 UI (Interface do Usuário)

Responsável exclusivamente por:

* Renderização
* Interação com o usuário
* Coleta de dados de entrada
* Exibição de resultados

A UI **não contém regras de negócio** e **não acessa o banco de dados diretamente**.

Exemplos:

* Páginas
* Componentes visuais
* Hooks de UI

---

### 3.2 Domain Services

Camada central do sistema.

Responsável por:

* Implementar regras de negócio
* Orquestrar fluxos (ex: criar venda + pagamentos)
* Validar dados de acordo com o domínio
* Coordenar múltiplos repositórios

Os services **não conhecem a UI** nem detalhes técnicos de infraestrutura.

#### Responsabilidade dos Services

Os services são responsáveis por **aplicar e garantir todas as regras de negócio**, incluindo:

- Validação de estados e transições (open, closed, canceled)
- Validação de regras financeiras
- Controle de criação de Transactions
- Garantia de histórico imutável
- Aplicação das regras de estoque

Nenhuma regra de negócio deve ser implementada na UI ou nos repositories.

---

### 3.3 Repositories

Responsáveis pelo acesso e persistência dos dados.

Funções principais:

* Criar, ler, atualizar e remover dados
* Aplicar filtros e consultas
* Traduzir entidades do domínio para persistência

Os repositories pertencem ao domínio porque definem **como o negócio precisa acessar os dados**, mesmo que utilizem IndexedDB internamente.

#### Limites dos Repositories

Os repositories têm responsabilidade **exclusivamente técnica**, incluindo:

- Persistência de dados
- Consultas e filtros
- Aplicação de índices do banco

Repositories **não devem**:
- Validar regras de negócio
- Decidir estados ou transições
- Criar ou interpretar Transactions
- Calcular status financeiros

Toda decisão de negócio pertence aos services.

---

### 3.4 Infraestrutura

Camada técnica de suporte.

Responsável por:

* Configuração do IndexedDB
* Instância e versionamento do Dexie
* Definição de tabelas e índices
* Migrações de schema

A infraestrutura **não contém regras de negócio**.

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

Representam conceitos centrais do negócio, como:

* Cliente
* Venda
* Produto
* Compra

Entities descrevem **o que existe no domínio** e possuem vida longa no sistema.

### 5.2 Types

Representam contratos de dados auxiliares, como:

* Inputs de criação
* Filtros
* Enums
* Tipos de apoio

Types não representam conceitos isolados do negócio.

---

## 6. Comunicação entre camadas

### Regra de ouro

* UI nunca acessa repositórios diretamente
* UI nunca acessa Dexie
* Repositórios não chamam services

Toda comunicação segue o fluxo:

```
UI → Service → Repository → Dexie
```

---

## 7. Injeção de dependências

Os services recebem seus repositórios via parâmetros, permitindo:

* Testes
* Mocks
* Baixo acoplamento

Exemplo conceitual:

* Service recebe um ou mais repositórios
* Repositórios acessam a infraestrutura

---

## 8. Decisões conscientes

### 8.1 Sem backend

Decisão intencional para simplificar uso e garantir funcionamento offline.

### 8.2 Repositórios no domínio

Apesar de utilizarem IndexedDB, os repositories pertencem ao domínio por representarem contratos de persistência do negócio.

### 8.3 Entities anêmicas

As regras de negócio residem nos services, não nas entities.

---

## 9. Evolução da arquitetura

Esta arquitetura foi projetada para:

* Crescimento incremental
* Refatorações seguras
* Facilidade de entendimento por novos desenvolvedores
* Uso eficiente de ferramentas de auxílio (ex: GitHub Copilot)

---

Este documento define **como o sistema está organizado** e **como as decisões arquiteturais devem ser respeitadas ao longo do desenvolvimento**.
