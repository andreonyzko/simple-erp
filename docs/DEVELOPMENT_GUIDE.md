# DEVELOPMENT_GUIDE.md  
## Guia de Desenvolvimento – Sistema ERP PWA

---

# 1. Objetivo deste documento

Este documento define **como desenvolver no Sistema ERP PWA sem violar o domínio, a arquitetura e as regras de negócio**.

Ele existe para:

- Orientar novos desenvolvedores
- Padronizar decisões técnicas
- Evitar violações arquiteturais
- Garantir consistência de regras
- Formalizar o fluxo com React Router Data Mode

Este guia é **normativo**. Quebras deliberadas das regras aqui descritas são consideradas erros de implementação.

---

# 2. Princípios fundamentais

## 2.1 O domínio é soberano

- Todas as regras de negócio estão definidas em `DOMAIN.md`
- Nenhuma decisão de negócio pode ser tomada fora dos services
- Implementações técnicas devem se adaptar ao domínio
- Routes nunca contêm regras de negócio

Em caso de dúvida, **o domínio sempre vence**.

---

## 2.2 A arquitetura deve ser respeitada

O fluxo arquitetural é obrigatório:

UI  
↓  
Route (loader/action)  
↓  
Service  
↓  
Repository  
↓  
Dexie  

Quebras desse fluxo **não são permitidas**.

---

# 3. Organização do código

src/  
 ├─ domain/  
 │   ├─ entities/  
 │   ├─ types/  
 │   ├─ services/  
 │   └─ repositories/  
 │  
 ├─ infra/  
 │   └─ database/  
 │       └─ dexie.ts  
 │  
 └─ ui/  
     ├─ layout/  
     ├─ components/  
     ├─ hooks/  
     ├─ pages/  
     ├─ routes/  
     └─ styles/  

Observações:

- A pasta `routes` contém loaders e actions.
- Pages são componentes visuais.
- UI não contém lógica de negócio.
- Services não conhecem UI nem rotas.

---

# 4. Regras por camada

---

## 4.1 UI (Pages / Components)

A UI é **burra por definição**.

Pode:

- Coletar dados de entrada
- Exibir dados retornados pelo loader
- Alterar query parameters
- Renderizar estado visual
- Utilizar `<Form>` ou `fetcher`
- Utilizar `useNavigation` para estados visuais

Não pode:

- Implementar regras de negócio
- Calcular valores financeiros
- Calcular status derivados (ex: paymentStatus)
- Acessar Dexie
- Acessar repositories diretamente
- Chamar services diretamente para mutações

Qualquer lógica além de formatação e controle visual é proibida.

---

## 4.2 Routes (Data Router Layer)

Routes são responsáveis por:

- Declarar `loader`
- Declarar `action`
- Interpretar a URL
- Extrair query parameters
- Chamar services
- Orquestrar fluxo de dados
- Declarar `errorElement`
- Permitir revalidação automática

Routes:

- Não implementam regras de negócio
- Não acessam Dexie
- Não acessam repositories diretamente
- Não contêm lógica financeira

Toda mutação de dados deve ocorrer via `action`.

---

## 4.3 Services

Services são o **coração do sistema**.

Responsabilidades obrigatórias:

- Validar regras de negócio
- Validar estados e transições
- Orquestrar fluxos (ex: venda + pagamento + estoque)
- Criar e controlar Transactions
- Aplicar regras de estoque
- Calcular dados derivados (ex: paymentStatus)

Regras importantes:

- Services importam diretamente repositories singleton
- Services não recebem repositories por parâmetro
- Services não conhecem UI
- Services não conhecem rotas
- Services não conhecem Dexie

Toda regra de negócio deve estar aqui.

---

## 4.4 Repositories

Repositories são responsáveis exclusivamente por persistência e consulta.

Podem:

- Criar registros
- Ler registros
- Atualizar campos permitidos
- Listar e filtrar dados persistidos

Não podem:

- Validar regras de negócio
- Calcular valores financeiros
- Criar Transactions
- Decidir estados
- Aplicar regras derivadas

