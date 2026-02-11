# Domínio do Sistema ERP PWA

## 1. Visão geral do domínio

Este documento define de forma **normativa, explícita e definitiva** o domínio do Sistema ERP PWA.

Aqui estão descritos:

- Conceitos centrais do negócio
- Entidades e seus atributos
- Tipos auxiliares
- Regras de negócio
- Relacionamentos lógicos
- Limites conceituais

Tudo o que está documentado neste arquivo é considerado **fonte única de verdade do domínio**. Implementações técnicas devem **se adaptar ao domínio**, e nunca o contrário.

---

## 2. Princípios do domínio

### 2.1 Linguagem ubíqua

Todos os termos definidos neste documento devem ser utilizados de forma consistente em:

- Código
- Nomes de arquivos
- Services
- Repositories
- Types e enums

Termos diferentes para o mesmo conceito são proibidos.

---

### 2.2 Domínio financeiro como núcleo

O núcleo do sistema é o **controle de movimentações financeiras**.

Eventos comerciais, como vendas e compras, existem para **gerar movimentações financeiras**, representadas explicitamente pela entidade **Transaction**.

---

## 3. Entidade central: Transaction

### Transaction

Representa uma **entrada ou saída financeira** no negócio.

Toda movimentação de dinheiro no sistema é representada por uma Transaction.

#### Atributos

- id
- title
- description (opcional)
- type (TransactionType)
- origin (TransactionOrigin)
- value
- method (PaymentMethods)
- date
- referenceId (opcional)

#### Regras de negócio

- Transactions representam pagamentos parciais ou integrais
- Uma Transaction pode existir sem `referenceId` quando for manual
- Transactions **nunca são editadas nem removidas**

**Transactions de venda:**

- title = "Venda #ID"
- type = in
- origin = sale
- referenceId = id da venda

**Transactions de compra:**

- title = "Compra #ID"
- type = out
- origin = purchase
- referenceId = id da compra

- Uma venda ou compra pode possuir **múltiplas Transactions**
- Transactions de venda e compra **só podem ser lançadas a partir da própria venda ou compra**
- Transactions manuais **só podem ser lançadas pela página de transactions**

Transaction é a **entidade mais importante do sistema**.

---

## 4. Entidades comerciais

### Sale

Representa uma venda de produtos e/ou serviços.

#### Atributos

- id
- clientId (opcional)
- items
- affectStock (boolean)
- totalValue
- status (SalePurchaseStatus)
- date
- notes (opcional)

#### Regras de negócio

- `clientId` é opcional; sua ausência indica uma venda sem cliente cadastrado
- Pode conter produtos e serviços
- `totalValue` é, por padrão, a soma dos items, mas pode ser sobrescrito manualmente
- O usuário decide se o estoque será afetado

#### Pagamento

O status de pagamento **não é armazenado**.

Ele é sempre calculado dinamicamente com base nas Transactions associadas:

- pending: soma = 0
- partial: soma > 0 e < totalValue
- paid: soma >= totalValue

#### Cancelamento

Ao cancelar uma venda:

- A venda muda para o estado `canceled`
- É gerada uma Transaction de saída (`out`)
- O valor da Transaction corretiva é a soma das Transactions da venda

---

### Purchase

Representa uma compra de produtos de fornecedores.

#### Atributos

- id
- supplierId (opcional)
- items
- affectStock (boolean)
- totalValue
- status (SalePurchaseStatus)
- date
- notes (opcional)

#### Regras de negócio

- Pode ou não possuir fornecedor
- Contém apenas produtos
- `totalValue` é, por padrão, a soma dos items, mas pode ser sobrescrito
- O usuário decide se o estoque será incrementado

#### Pagamento

O status de pagamento **não é armazenado**.

Ele é sempre calculado dinamicamente com base nas Transactions associadas:

- pending: soma = 0
- partial: soma > 0 e < totalValue
- paid: soma >= totalValue

#### Cancelamento

Ao cancelar uma compra:

