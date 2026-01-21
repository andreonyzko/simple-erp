# Domínio do Sistema ERP PWA

## 1. Visão geral do domínio

Este documento define de forma **detalhada, normativa e definitiva** o domínio do Sistema ERP PWA. Ele descreve **entidades**, **tipos**, **atributos**, **regras de negócio**, **relacionamentos** e **limites conceituais**.

Tudo o que está aqui é considerado **fonte de verdade do negócio**. Implementações técnicas devem se adaptar a este documento, e não o contrário.

---

## 2. Princípios do domínio

### 2.1 Linguagem ubíqua

Todos os termos definidos neste documento devem ser utilizados de forma consistente em:

* Código
* Nomes de arquivos
* Services
* Repositories
* Tipos e enums

### 2.2 Domínio financeiro como núcleo

O núcleo do sistema é o **controle de entradas e saídas financeiras**. Compras e vendas existem para gerar movimentações financeiras, registradas através de **Transactions**.

---

## 3. Entidade central: Transaction

### Transaction

Representa uma **entrada ou saída financeira** no negócio.

Uma Transaction pode representar:

* Pagamento parcial ou total de uma venda
* Pagamento parcial ou total de uma compra
* Movimentação financeira manual (entrada ou saída)

#### Atributos

* id
* title
* description (opcional)
* type (TransactionType)
* origin (TransactionOrigin)
* value
* method (PaymentMethods)
* date
* referenceId (opcional)

#### Regras de negócio

* Representa pagamentos parciais ou integrais
* Pode existir sem `referenceId` quando for manual

**Toda Transaction de venda:**

* title = "Venda #ID"
* type = in
* origin = sale
* referenceId = id da venda

**Toda Transaction de compra:**

* title = "Compra #ID"

* type = out

* origin = purchase

* referenceId = id da compra

* Uma venda ou compra pode possuir **múltiplas Transactions**, representando pagamentos parciais

* Transactions de venda e compra **somente podem ser lançadas pela página da própria venda ou compra**

* Transactions manuais **são lançadas exclusivamente pela página de transactions**

Transaction é a **entidade mais importante do sistema**.

---

## 4. Entidades de negócio

### Sale

Representa uma venda de produtos e/ou serviços.

#### Atributos

* id
* clientId
* items
* affectStock (boolean)
* totalValue
* paymentStatus (PaymentStatus)
* status (SalePurchaseStatus)
* date
* notes (opcional)

#### Regras de negócio

* Venda sem cliente cadastrado possui `clientId = 0`
* Pode conter produtos e serviços
* `totalValue` é, por padrão, a soma dos items, mas pode ser sobrescrito manualmente
* O usuário decide se o estoque será afetado
* É possível lançar Transactions diretamente **somente na página da venda**
* `paymentStatus` é reflexo das Transactions:

  * pending: soma = 0
  * partial: soma entre 0 e totalValue
  * paid: soma >= totalValue
* Ao cancelar uma venda:

  * É gerada uma Transaction de saída (`out`)
  * O valor é a soma das Transactions que referenciam a venda

---

### Purchase

Representa uma compra de produtos de fornecedores.

#### Atributos

* id
* supplierId (opcional)
* items
* totalValue
* affectStock (boolean)
* paymentStatus (PaymentStatus)
* status (SalePurchaseStatus)
* date
* notes (opcional)

#### Regras de negócio

* Pode ou não conter fornecedor
* Contém apenas produtos
* `totalValue` é, por padrão, a soma dos items, mas pode ser sobrescrito
* O usuário escolhe se o estoque será incrementado
* É possível lançar Transactions diretamente **somente na página da compra**
* `paymentStatus` é reflexo das Transactions:

  * pending: soma = 0
  * partial: soma entre 0 e totalValue
  * paid: soma >= totalValue
* Ao cancelar uma compra:

  * É gerada uma Transaction de entrada (`in`)
  * O valor é a soma das Transactions que referenciam a compra

---

## 5. Entidades cadastrais

### Client

Representa uma pessoa física ou jurídica que realiza compras no negócio.

#### Atributos

* id
* name
* document (opcional)
* address (opcional)
* phone (opcional)
* notes (opcional)
* active (boolean)
* createdAt

#### Regras de negócio

* Cliente desativado permanece no histórico
* Cliente desativado não pode ser referenciado em novos registros
* `document` representa CPF ou CNPJ
* `address` é uma string simples

---

### Supplier

Representa uma pessoa física ou jurídica que fornece produtos ao negócio.

#### Atributos

* id
* name
* document (opcional)
* address (opcional)
* phone (opcional)
* notes (opcional)
* active (boolean)
* createdAt

#### Regras de negócio

* Fornecedor desativado permanece no histórico
* Fornecedor desativado não pode ser referenciado em novos registros
* `document` representa CPF ou CNPJ
* `address` é uma string simples