Repositories devem ser determinísticos e previsíveis.

---

## 4.5 Infraestrutura (Dexie)

Responsável apenas por:

- Definição do schema
- Índices
- Versionamento do banco

Nunca deve:

- Conter regras de negócio
- Conhecer entidades do domínio
- Interferir no fluxo de rotas

---

# 5. Regras específicas do Data Router

## 5.1 Leitura de dados

Toda leitura de dados deve ocorrer via `loader`.

Exemplo correto:

- Loader extrai filtros da URL
- Loader chama service
- Service aplica regras
- Repository consulta Dexie

A UI nunca deve buscar dados diretamente.

---

## 5.2 Mutações

Toda mutação deve ocorrer via `action`.

Proibido:

- UI chamar service diretamente para criar, editar ou cancelar

Obrigatório:

- `<Form method="post">`
ou
- `fetcher.submit()`

A action chama o service.
O service executa regras.
O router revalida automaticamente.

---

## 5.3 Query Parameters

Busca e filtros devem ser representados como query parameters.

Exemplo:

/sales?search=joao&status=open

A alteração da URL dispara automaticamente o loader.

Não é permitido manter estado duplicado entre UI e URL.

---

## 5.4 Loading

Estados de navegação devem utilizar:

- `useNavigation`
- `fetcher.state`

Não é permitido:

- Criar estado manual de loading para dados de rota
- Controlar manualmente revalidação após action

---

## 5.5 Erros

Separação obrigatória:

- Erro técnico → tratado por `errorElement`
- Erro de negócio → retornado pela action e exibido na UI

Nunca misturar erros técnicos com regras de negócio.

---

# 6. Entities vs Types

## Entities

- Representam conceitos reais do negócio
- Possuem identidade
- São persistidas

Exemplos:

- Sale
- Purchase
- Transaction
- Client

---

## Types

- Estruturas auxiliares
- Não possuem identidade
- Não são persistidas isoladamente

Exemplos:

- ComercialItem
- Filtros
- Enums

---

# 7. Regras financeiras e histórico

- Registros financeiros nunca são editados
- Registros financeiros nunca são removidos
- Cancelamentos sempre geram Transactions corretivas
- Histórico é sempre preservado

Quebrar essas regras invalida o modelo financeiro.

---

# 8. Dados derivados

Dados derivados nunca são persistidos.

Exemplos:

- paymentStatus
- Saldos
- Dívidas

Regras:

- Devem ser calculados exclusivamente nos services
- Nunca podem ser alterados manualmente
- Nunca podem ser calculados na UI
- Nunca devem ser indexados

---

# 9. Estados e transições

As entidades Sale e Purchase seguem máquina de estados explícita.

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

Qualquer tentativa inválida deve resultar em erro no service.

---

# 10. Datas

- Sale, Purchase e CalendarEvent podem ter datas passadas ou futuras
- Transaction não pode ter data futura
- `createdAt` nunca pode ser alterado

Validação deve ocorrer nos services.

---

# 11. Padrões de código

## 11.1 TypeScript

- Usar `interface` para entities
- Usar `type` para unions e enums
- Evitar `any`

---

## 11.2 Nomenclatura

- camelCase para variáveis
- PascalCase para entities e services
- Nomes explícitos são preferíveis a abreviações

---

## 11.3 Comentários

Comentários devem:

- Explicar "porquê", não "como"
- Destacar regras críticas
- Evitar redundância
- Manter clareza conceitual

---

# 12. Commits e versionamento

Padrão sugerido:

- feat: nova funcionalidade
- fix: correção
- refactor: refatoração
- docs: documentação

---

# 13. Regra final

Se uma decisão parece ambígua:

1. Consulte DOMAIN.md
2. Consulte ARCHITECTURE.md
3. Verifique se está respeitando o fluxo oficial

O domínio é soberano.  
A arquitetura é obrigatória.  
O Router orquestra o fluxo.  
A UI é declarativa.  
Os services decidem as regras.
