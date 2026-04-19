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

const wrappers = document.querySelectorAll(".trilho-wrapper");

wrappers.forEach((wrapper) => {
  const trilho = wrapper.querySelector(".trilho");
  const janela = wrapper.querySelector(".janela-carrossel");
  const btnEsquerda = wrapper.querySelector(".seta-esquerda");
  const btnDireita = wrapper.querySelector(".seta-direita");
  const card = wrapper.querySelector(".card");

  let posicaoAtual = 0;

  function larguraDoCard() {
    const estilo = window.getComputedStyle(trilho);
    const gap = parseInt(estilo.columnGap || estilo.gap || 0);
    return card.offsetWidth + gap;
  }

  function maximoDeslocamento() {
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
});

// ===== menu lateral das categorias
const menuCategorias = document.getElementById("menuCategorias");

// ===== abrir menu das categorias
function openCategorias() {
  menuCategorias.classList.add("active");
}

// ===== fechar menu das categorias
function closeCategorias() {
  menuCategorias.classList.remove("active");
}

// ===== fechar menu ao clicar fora
document.addEventListener("click", (e) => {
  const botaoCategorias = document.querySelector('[onclick="openCategorias()"]');

  if(
    menuCategorias &&
    !menuCategorias.contains(e.target) &&
    botaoCategorias &&
    !botaoCategorias.contains(e.target)
){
    menuCategorias.classList.remove("active");
  }
});

document.querySelectorAll("#menuCategorias a").forEach((link) => {
  link.addEventListener("click", () => {
    closeCategorias();
  });
});