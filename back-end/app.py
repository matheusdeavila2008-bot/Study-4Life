from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
import os

from banco import (
    salvar_chat_ia,
    salvar_chat_ajuda,
    listar_chats_ia_usuario,
    login,
    cadastrar_usuario,
    registrar_acesso_usuario,
    pegar_dados_perfil,
    atualizar_tempo_site,
    adicionar_xp_quiz,
    adicionar_xp_nivel,
    salvar_avatar,
    listar_ranking,
    pegar_missoes_usuario,
    concluir_missao,
    concluir_missao_por_evento
)

from machine_learning import responder_pergunta

app = Flask(__name__)
CORS(app)

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# =========================
# HOME

@app.route("/")
def home():
    return "Backend do Study 4 Life está funcionando!"


# =========================
# CADASTRO

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
# GANHAR XP QUIZ SEM FARM

@app.route("/quiz/xp", methods=["POST"])
def rota_xp_quiz():

    dados = request.get_json()

    usuario_id = dados["usuario_id"]
    xp_ganho = dados["xp_ganho"]
    quiz_id = dados["quiz_id"]

    resultado = adicionar_xp_quiz(
        usuario_id,
        xp_ganho,
        quiz_id
    )

    return jsonify({
        "mensagem": resultado
    })

# =========================
# GANHAR XP DE NÍVEL MANUAL

@app.route("/missao/xp", methods=["POST"])
def rota_xp_missao():

    dados = request.get_json()

    usuario_id = dados["usuario_id"]
    xp_ganho = dados["xp_ganho"]

    resultado = adicionar_xp_nivel(
        usuario_id,
        xp_ganho,
        missao_feita=True
    )

    return jsonify({
        "mensagem": resultado
    })

# =========================
# PEGAR MISSÕES DIÁRIAS

@app.route("/missoes/<int:usuario_id>", methods=["GET"])
def rota_missoes(usuario_id):

    missoes = pegar_missoes_usuario(usuario_id)

    return jsonify(missoes)

# =========================
# CONCLUIR MISSÃO DIÁRIA MANUAL

@app.route("/missoes/concluir", methods=["POST"])
def rota_concluir_missao():

    dados = request.get_json()

    usuario_id = dados["usuario_id"]
    missao_id = dados["missao_id"]

    resultado = concluir_missao(
        usuario_id,
        missao_id
    )

    return jsonify({
        "mensagem": resultado
    })

# =========================
# CONCLUIR MISSÃO POR EVENTO AUTOMÁTICO

@app.route("/missao/evento", methods=["POST"])
def rota_evento_missao():

    dados = request.get_json()

    usuario_id = dados["usuario_id"]
    evento = dados["evento"]

    resultado = concluir_missao_por_evento(
        usuario_id,
        evento
    )

    return jsonify({
        "mensagem": resultado
    })


# =========================
# SALVAR AVATAR

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

@app.route("/ranking", methods=["GET"])
def rota_ranking():

    ranking = listar_ranking()

    return jsonify(ranking)

# =========================
# CENTRAL DE AJUDA (MACHINE LEARNING)

@app.route("/ajuda", methods=["POST"])
def rota_ajuda():

    dados = request.get_json()

    usuario_id = dados["usuario_id"]
    pergunta = dados["pergunta"]

    resposta = responder_pergunta(pergunta)

    salvar_chat_ajuda(
        usuario_id,
        pergunta,
        resposta
    )

    return jsonify({
        "sucesso": True,
        "pergunta": pergunta,
        "resposta": resposta
    })

# =========================
# STUDYCHAT.IA

@app.route("/chat-ia", methods=["POST"])
def rota_chat_ia():

    dados = request.get_json()

    usuario_id = dados["usuario_id"]
    pergunta = dados["pergunta"]

    prompt = f"""
    Você é o StudyChat.IA, um assistente educacional do Study4Life.

    Regras de resposta:
    - Responda em português do Brasil.
    - Seja claro, simples, educativo e amigável.
    - Não use Markdown.
    - Não use asteriscos (*).
    - Não use hashtags (#).
    - Não use títulos com símbolos.
    - Não use negrito, itálico ou listas com marcadores.
    - Escreva em texto normal, como uma conversa natural.
    - Use parágrafos curtos.
    - Quando precisar listar algo, use frases simples ou numeração com 1., 2., 3.
    - Foque em ajudar estudantes de forma objetiva.
    - Não invente informações. Se não souber, diga que não tem certeza.

    Pergunta do estudante:
    {pergunta}
    """

    try:
        resposta = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        texto_resposta = resposta.text

        salvar_chat_ia(
            usuario_id,
            pergunta,
            texto_resposta
        )

        return jsonify({
            "sucesso": True,
            "pergunta": pergunta,
            "resposta": texto_resposta
        })

    except Exception as erro:
        print("Erro na IA:", erro)

        return jsonify({
            "sucesso": False,
            "erro": "limite",
            "resposta": "⏳ O StudyChat.IA atingiu o limite temporário de uso. Aguarde alguns segundos e tente novamente."
        }), 429

# =========================
# HISTÓRICO DO STUDYCHAT.IA

@app.route("/historico-chat-ia/<int:usuario_id>", methods=["GET"])
def rota_historico_chat_ia(usuario_id):

    chats = listar_chats_ia_usuario(usuario_id)

    return jsonify(chats)

# =========================
# INICIAR SERVIDOR

if __name__ == "__main__":
    app.run(debug=False, use_reloader=False) 