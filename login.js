// login.js
const loginForm = document.getElementById("loginbtn")
console.log(loginForm)
//if (loginForm) {
  loginForm.addEventListener("click", async function (event) {
    console.log("submit")
    event.preventDefault()

    const data = {
      username: document.getElementById("username").value,
      password: document.getElementById("senha").value,
    }

    try {
      const response = await fetch("https://sua-api.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem("token", result.token)
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
//}
