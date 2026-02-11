# Guia de Desenvolvimento – Sistema ERP PWA

## 1. Objetivo deste documento

Este documento define **como desenvolver no Sistema ERP PWA sem violar o domínio, a arquitetura e as regras de negócio**.

Ele existe para:

- Orientar novos desenvolvedores
- Padronizar decisões técnicas
- Evitar violações arquiteturais
- Garantir consistência de regras

Este guia é **normativo**. Quebras deliberadas das regras aqui descritas são consideradas erros de implementação.

---

## 2. Princípios fundamentais

### 2.1 O domínio é soberano

- Todas as regras de negócio estão definidas em `DOMAIN.md`
- Nenhuma decisão de negócio pode ser tomada fora dos services
- Implementações técnicas devem se adaptar ao domínio

Em caso de dúvida, **o domínio sempre vence**.

---

### 2.2 A arquitetura deve ser respeitada

O fluxo arquitetural é obrigatório:

```
UI → Services → Repositories → Dexie
```

Quebras desse fluxo **não são permitidas**.

---

## 3. Organização do código

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

A estrutura reflete diretamente as camadas arquiteturais do sistema.

---

## 4. Regras por camada

### 4.1 UI (Pages / Components)

A UI é **burra por definição**.

Pode:

- Coletar dados de entrada
- Exibir dados
- Controlar estado visual
- Chamar services

Não pode:

- Implementar regras de negócio
- Calcular valores financeiros
- Calcular status derivados (ex: paymentStatus)
- Acessar Dexie
- Acessar repositories diretamente

Qualquer lógica além de formatação e controle visual é proibida.

---

### 4.2 Services

Services são o **coração do sistema**.

Responsabilidades obrigatórias:

- Validar regras de negócio
- Validar estados e transições
- Orquestrar fluxos (ex: venda + pagamento + estoque)
- Criar e controlar Transactions
- Aplicar regras de estoque
- Calcular dados derivados (ex: paymentStatus)

Regras importantes:

- Services **importam diretamente** repositories singleton
- Services não recebem repositories por parâmetro
- Um service não deve conhecer UI nem Dexie
- Funções devem ser pequenas e explícitas

Toda regra de negócio **deve** estar aqui.

---

### 4.3 Repositories

Repositories são responsáveis **exclusivamente por persistência e consulta**.

Podem:

- Criar registros
- Ler registros
- Atualizar campos permitidos
- Listar e filtrar dados

Não podem:

- Validar regras de negócio
- Calcular valores
- Criar Transactions
- Decidir estados
- Aplicar regras derivadas

Repositories devem ser **determinísticos e previsíveis**.

---

### 4.4 Infraestrutura (Dexie)

Responsável apenas por:

- Definição do schema
- Índices
- Versionamento do banco

Nunca deve:

- Conter regras de negócio
- Conhecer entidades do domínio

---

## 5. Entities vs Types

### Entities

- Representam conceitos reais do negócio
- Possuem identidade
- São persistidas

Exemplos:

- Sale
- Purchase
- Transaction
- Client

---

### Types

- Estruturas auxiliares
- Não possuem identidade
- Não são persistidas isoladamente

Exemplos:

- ComercialItem
- Enums
- Filtros

---

## 6. Regras financeiras e histórico

- Registros financeiros nunca são editados
- Registros financeiros nunca são removidos
- Cancelamentos sempre geram Transactions corretivas
- Histórico é sempre preservado

Quebrar essas regras invalida o modelo financeiro.

---

## 7. Dados derivados

Dados derivados **nunca são persistidos**.

Exemplos:

- paymentStatus
- Saldos
- Dívidas

Regras:

- Devem ser calculados exclusivamente nos services
- Nunca podem ser alterados manualmente
- Nunca podem ser calculados na UI

---

## 8. Estados e transições

As entidades **Sale** e **Purchase** seguem uma máquina de estados explícita.

Estados:

- open
- closed
- canceled

Transições permitidas:

- open → closed
- open → canceled
- closed → canceled

Transições proibidas:

- closed → open
- canceled → open
- canceled → closed

Qualquer tentativa de transição inválida deve resultar em erro.

---

## 9. Datas

- Sale, Purchase e CalendarEvent podem ter datas passadas ou futuras
- Transaction não pode ter data futura
- Campos `createdAt` nunca podem ser alterados

---

## 10. Padrões de código

### 10.1 TypeScript

- Usar `interface` para entities
- Usar `type` para unions e enums
- Evitar `any`

---

### 10.2 Nomenclatura

- camelCase para variáveis
- PascalCase para entities e services
- Nomes explícitos são preferíveis a abreviações

---

### 10.3 Comentários

Comentários devem ser:

- **Curtos e ricos** - Máximo valor em mínimo espaço
- **Explicar "porquê", não "como"** - Código limpo se auto-explica
- **Destacar regras críticas** - Imutabilidade, soft-delete, machine state
- **Evitar redundância** - Não comentar código óbvio (ex: `// Create`)

**Exemplos corretos:**

```typescript
// ✅ Explica propósito especial
// Toggle active/inactive status (soft-delete)
async active(id: number, active: boolean) { ... }

// ✅ Destaca regra CRÍTICA
// Transactions are IMMUTABLE (no update or delete methods)

// ✅ Numera passos complexos
// 1. Apply indexed filters (text or active)
// 2. Calculate derived data (paymentStatus)
// 3. Filter by derived data (applied in-memory)
```

**Exemplos incorretos:**

```typescript
// ❌ Redundante
// Create
async create(data: CreateDTO) { ... }

// ❌ Apenas repete o código
// Update active field
async active(id: number, active: boolean) { ... }
```

---

## 11. Commits e versionamento

Padrão sugerido:

- `feat:` nova funcionalidade
- `fix:` correção
- `refactor:` refatoração
- `docs:` documentação

---

## 12. Regra final

> **Se uma decisão parece ambígua, consulte o DOMAIN.md.**

O domínio é a autoridade máxima do sistema.
