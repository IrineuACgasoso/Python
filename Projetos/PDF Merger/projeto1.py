import PyPDF2
import os

merger = PyPDF2.PdfMerger()

files_list = os.listdir("files")
files_list.sort()

print(files_list)

for arquivo in files_list:
    if ".pdf" in arquivo:
        merger.append(f"files/{arquivo}")

merged_file_name = input()

merger.write(f"{merged_file_name}.pdf")