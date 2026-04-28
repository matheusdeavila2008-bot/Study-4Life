let faseLiberada = 0;

const fases = document.querySelectorAll(".fase");

const paginasDasFases = [
  "indexPerguntasPortugues.html",
  "#",
  "#",
  "#",
];

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
    alert("Essa fase ainda está em desenvolvimento!");
    return;
  }

  window.location.href = paginasDasFases[index];
}

atualizarFases();
