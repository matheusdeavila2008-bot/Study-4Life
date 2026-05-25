from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, date, timedelta
from werkzeug.security import generate_password_hash, check_password_hash

# conexão com o banco
engine = create_engine("sqlite:///study4life.db", echo=False)

Base = declarative_base()

Session = sessionmaker(bind=engine)
session = Session()


# =========================
# TABELA USUÁRIOS
# =========================
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False, unique=True)
    senha_hash = Column(String(255), nullable=False)
    cpf = Column(String(14), nullable=False, unique=True)
    avatar = Column(String(20), default="👨‍💻")
    criado_em = Column(DateTime, default=datetime.now)


# =========================
# TABELA PROGRESSO
# =========================
class ProgressoUsuario(Base):
    __tablename__ = "progresso_usuario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    dias_consecutivos = Column(Integer, default=0)
    ultimo_acesso = Column(DateTime)

    nivel = Column(Integer, default=0)
    xp = Column(Integer, default=0)
    horas_totais = Column(Float, default=0)
    missoes_realizadas = Column(Integer, default=0)


# =========================
# TABELA CONTEÚDOS
# =========================
class Conteudo(Base):
    __tablename__ = "conteudos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String(150), nullable=False)
    autor = Column(String(100))
    resumo = Column(Text)
    categoria = Column(String(80))
    imagem = Column(String(255))
    link = Column(String(255))


# =========================
# TABELA HISTÓRICO
# =========================
class HistoricoConteudo(Base):
    __tablename__ = "historico_conteudos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    conteudo_id = Column(Integer, ForeignKey("conteudos.id"), nullable=False)
    visualizado_em = Column(DateTime, default=datetime.now)


# =========================
# TABELA FAVORITOS
# =========================
class Favorito(Base):
    __tablename__ = "favoritos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    conteudo_id = Column(Integer, ForeignKey("conteudos.id"), nullable=False)
    favoritado_em = Column(DateTime, default=datetime.now)


# =========================
# TABELA CHAT IA
# =========================
class ChatHistorico(Base):
    __tablename__ = "chat_historico"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    pergunta = Column(Text, nullable=False)
    resposta = Column(Text, nullable=False)

    criado_em = Column(DateTime, default=datetime.now)


# =========================
# TABELA RANKING
# =========================
class Ranking(Base):
    __tablename__ = "ranking"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    pontos = Column(Integer, default=0)


# cria as tabelas
Base.metadata.create_all(engine)


# =========================
# CADASTRAR USUÁRIO
# =========================
def cadastrar_usuario(nome, email, senha, confirmar_senha, cpf):

    if senha != confirmar_senha:
        return "As senhas não coincidem."

    email_existente = session.query(Usuario).filter_by(email=email).first()

    if email_existente:
        return "Esse e-mail já está cadastrado."

    cpf_existente = session.query(Usuario).filter_by(cpf=cpf).first()

    if cpf_existente:
        return "Esse CPF já está cadastrado."

    novo_usuario = Usuario(
        nome=nome,
        email=email,
        senha_hash=generate_password_hash(senha),
        cpf=cpf,
        avatar="👨‍💻"
    )

    session.add(novo_usuario)
    session.commit()

    progresso = ProgressoUsuario(
        usuario_id=novo_usuario.id,
        dias_consecutivos=0,
        nivel=0,
        xp=0,
        horas_totais=0,
        missoes_realizadas=0
    )

    ranking = Ranking(
        usuario_id=novo_usuario.id,
        pontos=0
    )

    session.add(progresso)
    session.add(ranking)
    session.commit()

    return "Usuário cadastrado com sucesso."


# =========================
# LOGIN
# =========================
def login(email, senha):

    usuario = session.query(Usuario).filter_by(email=email).first()

    if not usuario:
        return None

    if check_password_hash(usuario.senha_hash, senha):
        return usuario

    return None


