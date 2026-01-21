# Guia de Desenvolvimento – Sistema ERP PWA

## 1. Objetivo deste documento

Este documento define **como desenvolver no projeto sem quebrar o domínio, a arquitetura e as regras de negócio**.

Ele serve como guia prático para:

* Novos desenvolvedores
* Manutenção futura
* Padronização de código
* Uso correto das camadas

---

## 2. Princípios fundamentais

### 2.1 Domínio é soberano

* Todas as regras de negócio estão definidas em `DOMAIN.md`
* Nenhuma decisão de negócio deve ser tomada fora dos services

### 2.2 Arquitetura deve ser respeitada

Fluxo obrigatório:

```
UI → Services → Repositories → Dexie
```

Quebras desse fluxo **não são permitidas**.

---

## 3. Organização de pastas

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

## 4. Regras por camada

### 4.1 UI (Pages / Components)

A UI é **burra por definição**.

Pode:

* Coletar dados
* Exibir dados
* Chamar services
* Controlar estado visual

Não pode:

* Implementar regras de negócio
* Acessar Dexie
* Acessar repositories diretamente
* Calcular status financeiros

---

### 4.2 Services

Services são o **coração do sistema**.

Responsabilidades:

* Validar regras de negócio
* Validar estados e transições
* Criar e controlar Transactions
* Aplicar regras de estoque
* Orquestrar múltiplos repositories

Boas práticas:

* Um service por domínio (sale, purchase, transaction, etc.)
* Funções pequenas e explícitas
* Nomes verbosos são preferíveis

---

### 4.3 Repositories

Repositories são responsáveis apenas por **persistência e consulta**.

Podem:

* Criar
* Ler
* Atualizar
* Listar
* Filtrar

Não podem:

* Validar regras de negócio
* Calcular valores
* Criar Transactions
* Alterar status de entidades

---

### 4.4 Infra (Dexie)

Responsável por:

* Definição do schema
* Índices
* Versionamento do banco

Nunca deve:

* Conter regra de negócio

---

## 5. Entities vs Types

### Entities

* Representam conceitos do negócio
* Possuem identidade
* São persistidas

Exemplos:

* Sale
* Purchase
* Transaction
* Client

### Types

* Estruturas auxiliares
* Não possuem identidade própria

Exemplos:

* ComercialItem
* PaymentStatus
* TransactionType

---

## 6. Regras de edição e cancelamento

* Registros financeiros não são editáveis
* Sale e Purchase seguem regras de estado (`open`, `closed`, `canceled`)
* Cancelamentos geram Transactions corretivas
* Exclusão física não é permitida

---

## 7. Filtros e consultas

* Filtros simples devem usar índices
* Filtros derivados devem ser aplicados no service
* Não criar índices sem necessidade real

---

## 8. Datas e histórico

* `createdAt` nunca é editável
* Transactions não podem ter data futura
* Sale, Purchase e CalendarEvent podem ter datas passadas ou futuras

---

## 9. Padrões de código

### 9.1 TypeScript

* Usar `interface` para entities
* Usar `type` para unions e enums
* Evitar `any`

### 9.2 Nomenclatura

* camelCase para variáveis
* PascalCase para entities
* Nomes explícitos são preferíveis

---

## 10. Commits e versionamento

Sugestão de padrão:

* `feat:` nova funcionalidade
* `fix:` correção
* `refactor:` refatoração
* `docs:` documentação

---

## 11. Uso do GitHub Copilot

* Manter DOMAIN.md atualizado melhora sugestões
* Evitar lógica de negócio na UI
* Preferir services explícitos

---

## 12. Regra final

> **Se uma decisão parece ambígua, consulte o DOMAIN.md.**

O domínio é a autoridade máxima do sistema.
