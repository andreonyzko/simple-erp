# UI_ARCHITECTURE.md  
## Sistema ERP PWA — Documentação da Camada de UI

---

# 1. Objetivo da UI

A camada de UI é responsável exclusivamente por:

- Renderização de telas  
- Interação com o usuário  
- Coleta de dados de entrada  
- Exibição de dados retornados pelos loaders  
- Controle de estado visual  

A UI:

- Não contém regras de negócio  
- Não acessa repositories  
- Não acessa Dexie  
- Não executa mutações diretamente nos services  

Fluxo obrigatório:

UI  
↓  
Route (loader/action)  
↓  
Service  
↓  
Repository  
↓  
Dexie  

A UI é declarativa e orientada à rota.

---

# 2. Stack de Tecnologias

## Base
- React  
- React Router (Data Router Mode)

## UI e Estilização
- TailwindCSS  
- Shadcn/UI  
- Lucide React  
- clsx  

## Tabelas
- TanStack Table  

## Formulários
- React Hook Form  
- Zod  

## Datas
- date-fns  
- react-day-picker  

## Notificações
- Sonner  

---

# 3. Papel do React Router (Data Mode)

O React Router é o orquestrador oficial do fluxo de dados.

Cada rota pode definir:

- loader → leitura de dados
- action → mutação de dados
- errorElement → tratamento de erro técnico
- children → rotas aninhadas

Regras:

- Dados de listagem vêm exclusivamente do loader
- Mutações ocorrem exclusivamente via action
- Busca e filtros são representados na URL
- Revalidação é automática após action

A UI não gerencia estado manual de dados de rota.

---

# 4. Estrutura da UI

ui/  
 ├── layout/  
 │     ├── AppShell.tsx  
 │     ├── Sidebar.tsx  
 │     ├── SidebarGroup.tsx  
 │     ├── SidebarItem.tsx  
 │     └── Header.tsx  
 │  
 ├── components/  
 │     ├── table/  
 │     ├── filters/  
 │     ├── feedback/  
 │     └── modal/  
 │  
 ├── hooks/  
 │     └── useSelection.ts  
 │  
 ├── pages/  
 │     ├── dashboard/  
 │     ├── calendar/  
 │     ├── sales/  
 │     ├── purchases/  
 │     ├── clients/  
 │     ├── suppliers/  
 │     ├── products/  
 │     ├── services/  
 │     └── transactions/  
 │  
 └── routes/  
       ├── sales.tsx  
       ├── clients.tsx  
       ├── products.tsx  
       └── etc  

Observação:

- A pasta `routes` contém loaders e actions.
- Pages são componentes puramente visuais.

---

# 5. Layout Base (AppShell)

## Estrutura

- Sidebar fixa  
- Header fixo  
- Conteúdo principal com scroll interno  

## Comportamento

- Sidebar colapsável  
- Estado colapsado persistido em LocalStorage 
- Scroll apenas no conteúdo principal  

---

# 6. Estrutura de Navegação

Dashboard  
Agenda  

Operações  
  ├─ Vendas  
  └─ Compras  

Pessoas  
  ├─ Clientes  
  └─ Fornecedores  

Domínio  
  ├─ Produtos  
  └─ Serviços  

Financeiro  
  └─ Extrato  

---

# 7. Padrão de Rotas

Exemplo para Sales:

/vendas              → Listagem  
/vendas/cadastrar          → Criação  
/vendas/:id/editar     → Edição  

Não existe rota dedicada para detalhes.

Detalhes são exibidos via linha expansível na tabela.

Todas as entidades seguem o padrão:

/entidade  
/entidade/cadastrar  
/entidade/:id/editar  

---

# 8. Estrutura de uma Rota (Exemplo)

## sales.tsx

- export loader
- export action
- export default component

Fluxo:

1. Loader interpreta query parameters
2. Loader chama service
3. Dados são retornados à UI
4. Action executa mutações
5. Router revalida automaticamente

---

# 9. Estrutura Padrão da ListPage

PageToolBar 
 ├── Título  
 ├── Botão "Novo"  
 ├── Barra de busca  
 └── Botão de filtros  

FilterPanel (colapsável)  

BatchActionBar (condicional)  

DataTable  
 ├── Checkbox  
 ├── Linha expansível  
 └── Empty State  

---

# 10. Busca

- Uma única barra de busca por listagem  
- Atualiza query parameter `search`
- Não mantém estado duplicado
- Não chama service diretamente
- Debounce ~600ms antes de atualizar a URL

Exemplo:

/sales?search=joao

Alterar a URL dispara automaticamente o loader.

---

# 11. Filtros

## Comportamento

- Painel colapsável  
- Ao clicar "Aplicar", atualiza query parameters  
- Botão "Limpar" remove parâmetros e volta ao padrão  

## Filtro de Período

- Utiliza react-day-picker  
- Período padrão: mês atual  
- Representado via `from` e `to` na URL  

---

# 12. Ordenação

Ordenação padrão:

| Entidade | Ordenação Inicial |
|----------|------------------|
| Sales, Purchases, Transactions | date desc |
| Clients, Suppliers, Products, Services | name asc |

Ordenação pode ser representada via query parameter opcional.

---

# 13. Estados de Navegação

Controlados por `useNavigation`.

Possíveis estados:

- idle
- loading
- submitting

Regras:

- Loading de navegação não deve ser controlado manualmente
- Botões devem reagir a `navigation.state`
- Submissões via fetcher devem reagir a `fetcher.state`

---

# 14. Estratégia de Loading

- Skeleton na tabela durante loading
- Spinner em botão durante submissão
- Nunca bloquear a tela inteira
- Loading global opcional no layout

Não criar estado manual para dados de rota.

---

# 15. Estratégia de Erro

Separação obrigatória:

- Erro técnico → errorElement da rota
- Erro de negócio → retornado pela action

Erros de negócio devem ser exibidos via toast.

Logs completos devem ir para o console.

---

# 16. Batch Actions

Podem ser implementadas via:

- Action dedicada
ou
- fetcher

Regras:

- Execução parcial permitida
- Não interromper lote completo
- Retornar resumo final

---

# 17. Formulários

- Sempre em página dedicada
- Nunca em modal grande
- React Hook Form + Zod
- Submissão via `<Form method="post">`
- Action chama service
- Router revalida automaticamente

UI nunca chama service diretamente.

---

# 18. IDs

IDs são sempre visíveis na UI.

Usados em:

- Toast
- Batch summary
- Modais de confirmação
- Cabeçalhos

---

# 19. Persistência de Filtros

Filtros não persistem ao sair da página.

Sempre iniciam no estado padrão (mês atual).

Estado padrão deve ser refletido na URL.

---

# 20. Política de Scroll

- Sidebar fixa
- Header fixo
- Conteúdo principal com overflow-y-auto

---

# 21. Estados Visuais

| Estado | Cor |
|--------|------|
| open | azul |
| closed | verde |
| canceled | cinza |
| active | verde |
| inactive | cinza |
| erro | vermelho |

---

# 22. Princípios Fundamentais

- UI nunca implementa regra de negócio
- UI nunca acessa repository
- UI nunca chama service diretamente para mutação
- Dados derivados nunca são calculados na UI
- URL representa o estado da listagem
- Routes orquestram o fluxo
- Services decidem as regras