---

### Product

Representa um item físico comercializado.

#### Atributos

* id
* name
* supplierId (opcional)
* stockControl (boolean)
* stock (opcional)
* cost (opcional)
* sellPrice (opcional)
* active (boolean)
* notes (opcional)

#### Regras de negócio

* Pode ou não pertencer a um fornecedor
* Se `stockControl` for falso, não existe controle de estoque
* Valores de custo e venda são opcionais
* Produto desativado não aparece em novos registros, mas permanece no histórico

---

### Service

Representa um serviço prestado pelo negócio.

#### Atributos

* id
* name
* price (opcional)
* active (boolean)
* notes (opcional)

#### Regras de negócio

* Valor de venda é opcional
* Não possui estoque
* Não participa de compras

---

## 6. Agenda

### CalendarEvent

Representa um evento da agenda.

#### Atributos

* id
* title
* description (opcional)
* date

#### Regras de negócio

* É totalmente desacoplado de outras entidades
* Não possui impacto financeiro

---

## 7. Conceitos auxiliares (Types)

### ComercialItem

Representa um item dentro de uma venda ou compra.

#### Atributos

* id
* type (ComercialItemType)
* referenceId
* quantity
* unitValue

#### Regras de negócio

* Compras não podem conter items do tipo service
* `unitValue` recebe o valor padrão do produto/serviço, mas pode ser sobrescrito

---

### PaymentMethods

Representa os métodos de pagamento.

Valores:

* pix
* cash
* ted
* boleto
* debit_card
* credit_card

---

### PaymentStatus

Indica o progresso de pagamento de uma venda ou compra.

Valores:

* pending
* partial
* paid

Regras:

* pending: soma das Transactions = 0
* partial: soma entre 0 e totalValue
* paid: soma >= totalValue

---

### TransactionType

Indica se a Transaction é entrada ou saída.

Valores:

* in
* out

Regras:

* Venda: in
* Compra: out
* Venda cancelada: out
* Compra cancelada: in

---

### TransactionOrigin

Indica a origem da Transaction.

Valores:

* sale
* purchase
* manual

Regras:

* Venda → sale
* Compra → purchase
* Cadastro manual → manual

---

### ComercialItemType

Indica o tipo do item comercial.

Valores:

* product
* service

Regras:

* Compras não podem conter service

---

### SalePurchaseStatus

Indica o status de uma venda ou compra.

Valores:

* open
* closed
* canceled

---

## 8. Regras operacionais transversais

### 8.1 Estados e transições (State Machine)

As entidades **Sale** e **Purchase** seguem uma máquina de estados explícita.

Estados possíveis:

* open
* closed
* canceled

Transições válidas:

* open → closed
* open → canceled
* closed → canceled

Transições inválidas:

* canceled → open
* canceled → closed

Uma vez cancelada, a entidade é considerada **final**.

---

### 8.2 Regras de edição por estado

#### Sale / Purchase em estado `open`

Campos editáveis:

* items
* affectStock
* totalValue
* notes
* date

Campos não editáveis:

* id
* paymentStatus (derivado)

#### Sale / Purchase em estado `closed`

Campos editáveis:

* notes

Campos não editáveis:

* items
* affectStock
* totalValue
* date
* paymentStatus

#### Sale / Purchase em estado `canceled`

* Nenhum campo é editável

---

### 8.3 Regras de exclusão

* Nenhuma entidade financeira pode ser excluída fisicamente
* Sale e Purchase devem ser canceladas quando inválidas
* Transaction nunca pode ser excluída

---

### 8.4 Cancelamento

* Cancelamento gera sempre uma Transaction corretiva
* Cancelamento não remove histórico

---

### 8.5 Estoque

* Estoque **não pode ficar negativo**
* Estoque só é alterado se `affectStock = true`
* Cancelamentos **revertem o estoque** conforme a decisão original

---

### 8.6 Regras de datas

* Sale, Purchase e CalendarEvent podem possuir datas passadas ou futuras
* Transaction **não pode** possuir data futura
* Campos `createdAt` **não podem** ser alterados nem definidos no futuro

---

### 8.7 Transactions manuais

* Transaction manual:

  * origin deve ser obrigatoriamente `manual`
  * não pode possuir `referenceId`
  * não pode referenciar Sale ou Purchase

---

### 8.8 Pagamento

* paymentStatus é sempre derivado das Transactions
* Nunca pode ser alterado manualmente

---

## 9. Limites do domínio

Este domínio não contempla:

* Emissão fiscal
* Contabilidade
* Multiusuário
* Permissões
* Sincronização em nuvem

---

## 10. Evolução do domínio

Este domínio foi modelado para:

* Evoluir incrementalmente
* Manter histórico imutável
* Garantir rastreabilidade financeira
* Servir como base sólida para regras futuras
