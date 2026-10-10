// =====================================================================
// 03_insert_data.js — LogiTrack: inserção dos documentos de exemplo
// Rodar depois de 01_database.js e 02_collections.js:
//   mongosh --file mongodb/03_insert_data.js
// =====================================================================

db = db.getSiblingDB("logitrack");

// Limpa as collections para o script poder rodar de novo
[
  "clientes", "produtos", "pedidos", "entregas", "transportadoras",
  "motoristas", "veiculos", "centrosDistribuicao", "ocorrencias", "rastreamentos",
].forEach((c) => db.getCollection(c).deleteMany({}));

// ---------- Auxiliares ----------
const oid = (n) => ObjectId("65" + "0".repeat(20) + n);

// Endereço padrão (mesmos campos em todo o projeto)
const endereco = (rua, numero, complemento, bairro, cidade, estado, cep) => ({
  rua, numero, complemento, bairro, cidade, estado, cep, pais: "Brasil",
});

// ---------- IDs ----------
const idTransp1 = oid("01"), idTransp2 = oid("02");
const idCd1 = oid("11"), idCd2 = oid("12");
const idCliente1 = oid("21"), idCliente2 = oid("22"), idCliente3 = oid("23");
const idProd1 = oid("31"), idProd2 = oid("32"), idProd3 = oid("33"), idProd4 = oid("34");
const idMot1 = oid("41"), idMot2 = oid("42"), idMot3 = oid("43");
const idVei1 = oid("51"), idVei2 = oid("52"), idVei3 = oid("53");
const idPed1 = oid("61"), idPed2 = oid("62"), idPed3 = oid("63"), idPed4 = oid("64");
const idEnt1 = oid("71"), idEnt2 = oid("72"), idEnt3 = oid("73"), idEnt4 = oid("74");

// ---------- Endereços reutilizados ----------
const endFeira = endereco("Av. Getúlio Vargas", "250", "", "Centro", "Feira de Santana", "BA", "44001-000");
const endSalvador = endereco("Av. Tancredo Neves", "1000", "Sala 10", "Caminho das Árvores", "Salvador", "BA", "41820-021");
const endConquista = endereco("Av. Brumado", "300", "", "Candeias", "Vitória da Conquista", "BA", "45055-000");
const endJequie = endereco("Rua Rui Barbosa", "45", "", "Centro", "Jequié", "BA", "45200-000");

// =====================================================================
// 1) TRANSPORTADORAS — endereço incorporado (só existe dentro dela)
// =====================================================================
db.transportadoras.insertOne({
  _id: idTransp1,
  nome: "RápidoBahia Transportes",
  documento: "12.345.678/0001-90",
  email: "contato@rapidobahia.com.br",
  telefone: "75988880001",
  endereco: endereco("Rua Conselheiro Franco", "80", "", "Centro", "Feira de Santana", "BA", "44001-100"),
  ativo: true,
});
db.transportadoras.insertOne({
  _id: idTransp2,
  nome: "NordesteLog",
  documento: "98.765.432/0001-10",
  email: "contato@nordestelog.com.br",
  telefone: "71988880002",
  endereco: endereco("Av. Paralela", "2000", "Bloco B", "Pituaçu", "Salvador", "BA", "41740-090"),
  ativo: true,
});

// =====================================================================
// 2) CENTROS DE DISTRIBUIÇÃO — endereço incorporado
// =====================================================================
db.centrosDistribuicao.insertMany([
  {
    _id: idCd1,
    nome: "CD Feira de Santana",
    codigo: "CD-FSA",
    endereco: endereco("Rod. BR-324", "km 3", "Galpão 2", "Tomba", "Feira de Santana", "BA", "44090-000"),
    ativo: true,
  },
  {
    _id: idCd2,
    nome: "CD Salvador",
    codigo: "CD-SSA",
    endereco: endereco("Av. Afrânio Peixoto", "500", "Galpão 1", "Periperi", "Salvador", "BA", "40720-000"),
    ativo: true,
  },
]);

