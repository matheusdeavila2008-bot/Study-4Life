// nome do usuário logado
const nomeSalvo = localStorage.getItem("usuario_nome");
const nomeUsuario = document.getElementById("nomeUsuario");

if (nomeSalvo) {
  nomeUsuario.innerHTML = `<span>${nomeSalvo}</span>`;
} else {
  nomeUsuario.innerHTML = `<span>Estudante</span>`;
}

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
  if (!menu.contains(e.target) && !menuIcon.contains(e.target)) {
    menu.classList.remove("active");
  }
});

let xp = 0;
let xpMeta = 100;
let nivel = 0;
let feitas = 0;

const avatares = ["🧑‍🎓", "👨‍💻", "👩‍💻", "🧠", "🚀", "😎"];
let avatarAtual = 0;

function atualizarBarra() {
  let xpNivelAtual = xp % 100;
  let porcentagem = (xpNivelAtual / xpMeta) * 100;

  document.getElementById("barraXp").style.width = porcentagem + "%";
  document.getElementById("xpAtual").textContent = xpNivelAtual;
  document.getElementById("xpMeta").textContent = xpMeta;
}

function concluirMeta(valorXP) {
  xp += valorXP;
  feitas++;

  nivel = Math.floor(xp / 100);

  document.getElementById("boxNivel").textContent = nivel;
  document.getElementById("nivelMini").textContent = nivel;
  document.getElementById("feitas").textContent = feitas;

  atualizarBarra();
}

function trocarAvatar() {
  avatarAtual++;

  if (avatarAtual >= avatares.length) {
    avatarAtual = 0;
  }

  document.getElementById("avatarBtn").textContent = avatares[avatarAtual];
}

function toggleConfig() {
  const menu = document.getElementById("menuConfig");
  const btn = document.querySelector(".btn-config");
  const seta = document.getElementById("setaConfig");

  menu.classList.toggle("ativo");
  btn.classList.toggle("aberto");

  if (menu.classList.contains("ativo")) {
    seta.textContent = "▴";
  } else {
    seta.textContent = "▾";
  }
}

async function carregarProgressoUsuario() {
  const usuarioId = localStorage.getItem("usuario_id");

  const resposta = await fetch(`http://127.0.0.1:5000/perfil/${usuarioId}`);
  const dados = await resposta.json();

  xp = dados.xp;
  nivel = dados.nivel;

  document.getElementById("dias").textContent = dados.dias_consecutivos;
  document.getElementById("boxNivel").textContent = dados.nivel;
  document.getElementById("nivelMini").textContent = dados.nivel;
  document.getElementById("horas").textContent = `${dados.horas_totais}h`;
  document.getElementById("ranking").textContent = `#${dados.ranking}`;

  atualizarBarra();
}

carregarProgressoUsuario();