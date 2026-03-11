def resolver():
    # 1. Leitura da Dimensão
    n = int(input())

    # 2. Leitura do Mapa
    mapa = []
    i = 0
    while i < n:
        linha = eval(input())
        mapa.append(linha)
        i = i + 1

    # 3. Localizar Ariel e Eric (Atribuições individuais, sem tuplas)
    ax = -1
    ay = -1
    ex = -1
    ey = -1
    
    r = 0
    while r < n:
        c = 0
        while c < n:
            if mapa[r][c] == 'A':
                ax = r
                ay = c
            if mapa[r][c] == 'E':
                ex = r
                ey = c
            c = c + 1
        r = r + 1

    # Variáveis de controle
    melhor_custo = [999999]
    melhor_mapa = [None]

    def buscar(x, y, custo_total):
        # Validação de limites e bloqueios
        if x < 0 or x >= n or y < 0 or y >= n:
            return
        
        celula = mapa[x][y]
        if celula == '0' or celula == 'V':
            return

        # Chegou ao destino (Eric)
        if x == ex and y == ey:
            if custo_total < melhor_custo[0]:
                melhor_custo[0] = custo_total
                # "Fotografa" o mapa vencedor
                copia_vencedora = []
                idx_l = 0
                while idx_l < n:
                    nova_linha = []
                    idx_c = 0
                    while idx_c < n:
                        nova_linha.append(mapa[idx_l][idx_c])
                        idx_c = idx_c + 1
                    copia_vencedora.append(nova_linha)
                    idx_l = idx_l + 1
                melhor_mapa[0] = copia_vencedora
            return

        # Identifica custo do passo
        custo_passo = 0
        if celula != 'A':
            custo_passo = int(celula)

        # Backtracking Silencioso
        original = mapa[x][y]
        if original != 'A':
            mapa[x][y] = 'V'

        # Tenta todas as direções
        buscar(x + 1, y, custo_total + custo_passo)
        buscar(x - 1, y, custo_total + custo_passo)
        buscar(x, y + 1, custo_total + custo_passo)
        buscar(x, y - 1, custo_total + custo_passo)

        # Limpa o rastro para outras possibilidades
        mapa[x][y] = original

    # Inicia a busca
    buscar(ax, ay, 0)

    # 4. Saída Final e Rastreamento do Caminho Eleito
    print("🧜‍♀️ Ariel iniciou a busca na posição (", ax, ",", ay, ")...")
    
    if melhor_custo[0] != 999999:
        # Imprime apenas o caminho que está marcado no melhor_mapa
        r = 0
        while r < n:
            c = 0
            while c < n:
                # Verifica se a célula faz parte do melhor caminho
                if melhor_mapa[0][r][c] == 'V' and (r != ax or c != ay):
                    # Pega o custo do mapa original para informar
                    custo_print = mapa[r][c]
                    print("🌊 Nadando para (", r, ",", c, ")... Consumo de O2:", custo_print)
                c = c + 1
            r = r + 1
            
        print("✨ Sucesso! Eric foi salvo com um consumo mínimo de", melhor_custo[0], "unidades de oxigênio.")
        print("\n📍 Mapa do Resgate Final:")
        for linha in melhor_mapa[0]:
            print(linha)
    else:
        print("🐚 Ariel não chegou a tempo... O oxigênio de Eric acabou.")

resolver()