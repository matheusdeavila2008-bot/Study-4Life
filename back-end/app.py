from flask import Flask, request, jsonify
from flask_cors import CORS

from banco import (
    login,
    cadastrar_usuario,
    registrar_acesso_usuario,
    pegar_dados_perfil,
    atualizar_tempo_site,
    adicionar_xp,
    salvar_avatar,
    listar_ranking
)

app = Flask(__name__)
CORS(app)


# =========================
# HOME
# =========================
@app.route("/")
def home():
    return "Backend do Study 4 Life está funcionando!"


# =========================
# CADASTRO
# =========================
@app.route("/cadastro", methods=["POST"])
def rota_cadastro():

    dados = request.get_json()

    resultado = cadastrar_usuario(
        nome=dados["nome"],
        email=dados["email"],
        senha=dados["senha"],
        confirmar_senha=dados["confirmar_senha"],
        cpf=dados["cpf"]
    )

    return jsonify({
        "mensagem": resultado
    })


# =========================
# LOGIN
# =========================
@app.route("/login", methods=["POST"])
def rota_login():

    dados = request.get_json()

    usuario = login(
        email=dados["email"],
        senha=dados["senha"]
    )

    if usuario:

        return jsonify({
            "sucesso": True,
            "mensagem": "Login realizado com sucesso.",
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome,
                "email": usuario.email,
                "avatar": usuario.avatar
            }
        })

    return jsonify({
        "sucesso": False,
        "mensagem": "E-mail ou senha incorretos."
    })


# =========================
# PERFIL
# =========================
@app.route("/perfil/<int:usuario_id>", methods=["GET"])
def rota_perfil(usuario_id):

    registrar_acesso_usuario(usuario_id)

    dados = pegar_dados_perfil(usuario_id)

    if not dados:

        return jsonify({
            "erro": "Dados do perfil não encontrados."
        }), 404

    return jsonify(dados)


# =========================
# TEMPO TOTAL
# =========================
@app.route("/tempo", methods=["POST"])
def rota_tempo():

    dados = request.get_json()

    usuario_id = dados["usuario_id"]
    minutos = dados["minutos"]

    resultado = atualizar_tempo_site(
        usuario_id,
        minutos
    )

    return jsonify({
        "mensagem": resultado
    })


# =========================
# GANHAR XP NO QUIZ
# =========================
@app.route("/quiz/xp", methods=["POST"])
def rota_xp_quiz():

    dados = request.get_json()

    usuario_id = dados["usuario_id"]
    xp_ganho = dados["xp_ganho"]

    resultado = adicionar_xp(
        usuario_id,
        xp_ganho
    )

    return jsonify({
        "mensagem": resultado
    })


# =========================
# SALVAR AVATAR
# =========================
@app.route("/avatar", methods=["POST"])
def rota_avatar():

    dados = request.get_json()

    usuario_id = dados["usuario_id"]
    avatar = dados["avatar"]

    resultado = salvar_avatar(
        usuario_id,
        avatar
    )

    return jsonify({
        "mensagem": resultado
    })


# =========================
# LISTAR RANKING
# =========================
@app.route("/ranking", methods=["GET"])
def rota_ranking():

    ranking = listar_ranking()

    return jsonify(ranking)


# =========================
# INICIAR SERVIDOR
# =========================
if __name__ == "__main__":
    app.run(debug=True)