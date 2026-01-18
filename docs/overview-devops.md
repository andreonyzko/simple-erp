## Objetivo

Este sistema foi criado para apoiar pequenos negócios unipessoais
(cabeleireira e esteticista), substituindo controles manuais de agenda,
vendas e financeiro por uma solução simples, local e confiável.

O foco não é automação excessiva, mas registro fiel da realidade.


## Princípios do Sistema
- Offline-first
- Zero backend no MVP
- Zero custo de infraestrutura
- Histórico nunca é apagado
- O sistema ajuda, não impõe processos
- Fiado é parte do negócio


## Visão de Domínio

- Atendimento não é dinheiro
- Venda não é dinheiro
- Compra não é dinheiro
- Dinheiro só existe no financeiro (Transaction)

O sistema nunca presume pagamento.

---

## Arquitetura & DevOps

- Frontend: React + Vite + TypeScript
- Persistência: IndexedDB (Dexie)
- Arquitetura local-first
- Deploy estático (GitHub Pages)
- Dados pertencem ao usuário
- Bibliotecas: Dexie, Formik, Yup, Toastify, Modal,

Não há backend no MVP por decisão consciente de custo, simplicidade e confiabilidade.

---