// =====================================================================
// 3) CLIENTES — endereço incorporado (lido junto com o cadastro)
// =====================================================================
db.clientes.insertMany([
  {
    _id: idCliente1,
    nome: "Maria Silva",
    tipo: "PF",
    documento: "123.456.789-00",
    email: "maria@email.com",
    telefone: "75999990000",
    endereco: endFeira,
    criadoEm: ISODate("2026-09-01T10:00:00Z"),
    atualizadoEm: ISODate("2026-09-01T10:00:00Z"),
  },
  {
    _id: idCliente2,
    nome: "Comercial Alfa Ltda",
    tipo: "PJ",
    documento: "11.222.333/0001-44",
    email: "compras@alfa.com.br",
    telefone: "71999990001",
    endereco: endSalvador,
    criadoEm: ISODate("2026-09-02T11:00:00Z"),
    atualizadoEm: ISODate("2026-09-02T11:00:00Z"),
  },
  {
    _id: idCliente3,
    nome: "Carlos Souza",
    tipo: "PF",
    documento: "987.654.321-00",
    email: "carlos@email.com",
    telefone: "77999990002",
    endereco: endConquista,
    criadoEm: ISODate("2026-09-03T09:30:00Z"),
    atualizadoEm: ISODate("2026-09-03T09:30:00Z"),
  },
]);

// =====================================================================
// 4) PRODUTOS — catálogo (referenciado pelos volumes dos pedidos)
// =====================================================================
db.produtos.insertMany([
  {
    _id: idProd1, nome: "Notebook", codigo: "NB-001", categoria: "Eletrônicos",
    pesoKg: Double(2.5), dimensoes: { comprimentoCm: 40, larguraCm: 30, alturaCm: 5 },
    fragil: true, ativo: true,
  },
  {
    _id: idProd2, nome: "Mouse sem fio", codigo: "MS-002", categoria: "Periféricos",
    pesoKg: Double(0.2), dimensoes: { comprimentoCm: 15, larguraCm: 10, alturaCm: 8 },
    fragil: false, ativo: true,
  },
  {
    _id: idProd3, nome: "Monitor 24 polegadas", codigo: "MN-003", categoria: "Eletrônicos",
    pesoKg: Double(4.8), dimensoes: { comprimentoCm: 60, larguraCm: 40, alturaCm: 15 },
    fragil: true, ativo: true,
  },
  {
    _id: idProd4, nome: "Cadeira de escritório", codigo: "CD-004", categoria: "Móveis",
    pesoKg: Double(12), dimensoes: { comprimentoCm: 70, larguraCm: 60, alturaCm: 50 },
    fragil: false, ativo: true,
  },
]);

// =====================================================================
// 5) MOTORISTAS e VEÍCULOS — referenciam a transportadora
// =====================================================================
db.motoristas.insertMany([
  {
    _id: idMot1, idTransportadora: idTransp1, nome: "Carlos Eduardo",
    documento: "111.222.333-44", numeroCnh: "01234567890", telefone: "75988881111",
    situacao: "disponivel",
  },
  {
    _id: idMot2, idTransportadora: idTransp1, nome: "Ana Paula",
    documento: "222.333.444-55", numeroCnh: "09876543210", telefone: "75988882222",
    situacao: "em_rota",
  },
  {
    _id: idMot3, idTransportadora: idTransp2, nome: "Roberto Lima",
    documento: "333.444.555-66", numeroCnh: "01357913579", telefone: "71988883333",
    situacao: "em_rota",
  },
]);

// A placa fica como texto (não é _id): se mudar, nenhuma referência quebra
db.veiculos.insertMany([
  { _id: idVei1, idTransportadora: idTransp1, placa: "ABC1D23", tipo: "van", capacidadeKg: Double(1200), situacao: "disponivel" },
  { _id: idVei2, idTransportadora: idTransp1, placa: "DEF4G56", tipo: "caminhao", capacidadeKg: Double(8000), situacao: "em_uso" },
  { _id: idVei3, idTransportadora: idTransp2, placa: "HIJ7K89", tipo: "van", capacidadeKg: Double(1500), situacao: "em_uso" },
]);

