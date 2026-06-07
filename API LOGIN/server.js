const http = require("http")

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
  res.writeHead(status, { "Content-Type": "application/json" })
  res.end(JSON.stringify(payload))
}

const server = http.createServer(async (req, res) => {
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

  if (req.url === "/login") {
    const { username, senha } = dados
    if (username === "admin" && senha === process.env.ADMIN_SENHA) {
      return responder(res, 200, { sucesso: true, data: { username } })
    }
    return responder(res, 401, {
      sucesso: false,
      message: "Credenciais inválidas",
    })
  }

  if (req.url === "/cadastrar") {
    const camposVazios = Object.keys(dados).filter(
      (k) => dados[k] === undefined || dados[k].toString().trim() === "",
    )

    if (camposVazios.length > 0) {
      return responder(res, 400, {
        sucesso: false,
        message: `Os seguintes campos são obrigatórios: ${camposVazios.join(", ")}`,
      })
    }

    if (dados.senha !== dados.csenha) {
      return responder(res, 400, {
        sucesso: false,
        message: "As senhas não coincidem",
      })
    }

    return responder(res, 201, {
      sucesso: true,
      message: "Cadastro realizado com sucesso",
    })
  }

  responder(res, 404, { sucesso: false, message: "Rota não encontrada" })
})

server.listen(3000, "localhost", () => {
  console.log("Server running at http://localhost:3000/")
})
