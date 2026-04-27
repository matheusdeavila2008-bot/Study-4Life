// ===== MENU LATERAL =====
const menu = document.getElementById("menuLateral");
const menuIcon = document.querySelector(".menu-icon");

function openMenu() {
  menu.classList.add("active");
}

function closeMenu() {
  menu.classList.remove("active");
}

document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !menuIcon.contains(e.target)) {
    menu.classList.remove("active");
  }
});

let xp = 0;
let diamantes = 0;
let streak = 0;
let metaAtual = 0;

const perguntas = [
  {
    pergunta: "O que significa HTML?",
    opcoes: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Home Tool Markup Language"
    ],
    correta: 0
  },
  {
    pergunta: "Qual tag cria um título principal?",
    opcoes: ["<p>", "<h1>", "<div>"],
    correta: 1
  },
  {
    pergunta: "Qual tag cria um link?",
    opcoes: ["<a>", "<img>", "<section>"],
    correta: 0
  }
];

let perguntaAtual = null;

function abrirQuiz(indice) {
  perguntaAtual = indice;

  const modal = document.getElementById("modalQuiz");
  const perguntaTexto = document.getElementById("perguntaTexto");
  const opcoes = document.getElementById("opcoes");
  const resultado = document.getElementById("resultado");

  perguntaTexto.textContent = perguntas[indice].pergunta;
  resultado.textContent = "";
  opcoes.innerHTML = "";

  perguntas[indice].opcoes.forEach((opcao, index) => {
    const botao = document.createElement("button");
    botao.textContent = opcao;
    botao.onclick = () => verificarResposta(index);
    opcoes.appendChild(botao);
  });

  modal.classList.add("ativo");
}

function fecharQuiz() {
  document.getElementById("modalQuiz").classList.remove("ativo");
}

function verificarResposta(indiceEscolhido) {
  const resultado = document.getElementById("resultado");
  const correta = perguntas[perguntaAtual].correta;

  if (indiceEscolhido === correta) {
    resultado.textContent = "Resposta correta! +25 XP";
    resultado.style.color = "#7ed957";

    xp += 25;
    diamantes += 1;
    streak += 1;
    metaAtual += 1;

    atualizarStatus();
  } else {
    resultado.textContent = "Resposta errada. Tente novamente!";
    resultado.style.color = "#ff4d4d";
  }
}

function atualizarStatus() {
  document.getElementById("xp").textContent = xp;
  document.getElementById("diamantes").textContent = diamantes;
  document.getElementById("streak").textContent = streak;

  if (metaAtual > 3) {
    metaAtual = 3;
  }

  document.getElementById("metaAtual").textContent = metaAtual;

  const porcentagem = (metaAtual / 3) * 100;
  document.getElementById("barraMeta").style.width = porcentagem + "%";
}