async function carregarAvatarHeader() {
  const usuarioId = localStorage.getItem("usuario_id");

  if (!usuarioId) {
    return;
  }

  const resposta = await fetch(`http://127.0.0.1:5000/perfil/${usuarioId}`);
  const dados = await resposta.json();

  const iconesPerfil = document.querySelectorAll(".icone-perfil");

  iconesPerfil.forEach((icone) => {
    icone.textContent = dados.avatar || "👨‍💻";
  });

  localStorage.setItem("usuario_avatar", dados.avatar || "👨‍💻");
}

carregarAvatarHeader();