// =====================================================================
// 6) PEDIDOS
// Incorporados: origem, destino, volumes[] e pagamento.
// Referências: idCliente e volumes[].idProduto
// (nomeProduto e pesoKg são copiados para o histórico não mudar).
// =====================================================================
db.pedidos.insertMany([
  {
    // Pedido com 2 volumes
    _id: idPed1,
    idCliente: idCliente1,
    situacao: "entregue",
    origem: endFeira,
    destino: endSalvador,
    volumes: [
      {
        codigo: "VOL-001", idProduto: idProd1, nomeProduto: "Notebook", pesoKg: Double(2.5),
        dimensoes: { comprimentoCm: 40, larguraCm: 30, alturaCm: 5 }, quantidade: NumberInt(1),
      },
      {
        codigo: "VOL-002", idProduto: idProd2, nomeProduto: "Mouse sem fio", pesoKg: Double(0.2),
        dimensoes: { comprimentoCm: 15, larguraCm: 10, alturaCm: 8 }, quantidade: NumberInt(2),
      },
    ],
    pagamento: { forma: "pix", valor: NumberDecimal("45.90"), situacao: "pago", pagoEm: ISODate("2026-10-01T09:00:00Z") },
    criadoEm: ISODate("2026-10-01T08:30:00Z"),
    atualizadoEm: ISODate("2026-10-02T12:10:00Z"),
  },
  {
    _id: idPed2,
    idCliente: idCliente2,
    situacao: "em_transito",
    origem: endSalvador,
    destino: endFeira,
    volumes: [
      {
        codigo: "VOL-003", idProduto: idProd3, nomeProduto: "Monitor 24 polegadas", pesoKg: Double(4.8),
        dimensoes: { comprimentoCm: 60, larguraCm: 40, alturaCm: 15 }, quantidade: NumberInt(1),
      },
    ],
    pagamento: { forma: "cartao", valor: NumberDecimal("89.50"), situacao: "pago", pagoEm: ISODate("2026-10-07T14:10:00Z") },
    criadoEm: ISODate("2026-10-07T14:00:00Z"),
    atualizadoEm: ISODate("2026-10-09T07:00:00Z"),
  },
  {
    _id: idPed3,
    idCliente: idCliente3,
    situacao: "em_transito",
    origem: endFeira,
    destino: endConquista,
    volumes: [
      {
        codigo: "VOL-004", idProduto: idProd4, nomeProduto: "Cadeira de escritório", pesoKg: Double(12),
        dimensoes: { comprimentoCm: 70, larguraCm: 60, alturaCm: 50 }, quantidade: NumberInt(2),
      },
    ],
    pagamento: { forma: "boleto", valor: NumberDecimal("150.00"), situacao: "pago", pagoEm: ISODate("2026-10-06T15:00:00Z") },
    criadoEm: ISODate("2026-10-06T10:00:00Z"),
    atualizadoEm: ISODate("2026-10-08T09:00:00Z"),
  },
  {
    _id: idPed4,
    idCliente: idCliente1,
    situacao: "entregue",
    origem: endFeira,
    destino: endJequie,
    volumes: [
      {
        codigo: "VOL-005", idProduto: idProd2, nomeProduto: "Mouse sem fio", pesoKg: Double(0.2),
        dimensoes: { comprimentoCm: 15, larguraCm: 10, alturaCm: 8 }, quantidade: NumberInt(3),
      },
    ],
    pagamento: { forma: "pix", valor: NumberDecimal("32.75"), situacao: "pago", pagoEm: ISODate("2026-10-04T12:00:00Z") },
    criadoEm: ISODate("2026-10-04T09:00:00Z"),
    atualizadoEm: ISODate("2026-10-05T19:45:00Z"),
  },
]);

