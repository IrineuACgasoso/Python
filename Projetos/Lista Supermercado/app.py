import os # Biblioteca do Python para mexer em caminhos de pastas
import sqlite3
import uuid
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename # Ferramenta de segurança para nomes de arquivos

app = Flask(__name__)


# --- CONFIGURAÇÃO DE PASTAS À PROVA DE FALHAS ---
# Descobre exatamente em qual pasta este arquivo (app.py) está salvo no computador/servidor
DIRETORIO_BASE = os.path.abspath(os.path.dirname(__file__))


# Força a pasta static e o banco de dados a ficarem DENTRO deste diretório base
app.config['UPLOAD_FOLDER'] = os.path.join(DIRETORIO_BASE, 'static')
CAMINHO_BANCO = os.path.join(DIRETORIO_BASE, 'banco.db')



# --- 1. CONFIGURAÇÃO DO BANCO DE DADOS ---
# Função para abrir a conexão com o arquivo banco.db
def conectar_banco():
    # Se o arquivo não existir, o SQLite cria ele na hora!
    conexao = sqlite3.connect(CAMINHO_BANCO)
    # Isso faz o banco devolver os dados como "dicionários", facilitando para o HTML
    conexao.row_factory = sqlite3.Row 
    return conexao



# Função para criar as "Abas" (Tabelas) na primeira vez que rodar
def inicializar_banco():
    conexao = conectar_banco()
    # Criamos a tabela de produtos (Catálogo)
    conexao.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            imagem TEXT NOT NULL
        )
    ''')
    # Criamos a tabela da lista de compras
    conexao.execute('''
        CREATE TABLE IF NOT EXISTS lista_compras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            quantidade INTEGER NOT NULL
        )
    ''')
    
    # Vamos verificar se o catálogo está vazio. Se estiver, adicionamos os 3 iniciais.
    cursor = conexao.execute('SELECT COUNT(*) FROM produtos')
    quantidade_produtos = cursor.fetchone()[0]
    
    if quantidade_produtos == 0:
        conexao.execute("INSERT INTO produtos (nome, imagem) VALUES ('Arroz', 'arroz.jpg')")
        conexao.execute("INSERT INTO produtos (nome, imagem) VALUES ('Feijão', 'feijao.jpg')")
        conexao.execute("INSERT INTO produtos (nome, imagem) VALUES ('Leite', 'leite.jpg')")
        conexao.commit() # Sempre que usamos INSERT, UPDATE ou DELETE, temos que dar 'commit' (salvar)
        
    conexao.close()



# Chamamos a função para garantir que o banco está pronto antes do site abrir
inicializar_banco()



@app.route('/', methods=['GET', 'POST'])
def index():
    conexao = conectar_banco()

    if request.method == 'POST':
        produto = request.form.get('produto')
        quantidade = int(request.form.get('quantidade'))
        
        # O símbolo '?' é usado por segurança, para evitar que hackers quebrem seu banco
        # Checamos se o item já está na lista de compras
        cursor = conexao.execute('SELECT * FROM lista_compras WHERE nome = ?', (produto,))
        item_existente = cursor.fetchone()
        
        if item_existente:
            # Se já existe, fazemos um UPDATE (Atualizar) somando a quantidade
            nova_quantidade = item_existente['quantidade'] + quantidade
            conexao.execute('UPDATE lista_compras SET quantidade = ? WHERE nome = ?', (nova_quantidade, produto))
        else:
            # Se não existe, fazemos um INSERT (Criar)
            conexao.execute('INSERT INTO lista_compras (nome, quantidade) VALUES (?, ?)', (produto, quantidade))
        
        conexao.commit()
        return redirect(url_for('index'))
    
    # READ (Ler): Pegamos todos os produtos e a lista para mandar pro HTML
    produtos_disponiveis = conexao.execute('SELECT * FROM produtos ORDER BY nome ASC').fetchall()
    lista_de_compras = conexao.execute('SELECT * FROM lista_compras ORDER BY nome ASC').fetchall()
    conexao.close()

    return render_template('index.html', produtos=produtos_disponiveis, lista=lista_de_compras)



@app.route('/remover/<nome_do_produto>')
def remover(nome_do_produto):
    conexao = conectar_banco()
    # DELETE (Apagar): Removemos o item da tabela de compras
    conexao.execute('DELETE FROM lista_compras WHERE nome = ?', (nome_do_produto,))
    conexao.commit()
    conexao.close()
    return redirect(url_for('index'))



@app.route('/novo_produto', methods=['POST'])
def novo_produto():
    nome_do_produto = request.form.get('nome_produto')
    imagem = request.files.get('imagem_produto')
    
    conexao = conectar_banco()
    
    # 1. Verifica se já existe um produto com esse nome (em minúsculo)
    cursor = conexao.execute('SELECT * FROM produtos WHERE LOWER(nome) = LOWER(?)', (nome_do_produto,))
    if cursor.fetchone():
        conexao.close()
        return redirect(url_for('index')) # Se já existe, cancela tudo e volta pra tela inicial

    # 2. A Mágica de Salvar a Imagem
    if imagem and imagem.filename != '':
        # Pega a extensão da imagem (ex: jpg, png)
        extensao = imagem.filename.rsplit('.', 1)[1].lower()
        
        # Limpa o nome do produto (ex: Feijão Carioca -> feijao_carioca)
        nome_limpo = secure_filename(nome_do_produto.lower())
        
        # Gera um código aleatório de 8 letras/números
        codigo_unico = uuid.uuid4().hex[:8]
        
        # Junta tudo! (ex: feijao_carioca_a7b8c9d0.jpg)
        nome_arquivo = f"{nome_limpo}_{codigo_unico}.{extensao}"
        
        # Salva a imagem na pasta correta
        caminho_completo = os.path.join(app.config['UPLOAD_FOLDER'], nome_arquivo)
        imagem.save(caminho_completo)
    else:
        # Se não enviou foto, usa a padrão
        nome_arquivo = 'default.jpg' 
        
    # 3. Salva o novo produto no banco de dados com o nome único da imagem
    conexao.execute('INSERT INTO produtos (nome, imagem) VALUES (?, ?)', (nome_do_produto, nome_arquivo))
    conexao.commit()
    conexao.close()
    
    return redirect(url_for('index'))



@app.route('/remover_catalogo/<nome_do_produto>')
def remover_catalogo(nome_do_produto):
    conexao = conectar_banco()
    conexao.execute('DELETE FROM produtos WHERE nome = ?', (nome_do_produto,))
    conexao.commit()
    conexao.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)