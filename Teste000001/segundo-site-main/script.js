// 1. Selecionamos o formulário e o container de mensagens
let formulario = document.getElementById('meu-formulario');
let containerMensagens = document.getElementById('container-mensagens');

// 2. Ouvimos o evento de "submit" (envio) do formulário
formulario.addEventListener('submit', function(evento) {
    // Impede a página de recarregar
    evento.preventDefault(); 
    
    // Selecionamos a caixa de texto dentro do evento
    let caixaTexto = document.getElementById('text-box');
    
    // Pegamos o valor (texto) digitado pelo usuário
    let textoDigitado = caixaTexto.value;
    
    // Próximos passos: Criar o balão e adicionar na tela...

    // Remove espaços em branco antes e depois do texto
let textoLimpo = textoDigitado.trim();

if (textoLimpo !== "") {
    // 1. Cria o elemento do balão (<article>)
    let novoPost = document.createElement('article');
    novoPost.className = 'chat-post'; // Aplica o CSS que criamos
    
    // 2. Define o conteúdo interno do balão
    novoPost.innerHTML = `
        <div class="user-info">
            <span class="avatar">👤</span> 
            <strong>Você</strong>
            <span class="date">| Postado agora</span>
        </div>
        <p>${textoLimpo}</p>
    `;
    
    // 3. Adiciona o novo balão dentro do container do fórum
    containerMensagens.appendChild(novoPost);
    
    // 4. Limpa a caixa de texto para a próxima mensagem
    caixaTexto.value = "";
} else {
    alert("Por favor, digite uma mensagem antes de enviar! ⚠️");
}
});

// ... código anterior onde o balão é criado e adicionado na tela ...

// 1. Criamos um objeto com os dados da mensagem
let dadosMensagem = {
    texto: textoLimpo,
    autor: "Você",
    data: "Postado agora"
};

// 2. Adicionamos a nova mensagem à nossa lista de histórico
historicoMensagens.push(dadosMensagem);

// 3. Convertemos a lista para texto e salvamos no localStorage
localStorage.setItem('chat_forum', JSON.stringify(historicoMensagens));

// 1. Inicializa o histórico (lendo o que está salvo ou começando vazio)
let historicoMensagens = JSON.parse(localStorage.getItem('chat_forum')) || [];
let containerMensagens = document.getElementById('container-mensagens');

// 2. Loop para desenhar na tela as mensagens que já estavam salvas
historicoMensagens.forEach(function(mensagem) {
    let balaoSalvo = document.createElement('article');
    balaoSalvo.className = 'chat-post';
    balaoSalvo.innerHTML = `
        <div class="user-info">
            <span class="avatar">👤</span> 
            <strong>${mensagem.autor}</strong>
            <span class="date">| ${mensagem.data}</span>
        </div>
        <p>${mensagem.texto}</p>
    `;
    containerMensagens.appendChild(balaoSalvo);
});