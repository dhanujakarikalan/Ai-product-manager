import os
import json
import pandas as pd
import pdfplumber
from docx import Document


class DataIngestion:

    # ---------------- CSV ---------------- #

    def load_csv(self, file_path):
        return pd.read_csv(file_path)

    # ---------------- Excel ---------------- #

    def load_excel(self, file_path):
        return pd.read_excel(file_path)

    # ---------------- JSON ---------------- #

    def load_json(self, file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        return pd.json_normalize(data)

    # ---------------- TXT ---------------- #

    def load_txt(self, file_path):

        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        return pd.DataFrame({
            "feedback": [text]
        })

    # ---------------- DOCX ---------------- #

    def load_docx(self, file_path):

        doc = Document(file_path)

        paragraphs = []

        for para in doc.paragraphs:
            if para.text.strip():
                paragraphs.append(para.text)

        return pd.DataFrame({
            "feedback": paragraphs
        })

    # ---------------- PDF ---------------- #

    def load_pdf(self, file_path):

        pages = []

        with pdfplumber.open(file_path) as pdf:

            for page in pdf.pages:

                text = page.extract_text()

                if text:
                    pages.append(text)

        return pd.DataFrame({
            "feedback": pages
        })

    # ---------------- Universal Loader ---------------- #

    def load_data(self, file_path):

        extension = os.path.splitext(file_path)[1].lower()

        if extension == ".csv":
            return self.load_csv(file_path)

        elif extension in [".xls", ".xlsx"]:
            return self.load_excel(file_path)

        elif extension == ".json":
            return self.load_json(file_path)

        elif extension == ".txt":
            return self.load_txt(file_path)

        elif extension == ".docx":
            return self.load_docx(file_path)

        elif extension == ".pdf":
            return self.load_pdf(file_path)

        else:
            raise ValueError(f"Unsupported File Format: {extension}")