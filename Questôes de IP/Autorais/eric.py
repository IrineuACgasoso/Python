def resolver():
    # 1. Leitura
    n_input = input()
    n = int(n_input)

    mapa = []
    i = 0
    while i < n:
        mapa.append(eval(input()))
        i = i + 1

    # 2. Localizar A e E
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

    print("Ariel iniciou a busca na posição (" + str(ax) + ", " + str(ay) + ")...")
    print("Príncipe Eric está na posição (" + str(ex) + ", " + str(ey) + ")...")

    # Variável para guardar o menor consumo encontrado
    melhor_custo = [999999] 

    # 3. Backtracking de Menor Custo
    def buscar(x, y, custo_atual):
        # Base 1: Fora do mapa
        if x < 0 or x >= n or y < 0 or y >= n:
            return
        
        celula = mapa[x][y]
        
        # Base 2: Parede ou já visitado
        if celula == '0' or celula == 'V':
            return
            
        # Poda: Se o custo atual já é pior que o melhor caminho achado antes, desiste
        if custo_atual >= melhor_custo[0]:
            return

        # Base 3: Achou o Eric! Atualiza o melhor custo e para de descer
        if x == ex and y == ey:
            melhor_custo[0] = custo_atual
            return

        # Prepara o custo da célula atual
        custo_celula = 0
        if celula != 'A' and celula != 'E':
            custo_celula = int(celula)

        # MARCAÇÃO (Ida) - Marca TUDO que pisar como 'V' (inclusive a posição 'A')
        original = mapa[x][y]
        mapa[x][y] = 'V'
        
        novo_custo = custo_atual + custo_celula

        # TENTA AS DIREÇÕES
        buscar(x + 1, y, novo_custo) # Baixo
        buscar(x - 1, y, novo_custo) # Cima
        buscar(x, y + 1, novo_custo) # Direita
        buscar(x, y - 1, novo_custo) # Esquerda

        # DESMARCAÇÃO (Volta) - Restaura o bloco para o que era antes
        mapa[x][y] = original

    # 4. Execução e Output
    buscar(ax, ay, 0)

    if melhor_custo[0] != 999999:
        restante = 25 - melhor_custo[0]
        if restante < 0:
            restante = 0
        print("Sucesso! Eric foi salvo! Oxigênio restante: " + str(restante) + " unidades.")
    else:
        print("Ariel não chegou a tempo... O oxigênio de Eric acabou.")

resolver()