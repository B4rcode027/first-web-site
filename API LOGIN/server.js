const http = require("http")
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/login") {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk.toString()
    })
    req.on("end", () => {
      const jsonData = JSON.parse(body)
      if (jsonData.username === "admin" && jsonData.senha === "senha") {
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ sucesso: true, data: jsonData }))
      } else {
        res.writeHead(401, { "Content-Type": "application/json" })
        res.end(
          JSON.stringify({ sucesso: false, message: "Credenciais inválidas" }),
        )
      }
    })
    return
  }
  if (req.method === "POST" && req.url === "/cadastrar") {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk.toString()
    })
    req.on("end", () => {
      const jsonData = JSON.parse(body)

      const camposVazios = []
      const chaves = Object.keys(jsonData)

      for (const chave of chaves) {
        if (
          jsonData[chave] === undefined ||
          jsonData[chave].toString().trim() === ""
        ) {
          camposVazios.push(chave)
        }
      }
      // if (jsonData.username === '' || jsonData.email === '' || jsonData.senha === '' || jsonData.csenha === '') {
      //     res.writeHead(400,{ 'Content-Type': 'application/json'});
      //     res.end(JSON.stringify({ sucesso: false, message: 'Todos os campos são obrigatórios' }));
      //     return;
      // }

      if (camposVazios.length > 0) {
        res.writeHead(400, { "Content-Type": "application/json" })
        res.end(
          JSON.stringify({
            sucesso: false,
            message: `Os seguintes campos são obrigatórios: ${camposVazios.join(", ")}`,
          }),
        )
        return
      }

      if (jsonData.senha !== jsonData.csenha) {
        res.writeHead(401, { "Content-Type": "application/json" })
        res.end(
          JSON.stringify({
            sucesso: false,
            message: "As senhas não coincidem",
          }),
        )
        return
      }
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(
        JSON.stringify({
          sucesso: true,
          message: "Cadastro realizado com sucesso",
        }),
      )
    })
    return
  }
})

server.listen(3000, "localhost", () => {
  console.log("Server running at http://localhost:3000/")
})