# =========================
# REGISTRAR ACESSO DIÁRIO
# =========================
def registrar_acesso_usuario(usuario_id):

    progresso = session.query(ProgressoUsuario).filter_by(
        usuario_id=usuario_id
    ).first()

    if not progresso:
        return None

    hoje = date.today()

    if not progresso.ultimo_acesso:
        progresso.dias_consecutivos = 1
        progresso.ultimo_acesso = datetime.now()
        session.commit()
        return progresso

    ultimo_dia = progresso.ultimo_acesso.date()

    if ultimo_dia == hoje:
        return progresso

    elif ultimo_dia == hoje - timedelta(days=1):
        progresso.dias_consecutivos += 1

    else:
        progresso.dias_consecutivos = 1

    progresso.ultimo_acesso = datetime.now()
    session.commit()

    return progresso


# =========================
# ATUALIZAR TEMPO TOTAL NO SITE
# =========================
def atualizar_tempo_site(usuario_id, minutos):

    progresso = session.query(ProgressoUsuario).filter_by(
        usuario_id=usuario_id
    ).first()

    if not progresso:
        return "Progresso não encontrado."

    horas = minutos / 60

    progresso.horas_totais += horas

    session.commit()

    return "Tempo atualizado com sucesso."


# =========================
# ADICIONAR XP AO USUÁRIO
# =========================
def adicionar_xp(usuario_id, xp_ganho):

    progresso = session.query(ProgressoUsuario).filter_by(
        usuario_id=usuario_id
    ).first()

    ranking = session.query(Ranking).filter_by(
        usuario_id=usuario_id
    ).first()

    if not progresso:
        return "Progresso não encontrado."

    progresso.xp += xp_ganho

    # nível começa em 0 e sobe a cada 100 XP
    progresso.nivel = progresso.xp // 100

    if ranking:
        ranking.pontos = progresso.xp

    session.commit()

    return "XP atualizado com sucesso."


# =========================
# PEGAR POSIÇÃO NO RANKING
# =========================
def pegar_posicao_ranking(usuario_id):

    ranking = session.query(Ranking).order_by(
        Ranking.pontos.desc()
    ).all()

    for posicao, item in enumerate(ranking, start=1):

        if item.usuario_id == usuario_id:
            return posicao

    return None


# =========================
# PEGAR DADOS DO PERFIL
# =========================
def pegar_dados_perfil(usuario_id):

    usuario = session.query(Usuario).filter_by(id=usuario_id).first()

    progresso = session.query(ProgressoUsuario).filter_by(
        usuario_id=usuario_id
    ).first()

    if not usuario or not progresso:
        return None

    posicao = pegar_posicao_ranking(usuario_id)

    return {
        "usuario_id": usuario.id,
        "nome": usuario.nome,
        "avatar": usuario.avatar,
        "dias_consecutivos": progresso.dias_consecutivos,
        "nivel": progresso.nivel,
        "xp": progresso.xp,
        "horas_totais": round(progresso.horas_totais, 2),
        "missoes_realizadas": progresso.missoes_realizadas,
        "ranking": posicao
    }


# =========================
# SALVAR AVATAR
# =========================
def salvar_avatar(usuario_id, avatar):

    usuario = session.query(Usuario).filter_by(id=usuario_id).first()

    if not usuario:
        return "Usuário não encontrado."

    usuario.avatar = avatar
    session.commit()

    return "Avatar atualizado com sucesso."


# =========================
# LISTAR RANKING
# =========================
def listar_ranking():

    resultados = (
        session.query(Usuario, ProgressoUsuario)
        .join(ProgressoUsuario, Usuario.id == ProgressoUsuario.usuario_id)
        .order_by(
            ProgressoUsuario.xp.desc(),
            ProgressoUsuario.nivel.desc(),
            ProgressoUsuario.dias_consecutivos.desc()
        )
        .all()
    )

    ranking = []

    for posicao, (usuario, progresso) in enumerate(resultados, start=1):

        ranking.append({
            "posicao": posicao,
            "usuario_id": usuario.id,
            "nome": usuario.nome,
            "avatar": usuario.avatar,
            "nivel": progresso.nivel,
            "xp": progresso.xp,
            "dias_consecutivos": progresso.dias_consecutivos
        })

    return ranking


