// menu lateral
const menu = document.getElementById("menuLateral");
const menuIcon = document.querySelector(".menu-icon");

function openMenu() {
  menu.classList.add("active");
}

function closeMenu() {
  menu.classList.remove("active");
}

document.addEventListener("click", (e) => {
  if (menu && menuIcon && !menu.contains(e.target) && !menuIcon.contains(e.target)) {
    menu.classList.remove("active");
  }
});

// mapa de fases - física
const mundosQuiz = [
  {
    capitulo: "Capítulo 1",
    titulo: "Mecânica",
    descricao: "Aprenda movimento, velocidade, aceleração, força, leis de Newton e energia mecânica.",
    fases: [
      {
        id: "fisica-mecanica-lvl-1",
        titulo: "Movimento",
        descricao: "Entenda posição, deslocamento, velocidade e trajetória.",
        icone: "🚀",
        xp: 1000,
        url: "indexPerguntasFisica.html",
      },
      {
        id: "fisica-mecanica-lvl-2",
        titulo: "Força",
        descricao: "Estude força, massa, peso e interações entre corpos.",
        icone: "💪",
        xp: 1200,
        url: "#",
      },
      {
        id: "fisica-mecanica-lvl-3",
        titulo: "Leis de Newton",
        descricao: "Treine inércia, força resultante e ação e reação.",
        icone: "🍎",
        xp: 1500,
        url: "#",
      },
      {
        id: "fisica-mecanica-boss",
        titulo: "Chefão Mecânico",
        descricao: "Desafio final de mecânica.",
        icone: "👑",
        xp: 2000,
        url: "#",
      },
    ],
  },
  {
    capitulo: "Capítulo 2",
    titulo: "Termologia",
    descricao: "Explore temperatura, calor, dilatação térmica, mudanças de estado e trocas de energia.",
    fases: [
      {
        id: "fisica-termologia-lvl-1",
        titulo: "Temperatura e Calor",
        descricao: "Entenda a diferença entre calor, temperatura e equilíbrio térmico.",
        icone: "🌡️",
        xp: 1000,
        url: "#",
      },
      {
        id: "fisica-termologia-lvl-2",
        titulo: "Escalas Térmicas",
        descricao: "Resolva questões com Celsius, Fahrenheit e Kelvin.",
        icone: "🔥",
        xp: 1200,
        url: "#",
      },
      {
        id: "fisica-termologia-lvl-3",
        titulo: "Mudanças de Estado",
        descricao: "Estude fusão, vaporização, condensação e solidificação.",
        icone: "🧊",
        xp: 1500,
        url: "#",
      },
      {
        id: "fisica-termologia-boss",
        titulo: "Chefão Térmico",
        descricao: "Desafio final de termologia.",
        icone: "🏆",
        xp: 2000,
        url: "#",
      },
    ],
  },
];

const mapaQuiz = document.getElementById("mapaQuiz");
const xpQuizTela = document.getElementById("xpQuizTela");
const fasesConcluidasTela = document.getElementById("fasesConcluidasTela");
const estrelasTela = document.getElementById("estrelasTela");
const statusGeral = document.getElementById("statusGeral");

function faseFoiConcluida(id) {
  return localStorage.getItem(`quiz_${id}_concluido`) === "true";
}

function pegarEstrelas(id) {
  return Number(localStorage.getItem(`quiz_${id}_estrelas`)) || 0;
}

function faseEstaDesbloqueada(fases, indice) {
  if (indice === 0) return true;

  const faseAnterior = fases[indice - 1];
  return faseFoiConcluida(faseAnterior.id);
}

