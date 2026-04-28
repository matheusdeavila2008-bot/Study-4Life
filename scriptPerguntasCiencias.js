const questoes = [
  {
    imagem: "https://picsum.photos/900/400?1",
    pergunta: "Qual é a unidade básica da vida?",
    respostas: ["Átomo", "Célula", "Molécula", "Tecido"],
    correta: 1,
  },
  {
    imagem: "https://picsum.photos/900/400?2",
    pergunta: "Qual órgão do corpo humano bombeia o sangue?",
    respostas: ["Pulmão", "Fígado", "Coração", "Rim"],
    correta: 2,
  },
  {
    imagem: "https://picsum.photos/900/400?3",
    pergunta: "Qual gás as plantas absorvem na fotossíntese?",
    respostas: ["Oxigênio", "Nitrogênio", "Gás carbônico", "Hidrogênio"],
    correta: 2,
  },
  {
    imagem: "https://picsum.photos/900/400?4",
    pergunta: "Qual parte da planta fixa o vegetal no solo?",
    respostas: ["Flor", "Folha", "Raiz", "Fruto"],
    correta: 2,
  },
  {
    imagem: "https://picsum.photos/900/400?5",
    pergunta: "Qual sistema do corpo humano é responsável pela respiração?",
    respostas: ["Digestório", "Respiratório", "Nervoso", "Circulatório"],
    correta: 1,
  },
  {
    imagem: "https://picsum.photos/900/400?6",
    pergunta: "Qual animal é mamífero?",
    respostas: ["Galinha", "Sapo", "Baleia", "Peixe"],
    correta: 2,
  },
  {
    imagem: "https://picsum.photos/900/400?7",
    pergunta: "Onde fica armazenado o material genético da célula?",
    respostas: ["Membrana", "Citoplasma", "Núcleo", "Parede celular"],
    correta: 2,
  },
  {
    imagem: "https://picsum.photos/900/400?8",
    pergunta: "Qual vitamina é produzida com ajuda da luz solar?",
    respostas: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina K"],
    correta: 2,
  },
  {
    imagem: "https://picsum.photos/900/400?9",
    pergunta: "Qual é o maior órgão do corpo humano?",
    respostas: ["Pulmão", "Pele", "Cérebro", "Estômago"],
    correta: 1,
  },
  {
    imagem: "https://picsum.photos/900/400?10",
    pergunta: "O que os seres vivos precisam para sobreviver?",
    respostas: ["Apenas luz", "Apenas água", "Energia e recursos do ambiente", "Apenas ar"],
    correta: 2,
  },
];

let atual = 0;
let acertos = 0;

function carregarQuestao() {
  const q = questoes[atual];

  document.getElementById("imagemQuestao").src = q.imagem;
  document.getElementById("pergunta").textContent = q.pergunta;
  document.getElementById("contador").textContent = `${atual + 1}/10`;

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

function finalizarQuiz() {
  const aprovado = acertos >= 7;

  document.getElementById("conteudoQuiz").innerHTML = `
    <div class="final">
      <h2>Quiz Finalizado 🎉</h2>
      <p>Você acertou ${acertos} de ${questoes.length} questões.</p>

      ${
        aprovado
          ? `
            <p class="aprovado">Parabéns! Você concluiu essa fase.</p>

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

  document.getElementById("contador").textContent = "10/10";
  document.getElementById("barra").style.width = "100%";
}

function voltarFases() {
  window.location.href = "quizMatematica.html";
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
