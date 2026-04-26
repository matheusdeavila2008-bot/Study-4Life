let xp = 340;
let xpMeta = 500;
let nivel = 7;
let feitas = 0;

const avatares = ["🧑‍🎓", "👨‍💻", "👩‍💻", "🧠", "🚀", "😎"];
let avatarAtual = 0;

function atualizarBarra() {
  let porcentagem = (xp / xpMeta) * 100;
  if (porcentagem > 100) porcentagem = 100;

  document.getElementById("barraXp").style.width = porcentagem + "%";
  document.getElementById("xpAtual").textContent = xp;
}

function completarMissao(check, valor) {
  if (check.checked) {
    xp += valor;
    feitas++;
  } else {
    xp -= valor;
    feitas--;
  }

  if (xp >= xpMeta) {
    xp -= xpMeta;
    nivel++;
    document.getElementById("boxNivel").textContent = nivel;
    document.getElementById("nivelMini").textContent = nivel;
    document.getElementById("nivelTopo").textContent = "✨ Nível " + nivel;
  }

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

atualizarBarra();