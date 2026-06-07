// login.js
const loginForm = document.getElementById("loginbtn")

if (loginForm) {
  loginForm.addEventListener("click", async function (event) {
    event.preventDefault()

    const data = {
      username: document.getElementById("username").value,
      senha: document.getElementById("senha").value, // corrigido: era "password"
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        if (result.token) {
          localStorage.setItem("token", result.token)
        }
        alert("Login realizado com sucesso!")
        window.location.href = "./index.html"
      } else {
        alert("Erro: " + (result.message || "Dados inválidos"))
      }
    } catch (error) {
      console.error("Erro de conexão:", error)
      alert("Falha ao conectar com o servidor.")
    }
  })
}
