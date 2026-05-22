const formCadastroAluno = document.getElementById("formCadastroAluno");

formCadastroAluno.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const cpf = document.getElementById("cpf").value;
  const termos = document.getElementById("termos").checked;

  if (!termos) {
    alert("Você precisa aceitar os termos de uso.");
    return;
  }

  const dados = {
    nome: nome,
    email: email,
    senha: senha,
    confirmar_senha: confirmarSenha,
    cpf: cpf,
  };

  const resposta = await fetch("http://127.0.0.1:5000/cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  const resultado = await resposta.json();

alert(resultado.mensagem);

if (resultado.mensagem.toLowerCase().includes("sucesso")) {
  window.location.assign("indexLogaluno.html");
}
});
