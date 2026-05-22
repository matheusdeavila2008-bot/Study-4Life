from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# conexão com o banco
engine = create_engine("sqlite:///study4life.db", echo=True)

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
    criado_em = Column(DateTime, default=datetime.now)


# =========================
# TABELA PROGRESSO
# =========================
class ProgressoUsuario(Base):
    __tablename__ = "progresso_usuario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    dias_consecutivos = Column(Integer, default=0)
    nivel = Column(Integer, default=1)
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
        cpf=cpf
    )

    session.add(novo_usuario)
    session.commit()

    progresso = ProgressoUsuario(usuario_id=novo_usuario.id)
    ranking = Ranking(usuario_id=novo_usuario.id)

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
# ATUALIZAR PROGRESSO
# =========================
def atualizar_progresso(usuario_id, xp_ganho, horas_estudadas, missao_feita=False):

    progresso = session.query(ProgressoUsuario).filter_by(
        usuario_id=usuario_id
    ).first()

    progresso.xp += xp_ganho
    progresso.horas_totais += horas_estudadas

    if missao_feita:
        progresso.missoes_realizadas += 1

    progresso.nivel = progresso.xp // 100 + 1

    session.commit()

    return "Progresso atualizado com sucesso."


# =========================
# ADICIONAR PONTOS RANKING
# =========================
def adicionar_pontos_ranking(usuario_id, pontos):

    ranking = session.query(Ranking).filter_by(
        usuario_id=usuario_id
    ).first()

    ranking.pontos += pontos

    session.commit()

    return "Ranking atualizado com sucesso."


# =========================
# VER RANKING
# =========================
def ver_ranking():

    ranking = session.query(Ranking).order_by(
        Ranking.pontos.desc()
    ).all()

    for posicao, item in enumerate(ranking, start=1):

        usuario = session.query(Usuario).filter_by(
            id=item.usuario_id
        ).first()

        print(f"{posicao}º lugar - {usuario.nome} - {item.pontos} pontos")


# =========================
# DELETAR USUÁRIO
# =========================
def deletar_usuario(email):

    usuario = session.query(Usuario).filter_by(
        email=email
    ).first()

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
print(deletar_usuario("matehuss@email.com.br"))

# listar usuários
# listar_usuarios()