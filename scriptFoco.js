// ===== MENU LATERAL =====
const menu = document.getElementById("menuLateral");
const menuIcon = document.querySelector(".menu-icon");

// abrir menu
function openMenu() {
  menu.classList.add("active");
}

// fechar menu
function closeMenu() {
  menu.classList.remove("active");
}

// ===== FECHAR CLICANDO FORA (EXTRA 🔥) =====
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !menuIcon.contains(e.target)) {
    menu.classList.remove("active");
  }
});

let tempoFoco = 25 * 60;
let tempoDescanso = 5 * 60;

let intervalo = null;

function formatarTempo(segundos) {
  let min = Math.floor(segundos / 60);
  let sec = segundos % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function atualizarTela() {
  document.getElementById("tempoFoco").innerText = formatarTempo(tempoFoco);
  document.getElementById("tempoDescanso").innerText = formatarTempo(tempoDescanso);
}

function iniciarFoco() {
  if (intervalo) return;

  intervalo = setInterval(() => {
    if (tempoFoco > 0) {
      tempoFoco--;
    } else {
      clearInterval(intervalo);
      intervalo = null;
      iniciarDescanso();
    }
    atualizarTela();
  }, 1000);
}

function iniciarDescanso() {
  if (intervalo) return;

  intervalo = setInterval(() => {
    if (tempoDescanso > 0) {
      tempoDescanso--;
    } else {
      clearInterval(intervalo);
      intervalo = null;
      iniciarFoco();
    }
    atualizarTela();
  }, 1000);
}

function pausar() {
  clearInterval(intervalo);
  intervalo = null;
}

function resetar() {
  clearInterval(intervalo);
  intervalo = null;

  tempoFoco = 25 * 60;
  tempoDescanso = 5 * 60;

  atualizarTela();
}

atualizarTela();