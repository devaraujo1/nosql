 LogiTrack — Levantamento de entidades

## Como os dados serão utilizados pela aplicação?

A LogiTrack acompanha:

Pedido → Centro de distribuição → Veículo → Motorista → Rota → Eventos → Entrega

A aplicação precisa responder:

1. Onde estão as entregas?
2. Quais regiões atrasam mais?
3. Qual motorista tem melhor desempenho?
4. Quais rotas são mais eficientes?
5. Quais horários geram atraso?
6. Qual centro de distribuição apresenta problemas?
7. Quanto tempo cada etapa demora?

| Pergunta                                 | Onde está a resposta                                      |
| ---------------------------------------- | --------------------------------------------------------- |
| 1. Onde estão as entregas?               | Entrega: `situacao` + último rastreio                     |
| 2. Quais regiões atrasam mais?           | Entrega: `destino.cidade` / `destino.estado` + `atrasado` |
| 3. Qual motorista tem melhor desempenho? | Entrega: `idMotorista` + se atrasou                       |
| 4. Quais rotas são mais eficientes?      | Entrega: tempos da `rota`                                 |
| 5. Quais horários geram atraso?          | Ocorrência e Rastreamento: `dataHora`                     |
| 6. Qual CD apresenta problemas?          | Entrega e Ocorrência: `idCentroDistribuicao`              |
| 7. Quanto tempo cada etapa demora?       | Entrega: `horariosEtapas`                                 |

---

## 1. Lista das entidades

14 entidades. São do domínio de **logística**.

| Entidade               | Descrição                                  | Responsabilidade no sistema                             |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------- |
| Cliente                | Pessoa ou empresa que solicita uma entrega | Fazer pedidos e acompanhar envios                       |
| Pedido                 | Solicitação de envio feita pelo cliente    | Registrar carga, origem, destino e pagamento            |
| Produto                | Item que pode ser transportado (catálogo)  | Informar nome, peso e tamanho da mercadoria             |
| Volume                 | Pacote, caixa ou palete do pedido          | Descrever cada unidade da carga                         |
| Pagamento              | Cobrança do serviço de transporte          | Registrar valor, forma e se foi pago                    |
| Entrega                | Transporte do pedido até o destino         | Controlar situação, prazos, motorista, veículo e etapas |
| Rota                   | Percurso da entrega                        | Guardar distância e tempos previsto e real              |
| Centro de Distribuição | Local de armazenagem e despacho            | Receber e expedir cargas                                |
| Motorista              | Quem realiza a entrega                     | Executar a rota e medir desempenho                      |
| Veículo                | Meio de transporte                         | Informar placa, tipo e capacidade                       |
| Transportadora         | Empresa que faz o transporte               | Agrupar motoristas e veículos                           |
| Ocorrência             | Problema ou evento no caminho              | Registrar atraso, avaria, recusa etc.                   |
| Rastreamento           | Ponto de localização no tempo              | Mostrar onde a carga passou                             |
| Endereço               | Local de coleta, destino ou CD             | Guardar rua, cidade, estado e CEP                       |

Volume, Pagamento e Endereço **existem no domínio**, mas ficam **dentro** de outros documentos (não têm collection própria).

---

## 2. Atributos

Todos os endereços usam os **mesmos campos**. Os IDs seguem o padrão `id` + nome da entidade (`idCliente`, `idPedido`, …).

Endereço padrão (repetido onde aparecer `endereco`, `origem` ou `destino`):

```
endereco
├── rua
├── numero
├── complemento
├── bairro
├── cidade
├── estado
├── cep
└── pais
```

### Cliente

Pessoa física ou jurídica que solicita o envio.

**Responsabilidade:** guardar contato e identificar quem fez o pedido.

```
Cliente
├── _id
├── nome
├── tipo                      # PF | PJ
├── documento                 # CPF ou CNPJ
├── email
├── telefone
├── endereco
├── criadoEm
└── atualizadoEm
```

