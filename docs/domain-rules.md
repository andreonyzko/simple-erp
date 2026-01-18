## Dinheiro só existe no Financeiro
- Venda não é dinheiro
- Compra não é dinheiro
- Atendimento não é dinheiro
- Transaction é o único registro de dinheiro real

## Histórico não é reescrito
- Nada "some"
- Nada é recalculado automaticamente
- Ajustem criam novos registros

## Sistema ajuda, não impõe
- Usuário decide quando registrar venda
- Usuário decide quando registrar pagamento
- Usuário decide se algo virou fiado

## Relacionamentos entre domínios
- Sale / Purchase têm Payment
- Transaction referencia Sale ou Purchase
- ComercialItem é reutilizável
- CalendarEvent não depende de ninguém

## Client / Supplier
- Podem ser inativados, nunca apagados
- Não participam do financeiro diretamente
- Só são referenciados por outros domínios
- Inativado não aparece em novos registros, mas continua no histórico

## Service
- Serviço é modelo, não evento
- Não controla estoque
- Não gera financeiro
- Pode ser inativado sem afetar histórico
- Valor real sempre vem do ComercialItem
- Serviço não "manda"no atendimento nem venda

## CalendarEvent
- Agenda é genérica
- Não gera venda
- Não gera financeiro
- Agenda é memória, não regra de negócio

## Product
- Produto pode existir sem fornecedor
- Produto pode ter fornecedor padrão
- Produto pode ou não ter estoque controlado
- Estoque só muda por venda, compra ou manualmente
- stockControl === false -> stock ignorado

## ComercialItem
- Sempre pertence a um contexto
- Nunca existe sozinho
- referenceId aponta para Product ou Service
- unitValue é capturado no momento do evento
- Mudança de preço futuro não afeta histórico
- Histórico sempre fiel ao que aconteceu

## Sale
- Venda sempre tem cliente
- Venda cria uma dívida
- Venda não cria Transaction automaticamente
- Venda pode existir sem pagamento
- Dívida = totalValue - paidValue
- Satatus vem do Payment
- Não pode alterar financeiro diretamente
- Não pode assumir pagamento automático
- Não pode Apagar histórico

## Purchase
- Compra pode ter fornecedor
- Compra pode ter pagamento parcial
- Compra pode afetar estoque
- Compra também gera dívida

## Payment
- paidValue >= 0
- paidValue <= totalValue
- status é sempre coerente com os valores
- pending -> paidValue === 0
- partial -> 0 < paidValue < totalValue
- paid -> paidValue === totalValue

## Transaction
- Representa dinheiro real
- Sempre tem método de pagamento
- Nunca é pendente
- Atualiza paidValue e Payment.status