# Banco de Dados – IndexedDB (Dexie)

## 1. Visão geral

Este documento descreve a **modelagem do banco de dados local** do Sistema ERP PWA, utilizando **IndexedDB** por meio da biblioteca **Dexie**.

O banco de dados é a **fonte única de verdade** do sistema. Toda persistência ocorre localmente no navegador, respeitando as regras definidas em `DOMAIN.md`.

---

## 2. Princípios de modelagem

### 2.1 Fonte única de verdade

* Não há backend
* Não há sincronização
* IndexedDB é o armazenamento principal

### 2.2 Histórico imutável

* Registros financeiros não são apagados
* Cancelamentos geram novos registros
* Correções nunca sobrescrevem histórico

### 2.3 Índices orientados a filtros reais

* Apenas campos usados em filtros e relacionamentos são indexados
* Campos derivados **não** são indexados

---

## 3. Estrutura geral do banco

```txt
Database: erp-database

Tables:
- calendar
- clients
- suppliers
- products
- services
- sales
- purchases
- transactions
```

Todas as tabelas utilizam:

* `id` como chave primária auto incremental

---

## 4. Tabelas e índices

## 4.1 calendar

### Campos

* id
* title
* description
* date

### Índices

```ts
id
,title
,date
```

### Justificativa

* Busca por título
* Filtro por período

---

## 4.2 clients

### Campos

* id
* name
* document
* address
* phone
* notes
* active
* createdAt

### Índices

```ts
id
,name
,document
,phone
,active
```

### Observações

* Dívidas são calculadas via sales + transactions
* Não há índice para valores derivados

---

## 4.3 suppliers

### Campos

* id
* name
* document
* address
* phone
* notes
* active
* createdAt

### Índices

```ts
id
,name
,document
,phone
,active
```

---

## 4.4 products

### Campos

* id
* name
* supplierId
* stockControl
* stock
* cost
* sellPrice
* active
* notes

### Índices

```ts
id
,name
,supplierId
,stockControl
,stock
,cost
,sellPrice
,active
```

### Observações

* Estoque negativo não é permitido
* Filtro de estoque usa campo `stock`

---

## 4.5 services

### Campos

* id
* name
* price
* active
* notes

### Índices

```ts
id
,name
,price
,active
```

---

## 4.6 sales

### Campos

* id
* clientId
* items
* affectStock
* totalValue
* paymentStatus
* status
* date
* notes

### Índices

```ts
id
,clientId
,date
,totalValue
,paymentStatus
,status
```

### Observações

* Busca por nome do cliente ocorre via tabela clients
* paymentStatus é armazenado para filtros rápidos

---

## 4.7 purchases

### Campos

* id
* supplierId
* items
* affectStock
* totalValue
* paymentStatus
* status
* date
* notes

### Índices

```ts
id
,supplierId
,date
,totalValue
,paymentStatus
,status
```

---

## 4.8 transactions

### Campos

* id
* title
* description
* type
* origin
* value
* method
* date
* referenceId

### Índices

```ts
id
,title
,origin
,type
,value
,date
,referenceId
```

### Observações

* `referenceId` é crítico para relacionamentos
* Transactions manuais possuem `referenceId = null`

---

## 5. Relacionamentos lógicos

> IndexedDB não possui foreign keys. Relacionamentos são mantidos logicamente.

### Relacionamentos principais

* sales.clientId → clients.id
* purchases.supplierId → suppliers.id
* products.supplierId → suppliers.id
* transactions.referenceId → sales.id | purchases.id

---

## 6. Estratégia de consultas

### Busca por texto

* Utiliza índices simples (`name`, `title`)

### Filtros por intervalo

* Utiliza índices numéricos (`date`, `value`, `totalValue`)

### Filtros derivados

* Realizados no service (em memória)

---

## 7. Performance e boas práticas

* Evitar índices desnecessários
* Preferir filtros por índices
* Realizar agregações no service
* Não indexar campos textuais longos (notes, description)

---

## 8. Evolução do banco

* Novos índices devem ser adicionados apenas quando necessários
* Alterações de schema devem respeitar versionamento do Dexie
* Refatorações de domínio exigem revisão deste documento

---

Este documento define **como os dados são armazenados e consultados** no Sistema ERP PWA.
