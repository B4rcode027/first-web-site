const express = require("express")
const cors = require("cors")
const { buscarItens } = require("./dados")

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares obrigatórios para APIs REST modernas
app.use(cors()) // Libera o CORS para o seu front-end se conectar sem travar
app.use(express.json()) // Permite que o servidor entenda requisições com corpo em JSON

/**
 * Rota original de Pesquisa (Atualizada para Async/Await + Supabase)
 * GET /api/pesquisa?q=termo&limite=20
 */
app.get("/api/pesquisa", async (req, res) => {
  try {
    const termo = (req.query.q || "").trim()
    const limite = Math.min(parseInt(req.query.limite, 10) || 20, 50)

    // Aguarda a resposta do banco de dados do Supabase
    const resultados = await buscarItens(termo, limite)

    res.json({
      sucesso: true,
      query: termo,
      total: resultados.length,
      resultados,
    })
  } catch (error) {
    console.error("Erro na rota /api/pesquisa:", error)
    res.status(500).json({ sucesso: false, erro: "Erro interno no servidor." })
  }
})

/**
 * Rota original de Sugestões (Atualizada para Async/Await + Supabase)
 * GET /api/sugestoes?q=termo&limite=8
 */
app.get("/api/sugestoes", async (req, res) => {
  try {
    const termo = (req.query.q || "").trim()
    const limite = Math.min(parseInt(req.query.limite, 10) || 8, 15)

    // Aguarda a resposta do banco de dados do Supabase
    const resultados = await buscarItens(termo, limite)

    // Filtra as propriedades para retornar exatamente a estrutura que seu front já espera
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
    console.error("Erro na rota /api/sugestoes:", error)
    res.status(500).json({ sucesso: false, erro: "Erro interno no servidor." })
  }
})

// Gerenciador de erros para rotas não encontradas (404) - Mantendo suas strings
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    message:
      "Rota não encontrada. Use GET /api/pesquisa?q=termo ou GET /api/sugestoes?q=termo",
  })
})

// Inicia o servidor escutando na porta correta para o Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API REST ativa e integrada ao Supabase na porta ${PORT}`)
})
