# Visão Geral do Projeto – Sistema ERP PWA

## 1. O que é este projeto

Este projeto é um **Sistema ERP (Enterprise Resource Planning) Web**, desenvolvido como **PWA (Progressive Web App)**, com funcionamento **100% offline**, **sem backend** e **sem dependência de servidor**.

Toda a aplicação roda no navegador e utiliza **IndexedDB**, por meio da biblioteca **Dexie**, como fonte única de persistência de dados.

O sistema foi projetado para pequenos e médios negócios que precisam de controle administrativo local, simples e confiável.

---

## 2. Objetivo principal

O objetivo do projeto é fornecer um **ERP modular, performático e extensível**, capaz de gerenciar operações administrativas comuns, mantendo:

* Funcionamento offline-first
* Simplicidade arquitetural
* Clareza de regras de negócio
* Facilidade de manutenção
* Evolução segura do código

O projeto **não busca competir com ERPs corporativos em nuvem**, mas sim resolver problemas práticos do dia a dia de forma local.

### Núcleo financeiro

O sistema possui um **núcleo financeiro baseado em movimentações (Transactions)**, separando claramente:

- Eventos comerciais (vendas e compras)
- Movimentações de dinheiro (entradas e saídas)

Essa abordagem garante:
- Histórico financeiro imutável
- Rastreabilidade de pagamentos
- Suporte a pagamentos parciais
- Cancelamentos com estorno explícito

O sistema **não edita nem apaga registros financeiros**, apenas cria novos lançamentos corretivos quando necessário.

---

## 3. Público-alvo

* Pequenos comerciantes
* Prestadores de serviço
* Negócios locais
* Uso individual ou em um único dispositivo

O sistema **não é multiusuário** e **não possui controle de permissões**.

---

## 4. Escopo funcional

### Funcionalidades contempladas

* Cadastro de clientes
* Cadastro de produtos
* Cadastro de serviços
* Registro de vendas
* Registro de compras
* Controle de pagamentos
* Agenda / calendário de compromissos
* Relacionamentos entre entidades (ex: vendas ↔ clientes)

### Funcionalidades fora de escopo

* Backend ou API
* Autenticação de usuários
* Sincronização em nuvem
* Multiusuário
* Controle de permissões
* Integração com sistemas externos

Essas exclusões são **decisões arquiteturais conscientes**, não limitações técnicas.

---

## 5. Princípios fundamentais do projeto

### Offline-first

O sistema deve funcionar integralmente sem conexão com a internet.

### Client-side only

Toda a lógica de negócio, persistência e validações ocorrem no client.

### Domínio em primeiro lugar

As regras de negócio são centralizadas em uma camada de domínio, separadas da interface e da infraestrutura.

### Simplicidade antes de abstração

Evita-se overengineering. Abstrações só são criadas quando há benefício real.

---

## 6. Tecnologias principais

* TypeScript
* PWA
* IndexedDB
* Dexie
* Framework frontend (ex: React)

As tecnologias de UI são consideradas **detalhes de implementação**, não parte do domínio.

---

## 7. Filosofia de evolução

O projeto foi pensado para:

* Crescer de forma incremental
* Permitir refatorações seguras
* Ser facilmente compreendido por novos desenvolvedores
* Servir como base sólida para futuras funcionalidades

---

## 8. Leitura recomendada

Para compreender completamente o projeto, leia os documentos na seguinte ordem:

1. PROJECT_OVERVIEW.md (este documento)
2. ARCHITECTURE.md
3. DOMAIN.md
4. DATABASE.md
5. DEVELOPMENT_GUIDE.md

---

Este documento define **o que o projeto é e o que ele não é**. As decisões técnicas e estruturais estão detalhadas nos documentos seguintes.
