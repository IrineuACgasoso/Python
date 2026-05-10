import os
import sqlite3
import uuid
from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
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
    conexao.execute('''
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE
        )
    ''')
    conexao.execute('''
        CREATE TABLE IF NOT EXISTS produto_categoria (
            produto_id   INTEGER NOT NULL,
            categoria_id INTEGER NOT NULL,
            PRIMARY KEY (produto_id, categoria_id),
            FOREIGN KEY (produto_id)   REFERENCES produtos(id),
            FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        )
    ''')

    if conexao.execute('SELECT COUNT(*) FROM produtos').fetchone()[0] == 0:
        conexao.execute("INSERT INTO produtos (nome, imagem) VALUES ('Arroz',  'arroz.jpg')")
        conexao.execute("INSERT INTO produtos (nome, imagem) VALUES ('Feijão', 'feijao.jpg')")
        conexao.execute("INSERT INTO produtos (nome, imagem) VALUES ('Leite',  'leite.jpg')")
        conexao.commit()

    conexao.close()


inicializar_banco()


# ── Página principal ───────────────────────────────────────────────────────────

@app.route('/', methods=['GET'])
def index():
    conexao    = conectar_banco()
    produtos   = conexao.execute('SELECT * FROM produtos   ORDER BY nome ASC').fetchall()
    lista      = conexao.execute('SELECT * FROM lista_compras ORDER BY nome ASC').fetchall()
    categorias = conexao.execute('SELECT * FROM categorias ORDER BY nome ASC').fetchall()

    produto_cats = {}
    for row in conexao.execute('SELECT produto_id, categoria_id FROM produto_categoria').fetchall():
        produto_cats.setdefault(row['produto_id'], []).append(row['categoria_id'])

    conexao.close()
    return render_template('index.html',
                           produtos=produtos,
                           lista=lista,
                           categorias=categorias,
                           produto_cats=produto_cats)


# ── APIs AJAX ─────────────────────────────────────────────────────────────────

def _lista_json(cx):
    rows = cx.execute('SELECT * FROM lista_compras ORDER BY nome ASC').fetchall()
    return [{'nome': r['nome'], 'quantidade': r['quantidade']} for r in rows]


@app.route('/api/adicionar', methods=['POST'])
def api_adicionar():
    produto    = request.form.get('produto')
    quantidade = int(request.form.get('quantidade', 1))
    cx         = conectar_banco()
    existente  = cx.execute('SELECT * FROM lista_compras WHERE nome=?', (produto,)).fetchone()
    if existente:
        cx.execute('UPDATE lista_compras SET quantidade=? WHERE nome=?',
                   (existente['quantidade'] + quantidade, produto))
    else:
        cx.execute('INSERT INTO lista_compras (nome, quantidade) VALUES (?,?)',
                   (produto, quantidade))
    cx.commit()
    lista = _lista_json(cx)
    cx.close()
    return jsonify(lista)


@app.route('/api/remover/<nome_do_produto>')
def api_remover(nome_do_produto):
    cx = conectar_banco()
    cx.execute('DELETE FROM lista_compras WHERE nome=?', (nome_do_produto,))
    cx.commit()
    lista = _lista_json(cx)
    cx.close()
    return jsonify(lista)


# ── Catálogo: novo produto ─────────────────────────────────────────────────────

@app.route('/novo_produto', methods=['POST'])
def novo_produto():
    nome   = request.form.get('nome_produto', '').strip()
    imagem = request.files.get('imagem_produto')
    cx     = conectar_banco()

    if cx.execute('SELECT 1 FROM produtos WHERE LOWER(nome)=LOWER(?)', (nome,)).fetchone():
        cx.close()
        return redirect(url_for('index'))

    if imagem and imagem.filename:
        ext          = imagem.filename.rsplit('.', 1)[1].lower()
        nome_arquivo = f"{secure_filename(nome.lower())}_{uuid.uuid4().hex[:8]}.{ext}"
        imagem.save(os.path.join(app.config['UPLOAD_FOLDER'], nome_arquivo))
    else:
        nome_arquivo = 'default.jpg'

    cx.execute('INSERT INTO produtos (nome, imagem) VALUES (?,?)', (nome, nome_arquivo))
    cx.commit()
    cx.close()
    return redirect(url_for('index'))


# ── Catálogo: editar produto ───────────────────────────────────────────────────

