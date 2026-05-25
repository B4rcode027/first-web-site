
// O JavaScript que faz a mágica acontecer
const searchForm = document.getElementById("searchForm")
const itens = document.querySelectorAll(".item");

searchForm.addEventListener("input", (e) => {
  const valorDigitado = e.target.value.toLowerCase()

  itens.forEach((item) => {
    // Verifica se o texto do item inclui o que foi digitado
    if (item.textContent.toLowerCase().includes(valorDigitado)) {
      item.style.display = "block" // Mostra o item
    } else {
      item.style.display = "none" // Oculta o item
    }
  })
})
