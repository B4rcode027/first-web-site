const http = require("http")
// Removido o 'const url = require("url")' pois usaremos a nova API global 'new URL()'

const { buscarItens } = require("./dados")

const PORT = process.env.PORT || 10000

function enviarJson(res, status, dados) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*", // Libera o acesso para o seu front-end
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end(JSON.stringify(dados))
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    enviarJson(res, 200, { sucesso: true })
    return
  }

  // Correção moderna para evitar o DeprecationWarning [DEP0169]
  // Criamos o objeto de URL usando a URL base padrão necessária pelo construtor
  const urlCompleta = new URL(req.url, `http://${req.headers.host}`)
  const pathname = urlCompleta.pathname
  const searchParams = urlCompleta.searchParams

  if (req.method === "GET" && pathname === "/api/pesquisa") {
    const termo = (searchParams.get("q") || "").trim()
    const limite = Math.min(parseInt(searchParams.get("limite"), 10) || 20, 50)
    const resultados = buscarItens(termo, limite).map(
      ({ pontuacao, ...item }) => item,
    )

    enviarJson(res, 200, {
      sucesso: true,
      query: termo,
      total: resultados.length,
      resultados,
    })
    return
  }

  if (req.method === "GET" && pathname === "/api/sugestoes") {
    const termo = (searchParams.get("q") || "").trim()
    const limite = Math.min(parseInt(searchParams.get("limite"), 10) || 8, 15)
    const resultados = buscarItens(termo, limite)

    enviarJson(res, 200, {
      sucesso: true,
      query: termo,
      sugestoes: resultados.map((item) => ({
        id: item.id,
        titulo: item.titulo,
        tipo: item.tipo,
        local: item.local,
        url: item.url,
      })),
    })
    return
  }

  enviarJson(res, 404, {
    sucesso: false,
    message:
      "Rota não encontrada. Use GET /api/pesquisa?q=termo ou GET /api/sugestoes?q=termo",
  })
})

server.listen(PORT, "0.0.0.0", () => {
  console.log(`API de pesquisa rodando na porta ${PORT}`)
})
