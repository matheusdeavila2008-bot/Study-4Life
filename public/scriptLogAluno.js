const formLoginAluno = document.getElementById("formLoginAluno");

formLoginAluno.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const dados = {
    email: email,
    senha: senha,
  };

  const baseUrl = window.BACKEND_URL || "http://127.0.0.1:5000";
  const resposta = await fetch(`${baseUrl}/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(dados),
  });

  const resultado = await resposta.json();

  if (resultado.sucesso) {
    // salva login
    localStorage.setItem("usuario_logado", "true");

    // salva dados do usuário
    localStorage.setItem("usuario_id", resultado.usuario.id);

    localStorage.setItem("usuario_nome", resultado.usuario.nome);

    alert("Login realizado com sucesso!");

    // vai para home
    window.location.href = "indexHome.html";
  } else {
    alert(resultado.mensagem);
  }
});
