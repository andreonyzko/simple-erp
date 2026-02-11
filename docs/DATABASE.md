# Banco de Dados – IndexedDB (Dexie)

## 1. Visão geral

Este documento define a **modelagem do banco de dados local** do Sistema ERP PWA.

O sistema utiliza **IndexedDB**, por meio da biblioteca **Dexie**, como **única fonte de persistência de dados**. Não existe backend, sincronização ou qualquer outra fonte externa de dados.

O banco de dados é **subordinado ao domínio**. Nenhuma decisão de modelagem pode violar ou reinterpretar regras definidas em `DOMAIN.md`.

---

## 2. Princípios de modelagem

### 2.1 Fonte única de verdade

* Toda persistência ocorre localmente no navegador
* Não há backend
* Não há sincronização
* IndexedDB é a fonte única de dados persistidos

---

### 2.2 Histórico imutável

* Registros financeiros **não são editados nem removidos**
* Cancelamentos e correções geram **novos registros**
* Histórico nunca é sobrescrito

---

### 2.3 Dados derivados não persistidos

Campos que podem ser derivados de outras entidades **não são armazenados no banco**.

Exemplos:

* `paymentStatus`
* Saldos
* Dívidas

Esses dados são sempre calculados dinamicamente nos services.

---

### 2.4 Índices orientados a consultas reais

* Apenas campos usados em filtros, buscas ou relacionamentos são indexados
* Campos derivados **nunca** são indexados
* Índices são adicionados apenas quando existe necessidade comprovada

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

* Clientes desativados permanecem no histórico
* Dívidas e situação financeira são **dados derivados**

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
* supplierId (opcional)
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
* O campo `stock` só é utilizado quando `stockControl = true`

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
* clientId (opcional)
* items
* affectStock
* totalValue
* status
* date
* notes

### Índices

```ts
id
,clientId
,date
,totalValue
,status
```

### Observações

* `clientId` é opcional
* Vendas sem cliente cadastrado não possuem relacionamento com `clients`
* `paymentStatus` **não é persistido**

---

## 4.7 purchases

### Campos

* id
* supplierId (opcional)
* items
* affectStock
* totalValue
* status
* date
* notes

### Índices

```ts
id
,supplierId
,date
,totalValue
,status
```

### Observações

* `paymentStatus` **não é persistido**

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
* referenceId (opcional)

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

* `referenceId` mantém relacionamentos lógicos
* Transactions manuais possuem `referenceId = null`
* Transactions nunca são editadas ou removidas

---

## 5. Relacionamentos lógicos

> IndexedDB não possui foreign keys. Todos os relacionamentos são mantidos logicamente pelo domínio.

Relacionamentos principais:

* sales.clientId → clients.id
* purchases.supplierId → suppliers.id
* products.supplierId → suppliers.id
* transactions.referenceId → sales.id | purchases.id

---

## 6. Estratégia de consultas

### Busca textual

* Utiliza índices simples (ex: `name`, `title`)

### Filtros por intervalo

* Utiliza índices numéricos (ex: `date`, `value`, `totalValue`)

### Dados derivados

* Calculados no service
* Nunca persistidos
* Nunca indexados

---

## 7. Performance e boas práticas

* Evitar índices desnecessários
* Preferir consultas indexadas
* Realizar agregações no service
* Não indexar campos textuais longos (`notes`, `description`)

---

## 8. Evolução do banco

* Alterações de schema devem respeitar versionamento do Dexie
* Novos índices devem ser justificados por necessidade real
* Mudanças no domínio exigem revisão deste documento

---

Este documento define **como os dados são armazenados**, e deve permanecer sempre alinhado ao domínio.
