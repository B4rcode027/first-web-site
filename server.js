const http = require("http")
const url = require("url")
const { buscarItens } = require("./dados")

const PORT = process.env.PORT || 3001

const server = http.createServer((req, res) => {
  // Cabeçalhos manuais de CORS
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.writeHead(204)
    res.end()
    return
  }

  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname
  const query = parsedUrl.query

  if (pathname === "/api/pesquisa" && req.method === "GET") {
    const termo = query.q || ""
    const limite = parseInt(query.limite, 10) || 20
    const resultados = buscarItens(termo, limite)

    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(
      JSON.stringify({
        sucesso: true,
        query: termo,
        total: resultados.length,
        resultados,
      }),
    )
  } else if (pathname === "/api/sugestoes" && req.method === "GET") {
    const termo = query.q || ""
    const limite = parseInt(query.limite, 10) || 8
    const resultados = buscarItens(termo, limite)

    const sugestoes = resultados.map((item) => ({
      id: item.id,
      titulo: item.titulo,
      tipo: item.tipo,
      local: item.local,
      url: item.url,
    }))

    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(
      JSON.stringify({
        sucesso: true,
        query: termo,
        sugestoes,
      }),
    )
  } else {
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(
      JSON.stringify({
        sucesso: false,
        message:
          "Rota não encontrada. Use GET /api/pesquisa?q=termo ou GET /api/sugestoes?q=termo",
      }),
    )
  }
})

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
