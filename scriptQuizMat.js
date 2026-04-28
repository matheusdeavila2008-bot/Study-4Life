let faseLiberada = 0;

const fases = document.querySelectorAll(".fase");

const paginasDasFases = [
  "indexPerguntasMat.html",
  "quizMatematicaPerguntas2.html",
  "quizMatematicaPerguntas3.html",
  "quizMatematicaPerguntas4.html",
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
    alert("Essa fase ainda está bloqueada!");
    return;
  }

  window.location.href = paginasDasFases[index];
}

atualizarFases();
