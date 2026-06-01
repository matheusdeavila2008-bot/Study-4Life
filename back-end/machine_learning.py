from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# =========================
# DADOS DE TREINAMENTO
# =========================

perguntas = [

    # SENHA
    "esqueci minha senha",
    "como recuperar minha senha",
    "não lembro minha senha",
    "perdi minha senha",
    "trocar senha",
    "alterar senha",

    # LOGIN
    "não consigo entrar",
    "erro no login",
    "problema para acessar",
    "não consigo fazer login",
    "login não funciona",

    # NÍVEL
    "como subir de nivel",
    "como aumentar meu nivel",
    "ganhar nivel",
    "como funciona o nivel",
    "nivel da conta",

    # XP
    "como ganhar xp",
    "como conseguir xp",
    "ganho experiencia como",
    "aumentar xp",
    "como evoluir",

    # QUIZ
    "como fazer quiz",
    "onde estão os quizzes",
    "como responder quiz",
    "não encontro os quizzes",
    "quiz do sistema",

    # MISSÕES
    "como funcionam as missoes",
    "onde vejo minhas missoes",
    "como concluir uma missao",
    "missao diaria",
    "ganhar recompensa",

    # RANKING
    "como funciona o ranking",
    "como subir no ranking",
    "pontuacao ranking",
    "classificacao dos usuarios",
    "posicao no ranking",

    # PERFIL
    "como alterar avatar",
    "trocar avatar",
    "editar perfil",
    "mudar foto",
    "alterar dados da conta",

    # TEMPO DE ESTUDO
    "como registrar horas",
    "tempo estudado",
    "horas de estudo",
    "contador de estudo",
    "registrar tempo"
]

classes = [

    # SENHA
    "senha",
    "senha",
    "senha",
    "senha",
    "senha",
    "senha",

    # LOGIN
    "login",
    "login",
    "login",
    "login",
    "login",

    # NÍVEL
    "nivel",
    "nivel",
    "nivel",
    "nivel",
    "nivel",

    # XP
    "xp",
    "xp",
    "xp",
    "xp",
    "xp",

    # QUIZ
    "quiz",
    "quiz",
    "quiz",
    "quiz",
    "quiz",

    # MISSÕES
    "missao",
    "missao",
    "missao",
    "missao",
    "missao",

    # RANKING
    "ranking",
    "ranking",
    "ranking",
    "ranking",
    "ranking",

    # PERFIL
    "perfil",
    "perfil",
    "perfil",
    "perfil",
    "perfil",

    # TEMPO
    "tempo",
    "tempo",
    "tempo",
    "tempo",
    "tempo"
]

# =========================
# TREINAMENTO
# =========================

vectorizer = CountVectorizer()

X = vectorizer.fit_transform(perguntas)

modelo = MultinomialNB()

modelo.fit(X, classes)

# =========================
# RESPOSTAS
# =========================

respostas = {

    "senha":
        "Para recuperar sua senha, utilize a opção 'Esqueci minha senha' na tela de login.",

    "login":
        "Verifique se seu e-mail e senha estão corretos. Caso o problema continue, tente redefinir sua senha.",

    "nivel":
        "Seu nível aumenta conforme você acumula XP através de missões, estudos e atividades.",

    "xp":
        "Você ganha XP ao concluir missões, responder quizzes e utilizar os recursos da plataforma.",

    "quiz":
        "Os quizzes estão disponíveis nas áreas de estudo da plataforma.",

    "missao":
        "As missões diárias são atualizadas automaticamente e podem render XP ao serem concluídas.",

    "ranking":
        "O ranking é calculado com base na quantidade de XP acumulado pelos usuários.",

    "perfil":
        "Você pode personalizar seu perfil alterando avatar e acompanhando seu progresso.",

    "tempo":
        "O tempo de estudo é registrado automaticamente enquanto você utiliza as áreas de aprendizado."
}

# =========================
# FUNÇÃO PRINCIPAL
# =========================

def responder_pergunta(pergunta):

    try:

        pergunta_vetorizada = vectorizer.transform([pergunta])

        categoria = modelo.predict(pergunta_vetorizada)[0]

        return respostas.get(
            categoria,
            "Não encontrei uma resposta para essa dúvida."
        )

    except Exception:

        return "Ocorreu um erro ao processar sua pergunta."