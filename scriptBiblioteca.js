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
