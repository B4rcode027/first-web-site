const http = require("http")
const { createClient } = require("@supabase/supabase-js")
require("dotenv").config()

// Buscando as credenciais das variáveis de ambiente (.env)
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Erro: SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias no ambiente.",
  )
  process.exit(1)
}

// Inicializa o cliente do Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function lerBody(req) {
  return new Promise((resolve, reject) => {
    let body = ""
    req.on("data", (chunk) => (body += chunk.toString()))
    req.on("end", () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error("JSON inválido"))
      }
    })
    req.on("error", reject)
  })
}

function responder(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end(JSON.stringify(payload))
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    })
    return res.end()
  }

  if (req.method !== "POST") {
    return responder(res, 404, {
      sucesso: false,
      message: "Rota não encontrada",
    })
  }

  let dados
  try {
    dados = await lerBody(req)
  } catch {
    return responder(res, 400, { sucesso: false, message: "Body inválido" })
  }

  // --- ROTA DE LOGIN ---
  if (req.url === "/login") {
    const { email, senha } = dados // O Supabase usa email por padrão para Auth

    // Autentica o usuário diretamente no Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    })

    if (error) {
      return responder(res, 401, { sucesso: false, message: error.message })
    }

    // Retorna os dados do usuário logado e o token de sessão (JWT)
    return responder(res, 200, {
      sucesso: true,
      message: "Login realizado com sucesso",
      session: data.session,
      user: data.user,
    })
  }

  // --- ROTA DE CADASTRO ---
  if (req.url === "/cadastrar") {
    const { email, senha, csenha } = dados

    if (!email || !senha || !csenha) {
      return responder(res, 400, {
        sucesso: false,
        message: "Email, senha e csenha são obrigatórios",
      })
    }

    if (senha !== csenha) {
      return responder(res, 400, {
        sucesso: false,
        message: "As senhas não coincidem",
      })
    }

    // Cria o usuário diretamente no serviço de Auth do Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: senha,
    })

    if (error) {
      return responder(res, 400, { sucesso: false, message: error.message })
    }

    return responder(res, 201, {
      sucesso: true,
      message:
        "Cadastro realizado com sucesso! Verifique seu email se necessário.",
      user: data.user,
    })
  }

  responder(res, 404, { sucesso: false, message: "Rota não encontrada" })
})

server.listen(3000, "localhost", () => {
  console.log("Server running at http://localhost:3000/")
})
