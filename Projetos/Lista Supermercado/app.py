import os
import sqlite3
import uuid
import json
from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

DIRETORIO_BASE = os.path.abspath(os.path.dirname(__file__))
app.config['UPLOAD_FOLDER'] = os.path.join(DIRETORIO_BASE, 'static')
CAMINHO_BANCO = os.path.join(DIRETORIO_BASE, 'banco.db')


def conectar_banco():
    conexao = sqlite3.connect(CAMINHO_BANCO)
    conexao.row_factory = sqlite3.Row
    return conexao


def inicializar_banco():
    conexao = conectar_banco()
    conexao.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            imagem TEXT NOT NULL
        )
    ''')
    conexao.execute('''
        CREATE TABLE IF NOT EXISTS lista_compras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            quantidade INTEGER NOT NULL
        )
    ''')

    cursor = conexao.execute('SELECT COUNT(*) FROM produtos')
    quantidade_produtos = cursor.fetchone()[0]

    if quantidade_produtos == 0:
        conexao.execute("INSERT INTO produtos (nome, imagem) VALUES ('Arroz', 'arroz.jpg')")
        conexao.execute("INSERT INTO produtos (nome, imagem) VALUES ('Feijão', 'feijao.jpg')")
        conexao.execute("INSERT INTO produtos (nome, imagem) VALUES ('Leite', 'leite.jpg')")
        conexao.commit()

    conexao.close()


inicializar_banco()


# ── Página principal ──────────────────────────────────────────────────────────

@app.route('/', methods=['GET'])
def index():
    conexao = conectar_banco()
    produtos_disponiveis = conexao.execute('SELECT * FROM produtos ORDER BY nome ASC').fetchall()
    lista_de_compras = conexao.execute('SELECT * FROM lista_compras ORDER BY nome ASC').fetchall()
    conexao.close()
    return render_template('index.html', produtos=produtos_disponiveis, lista=lista_de_compras)


# ── APIs AJAX (não recarregam a página) ──────────────────────────────────────

def _lista_json(conexao):
    """Lê a lista atual e retorna como lista de dicionários."""
    rows = conexao.execute('SELECT * FROM lista_compras ORDER BY nome ASC').fetchall()
    return [{'nome': row['nome'], 'quantidade': row['quantidade']} for row in rows]


@app.route('/api/adicionar', methods=['POST'])
def api_adicionar():
    """Adiciona/incrementa item na lista e devolve a lista atualizada em JSON."""
    produto = request.form.get('produto')
    quantidade = int(request.form.get('quantidade', 1))

    conexao = conectar_banco()
    cursor = conexao.execute('SELECT * FROM lista_compras WHERE nome = ?', (produto,))
    item_existente = cursor.fetchone()

    if item_existente:
        nova_quantidade = item_existente['quantidade'] + quantidade
        conexao.execute('UPDATE lista_compras SET quantidade = ? WHERE nome = ?',
                        (nova_quantidade, produto))
    else:
        conexao.execute('INSERT INTO lista_compras (nome, quantidade) VALUES (?, ?)',
                        (produto, quantidade))

    conexao.commit()
    lista = _lista_json(conexao)
    conexao.close()
    return jsonify(lista)


@app.route('/api/remover/<nome_do_produto>')
def api_remover(nome_do_produto):
    """Remove item da lista e devolve a lista atualizada em JSON."""
    conexao = conectar_banco()
    conexao.execute('DELETE FROM lista_compras WHERE nome = ?', (nome_do_produto,))
    conexao.commit()
    lista = _lista_json(conexao)
    conexao.close()
    return jsonify(lista)


# ── Catálogo: novo produto ────────────────────────────────────────────────────

@app.route('/novo_produto', methods=['POST'])
def novo_produto():
    nome_do_produto = request.form.get('nome_produto')
    imagem = request.files.get('imagem_produto')

    conexao = conectar_banco()
    cursor = conexao.execute('SELECT * FROM produtos WHERE LOWER(nome) = LOWER(?)', (nome_do_produto,))
    if cursor.fetchone():
        conexao.close()
        return redirect(url_for('index'))

    if imagem and imagem.filename != '':
        extensao = imagem.filename.rsplit('.', 1)[1].lower()
        nome_limpo = secure_filename(nome_do_produto.lower())
        codigo_unico = uuid.uuid4().hex[:8]
        nome_arquivo = f"{nome_limpo}_{codigo_unico}.{extensao}"
        caminho_completo = os.path.join(app.config['UPLOAD_FOLDER'], nome_arquivo)
        imagem.save(caminho_completo)
    else:
        nome_arquivo = 'default.jpg'

    conexao.execute('INSERT INTO produtos (nome, imagem) VALUES (?, ?)', (nome_do_produto, nome_arquivo))
    conexao.commit()
    conexao.close()
    return redirect(url_for('index'))


# ── Catálogo: editar produto ──────────────────────────────────────────────────

@app.route('/editar_produto/<int:produto_id>', methods=['POST'])
def editar_produto(produto_id):
    novo_nome = request.form.get('novo_nome', '').strip()
    imagem = request.files.get('imagem_produto')

    if not novo_nome:
        return redirect(url_for('index'))

    conexao = conectar_banco()
    produto = conexao.execute('SELECT * FROM produtos WHERE id = ?', (produto_id,)).fetchone()

    if not produto:
        conexao.close()
        return redirect(url_for('index'))

    # Verifica conflito de nome com outro produto
    conflito = conexao.execute(
        'SELECT * FROM produtos WHERE LOWER(nome) = LOWER(?) AND id != ?',
        (novo_nome, produto_id)
    ).fetchone()
    if conflito:
        conexao.close()
        return redirect(url_for('index'))

    nome_arquivo = produto['imagem']  # mantém imagem atual por padrão

    if imagem and imagem.filename != '':
        extensao = imagem.filename.rsplit('.', 1)[1].lower()
        nome_limpo = secure_filename(novo_nome.lower())
        codigo_unico = uuid.uuid4().hex[:8]
        nome_arquivo = f"{nome_limpo}_{codigo_unico}.{extensao}"
        caminho_completo = os.path.join(app.config['UPLOAD_FOLDER'], nome_arquivo)
        imagem.save(caminho_completo)

    conexao.execute(
        'UPDATE produtos SET nome = ?, imagem = ? WHERE id = ?',
        (novo_nome, nome_arquivo, produto_id)
    )
    conexao.commit()
    conexao.close()
    return redirect(url_for('index'))


# ── Catálogo: remover produto ─────────────────────────────────────────────────

@app.route('/remover_catalogo/<nome_do_produto>')
def remover_catalogo(nome_do_produto):
    conexao = conectar_banco()
    conexao.execute('DELETE FROM produtos WHERE nome = ?', (nome_do_produto,))
    conexao.commit()
    conexao.close()
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)