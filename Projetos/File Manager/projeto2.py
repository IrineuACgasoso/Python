import os
from tkinter.filedialog import askdirectory

caminho = askdirectory(title="Selecione uma pasta")

files_list = os.listdir(caminho)

locals = {
    "images" : [".png", ".jpg", ".gif"],
    "pdfs"   : [".pdf"],
    "texts"  : [".txt"],
    "patches": [".zg1xf", ".zg1f"],
    "tiled"  : [".tmj"]
}

for arquivo in files_list:
    nome, extensao = os.path.splitext(f"{caminho}/{arquivo}")

    for pasta in locals:
        if extensao in locals[pasta]:
            if not os.path.exists(f"{caminho}/{pasta}"):
                os.mkdir(f"{caminho}/{pasta}")

            os.rename(f"{caminho}/{arquivo}", f"{caminho}/{pasta}/{arquivo}")