@app.route('/editar_produto/<int:produto_id>', methods=['POST'])
def editar_produto(produto_id):
    novo_nome = request.form.get('novo_nome', '').strip()
    imagem    = request.files.get('imagem_produto')
    if not novo_nome:
        return redirect(url_for('index'))

    cx      = conectar_banco()
    produto = cx.execute('SELECT * FROM produtos WHERE id=?', (produto_id,)).fetchone()
    if not produto:
        cx.close()
        return redirect(url_for('index'))

    if cx.execute('SELECT 1 FROM produtos WHERE LOWER(nome)=LOWER(?) AND id!=?',
                  (novo_nome, produto_id)).fetchone():
        cx.close()
        return redirect(url_for('index'))

    nome_arquivo = produto['imagem']
    if imagem and imagem.filename:
        ext          = imagem.filename.rsplit('.', 1)[1].lower()
        nome_arquivo = f"{secure_filename(novo_nome.lower())}_{uuid.uuid4().hex[:8]}.{ext}"
        imagem.save(os.path.join(app.config['UPLOAD_FOLDER'], nome_arquivo))

    cx.execute('UPDATE produtos SET nome=?, imagem=? WHERE id=?',
               (novo_nome, nome_arquivo, produto_id))
    cx.commit()
    cx.close()
    return redirect(url_for('index'))


# ── Catálogo: remover produto ──────────────────────────────────────────────────

@app.route('/remover_catalogo/<nome_do_produto>')
def remover_catalogo(nome_do_produto):
    cx      = conectar_banco()
    produto = cx.execute('SELECT id FROM produtos WHERE nome=?', (nome_do_produto,)).fetchone()
    if produto:
        cx.execute('DELETE FROM produto_categoria WHERE produto_id=?', (produto['id'],))
        cx.execute('DELETE FROM produtos WHERE id=?', (produto['id'],))
        cx.commit()
    cx.close()
    return redirect(url_for('index'))


# ── Categorias ─────────────────────────────────────────────────────────────────

@app.route('/nova_categoria', methods=['POST'])
def nova_categoria():
    nome        = request.form.get('nome_categoria', '').strip()
    produto_ids = request.form.getlist('produtos_categoria')
    if not nome:
        return redirect(url_for('index'))

    cx = conectar_banco()
    if cx.execute('SELECT 1 FROM categorias WHERE LOWER(nome)=LOWER(?)', (nome,)).fetchone():
        cx.close()
        return redirect(url_for('index'))

    cx.execute('INSERT INTO categorias (nome) VALUES (?)', (nome,))
    cx.commit()
    cat_id = cx.execute('SELECT last_insert_rowid()').fetchone()[0]

    for pid in produto_ids:
        try:
            cx.execute('INSERT INTO produto_categoria (produto_id, categoria_id) VALUES (?,?)',
                       (int(pid), cat_id))
        except Exception:
            pass
    cx.commit()
    cx.close()
    return redirect(url_for('index'))


@app.route('/editar_categoria/<int:cat_id>', methods=['POST'])
def editar_categoria(cat_id):
    novo_nome   = request.form.get('novo_nome_categoria', '').strip()
    produto_ids = request.form.getlist('produtos_categoria')
    if not novo_nome:
        return redirect(url_for('index'))

    cx = conectar_banco()
    if cx.execute('SELECT 1 FROM categorias WHERE LOWER(nome)=LOWER(?) AND id!=?',
                  (novo_nome, cat_id)).fetchone():
        cx.close()
        return redirect(url_for('index'))

    cx.execute('UPDATE categorias SET nome=? WHERE id=?', (novo_nome, cat_id))
    cx.execute('DELETE FROM produto_categoria WHERE categoria_id=?', (cat_id,))
    for pid in produto_ids:
        try:
            cx.execute('INSERT INTO produto_categoria (produto_id, categoria_id) VALUES (?,?)',
                       (int(pid), cat_id))
        except Exception:
            pass
    cx.commit()
    cx.close()
    return redirect(url_for('index'))


@app.route('/remover_categoria/<int:cat_id>')
def remover_categoria(cat_id):
    cx = conectar_banco()
    cx.execute('DELETE FROM produto_categoria WHERE categoria_id=?', (cat_id,))
    cx.execute('DELETE FROM categorias WHERE id=?', (cat_id,))
    cx.commit()
    cx.close()
    return redirect(url_for('index'))


# Adicione esta rota em qualquer lugar do seu app.py
@app.route('/sw.js')
def serve_sw():
    # Isso diz ao Flask: "Quando pedirem o sw.js na raiz, entregue o que está na pasta static"
    return send_from_directory('static', 'sw.js')


if __name__ == '__main__':
    app.run(debug=True)