# =========================
# CADASTRAR CONTEÚDO
# =========================
def cadastrar_conteudo(titulo, autor, resumo, categoria, imagem, link):

    conteudo = Conteudo(
        titulo=titulo,
        autor=autor,
        resumo=resumo,
        categoria=categoria,
        imagem=imagem,
        link=link
    )

    session.add(conteudo)
    session.commit()

    return "Conteúdo cadastrado com sucesso."


# =========================
# SALVAR HISTÓRICO
# =========================
def salvar_historico(usuario_id, conteudo_id):

    historico = HistoricoConteudo(
        usuario_id=usuario_id,
        conteudo_id=conteudo_id
    )

    session.add(historico)
    session.commit()

    return "Histórico salvo com sucesso."


# =========================
# FAVORITAR CONTEÚDO
# =========================
def favoritar_conteudo(usuario_id, conteudo_id):

    favorito_existente = session.query(Favorito).filter_by(
        usuario_id=usuario_id,
        conteudo_id=conteudo_id
    ).first()

    if favorito_existente:
        return "Esse conteúdo já está nos favoritos."

    favorito = Favorito(
        usuario_id=usuario_id,
        conteudo_id=conteudo_id
    )

    session.add(favorito)
    session.commit()

    return "Conteúdo favoritado com sucesso."


# =========================
# SALVAR CHAT IA
# =========================
def salvar_chat(usuario_id, pergunta, resposta):

    chat = ChatHistorico(
        usuario_id=usuario_id,
        pergunta=pergunta,
        resposta=resposta
    )

    session.add(chat)
    session.commit()

    return "Chat salvo com sucesso."


# =========================
# ATUALIZAR PROGRESSO GERAL
# =========================
def atualizar_progresso(usuario_id, xp_ganho, horas_estudadas, missao_feita=False):

    progresso = session.query(ProgressoUsuario).filter_by(
        usuario_id=usuario_id
    ).first()

    ranking = session.query(Ranking).filter_by(
        usuario_id=usuario_id
    ).first()

    if not progresso:
        return "Progresso não encontrado."

    progresso.xp += xp_ganho
    progresso.horas_totais += horas_estudadas

    if missao_feita:
        progresso.missoes_realizadas += 1

    progresso.nivel = progresso.xp // 100

    if ranking:
        ranking.pontos = progresso.xp

    session.commit()

    return "Progresso atualizado com sucesso."


# =========================
# ADICIONAR PONTOS AO RANKING
# =========================
def adicionar_pontos_ranking(usuario_id, pontos):

    ranking = session.query(Ranking).filter_by(
        usuario_id=usuario_id
    ).first()

    if not ranking:
        return "Ranking não encontrado."

    ranking.pontos += pontos

    session.commit()

    return "Ranking atualizado com sucesso."


# =========================
# DELETAR USUÁRIO
# =========================
def deletar_usuario(email):

    usuario = session.query(Usuario).filter_by(email=email).first()

    if not usuario:
        return "Usuário não encontrado."

    session.delete(usuario)
    session.commit()

    return "Usuário deletado com sucesso."


# =========================
# LISTAR USUÁRIOS
# =========================
def listar_usuarios():

    usuarios = session.query(Usuario).all()

    for usuario in usuarios:
        print(usuario.id, usuario.nome, usuario.email)


# =========================
# VER RANKING
# =========================
def ver_ranking():

    ranking = listar_ranking()

    for usuario in ranking:
        print(
            f"{usuario['posicao']}º lugar - "
            f"{usuario['nome']} - "
            f"{usuario['xp']} XP - "
            f"Nível {usuario['nivel']} - "
            f"{usuario['dias_consecutivos']} dias"
        )


# =========================
# TESTES
# =========================

# cadastrar usuário
# print(cadastrar_usuario(
#     nome="Matheus",
#     email="matheus@email.com",
#     senha="123456",
#     confirmar_senha="123456",
#     cpf="12345678900"
# ))

# deletar usuário
# print(deletar_usuario("mvbs.1711@gmail.com"))

# listar usuários
# listar_usuarios()

# ver ranking
# ver_ranking()