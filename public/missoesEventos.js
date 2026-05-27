async function registrarEventoMissao(evento) {
  const usuarioId = localStorage.getItem("usuario_id");

  if (!usuarioId) {
    return;
  }

  const resposta = await fetch("http://127.0.0.1:5000/missao/evento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      usuario_id: usuarioId,
      evento: evento
    })
  });

  const resultado = await resposta.json();

  console.log(resultado.mensagem);
}