# SEARCH_FILTERS.md  
## Busca e Filtros – Sistema ERP PWA

---

# 1. Objetivo deste documento

Este documento define de forma normativa como funcionam as buscas e os filtros no Sistema ERP PWA.

Ele estabelece:

- O comportamento da barra única de busca textual
- Os campos considerados na busca por entidade
- Os filtros estruturados disponíveis por entidade
- A separação clara entre busca, filtros e dados derivados
- A representação obrigatória desses estados na URL

Este documento serve como contrato entre:

UI  
Routes (Data Router)  
Services  
Repositories  

---

# 2. Princípios fundamentais

## 2.1 URL como fonte da verdade

Busca e filtros são representados obrigatoriamente como query parameters na URL.

Exemplo:

/sales?search=joao&status=open&from=2024-01-01&to=2024-01-31

A alteração da URL:

- Dispara automaticamente o loader da rota
- Reexecuta o fluxo de busca
- Atualiza a listagem
- Mantém compatibilidade com back/forward
- Permite deep linking

Não é permitido manter estado duplicado entre UI e URL.

---

## 2.2 Busca textual (Search)

- Existe uma única barra de busca por listagem
- A busca é exclusivamente textual
- O texto digitado é aplicado apenas a campos previamente definidos
- A busca reduz o universo inicial de dados
- A busca nunca executa cálculos derivados

A interpretação da busca ocorre no loader da rota.

---

## 2.3 Filtros estruturados (Filters)

- Filtros são aplicados por meio de inputs específicos
- Filtros são estruturados (booleanos, enums, ranges, datas)
- Filtros refinam o resultado da busca
- Filtros alteram query parameters
- Aplicação efetiva ocorre no loader

Filtros nunca são armazenados em estado local isolado.

---

## 2.4 Ordem de aplicação

A ordem de aplicação é obrigatória:

1. Busca textual (repository / índice)
2. Filtros estruturados simples (repository / índice)
3. Filtros derivados (service / memória)

Essa ordem não pode ser alterada.

---

# 3. Responsabilidades por camada

## 3.1 UI

Responsável por:

- Renderizar barra de busca
- Renderizar painel de filtros
- Atualizar query parameters
- Exibir resultados retornados pelo loader

A UI:

- Não executa busca diretamente
- Não aplica filtros manualmente
- Não calcula dados derivados
- Não chama services diretamente

---

## 3.2 Route (Loader)

Responsável por:

- Ler query parameters
- Validar parâmetros
- Chamar o service com os filtros extraídos
- Retornar o resultado final para a UI

O loader não implementa regras de negócio.

---

## 3.3 Service

Responsável por:

- Aplicar regras derivadas
- Calcular dados financeiros
- Aplicar filtros baseados em dados derivados
- Garantir consistência das regras

---

## 3.4 Repository

Responsável por:

- Executar consultas indexadas
- Aplicar filtros simples
- Retornar dados persistidos

Repositories nunca aplicam filtros derivados.

---

# 4. Agenda (CalendarEvent)

## Busca

Campos considerados:

- title

## Filtros

- Período:
  - data inicial (from)
  - data final (to)

Query example:

/calendar?from=2024-01-01&to=2024-01-31

---

# 5. Clientes (Client)

## Busca

Campos considerados:

- name
- document
- phone

## Filtros

- Status:
  - active=true
  - active=false

- Situação financeira:
  - debtStatus=with_debt
  - debtStatus=clear

- Dívida:
  - minDebt
  - maxDebt

## Observações

- Dívida é dado derivado (sales + transactions)
- Filtros financeiros são aplicados exclusivamente no service
- Repositories não calculam dívida

---

# 6. Fornecedores (Supplier)

## Busca

Campos considerados:

- name
- document
- phone

## Filtros

- Status:
  - active=true
  - active=false

- Situação financeira:
  - debtStatus=owing
  - debtStatus=clear

- Dívida:
  - minDebt
  - maxDebt

## Observações

- Dívida é dado derivado (purchases + transactions)
- Filtros financeiros são aplicados exclusivamente no service

---

# 7. Produtos (Product)

## Busca

Campos considerados:

- name

## Filtros

- Controle de estoque:
  - stockControl=true
  - stockControl=false

- Estoque:
  - minStock
  - maxStock

- Custo:
  - minCost
  - maxCost

- Valor de venda:
  - minSellPrice
  - maxSellPrice

- Status:
  - active=true
  - active=false

---

# 8. Serviços (Service)

## Busca

Campos considerados:

- name

## Filtros

- Preço:
  - minPrice
  - maxPrice

- Status:
  - active=true
  - active=false

---

# 9. Vendas (Sale)

## Busca

Campos considerados:

- nome do cliente

## Filtros

- Valor total:
  - minTotal
  - maxTotal

- Status da venda:
  - status=open
  - status=closed
  - status=canceled

- Período:
  - from
  - to

- Status de pagamento:
  - paymentStatus=pending
  - paymentStatus=partial
  - paymentStatus=paid

## Observações

- Busca por nome do cliente ocorre via relacionamento Client → Sale
- Vendas sem clientId não participam da busca por nome de cliente
- Status de pagamento é dado derivado
- Filtro de paymentStatus é aplicado exclusivamente no service

---

# 10. Compras (Purchase)

## Busca

Campos considerados:

- nome do fornecedor

## Filtros

- Valor total:
  - minTotal
  - maxTotal

- Status da compra:
  - status=open
  - status=closed
  - status=canceled

- Período:
  - from
  - to

- Status de pagamento:
  - paymentStatus=pending
  - paymentStatus=partial
  - paymentStatus=paid

## Observações

- Status de pagamento é dado derivado
- Aplicação ocorre no service

---

# 11. Transações (Transaction)

## Busca

Campos considerados:

- title

## Filtros

- Origem:
  - origin=sale
  - origin=purchase
  - origin=manual

- Tipo:
  - type=in
  - type=out

- Valor:
  - minValue
  - maxValue

- Período:
  - from
  - to

---

# 12. Considerações técnicas

- Campos derivados nunca são indexados
- Busca textual utiliza índices simples quando possível
- Filtros por range utilizam índices numéricos
- Combinações complexas são resolvidas no service
- Loader nunca implementa regra de negócio
- UI nunca executa lógica de filtragem

---

# 13. Regra final

A busca reduz o conjunto inicial de dados.  
Os filtros refinam o resultado.  
Dados derivados são responsabilidade exclusiva do service.  
A URL representa o estado da listagem.  
O loader executa o fluxo.  
A UI apenas exibe.
