const itensPesquisa = [
  {
    id: 1,
    titulo: "Alugar",
    tipo: "secao",
    local: "Prime Lar",
    url: "#aluguel",
    tags: ["aluguel", "alugar", "locacao", "locação"],
  },
  {
    id: 2,
    titulo: "Comprar",
    tipo: "secao",
    local: "Prime Lar",
    url: "#comprar",
    tags: ["compra", "comprar", "venda"],
  },
  {
    id: 3,
    titulo: "Anunciar imóvel",
    tipo: "secao",
    local: "Prime Lar",
    url: "./anunciar.html",
    tags: ["anunciar", "anuncio", "anúncio", "cadastrar"],
  },
  {
    id: 4,
    titulo: "Financiamento",
    tipo: "secao",
    local: "Prime Lar",
    url: "./financiamento.html",
    tags: ["financiamento", "financiar", "credito", "crédito", "parcela"],
  },
  {
    id: 5,
    titulo: "Apartamento do Minha Casa Minha Vida",
    tipo: "categoria",
    local: "Categorias",
    url: "#aluguel",
    tags: ["minha casa minha vida", "mcv", "apartamento", "subsídio"],
  },
  {
    id: 6,
    titulo: "Seu pet também merece um novo lar",
    tipo: "categoria",
    local: "Categorias",
    url: "#aluguel",
    tags: ["pet", "animal", "cachorro", "gato"],
  },
  {
    id: 7,
    titulo: "A Varanda com Vista dos Sonhos",
    tipo: "categoria",
    local: "Categorias",
    url: "#comprar",
    tags: ["varanda", "vista", "apartamento"],
  },
  {
    id: 8,
    titulo: "Procurando Imóveis Mobiliados?",
    tipo: "categoria",
    local: "Categorias",
    url: "#aluguel",
    tags: ["mobiliado", "mobilia", "móveis"],
  },
  {
    id: 9,
    titulo: "Apartamento 2 quartos — Jardim América",
    tipo: "imovel",
    local: "Ribeirão Preto, SP",
    url: "./financiamento.html",
    preco: 285000,
    tags: ["apartamento", "jardim america", "ribeirao preto", "2 quartos"],
  },
  {
    id: 10,
    titulo: "Casa térrea com quintal — Vila Tibério",
    tipo: "imovel",
    local: "Ribeirão Preto, SP",
    url: "./financiamento.html",
    preco: 420000,
    tags: ["casa", "vila tibério", "vila tiberio", "quintal", "ribeirao preto"],
  },
  {
    id: 11,
    titulo: "Apartamento com varanda gourmet",
    tipo: "imovel",
    local: "Campos Elíseos, Ribeirão Preto",
    url: "./financiamento.html",
    preco: 398000,
    tags: ["varanda", "gourmet", "campos eliseos", "apartamento"],
  },
  {
    id: 12,
    titulo: "Apartamento mobiliado — Centro",
    tipo: "imovel",
    local: "Centro, Ribeirão Preto",
    url: "./financiamento.html",
    preco: 310000,
    tags: ["mobiliado", "centro", "apartamento", "ribeirao preto"],
  },
  {
    id: 13,
    titulo: "Sobrado em condomínio fechado",
    tipo: "imovel",
    local: "Bonfim Paulista, SP",
    url: "./financiamento.html",
    preco: 520000,
    tags: ["sobrado", "condominio", "bonfim paulista"],
  },
  {
    id: 14,
    titulo: "Casa pet friendly — Nova Aliança",
    tipo: "imovel",
    local: "Ribeirão Preto, SP",
    url: "./financiamento.html",
    preco: 245000,
    tags: ["pet", "nova aliança", "nova alianca", "casa"],
  },
  {
    id: 15,
    titulo: "Ribeirão Preto",
    tipo: "cidade",
    local: "São Paulo",
    url: "./financiamento.html",
    tags: ["ribeirao preto", "ribeirão preto", "sp"],
  },
  {
    id: 16,
    titulo: "Jardim América",
    tipo: "bairro",
    local: "Ribeirão Preto, SP",
    url: "./financiamento.html",
    tags: ["jardim america", "bairro"],
  },
  {
    id: 17,
    titulo: "Vila Tibério",
    tipo: "bairro",
    local: "Ribeirão Preto, SP",
    url: "./financiamento.html",
    tags: ["vila tibério", "vila tiberio", "bairro"],
  },
  {
    id: 18,
    titulo: "Campos Elíseos",
    tipo: "bairro",
    local: "Ribeirão Preto, SP",
    url: "./financiamento.html",
    tags: ["campos eliseos", "campos elíseos", "bairro"],
  },
  {
    id: 19,
    titulo: "São Paulo",
    tipo: "cidade",
    local: "SP",
    url: "#comprar",
    tags: ["sao paulo", "são paulo", "capital"],
  },
  {
    id: 20,
    titulo: "Av. Paulista",
    tipo: "rua",
    local: "Bela Vista, São Paulo - SP",
    url: "#",
    tags: ["avenida paulista", "paulista", "bela vista"],
  },
]

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

function buscarItens(termo, limite) {
  const query = normalizar(termo)
  if (!query) return []

  const resultados = itensPesquisa
    .map((item) => {
      const campos = [
        item.titulo,
        item.local,
        item.tipo,
        ...(item.tags || []),
      ]
      const textoBusca = normalizar(campos.join(" "))
      const tituloNorm = normalizar(item.titulo)

      let pontuacao = 0
      if (tituloNorm === query) pontuacao += 100
      if (tituloNorm.startsWith(query)) pontuacao += 50
      if (textoBusca.includes(query)) pontuacao += 30
      query.split(/\s+/).forEach((palavra) => {
        if (palavra && textoBusca.includes(palavra)) pontuacao += 10
      })

      return { ...item, pontuacao }
    })
    .filter((item) => item.pontuacao > 0)
    .sort((a, b) => b.pontuacao - a.pontuacao)

  return limite ? resultados.slice(0, limite) : resultados
}

module.exports = { itensPesquisa, buscarItens, normalizar }
