# Busca e Filtros – Sistema ERP PWA

## 1. Objetivo do documento

Este documento especifica **como funcionam as buscas e os filtros** no Sistema ERP PWA.

Ele define:

* O comportamento da **barra única de busca**
* Os **campos considerados** na busca por entidade
* Os **filtros disponíveis** por tipo de entidade
* A separação clara entre **busca textual** e **filtros estruturados**

Este documento serve como referência para:

* Implementação da UI
* Implementação dos services
* Definição de índices no banco

---

## 2. Conceitos fundamentais

### 2.1 Busca (Search)

* A busca ocorre por **uma única barra de pesquisa**
* A busca é **textual**
* O valor digitado é aplicado a **campos específicos**, dependendo da entidade
* A busca **não substitui filtros**, apenas reduz o conjunto inicial de dados

### 2.2 Filtros (Filters)

* Filtros ficam em um **formulário separado**
* Cada filtro possui seu próprio input
* Filtros são **estruturados** (booleanos, ranges, enums, datas)
* Filtros refinam o resultado da busca

### 2.3 Ordem de aplicação

1. Busca textual
2. Filtros estruturados
3. Regras derivadas (cálculos em service)

---

## 3. Agenda (CalendarEvent)

### Busca

* Campos considerados:

  * title

### Filtros

* Período:

  * data inicial
  * data final

---

## 4. Clientes (Client)

### Busca

* Campos considerados:

  * name
  * document
  * phone

### Filtros

* Status:

  * ativado
  * desativado
* Situação financeira:

  * com dívidas
  * em dia
* Dívida:

  * valor mínimo
  * valor máximo

### Observações

* Dívida é valor **derivado** (sales + transactions)
* Filtros financeiros são aplicados no service

---

## 5. Fornecedores (Supplier)

### Busca

* Campos considerados:

  * name
  * document
  * phone

### Filtros

* Status:

  * ativado
  * desativado
* Situação financeira:

  * devendo
  * em dia
* Dívida:

  * valor mínimo
  * valor máximo

### Observações

* Dívida é valor **derivado** (purchases + transactions)

---

## 6. Produtos (Product)

### Busca

* Campos considerados:

  * name

### Filtros

* Estoque:

  * estoque não controlado
  * em estoque
  * sem estoque
* Custo:

  * valor mínimo
  * valor máximo
* Valor de venda:

  * valor mínimo
  * valor máximo
* Status:

  * ativado
  * desativado

---

## 7. Serviços (Service)

### Busca

* Campos considerados:

  * name

### Filtros

* Preço:

  * valor mínimo
  * valor máximo
* Status:

  * ativado
  * desativado

---

## 8. Vendas (Sale)

### Busca

* Campos considerados:

  * nome do cliente

### Filtros

* Valor total:

  * mínimo
  * máximo
* Status de pagamento:

  * pendente
  * parcial
  * pago
* Status da venda:

  * aberta
  * fechada
  * cancelada
* Período:

  * data inicial
  * data final

### Observações

* Busca por nome do cliente ocorre via relacionamento Client → Sale

---

## 9. Compras (Purchase)

### Busca

* Campos considerados:

  * nome do fornecedor

### Filtros

* Valor total:

  * mínimo
  * máximo
* Status de pagamento:

  * pendente
  * parcial
  * pago
* Status da compra:

  * aberta
  * fechada
  * cancelada
* Período:

  * data inicial
  * data final

### Observações

* Busca por nome do fornecedor ocorre via relacionamento Supplier → Purchase

---

## 10. Transações (Transaction)

### Busca

* Campos considerados:

  * title

### Filtros

* Origem:

  * venda
  * compra
  * manual
* Tipo:

  * entrada
  * saída
* Valor:

  * mínimo
  * máximo
* Período:

  * data inicial
  * data final

---

## 11. Considerações técnicas

* Campos derivados **não são indexados**
* Busca textual utiliza índices simples quando possível
* Filtros de range utilizam índices numéricos
* Combinações complexas são tratadas no service

---

## 12. Regra final

> A busca **reduz o universo de dados**. Os filtros **refinam os resultados**.

Este documento define o **contrato funcional de busca e filtros** do sistema.
