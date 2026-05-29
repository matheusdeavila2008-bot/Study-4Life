// perguntas quiz Git e GitHub
const questoes = [
  {
    imagem:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1170&auto=format&fit=crop",
    pergunta: "Qual é a principal função do Git?",
    respostas: [
      "Editar imagens",
      "Controlar versões de código",
      "Criar bancos de dados",
      "Hospedar vídeos",
    ],
    correta: 1,
  },
  {
    imagem:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1170&auto=format&fit=crop",
    pergunta: "Qual comando inicializa um repositório Git?",
    respostas: ["git start", "git init", "git create", "git push"],
    correta: 1,
  },
  {
    imagem:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1170&auto=format&fit=crop",
    pergunta: "Qual plataforma é usada para hospedar repositórios Git online?",
    respostas: ["Photoshop", "GitHub", "Figma", "Word"],
    correta: 1,
  },
  {
    imagem:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1172&auto=format&fit=crop",
    pergunta: "Qual comando envia alterações para o GitHub?",
    respostas: ["git pull", "git add", "git push", "git merge"],
    correta: 2,
  },
  {
    imagem:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1170&auto=format&fit=crop",
    pergunta: "Qual comando adiciona arquivos para preparação de commit?",
    respostas: ["git stage", "git add", "git upload", "git save"],
    correta: 1,
  },
  {
    imagem:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1170&auto=format&fit=crop",
    pergunta: "O que é um commit no Git?",
    respostas: [
      "Um erro no código",
      "Uma cópia de segurança do computador",
      "Um registro de alterações no projeto",
      "Um site hospedado",
    ],
    correta: 2,
  },
  {
    imagem:
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1170&auto=format&fit=crop",
    pergunta: "Qual comando baixa alterações do repositório remoto?",
    respostas: ["git clone", "git branch", "git pull", "git commit"],
    correta: 2,
  },
  {
    imagem:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1170&auto=format&fit=crop",
    pergunta: "Para que serve uma branch no Git?",
    respostas: [
      "Hospedar imagens",
      "Criar versões paralelas do projeto",
      "Apagar commits",
      "Editar banco de dados",
    ],
    correta: 1,
  },
  {
    imagem:
      "https://images.unsplash.com/photo-1515876305430-f06edab8282a?q=80&w=1170&auto=format&fit=crop",
    pergunta: "Qual comando cria uma cópia de um repositório remoto?",
    respostas: ["git clone", "git fork", "git copy", "git branch"],
    correta: 0,
  },
  {
    imagem:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1170&auto=format&fit=crop",
    pergunta: "Qual comando mostra o estado atual dos arquivos no Git?",
    respostas: ["git check", "git files", "git status", "git state"],
    correta: 2,
  },
];

const QUIZ_ID = "git-github-lvl-1";

let atual = 0;
let acertos = 0;

function carregarQuestao() {
  const q = questoes[atual];

  document.getElementById("imagemQuestao").src = q.imagem;
  document.getElementById("pergunta").textContent = q.pergunta;
  document.getElementById("contador").textContent =
    `${atual + 1}/${questoes.length}`;

  const progresso = ((atual + 1) / questoes.length) * 100;
  document.getElementById("barra").style.width = progresso + "%";

  const area = document.getElementById("respostas");
  area.innerHTML = "";

  q.respostas.forEach((texto, indice) => {
    const btn = document.createElement("button");
    btn.textContent = texto;
    btn.onclick = () => responder(btn, indice);
    area.appendChild(btn);
  });
}

function responder(botao, indice) {
  const correta = questoes[atual].correta;
  const botoes = document.querySelectorAll(".respostas button");

  botoes.forEach((btn) => {
    btn.disabled = true;
  });

  if (indice === correta) {
    botao.classList.add("correta");
    acertos++;
  } else {
    botao.classList.add("errada");
    botoes[correta].classList.add("correta");
  }

  setTimeout(() => {
    atual++;

    if (atual < questoes.length) {
      carregarQuestao();
    } else {
      finalizarQuiz();
    }
  }, 1000);
}

async function finalizarQuiz() {
  const aprovado = acertos >= 7;

  let xpGanho = 0;
  let mensagemXp = "";

  if (aprovado) {
    xpGanho = acertos * 100;
    mensagemXp = await adicionarXpQuiz(xpGanho, QUIZ_ID);

    await registrarEventoMissao("responder_quiz");
    await registrarEventoMissao("estudar_git");

    if (acertos >= 10) {
      await registrarEventoMissao("acertar_10_perguntas");
    }
  }

  document.getElementById("conteudoQuiz").innerHTML = `
    <div class="final">
      <h2>Quiz Finalizado 🎉</h2>
      <p>Você acertou ${acertos} de ${questoes.length} questões.</p>

      ${
        aprovado
          ? `
            <p class="aprovado">
              Parabéns! Você concluiu esse level.
            </p>

            <p class="aprovado">
              ${
                mensagemXp === "XP Quiz atualizado com sucesso." ||
                mensagemXp === "XP atualizado com sucesso."
                  ? `Você ganhou ${xpGanho} XP Quiz.`
                  : mensagemXp
              }
            </p>

            <button class="btn-voltar" onclick="voltarFases()">
              Voltar para Fases
            </button>
          `
          : `
            <p class="reprovado">
              Você precisa acertar pelo menos 7 questões para concluir.
            </p>

            <div class="acoes-finais">
              <button class="btn-retry" onclick="reiniciarQuiz()">
                Tentar Novamente
              </button>

              <button class="btn-voltar" onclick="voltarFases()">
                Voltar para Fases
              </button>
            </div>
          `
      }
    </div>
  `;

  document.getElementById("contador").textContent =
    `${questoes.length}/${questoes.length}`;
  document.getElementById("barra").style.width = "100%";
}

function voltarFases() {
  window.location.href = "quizGit.html";
}

function reiniciarQuiz() {
  atual = 0;
  acertos = 0;

  document.getElementById("conteudoQuiz").innerHTML = `
    <div class="area-img">
      <img id="imagemQuestao" src="" alt="Imagem da questão">
    </div>

    <div class="pergunta" id="pergunta"></div>

    <div class="respostas" id="respostas"></div>
  `;

  carregarQuestao();
}

carregarQuestao();