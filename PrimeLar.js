const API_PESQUISA = "https://first-web-site-1.onrender.com" // 💻 Alterado para a URL do Render

const searchForm = document.getElementById("searchForm")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const searchDropdown = document.getElementById("searchDropdown")
const searchResults = document.getElementById("searchResults")

let debounceTimer = null
let sugestoesAtuais = []

function tipoLabel(tipo) {
  const labels = {
    imovel: "Imóvel",
    bairro: "Bairro",
    cidade: "Cidade",
    rua: "Rua",
    secao: "Seção",
    categoria: "Categoria",
  }
  return labels[tipo] || tipo
}

function formatarPreco(valor) {
  if (!valor) return ""
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

async function buscarSugestoes(termo) {
  if (!termo.trim()) {
    esconderDropdown()
    return
  }

  try {
    const res = await fetch(
      `${API_PESQUISA}/api/sugestoes?q=${encodeURIComponent(termo)}&limite=8`,
    )
    const data = await res.json()

    if (!data.sucesso) return

    sugestoesAtuais = data.sugestoes
    renderizarDropdown(data.sugestoes)
  } catch {
    mostrarErroApi()
  }
}

async function executarPesquisa(termo) {
  if (!termo.trim()) {
    alert("Digite um bairro, cidade ou tipo de imóvel para buscar.")
    return
  }

  esconderDropdown()
  searchResults.classList.remove("hidden")
  searchResults.innerHTML = `<p class="search-loading"><i class="fa-solid fa-spinner fa-spin"></i> Buscando...</p>`

  try {
    const res = await fetch(
      `${API_PESQUISA}/api/pesquisa?q=${encodeURIComponent(termo)}&limite=20`,
    )
    const data = await res.json()

    if (!data.sucesso) return

    renderizarResultados(data.resultados, data.query)
  } catch {
    // Mensagem atualizada: focada em instabilidade de rede/servidor externo
    searchResults.innerHTML = `
      <p class="search-erro">
        <i class="fa-solid fa-triangle-exclamation"></i>
        Não foi possível conectar ao servidor de busca. Tente novamente em instantes.
      </p>`
  }
}

function renderizarDropdown(sugestoes) {
  if (!searchDropdown) return

  if (!sugestoes.length) {
    searchDropdown.innerHTML = `<p class="search-dropdown-empty">Nenhuma sugestão encontrada</p>`
    searchDropdown.classList.add("ativo")
    return
  }

  searchDropdown.innerHTML = sugestoes
    .map(
      (item, index) => `
      <button type="button" class="search-dropdown-item" data-index="${index}">
        <span class="search-dropdown-tipo">${tipoLabel(item.tipo)}</span>
        <strong>${item.titulo}</strong>
        <span class="search-dropdown-local">${item.local}</span>
      </button>`,
    )
    .join("")

  searchDropdown.querySelectorAll(".search-dropdown-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = sugestoesAtuais[btn.dataset.index]
      irParaResultado(item)
    })
  })

  searchDropdown.classList.add("ativo")
}

function renderizarResultados(resultados, query) {
  if (!resultados.length) {
    searchResults.innerHTML = `
      <h2 class="search-results-title">Resultados para "${query}"</h2>
      <p class="search-sem-resultado">Nenhum imóvel ou local encontrado. Tente outro termo.</p>`
    return
  }

  searchResults.innerHTML = `
    <h2 class="search-results-title">Resultados para "${query}" <span>(${resultados.length})</span></h2>
    <div class="search-results-grid">
      ${resultados
        .map(
          (item) => `
        <article class="search-result-card" data-url="${item.url}">
          <span class="search-result-tipo">${tipoLabel(item.tipo)}</span>
          <h3>${item.titulo}</h3>
          <p class="search-result-local"><i class="fa-solid fa-location-dot"></i> ${item.local}</p>
          ${item.preco ? `<p class="search-result-preco">${formatarPreco(item.preco)}</p>` : ""}
          <button type="button" class="botao search-result-btn">Ver detalhes</button>
        </article>`,
        )
        .join("")}
    </div>`

  searchResults.querySelectorAll(".search-result-card").forEach((card) => {
    const urlDestino = card.dataset.url
    card.querySelector(".search-result-btn").addEventListener("click", () => {
      window.location.href = urlDestino
    })
    card.addEventListener("click", (e) => {
      if (e.target.closest(".search-result-btn")) return
      window.location.href = urlDestino
    })
  })
}

function irParaResultado(item) {
  if (!item) return
  searchInput.value = item.titulo
  esconderDropdown()
  window.location.href = item.url
}

function esconderDropdown() {
  if (searchDropdown) {
    searchDropdown.classList.remove("ativo")
    searchDropdown.innerHTML = ""
  }
}

function mostrarErroApi() {
  if (!searchDropdown) return
  // Mensagem de erro simplificada para o dropdown na nuvem
  searchDropdown.innerHTML = `
    <p class="search-dropdown-erro">
      Servidor temporariamente indisponível.
    </p>`
  searchDropdown.classList.add("ativo")
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => buscarSugestoes(e.target.value), 300)
  })

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      executarPesquisa(searchInput.value)
    }
    if (e.key === "Escape") esconderDropdown()
  })
}

if (searchBtn) {
  searchBtn.addEventListener("click", () => executarPesquisa(searchInput.value))
}

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    executarPesquisa(searchInput.value)
  })
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) esconderDropdown()
})

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")
  const menuLinks = document.querySelectorAll(".nav-menu a")

  // Alterna o menu (Abre e Fecha) ao clicar no botão
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("ativo")

    // Troca o ícone de Barras para um 'X' quando aberto
    const icone = menuToggle.querySelector("i")
    if (navMenu.classList.contains("ativo")) {
      icone.className = "fa-solid fa-xmark"
    } else {
      icone.className = "fa-solid fa-bars"
    }
  })

  // Fecha o menu automaticamente quando clicar em qualquer link (âncora)
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("ativo")) {
        navMenu.classList.remove("ativo")
        menuToggle.querySelector("i").className = "fa-solid fa-bars"
      }
    })
  })
})