const express = require("express")
const cors = require("cors")
const { buscarItens } = require("./dados")

const app = express()
const PORT = process.env.PORT || 3001

// Configurações Globais (Middlewares)
app.use(cors()) // Ativa CORS para qualquer origem automaticamente
app.use(express.json()) // Permite que a API entenda JSON no corpo das requisições

/**
 * Rota original de Pesquisa
 * GET /api/pesquisa?q=termo&limite=20
 */
app.get("/api/pesquisa", (req, res) => {
  try {
    const termo = (req.query.q || "").trim()
    const limite = Math.min(parseInt(req.query.limite, 10) || 20, 50)

    const resultados = buscarItens(termo, limite).map(
      ({ pontuacao, ...item }) => item,
    )

    res.json({
      sucesso: true,
      query: termo,
      total: resultados.length,
      resultados,
    })
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: "Erro interno no servidor." })
  }
})

/**
 * Rota original de Sugestões
 * GET /api/sugestoes?q=termo&limite=8
 */
app.get("/api/sugestoes", (req, res) => {
  try {
    const termo = (req.query.q || "").trim()
    const limite = Math.min(parseInt(req.query.limite, 10) || 8, 15)

    const resultados = buscarItens(termo, limite)

    const sugestoes = resultados.map((item) => ({
      id: item.id,
      titulo: item.titulo,
      tipo: item.tipo,
      local: item.local,
      url: item.url,
    }))

    res.json({
      sucesso: true,
      query: termo,
      sugestoes,
    })
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: "Erro interno no servidor." })
  }
})

// Tratamento de rota não encontrada (404) - Mantendo sua mensagem original
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    message:
      "Rota não encontrada. Use GET /api/pesquisa?q=termo ou GET /api/sugestoes?q=termo",
  })
})

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`🚀 API com Express rodando com as rotas antigas preservadas!`)
})
