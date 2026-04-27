let faseAtual = null;
let faseLiberada = 0;

const perguntas = [
  {
    pergunta: "O que é HTML?",
    opcoes: [
      "Uma linguagem de marcação",
      "Um banco de dados",
      "Uma linguagem de programação"
    ],
    correta: 0
  },
  {
    pergunta: "Qual tag cria um título principal?",
    opcoes: ["<p>", "<h1>", "<img>"],
    correta: 1
  },
  {
    pergunta: "Qual tag cria um link?",
    opcoes: ["<a>", "<section>", "<div>"],
    correta: 0
  },
  {
    pergunta: "Qual atributo define o destino de um link?",
    opcoes: ["src", "href", "alt"],
    correta: 1
  }
];

const fases = document.querySelectorAll(".fase");

function atualizarFases() {
  fases.forEach((fase, index) => {
    fase.classList.remove("desbloqueada", "bloqueada");

    if (index <= faseLiberada) {
      fase.classList.add("desbloqueada");
    } else {
      fase.classList.add("bloqueada");
    }
  });
}

function abrirFase(index) {
  if (index > faseLiberada) {
    alert("Essa fase ainda está bloqueada!");
    return;
  }

  faseAtual = index;

  document.getElementById("modalQuiz").classList.add("ativo");
  document.getElementById("perguntaQuiz").textContent = perguntas[index].pergunta;

  const opcoesQuiz = document.getElementById("opcoesQuiz");
  const resultadoQuiz = document.getElementById("resultadoQuiz");

  resultadoQuiz.textContent = "";
  opcoesQuiz.innerHTML = "";

  perguntas[index].opcoes.forEach((opcao, i) => {
    const botao = document.createElement("button");
    botao.textContent = opcao;
    botao.onclick = () => verificarResposta(i);
    opcoesQuiz.appendChild(botao);
  });
}

function verificarResposta(respostaEscolhida) {
  const resultadoQuiz = document.getElementById("resultadoQuiz");
  const respostaCerta = perguntas[faseAtual].correta;

  if (respostaEscolhida === respostaCerta) {
    resultadoQuiz.textContent = "Resposta correta! Próxima fase desbloqueada.";
    resultadoQuiz.style.color = "#7ed957";

    fases[faseAtual].classList.add("concluida");

    if (faseAtual === faseLiberada && faseLiberada < perguntas.length - 1) {
      faseLiberada++;
    }

    atualizarFases();

    setTimeout(() => {
      fecharQuiz();
    }, 1000);

  } else {
    resultadoQuiz.textContent = "Resposta errada. Tente novamente!";
    resultadoQuiz.style.color = "#ff4d4d";
  }
}

function fecharQuiz() {
  document.getElementById("modalQuiz").classList.remove("ativo");
}

atualizarFases();