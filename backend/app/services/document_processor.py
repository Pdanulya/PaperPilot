# Libraries Used:
# PyMuPDF to read pdf files
# python-docx to read docx files
# In build python simple file reading to read txt files

import io
import fitz
from docx import Document as DocxDocument

def extract_text_from_bytes(file_bytes: bytes, extension: str) -> str:
    if extension == ".txt":
        return file_bytes.decode("utf-8", errors="ignore")
    
    elif extension == ".pdf":
        pdf = fitz.open(stream=file_bytes, filetype="pdf")  # fitz works with bytes directly
        text = []
        for page in pdf:
            text.append(page.get_text())
        pdf.close()
        return "\n".join(text)
    
    elif extension == ".docx":
        doc = DocxDocument(io.BytesIO(file_bytes))  # use your already imported DocxDocument
        return "\n".join(p.text for p in doc.paragraphs)
    
    raise ValueError(f"Unsupported file type: {extension}")




# import os
# import fitz
# from docx import Document as DocxDocument

# def extract_txt_text(file_path: str):
#     with open(file_path, "r", encoding="utf-8") as file:
#         return file.read()

# def extract_docx_text(file_path: str):
#     doc = DocxDocument(file_path)

#     text = []

#     for paragraph in doc.paragraphs:
#         text.append(paragraph.text)

#     return "\n".join(text)

# def extract_pdf_text(file_path: str):
#     pdf = fitz.open(file_path)

#     text = []

#     for page in pdf:
#         text.append(page.get_text())

#     pdf.close()

#     return "\n".join(text)

# def extract_text(file_path: str):
#     extension = os.path.splitext(file_path)[1].lower()

#     if extension == ".pdf":
#         return extract_pdf_text(file_path)

#     elif extension == ".docx":
#         return extract_docx_text(file_path)

#     elif extension == ".txt":
#         return extract_txt_text(file_path)

#     else:
#         raise ValueError("Unsupported file type")