const http = require("http")
const url = require("url")
const { buscarItens } = require("./dados")

// Se houver uma porta da nuvem, usa ela; se não, usa a 3001 local
const PORT = process.env.PORT || 3001

function enviarJson(res, status, dados) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
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

  const parsed = url.parse(req.url, true)

  if (req.method === "GET" && parsed.pathname === "/api/pesquisa") {
    const termo = (parsed.query.q || "").trim()
    const limite = Math.min(parseInt(parsed.query.limite, 10) || 20, 50)
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

  if (req.method === "GET" && parsed.pathname === "/api/sugestoes") {
    const termo = (parsed.query.q || "").trim()
    const limite = Math.min(parseInt(parsed.query.limite, 10) || 8, 15)
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
    message: "Rota não encontrada. Use GET /api/pesquisa?q=termo ou GET /api/sugestoes?q=termo",
  })
})

server.listen(PORT, "0.0.0.0", () => {
  console.log(`API de pesquisa rodando na porta ${PORT}`)
})
