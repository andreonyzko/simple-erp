# Busca e Filtros – Sistema ERP PWA

## 1. Objetivo deste documento

Este documento define **de forma normativa** como funcionam as buscas e os filtros no Sistema ERP PWA.

Ele estabelece:

* O comportamento da **barra única de busca textual**
* Os **campos considerados** na busca por entidade
* Os **filtros estruturados disponíveis** por entidade
* A separação clara entre **busca**, **filtros** e **dados derivados**

Este documento serve como contrato entre:

* UI
* Services
* Repositories

---

## 2. Conceitos fundamentais

### 2.1 Busca textual (Search)

* Existe **uma única barra de busca** por listagem
* A busca é **exclusivamente textual**
* O texto digitado é aplicado apenas a **campos previamente definidos**
* A busca **reduz o universo inicial de dados**, mas não substitui filtros

A busca nunca executa cálculos derivados.

---

### 2.2 Filtros estruturados (Filters)

* Filtros são aplicados por meio de um formulário separado
* Cada filtro possui um input específico
* Filtros são **estruturados** (booleanos, enums, ranges, datas)
* Filtros refinam o resultado da busca

---

### 2.3 Ordem de aplicação

A ordem de aplicação é **obrigatória**:

1. Busca textual (repository / índice)
2. Filtros estruturados simples (repository / índice)
3. Filtros derivados (service / memória)

---

## 3. Agenda (CalendarEvent)

### Busca

Campos considerados:

* title

### Filtros

* Período:

  * data inicial
  * data final

---

## 4. Clientes (Client)

### Busca

Campos considerados:

* name
* document
* phone

### Filtros

* Status:

  * ativo
  * desativado

* Situação financeira:

  * com dívidas
  * em dia

* Dívida:

  * valor mínimo
  * valor máximo

### Observações

* Dívida é um **dado derivado** (sales + transactions)
* Filtros financeiros são aplicados exclusivamente no service

---

## 5. Fornecedores (Supplier)

### Busca

Campos considerados:

* name
* document
* phone

### Filtros

* Status:

  * ativo
  * desativado

* Situação financeira:

  * devendo
  * em dia

* Dívida:

  * valor mínimo
  * valor máximo

### Observações

* Dívida é um **dado derivado** (purchases + transactions)
* Filtros financeiros são aplicados exclusivamente no service

---

## 6. Produtos (Product)

### Busca

Campos considerados:

* name

### Filtros

* Controle de estoque:

  * estoque não controlado
  * em estoque
  * sem estoque

* Estoque:

  * quantidade mínima
  * quantidade máxima

* Custo:

  * valor mínimo
  * valor máximo

* Valor de venda:

  * valor mínimo
  * valor máximo

* Status:

  * ativo
  * desativado

---

## 7. Serviços (Service)

### Busca

Campos considerados:

* name

### Filtros

* Preço:

  * valor mínimo
  * valor máximo

* Status:

  * ativo
  * desativado

---

## 8. Vendas (Sale)

### Busca

Campos considerados:

* nome do cliente

### Filtros

* Valor total:

  * mínimo
  * máximo

* Status da venda:

  * open
  * closed
  * canceled

* Período:

  * data inicial
  * data final

* Status de pagamento:

  * pending
  * partial
  * paid

### Observações

* Busca por nome do cliente ocorre via relacionamento Client → Sale
* Vendas sem `clientId` não participam da busca por nome de cliente
* Status de pagamento é um **dado derivado**, calculado no service

---

## 9. Compras (Purchase)

### Busca

Campos considerados:

* nome do fornecedor

### Filtros

* Valor total:

  * mínimo
  * máximo

* Status da compra:

  * open
  * closed
  * canceled

* Período:

  * data inicial
  * data final

* Status de pagamento:

  * pending
  * partial
  * paid

### Observações

* Busca por nome do fornecedor ocorre via relacionamento Supplier → Purchase
* Status de pagamento é um **dado derivado**, calculado no service

---

## 10. Transações (Transaction)

### Busca

Campos considerados:

* title

### Filtros

* Origem:

  * sale
  * purchase
  * manual

* Tipo:

  * in
  * out

* Valor:

  * mínimo
  * máximo

* Período:

  * data inicial
  * data final

---

## 11. Considerações técnicas

* Campos derivados nunca são indexados
* Busca textual utiliza índices simples quando possível
* Filtros por range utilizam índices numéricos
* Combinações complexas são resolvidas no service

---

## 12. Regra final

> A busca **reduz o conjunto de dados**. Os filtros **refinam o resultado**.

Qualquer cálculo ou decisão derivada pertence exclusivamente aos services.
