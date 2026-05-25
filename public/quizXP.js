async function adicionarXpQuiz(xpGanho, quizId) {
  const usuarioId = localStorage.getItem("usuario_id");

  if (!usuarioId) {
    alert("Usuário não encontrado. Faça login novamente.");
    return "Usuário não encontrado.";
  }

  const resposta = await fetch("http://127.0.0.1:5000/quiz/xp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      usuario_id: usuarioId,
      xp_ganho: xpGanho,
      quiz_id: quizId
    })
  });

  const resultado = await resposta.json();

  return resultado.mensagem;
}