- A compra muda para o estado `canceled`
- É gerada uma Transaction de entrada (`in`)
- O valor da Transaction corretiva é a soma das Transactions da compra

---

## 5. Entidades cadastrais

### Client

Representa uma pessoa física ou jurídica que realiza compras.

#### Atributos

- id
- name
- document (opcional)
- address (opcional)
- phone (opcional)
- notes (opcional)
- active (boolean)
- createdAt

#### Regras de negócio

- Clientes desativados permanecem no histórico
- Clientes desativados não podem ser utilizados em novos registros
- Services devem validar se a entidade já está no estado solicitado antes de persistir (evitar toggles redundantes)

---

### Supplier

Representa uma pessoa física ou jurídica que fornece produtos.

#### Atributos

- id
- name
- document (opcional)
- address (opcional)
- phone (opcional)
- notes (opcional)
- active (boolean)
- createdAt

#### Regras de negócio

- Fornecedores desativados permanecem no histórico
- Fornecedores desativados não podem ser utilizados em novos registros
- Services devem validar se a entidade já está no estado solicitado antes de persistir (evitar toggles redundantes)

---

### Product

Representa um item físico comercializado.

#### Atributos

- id
- name
- supplierId (opcional)
- stockControl (boolean)
- stock (opcional)
- cost (opcional)
- sellPrice (opcional)
- active (boolean)
- notes (opcional)

#### Regras de negócio

- Pode ou não pertencer a um fornecedor
- Se `stockControl` for falso, não existe controle de estoque
- Estoque nunca pode ficar negativo
- Produto desativado permanece no histórico

---

### Service

Representa um serviço prestado pelo negócio.

#### Atributos

- id
- name
- price (opcional)
- active (boolean)
- notes (opcional)

#### Regras de negócio

- Não possui estoque
- Não participa de compras

---

## 6. Agenda

### CalendarEvent

Representa um evento da agenda.

#### Atributos

- id
- title
- description (opcional)
- date

#### Regras de negócio

- Não possui impacto financeiro
- Não se relaciona com outras entidades

---

## 7. Tipos auxiliares

### ComercialItem

Representa um item dentro de uma venda ou compra.

#### Atributos

- id
- type (ComercialItemType)
- referenceId
- quantity
- unitValue

#### Regras de negócio

- Compras não podem conter items do tipo service

---

### PaymentMethods

Valores possíveis:

- pix
- cash
- ted
- boleto
- debit_card
- credit_card

---

### TransactionType

Valores possíveis:

- in
- out

---

### TransactionOrigin

Valores possíveis:

- sale
- purchase
- manual

---

### ComercialItemType

Valores possíveis:

- product
- service

---

### SalePurchaseStatus

Valores possíveis:

- open
- closed
- canceled

---

## 8. Estados e transições

As entidades **Sale** e **Purchase** seguem uma máquina de estados explícita.

### Estados possíveis

- open
- closed
- canceled

### Transições válidas

- open → closed
- open → canceled
- closed → canceled

### Transições inválidas

- closed → open
- canceled → open
- canceled → closed

Uma vez fechada ou cancelada, a entidade **nunca retorna ao estado open**.

---

## 9. Regras transversais

### 9.1 Histórico imutável

- Nenhuma entidade financeira pode ser excluída
- Transactions nunca são editadas ou removidas

---

### 9.2 Estoque

- Estoque nunca pode ficar negativo
- Estoque só é alterado se `affectStock = true`
- Cancelamentos revertem estoque conforme a decisão original

---

### 9.3 Datas

- Sale, Purchase e CalendarEvent podem ter datas passadas ou futuras
- Transaction **não pode** ter data futura
- `createdAt` nunca pode ser alterado

---

### 9.4 Transactions manuais

- origin deve ser `manual`
- Não possuem `referenceId`
- Não podem referenciar Sale ou Purchase

---

## 10. Limites do domínio

Este domínio **não contempla**:

- Emissão fiscal
- Contabilidade formal
- Multiusuário
- Permissões
- Sincronização

---

Este documento define **as regras absolutas do negócio** e deve ser respeitado integralmente em toda implementação.