// =====================================================================
// 7) ENTREGAS
// Incorporados: destino (cópia do pedido), rota, horariosEtapas, rastreioAtual.
// Referências: pedido, transportadora, motorista, veículo e centro.
// Entregas em andamento não têm chegouEm/entregueEm nem duracaoRealMin ainda.
// =====================================================================
db.entregas.insertMany([
  {
    // No prazo, entregue (Salvador)
    _id: idEnt1,
    idPedido: idPed1, idTransportadora: idTransp1, idMotorista: idMot1,
    idVeiculo: idVei1, idCentroDistribuicao: idCd1,
    situacao: "entregue",
    atrasado: false,
    prometidoPara: ISODate("2026-10-03T18:00:00Z"),
    destino: endSalvador,
    rota: { distanciaKm: Double(110), duracaoPrevistaMin: NumberInt(120), duracaoRealMin: NumberInt(115) },
    horariosEtapas: {
      recebidoNoCdEm: ISODate("2026-10-02T08:00:00Z"),
      saiuEm: ISODate("2026-10-02T10:00:00Z"),
      chegouEm: ISODate("2026-10-02T11:55:00Z"),
      entregueEm: ISODate("2026-10-02T12:10:00Z"),
    },
    rastreioAtual: { latitude: Double(-12.9777), longitude: Double(-38.5016), cidade: "Salvador", estado: "BA", registradoEm: ISODate("2026-10-02T12:10:00Z") },
    criadoEm: ISODate("2026-10-02T08:00:00Z"),
    atualizadoEm: ISODate("2026-10-02T12:10:00Z"),
  },
  {
    // No prazo, em trânsito (Feira de Santana)
    _id: idEnt2,
    idPedido: idPed2, idTransportadora: idTransp2, idMotorista: idMot3,
    idVeiculo: idVei3, idCentroDistribuicao: idCd2,
    situacao: "em_transito",
    atrasado: false,
    prometidoPara: ISODate("2026-10-10T18:00:00Z"),
    destino: endFeira,
    rota: { distanciaKm: Double(110), duracaoPrevistaMin: NumberInt(120) },
    horariosEtapas: {
      recebidoNoCdEm: ISODate("2026-10-08T16:00:00Z"),
      saiuEm: ISODate("2026-10-09T07:00:00Z"),
    },
    rastreioAtual: { latitude: Double(-12.7867), longitude: Double(-38.4033), cidade: "Simões Filho", estado: "BA", registradoEm: ISODate("2026-10-09T08:30:00Z") },
    criadoEm: ISODate("2026-10-08T16:00:00Z"),
    atualizadoEm: ISODate("2026-10-09T08:30:00Z"),
  },
  {
    // Atrasada, em trânsito (Vitória da Conquista)
    _id: idEnt3,
    idPedido: idPed3, idTransportadora: idTransp1, idMotorista: idMot2,
    idVeiculo: idVei2, idCentroDistribuicao: idCd1,
    situacao: "em_transito",
    atrasado: true,
    prometidoPara: ISODate("2026-10-08T18:00:00Z"),
    destino: endConquista,
    rota: { distanciaKm: Double(380), duracaoPrevistaMin: NumberInt(360) },
    horariosEtapas: {
      recebidoNoCdEm: ISODate("2026-10-07T17:00:00Z"),
      saiuEm: ISODate("2026-10-08T09:00:00Z"),
    },
    rastreioAtual: { latitude: Double(-14.528), longitude: Double(-40.3636), cidade: "Poções", estado: "BA", registradoEm: ISODate("2026-10-09T09:30:00Z") },
    criadoEm: ISODate("2026-10-07T17:00:00Z"),
    atualizadoEm: ISODate("2026-10-09T09:30:00Z"),
  },
  {
    // Atrasada, entregue (Jequié)
    _id: idEnt4,
    idPedido: idPed4, idTransportadora: idTransp1, idMotorista: idMot1,
    idVeiculo: idVei1, idCentroDistribuicao: idCd1,
    situacao: "entregue",
    atrasado: true,
    prometidoPara: ISODate("2026-10-05T18:00:00Z"),
    destino: endJequie,
    rota: { distanciaKm: Double(260), duracaoPrevistaMin: NumberInt(240), duracaoRealMin: NumberInt(300) },
    horariosEtapas: {
      recebidoNoCdEm: ISODate("2026-10-05T08:00:00Z"),
      saiuEm: ISODate("2026-10-05T14:30:00Z"),
      chegouEm: ISODate("2026-10-05T19:30:00Z"),
      entregueEm: ISODate("2026-10-05T19:45:00Z"),
    },
    rastreioAtual: { latitude: Double(-13.8587), longitude: Double(-40.0837), cidade: "Jequié", estado: "BA", registradoEm: ISODate("2026-10-05T19:45:00Z") },
    criadoEm: ISODate("2026-10-05T08:00:00Z"),
    atualizadoEm: ISODate("2026-10-05T19:45:00Z"),
  },
]);

// =====================================================================
// 8) OCORRÊNCIAS — referenciam a entrega (collection própria)
// Schema flexível: mesmo núcleo, com um campo extra por tipo
// (atraso -> minutosAtraso; avaria -> gravidade).
// =====================================================================
db.ocorrencias.insertMany([
  {
    _id: oid("81"), idEntrega: idEnt4, idCentroDistribuicao: idCd1, idMotorista: idMot1,
    tipo: "atraso", descricao: "Trânsito intenso e prazo estourado",
    dataHora: ISODate("2026-10-05T18:05:00Z"), cidade: "Jequié",
    minutosAtraso: NumberInt(105),
  },
  {
    _id: oid("82"), idEntrega: idEnt3, idCentroDistribuicao: idCd1, idMotorista: idMot2,
    tipo: "atraso", descricao: "Prazo estourado após parada para reparo",
    dataHora: ISODate("2026-10-09T08:00:00Z"), cidade: "Jequié",
    minutosAtraso: NumberInt(840),
  },
  {
    _id: oid("83"), idEntrega: idEnt3, idCentroDistribuicao: idCd1, idMotorista: idMot2,
    tipo: "avaria", descricao: "Pneu furado, caminhão parado para reparo",
    dataHora: ISODate("2026-10-08T14:20:00Z"), cidade: "Jequié",
    gravidade: "media",
  },
  {
    _id: oid("84"), idEntrega: idEnt4, idCentroDistribuicao: idCd1, idMotorista: idMot1,
    tipo: "avaria", descricao: "Embalagem amassada no carregamento",
    dataHora: ISODate("2026-10-05T15:00:00Z"), cidade: "Feira de Santana",
    gravidade: "baixa",
  },
  {
    // Sem campo extra: o núcleo basta
    _id: oid("85"), idEntrega: idEnt1, idCentroDistribuicao: idCd1, idMotorista: idMot1,
    tipo: "ausente", descricao: "Destinatário ausente na primeira tentativa",
    dataHora: ISODate("2026-10-02T12:00:00Z"), cidade: "Salvador",
  },
]);

