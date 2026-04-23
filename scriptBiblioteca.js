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
  const botaoCategorias = document.querySelector(
    '[onclick="openCategorias()"]',
  );

  if (
    menuCategorias &&
    !menuCategorias.contains(e.target) &&
    botaoCategorias &&
    !botaoCategorias.contains(e.target)
  ) {
    menuCategorias.classList.remove("active");
  }
});

document.querySelectorAll("#menuCategorias a").forEach((link) => {
  link.addEventListener("click", () => {
    closeCategorias();
  });
});

// ===== modal reutilizável
const modalOverlay = document.getElementById("modalOverlay");
const fecharModal = document.getElementById("fecharModal");

const modalImagem = document.getElementById("modalImagem");
const modalTitulo = document.getElementById("modalTitulo");
const modalAutor = document.getElementById("modalAutor");
const modalResumo = document.getElementById("modalResumo");
const modalCategoria1 = document.getElementById("modalCategoria1");
const modalCategoria2 = document.getElementById("modalCategoria2");

const modalLink = document.getElementById("modalLink");
const cardsModal = document.querySelectorAll(".abrir-modal");

cardsModal.forEach((card) => {
  card.addEventListener("click", () => {
    const titulo = card.dataset.titulo;
    const autor = card.dataset.autor;
    const resumo = card.dataset.resumo;
    const imagem = card.dataset.imagem;
    const categoria1 = card.dataset.categoria1;
    const categoria2 = card.dataset.categoria2;
    const link = card.dataset.link;

    modalImagem.src = imagem;
    modalImagem.alt = titulo;
    modalTitulo.textContent = titulo;
    modalAutor.textContent = autor;
    modalResumo.textContent = resumo;
    modalCategoria1.textContent = categoria1;
    modalCategoria2.textContent = categoria2;
    modalLink.href = link;

    modalOverlay.classList.add("ativo");
    document.body.classList.add("modal-aberto");
  });
});

function fecharModalFuncao() {
  modalOverlay.classList.remove("ativo");
  document.body.classList.remove("modal-aberto");
}

fecharModal.addEventListener("click", fecharModalFuncao);

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    fecharModalFuncao();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("ativo")) {
    fecharModalFuncao();
  }
});
