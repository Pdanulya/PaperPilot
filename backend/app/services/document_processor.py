# Libraries Used:
# PyMuPDF to read pdf files
# python-docx to read docx files
# In build python simple file reading to read txt files

import fitz
from docx import Document as DocxDocument

def extract_txt_text(file_path: str):
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()

def extract_docx_text(file_path: str):
    doc = DocxDocument(file_path)

    text = []

    for paragraph in doc.paragraphs:
        text.append(paragraph.text)

    return "\n".join(text)

def extract_pdf_text(file_path: str):
    pdf = fitz.open(file_path)

    text = []

    for page in pdf:
        text.append(page.get_text())

    pdf.close()

    return "\n".join(text)