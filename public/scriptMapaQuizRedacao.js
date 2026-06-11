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

// mapa de fases - redação
const mundosQuiz = [
  {
    capitulo: "Capítulo 1",
    titulo: "Estrutura Dissertativo-Argumentativa",
    descricao: "Aprenda introdução, desenvolvimento, conclusão, tese e organização do texto no modelo ENEM.",
    fases: [
      {
        id: "redacao-estrutura-lvl-1",
        titulo: "Introdução",
        descricao: "Entenda como apresentar o tema, contextualizar e criar uma tese forte.",
        icone: "📝",
        xp: 1000,
        url: "indexPerguntasRedacao.html",
      },
      {
        id: "redacao-estrutura-lvl-2",
        titulo: "Desenvolvimento",
        descricao: "Aprenda a construir parágrafos com ideia principal, repertório e explicação.",
        icone: "📚",
        xp: 1200,
        url: "#",
      },
      {
        id: "redacao-estrutura-lvl-3",
        titulo: "Conclusão",
        descricao: "Treine proposta de intervenção completa com agente, ação, meio, finalidade e detalhamento.",
        icone: "🎯",
        xp: 1500,
        url: "#",
      },
      {
        id: "redacao-estrutura-boss",
        titulo: "Chefão da Estrutura",
        descricao: "Desafio final sobre a estrutura completa da redação.",
        icone: "👑",
        xp: 2000,
        url: "#",
      },
    ],
  },
  {
    capitulo: "Capítulo 2",
    titulo: "Argumentação",
    descricao: "Treine repertórios, argumentos, conectivos, coerência, coesão e defesa de ponto de vista.",
    fases: [
      {
        id: "redacao-argumentacao-lvl-1",
        titulo: "Tese e Ponto de Vista",
        descricao: "Aprenda a defender uma opinião clara e adequada ao tema.",
        icone: "💡",
        xp: 1000,
        url: "#",
      },
      {
        id: "redacao-argumentacao-lvl-2",
        titulo: "Repertório Sociocultural",
        descricao: "Use dados, leis, livros, filmes, filósofos e fatos históricos na argumentação.",
        icone: "🏛️",
        xp: 1200,
        url: "#",
      },
      {
        id: "redacao-argumentacao-lvl-3",
        titulo: "Coesão e Coerência",
        descricao: "Aprenda a conectar ideias e deixar seu texto mais claro e organizado.",
        icone: "🔗",
        xp: 1500,
        url: "#",
      },
      {
        id: "redacao-argumentacao-boss",
        titulo: "Chefão da Argumentação",
        descricao: "Desafio final de tese, repertório, coesão e defesa de ideias.",
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