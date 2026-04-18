// ===== menu lateral
const menu = document.getElementById("menuLateral");
const menuIcon = document.querySelector(".menu-icon");

// ===== abrir menu
function openMenu() {
  menu.classList.add("active");
}

// ===== fechar menu
function closeMenu() {
  menu.classList.remove("active");
}

// ===== fechar ao clicar fora
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !menuIcon.contains(e.target)) {
    menu.classList.remove("active");
  }
});

// ===== catalogo

const trilho = document.getElementById("trilho");
const btnEsquerda = document.getElementById("btnEsquerda");
const btnDireita = document.getElementById("btnDireita");

let posicaoAtual = 0;

function larguraDoCard() {
  const card = document.querySelector(".card");
  const estilo = window.getComputedStyle(trilho);
  const gap = parseInt(estilo.columnGap || estilo.gap || 0);
  return card.offsetWidth + gap;
}

function maximoDeslocamento() {
  const janela = document.getElementById("janelaCarrossel");
  return Math.max(0, trilho.scrollWidth - janela.clientWidth);
}

function atualizarCarrossel() {
  trilho.style.transform = `translateX(-${posicaoAtual}px)`;
}

btnDireita.addEventListener("click", () => {
  posicaoAtual += larguraDoCard();
  const limite = maximoDeslocamento();
  if (posicaoAtual > limite) {
    posicaoAtual = limite;
  }
  atualizarCarrossel();
});

btnEsquerda.addEventListener("click", () => {
  posicaoAtual -= larguraDoCard();
  if (posicaoAtual < 0) {
    posicaoAtual = 0;
  }
  atualizarCarrossel();
});

window.addEventListener("resize", () => {
  const limite = maximoDeslocamento();
  if (posicaoAtual > limite) {
    posicaoAtual = limite;
  }
  atualizarCarrossel();
});