Exemplo de documento incorporado (como na aula):

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "75999990000",
  "endereco": {
    "rua": "Rua A",
    "numero": "100",
    "complemento": "",
    "bairro": "Centro",
    "cidade": "Feira de Santana",
    "estado": "BA",
    "cep": "44000-000",
    "pais": "Brasil"
  }
}
```

### Pedido

Solicitação de envio.

**Responsabilidade:** registrar a carga, de onde sai, para onde vai e o pagamento.

```
Pedido
├── _id
├── idCliente
├── situacao                  # criado | pago | em_transito | entregue | cancelado
├── origem                    # endereço
├── destino                   # endereço
├── volumes[]                 # Volume incorporado
│     ├── codigo
│     ├── idProduto
│     ├── nomeProduto
│     ├── pesoKg
│     ├── dimensoes
│     │     ├── comprimentoCm
│     │     ├── larguraCm
│     │     └── alturaCm
│     └── quantidade
├── pagamento                 # Pagamento incorporado
│     ├── forma
│     ├── valor
│     ├── situacao            # pendente | pago
│     └── pagoEm
├── criadoEm
└── atualizadoEm
```

### Produto

Item do catálogo.

**Responsabilidade:** dados da mercadoria. No pedido copiamos `nomeProduto` e `pesoKg`, para o histórico não mudar se o catálogo mudar.

```
Produto
├── _id
├── nome
├── codigo
├── categoria
├── pesoKg
├── dimensoes
│     ├── comprimentoCm
│     ├── larguraCm
│     └── alturaCm
├── fragil
└── ativo
```

### Volume

Unidade física da carga.

**Responsabilidade:** detalhar cada pacote. **Não** tem collection: fica em `Pedido.volumes`.

```
Volume
├── codigo
├── idProduto
├── nomeProduto
├── pesoKg
├── dimensoes
│     ├── comprimentoCm
│     ├── larguraCm
│     └── alturaCm
└── quantidade
```

### Pagamento

Cobrança do frete.

**Responsabilidade:** dizer se o pedido foi pago. **Não** tem collection: fica em `Pedido.pagamento`.

```
Pagamento
├── forma
├── valor
├── situacao                  # pendente | pago
└── pagoEm
```

---

### Entrega

Operação de transporte. Documento que a operação consulta o tempo todo.

**Responsabilidade:** responder onde está, se atrasou, quem leva e quanto cada etapa demorou.

```
Entrega
├── _id
├── idPedido
├── idTransportadora
├── idMotorista
├── idVeiculo
├── idCentroDistribuicao
├── situacao                  # no_cd | em_transito | entregue | falhou
├── atrasado                  # true | false
├── prometidoPara
├── destino                   # mesmo endereço do pedido (cópia)
├── rota                      # Rota incorporada
│     ├── distanciaKm
│     ├── duracaoPrevistaMin
│     └── duracaoRealMin
├── horariosEtapas
│     ├── recebidoNoCdEm
│     ├── saiuEm
│     ├── chegouEm
│     └── entregueEm
├── rastreioAtual             # último ponto (pergunta 1)
│     ├── latitude
│     ├── longitude
│     ├── cidade
│     ├── estado
│     └── registradoEm
├── criadoEm
└── atualizadoEm
```

### Rota

Percurso daquela entrega.

**Responsabilidade:** comparar tempo previsto e real (pergunta 4). Fica **dentro da Entrega** (`rota`).

```
Rota
├── distanciaKm
├── duracaoPrevistaMin
└── duracaoRealMin
```

### Centro de Distribuição

Local de armazenagem e despacho.

**Responsabilidade:** ser o hub da carga e aparecer na pergunta 6.

```
CentroDistribuicao
├── _id
├── nome
├── codigo
├── endereco
└── ativo
```

### Motorista

Quem executa a entrega.

**Responsabilidade:** ser ligado à entrega e à pergunta 3.

```
Motorista
├── _id
├── idTransportadora
├── nome
├── documento
├── numeroCnh
├── telefone
└── situacao                  # disponivel | em_rota | inativo
```

### Veículo

Meio de transporte.

**Responsabilidade:** placa, tipo e capacidade para a entrega.

```
Veiculo
├── _id
├── idTransportadora
├── placa
├── tipo                      # van | caminhao | motocicleta
├── capacidadeKg
└── situacao                  # disponivel | em_uso | manutencao
```
### Transportadora

Empresa que opera o transporte.

**Responsabilidade:** agrupar motoristas, veículos e entregas.

```
Transportadora
├── _id
├── nome
├── documento                 # CNPJ
├── email
├── telefone
├── endereco
└── ativo
```

### Ocorrência

Evento ou problema no transporte.

**Responsabilidade:** perguntas 5 e 6 (horário e problemas do CD).

```
Ocorrencia
├── _id
├── idEntrega
├── idCentroDistribuicao
├── idMotorista
├── tipo                      # atraso | avaria | ausente | recusa | outro
├── descricao
├── dataHora
└── cidade
```

### Rastreamento

Ponto de localização (GPS ou check-in).

**Responsabilidade:** histórico para as perguntas 1 e 5. O **último** ponto também fica em `Entrega.rastreioAtual`.

```
Rastreamento
├── _id
├── idEntrega
├── latitude
├── longitude
├── cidade
├── estado
└── registradoEm
```

### Endereço

Local de coleta, destino ou CD.

**Responsabilidade:** cidade e estado para atraso por região. **Não** vira collection.

```
Endereco
├── rua
├── numero
├── complemento
├── bairro
├── cidade
├── estado
├── cep
└── pais
```

## Relacionamentos (ligação para o código)

Os documentos se conectam por `_id` e pelos campos `id...`:

```
Cliente._id          →  Pedido.idCliente
Produto._id          →  Pedido.volumes[].idProduto
Pedido._id           →  Entrega.idPedido
Transportadora._id   →  Motorista.idTransportadora
Transportadora._id   →  Veiculo.idTransportadora
Transportadora._id   →  Entrega.idTransportadora
Motorista._id        →  Entrega.idMotorista
Veiculo._id          →  Entrega.idVeiculo
CentroDistribuicao._id → Entrega.idCentroDistribuicao
Entrega._id          →  Ocorrencia.idEntrega
Entrega._id          →  Rastreamento.idEntrega
```

```
Cliente 1 ── * Pedido
Pedido  1 ── 1 Pagamento          (dentro do pedido)
Pedido  1 ── * Volume             (dentro do pedido)
Volume  * ── 1 Produto            (idProduto)
Pedido  1 ── 1 Entrega
Entrega * ── 1 Transportadora
Entrega * ── 1 Motorista
Entrega * ── 1 Veiculo
Entrega * ── 1 Centro de Distribuição
Entrega 1 ── 1 Rota               (dentro da entrega)
Entrega 1 ── * Ocorrencia
Entrega 1 ── * Rastreamento
```

Com isso dá para, nas próximas atividades, montar as collections e buscar: pedido do cliente, entrega do pedido, motorista da entrega, ocorrências da entrega.



Embedded documents × collections


---

Não é “uma entidade = uma collection”. O critério é: **a tela lê isso junto?** e **isso cresce sem parar?**

| Relacionamento                                   | Decisão                                       | Por quê                                                               |
| ------------------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------- |
| Cliente → Endereço                               | Incorporado                                   | Sempre aparece junto no cadastro                                      |
| Pedido → origem e destino                        | Incorporado                                   | Cópia do momento do pedido (não muda se o cliente alterar o cadastro) |
| Pedido → Volumes                                 | Incorporado                                   | Poucos pacotes; o pedido precisa da carga inteira                     |
| Pedido → Pagamento                               | Incorporado                                   | Um pagamento por pedido; lê junto                                     |
| Pedido → Produto                                 | Referência (`idProduto`) + nome/peso copiados | O catálogo muda; o pedido antigo não pode mudar                       |
| Pedido e Entrega                                 | Collections diferentes                        | Pedido é comercial; entrega é a operação (perguntas 1 a 7)            |
| Entrega → Motorista, Veículo, Transportadora, CD | Referência (`id...`)                          | Cadastros reutilizados (perguntas 3 e 6)                              |
| Entrega → Rota                                   | Incorporado                                   | Rota daquela entrega (pergunta 4)                                     |
| Entrega → último rastreio                        | Incorporado (`rastreioAtual`)                 | Pergunta 1 em uma leitura                                             |
| Histórico de rastreio                            | Collection `rastreamentos`                    | Muitos pontos GPS; não cabe tudo na entrega                           |
| Ocorrência                                       | Collection `ocorrencias`                      | Contar problemas por CD e por horário                                 |
| Endereço, Volume, Pagamento                      | Sem collection                                | Só existem dentro de outros documentos                                |

### Collections previstas (próxima atividade, sem criar scripts agora)

`clientes`, `produtos`, `pedidos`, `entregas`, `motoristas`, `veiculos`, `transportadoras`, `centrosDistribuicao`, `rastreamentos`, `ocorrencias`.

## Justificativa

A modelagem segue **como a aplicação usa os dados**, não um modelo relacional.

- **Entrega** junta o que a operação pergunta o tempo todo: situação, atraso, destino, tempos e último GPS.
- **Pedido** junta o lado comercial: cliente, volumes e pagamento.
- **Rastreamento** separado porque o GPS gera muitos pontos; o último ponto fica na entrega.
- **Ocorrência** separada para listar problemas por centro de distribuição e por horário.
- **Motorista, veículo, transportadora, CD, produto e cliente** em collections próprias porque vários pedidos/entregas usam o mesmo cadastro.

