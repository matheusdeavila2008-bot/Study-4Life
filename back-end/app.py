from flask import Flask, request, jsonify
from flask_cors import CORS
from banco import login, cadastrar_usuario

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Backend do Study 4 Life está funcionando!"


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
                "email": usuario.email
            }
        })

    return jsonify({
        "sucesso": False,
        "mensagem": "E-mail ou senha incorretos."
    })


if __name__ == "__main__":
    app.run(debug=True)