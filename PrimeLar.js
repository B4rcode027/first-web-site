// javascript para caixa de pesquisa
let searchForm = document.getElementById("searchForm")
const itens = document.querySelectorAll(".item");
let botoes = document.querySelectorAll(".nav")

let input = document.getElementById("searchInput")
let datalist = document.getElementById("itens")

botoes.forEach((botao, index) => {
  let href = botao.querySelector("a").getAttribute("href")
  datalist.innerHTML += `<option class="item" value="${botao.textContent.trim()}" href="${href}" onclick="selecionarItem('${href}')">`
})
// function selecionarItem(href) {
//   console.log("selecionarItem")
//   searchForm.setAttribute("data-search", href)
// }

searchForm.addEventListener("input",function(e) {
  let itenss = document.querySelectorAll(".item")
  
  let valor=e.target.value.toLowerCase()
  let selecionado = Array.from(itenss).find(item => item.value.toLowerCase() === valor)
  if (selecionado) {
    searchForm.setAttribute("data-search", selecionado.getAttribute("href"))
  } else {
    searchForm.setAttribute("data-search", "")
  }
})
function redirecionar() {
  
  let href = searchForm.getAttribute("data-search")
  if (href) {
    console.log(href)
    window.location.hash = href
    searchForm.setAttribute("data-search", "")
    searchForm.reset()
  } else{
    alert("Nenhum item selecionado")
  }
}
searchForm.addEventListener("input", (e) => {
  const valorDigitado = e.target.value.toLowerCase()

  itens.forEach((item) => {
    if (item.textContent.toLowerCase().includes(valorDigitado)) {
      item.style.display = "block" 
    } else {
      item.style.display = "none" 
    }
  })
})
// fim do codigo da caixa de pesquisa