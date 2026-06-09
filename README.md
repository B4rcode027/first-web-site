# 🌐 Prime Lar — Plataforma Imobiliária Inteligente

## 📝 Sobre o Projeto
O **Prime Lar** é uma plataforma imobiliária digital projetada para conectar usuários ao seu próximo imóvel de forma rápida e segura. O projeto simula um ecossistema completo de locação e compra de imóveis, contando com uma interface web moderna, fluida e totalmente integrada a uma API própria para pesquisas dinâmicas.

---

## 🚀 Arquitetura e Tecnologias Utilizadas

O projeto foi dividido em duas partes fundamentais para garantir a separação de responsabilidades (Client/Server):

### 🎨 Frontend (Interface do Usuário)
* **HTML5:** Estruturação semântica do portal, seções de navegação, categorias e rodapé institucional.
* **CSS3:** Customização de fontes externas (Google Fonts), estilização de botões, estados de hover e layout responsivo.
* **JavaScript (Vanilla):** Lógica do lado do cliente responsável pelas requisições HTTP (`fetch`), manipulação assíncrona do DOM e controle de eventos.

### ⚙️ Backend & API (Servidor)
* **Node.js (Módulo HTTP nativo):** Criação do servidor web sem dependências externas pesadas.
* **REST API:** Endpoints estruturados para retornar dados em formato JSON.
* **Render:** Infraestrutura utilizada para a hospedagem na nuvem e deploy contínuo da API.

---

## 🧠 Recursos e Aprendizados Relevantes

O desenvolvimento deste ecossistema me permitiu aplicar conceitos avançados de programação e arquitetura web, tais como:

* **Integração com APIs (Fetch API):** Consumo assíncrono dos endpoints de busca e sugestões com tratamento de erros de rede.
* **Mecanismo de Busca Otimizado (Debounce):** Implementação de um temporizador (`setTimeout`) para evitar requisições excessivas ao servidor enquanto o usuário digita.
* **Algoritmo de Relevância e Busca Fonética:** Sistema no backend que normaliza strings (removendo acentos e caixa alta) e calcula uma pontuação baseada em regras (Ex: correspondência exata do título ganha mais peso do que uma correspondência em tags).
* **Configuração de CORS (Cross-Origin Resource Sharing):** Manipulação manual de cabeçalhos HTTP no Node.js para permitir que o Frontend se comunique com o servidor hospedado no Render de forma segura.
* **Gerenciamento de Rotas Nativo:** Tratamento manual de caminhos de URL (`pathname`) e parâmetros de busca (`searchParams`) utilizando a API global `new URL()`.

---

## 🛠️ Como Executar o Projeto

### 1. Clonar o Repositório
```bash
git clone https://github.com/B4rcode027/first-web-site.git

📬 Contato
Se quiser trocar uma ideia sobre desenvolvimento web, arquitetura de APIs ou acompanhar meus estudos, você pode me encontrar por aqui:

Nome: Gabriel Pereira Freire

E-mail: gpereira2019@gmail.com

GitHub: B4rcode027