function desenharMapa() {
  mapaQuiz.innerHTML = "";

  let totalFases = 0;
  let totalConcluidas = 0;
  let totalEstrelas = 0;
  let xpTotal = 0;

  mundosQuiz.forEach((mundo) => {
    totalFases += mundo.fases.length;

    const concluidasNoMundo = mundo.fases.filter((fase) =>
      faseFoiConcluida(fase.id)
    ).length;

    totalConcluidas += concluidasNoMundo;

    const porcentagem = (concluidasNoMundo / mundo.fases.length) * 100;

    const mundoCard = document.createElement("section");
    mundoCard.classList.add("mundo-card");

    mundoCard.innerHTML = `
      <div class="mundo-topo">
        <div>
          <span class="mundo-tag">${mundo.capitulo}</span>
          <h2>${mundo.titulo}</h2>
          <p>${mundo.descricao}</p>
        </div>

        <div class="mundo-progresso">
          <p>${concluidasNoMundo}/${mundo.fases.length} fases concluídas</p>
          <div class="barra-progresso">
            <span style="width: ${porcentagem}%"></span>
          </div>
        </div>
      </div>

      <div class="trilha-game"></div>
    `;

    const trilha = mundoCard.querySelector(".trilha-game");

    mundo.fases.forEach((fase, indice) => {
      const concluida = faseFoiConcluida(fase.id);
      const desbloqueada = faseEstaDesbloqueada(mundo.fases, indice);
      const estrelas = pegarEstrelas(fase.id);

      totalEstrelas += estrelas;

      if (concluida) {
        xpTotal += fase.xp;
      }

      const botao = document.createElement("button");
      botao.classList.add("fase-game");

      if (concluida) {
        botao.classList.add("concluida");
      } else if (desbloqueada) {
        botao.classList.add("atual");
      } else {
        botao.classList.add("bloqueada");
      }

      botao.innerHTML = `
        ${!desbloqueada ? `<span class="cadeado">🔒</span>` : ""}
        <div class="fase-numero">${concluida ? "✅" : fase.icone}</div>
        <h3>${fase.titulo}</h3>
        <p>${fase.descricao}</p>

        <div class="fase-recompensa">
          <span>+${fase.xp} XP</span>
          <span class="estrelas">${montarEstrelas(estrelas)}</span>
        </div>
      `;

      botao.addEventListener("click", () => {
        abrirFase(fase, desbloqueada);
      });

      trilha.appendChild(botao);
    });

    mapaQuiz.appendChild(mundoCard);
  });

  xpQuizTela.textContent = xpTotal;
  fasesConcluidasTela.textContent = `${totalConcluidas}/${totalFases}`;
  estrelasTela.textContent = totalEstrelas;
  statusGeral.textContent = `${totalConcluidas} fases concluídas`;

  atualizarRank(totalConcluidas);
}

function montarEstrelas(quantidade) {
  let estrelas = "";

  for (let i = 1; i <= 3; i++) {
    estrelas += i <= quantidade ? "⭐" : "☆";
  }

  return estrelas;
}

function atualizarRank(totalConcluidas) {
  const rank = document.querySelector(".rank-card strong");

  if (totalConcluidas >= 8) {
    rank.textContent = "Mestre";
  } else if (totalConcluidas >= 5) {
    rank.textContent = "Avançado";
  } else if (totalConcluidas >= 2) {
    rank.textContent = "Explorador";
  } else {
    rank.textContent = "Aprendiz";
  }
}

function abrirFase(fase, desbloqueada) {
  if (!desbloqueada) {
    mostrarAviso("Conclua a fase anterior para desbloquear esta.");
    return;
  }

  if (fase.url === "#") {
    mostrarAviso("Essa fase ainda está em desenvolvimento.");
    return;
  }

  window.location.href = fase.url;
}

function mostrarAviso(texto) {
  let aviso = document.querySelector(".aviso-bloqueado");

  if (!aviso) {
    aviso = document.createElement("div");
    aviso.classList.add("aviso-bloqueado");
    document.body.appendChild(aviso);
  }

  aviso.textContent = texto;
  aviso.classList.add("ativo");

  setTimeout(() => {
    aviso.classList.remove("ativo");
  }, 2200);
}

desenharMapa();