// =====================================================================
// 9) RASTREAMENTOS — histórico de GPS (referenciam a entrega).
// O último ponto de cada entrega é o mesmo de entregas.rastreioAtual.
// =====================================================================
db.rastreamentos.insertMany([
  // Entrega 1 (Feira de Santana -> Salvador)
  { _id: oid("A1"), idEntrega: idEnt1, latitude: Double(-12.2664), longitude: Double(-38.9663), cidade: "Feira de Santana", estado: "BA", registradoEm: ISODate("2026-10-02T10:00:00Z") },
  { _id: oid("A2"), idEntrega: idEnt1, latitude: Double(-12.7867), longitude: Double(-38.4033), cidade: "Simões Filho", estado: "BA", registradoEm: ISODate("2026-10-02T11:00:00Z") },
  { _id: oid("A3"), idEntrega: idEnt1, latitude: Double(-12.9777), longitude: Double(-38.5016), cidade: "Salvador", estado: "BA", registradoEm: ISODate("2026-10-02T12:10:00Z") },
  // Entrega 2 (Salvador -> Feira de Santana)
  { _id: oid("A4"), idEntrega: idEnt2, latitude: Double(-12.9777), longitude: Double(-38.5016), cidade: "Salvador", estado: "BA", registradoEm: ISODate("2026-10-09T07:00:00Z") },
  { _id: oid("A5"), idEntrega: idEnt2, latitude: Double(-12.7867), longitude: Double(-38.4033), cidade: "Simões Filho", estado: "BA", registradoEm: ISODate("2026-10-09T08:30:00Z") },
  // Entrega 3 (Feira de Santana -> Vitória da Conquista)
  { _id: oid("A6"), idEntrega: idEnt3, latitude: Double(-12.2664), longitude: Double(-38.9663), cidade: "Feira de Santana", estado: "BA", registradoEm: ISODate("2026-10-08T09:00:00Z") },
  { _id: oid("A7"), idEntrega: idEnt3, latitude: Double(-13.8587), longitude: Double(-40.0837), cidade: "Jequié", estado: "BA", registradoEm: ISODate("2026-10-08T14:00:00Z") },
  { _id: oid("A8"), idEntrega: idEnt3, latitude: Double(-14.528), longitude: Double(-40.3636), cidade: "Poções", estado: "BA", registradoEm: ISODate("2026-10-09T09:30:00Z") },
  // Entrega 4 (Feira de Santana -> Jequié)
  { _id: oid("A9"), idEntrega: idEnt4, latitude: Double(-12.2664), longitude: Double(-38.9663), cidade: "Feira de Santana", estado: "BA", registradoEm: ISODate("2026-10-05T14:30:00Z") },
  { _id: oid("AA"), idEntrega: idEnt4, latitude: Double(-12.4297), longitude: Double(-39.2478), cidade: "Santo Estêvão", estado: "BA", registradoEm: ISODate("2026-10-05T16:30:00Z") },
  { _id: oid("AB"), idEntrega: idEnt4, latitude: Double(-13.8587), longitude: Double(-40.0837), cidade: "Jequié", estado: "BA", registradoEm: ISODate("2026-10-05T19:45:00Z") },
]);

// ---------- Conferência rápida ----------
[
  "transportadoras", "centrosDistribuicao", "clientes", "produtos", "motoristas",
  "veiculos", "pedidos", "entregas", "ocorrencias", "rastreamentos",
].forEach((c) => print(c + ": " + db.getCollection(c).countDocuments()));
