function typeWriter(elementId, texto, velocidade = 50) {
    let index = 0;
    const elemento = document.getElementById(elementId);

    function escrever() {
        if (index < texto.length) {
            elemento.textContent += texto.charAt(index);
            index++;
            setTimeout(escrever, velocidade);
        }
    }

    escrever();
}

// 🔥 chamando para os dois textos
typeWriter("typing-text", 'Bem-Vindo "nome do usuario"', 50);
