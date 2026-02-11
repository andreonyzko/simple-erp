# Visão Geral do Projeto – Sistema ERP PWA

## 1. O que é este projeto

Este projeto é um **Sistema ERP (Enterprise Resource Planning) Web**, desenvolvido como uma **PWA (Progressive Web App)**, com funcionamento **100% offline**, **sem backend** e **sem dependência de servidor**.

Toda a aplicação roda integralmente no navegador e utiliza **IndexedDB**, por meio da biblioteca **Dexie**, como **fonte única de persistência de dados**.

O sistema foi concebido para pequenos e médios negócios que precisam de um controle administrativo **local, simples, confiável e previsível**, sem complexidade desnecessária.

---

## 2. Objetivo do projeto

O objetivo principal é fornecer um **ERP modular, extensível e de fácil manutenção**, capaz de gerenciar operações administrativas comuns, mantendo como premissas centrais:

* Funcionamento offline-first
* Arquitetura clara e previsível
* Domínio explícito e bem definido
* Histórico financeiro imutável
* Evolução segura do código

O projeto **não busca competir com ERPs corporativos em nuvem**, nem atender cenários complexos de múltiplos usuários ou sincronização.

---

## 3. Princípios fundamentais

### 3.1 Offline-first

O sistema deve funcionar integralmente sem conexão com a internet. Nenhuma funcionalidade essencial depende de serviços externos.

### 3.2 Client-side only

Toda a lógica de negócio, validações e persistência de dados ocorrem no client.

Não existe backend, API, sincronização ou comunicação com servidores.

### 3.3 Domínio em primeiro lugar

As regras de negócio são tratadas como o **núcleo do sistema**. A interface do usuário e a infraestrutura são consideradas detalhes de implementação.

Qualquer decisão ambígua deve ser resolvida no domínio.

### 3.4 Simplicidade consciente

A arquitetura evita abstrações desnecessárias. Soluções simples e explícitas são preferidas a generalizações prematuras.

---

## 4. Núcleo financeiro

O núcleo do sistema é o **controle de movimentações financeiras**, modelado explicitamente através da entidade **Transaction**.

Eventos comerciais, como vendas e compras, existem para **gerar movimentações financeiras**, e não o contrário.

Essa abordagem garante:

* Histórico financeiro imutável
* Rastreabilidade completa de entradas e saídas
* Suporte nativo a pagamentos parciais
* Cancelamentos explícitos via lançamentos corretivos

O sistema **nunca edita nem remove registros financeiros**. Correções e estornos são sempre representados por novas Transactions.

---

## 5. Escopo funcional

### 5.1 Funcionalidades contempladas

* Cadastro de clientes
* Cadastro de fornecedores
* Cadastro de produtos
* Cadastro de serviços
* Registro de vendas
* Registro de compras
* Controle de pagamentos por meio de Transactions
* Agenda de compromissos (calendar)
* Relacionamentos lógicos entre entidades

### 5.2 Funcionalidades fora de escopo

As seguintes funcionalidades **não fazem parte do projeto**, por decisão arquitetural consciente:

* Backend ou API
* Autenticação de usuários
* Multiusuário
* Controle de permissões
* Sincronização em nuvem
* Integrações externas
* Emissão fiscal
* Contabilidade formal

---

## 6. Público-alvo

O sistema é voltado para:

* Pequenos comerciantes
* Prestadores de serviço
* Negócios locais
* Uso individual ou em um único dispositivo

O projeto assume **um único operador** e **um único ambiente de uso**.

---

## 7. Tecnologias

As principais tecnologias utilizadas são:

* TypeScript
* PWA
* IndexedDB
* Dexie
* Framework frontend (ex: React)

As tecnologias de UI são consideradas **detalhes de implementação** e não fazem parte do domínio.

---

## 8. Filosofia de evolução

O projeto foi modelado para:

* Crescer de forma incremental
* Permitir refatorações seguras
* Manter regras de negócio explícitas
* Evitar acoplamentos acidentais
* Facilitar o entendimento por novos desenvolvedores

A documentação é parte essencial do projeto e deve evoluir junto com o código.

---

## 9. Leitura recomendada

Para compreender completamente o projeto, a leitura recomendada é:

1. PROJECT_OVERVIEW.md (este documento)
2. ARCHITECTURE.md
3. DOMAIN.md
4. DATABASE.md
5. DEVELOPMENT_GUIDE.md

---

Este documento define **o que o projeto é, o que ele não é e quais princípios norteiam todas as decisões técnicas e de domínio**.
