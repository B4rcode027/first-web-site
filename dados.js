const { createClient } = require("@supabase/supabase-js")

// Coleta as variáveis de ambiente configuradas no Render
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

// Cria o cliente de conexão com o Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

/**
 * Busca itens em tempo real diretamente na tabela do Supabase
 */
async function buscarItens(termo, limite) {
  const queryText = termo ? termo.trim() : ""
  if (!queryText) return []

  try {
    // IMPORTANTE: Altere 'itensPesquisa' para o nome exato da sua tabela no Supabase se for diferente
    let query = supabase.from("itensPesquisa").select("*")

    // O Supabase filtra no banco buscando o termo no titulo ou dentro do array de tags
    // O .ilike() funciona ignorando maiúsculas/minúsculas e acentos na maioria dos casos do Postgres
    query = query.or(`titulo.ilike.%${queryText}%, tags.cs.{${queryText}}`)

    if (limite) {
      query = query.limit(limite)
    }

    const { data, error } = await query

    if (error) {
      console.error("Erro ao consultar o Supabase:", error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error("Erro inesperado na conexão com o Supabase:", err)
    return []
  }
}

// Exportamos as funções para o server.js utilizar
module.exports = { buscarItens, normalizar }
