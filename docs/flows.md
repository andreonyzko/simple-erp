## Atendimento Simples
- Usuario cria evento na agenda
- Atendimento acontece
- Usuário cria uma Sale
- Cliente paga na hora
- Sistema cria Transaction
- Venda fica paid

## Venda fiada
- Usuario cria Sale
- Payment: Pending
- Nenhuma transaction
- Cliente aparece como devedor

## Pagamento Parcial
- Cliente paga parte
- Usuário cria Pagamento na página da Venda
- paidValue aumenta
- Status vira partial

## Quitação
- Cliente paga o restante
- Usuário cria Pagamento na página da Venda
- Status vira paid
- Dívida zera

## Compra fiada
- Usuario registra Purchase
- Payment: pending
- Produto entra no estoque
- Nenhuma saida financeira ainda

## Pagamento manual (despesa)
- Usuário cria Transaction
- origin: manual
- Sem sale ou Purchase associada
