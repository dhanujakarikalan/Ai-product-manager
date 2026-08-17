try:
    from sentence_transformers import SentenceTransformer
except Exception:
    SentenceTransformer = None
import numpy as np


class TextEmbeddings:

    def __init__(self):
        if SentenceTransformer:
            try:
                self.model = SentenceTransformer(
                    "sentence-transformers/all-MiniLM-L6-v2"
                )
            except Exception:
                self.model = None
        else:
            self.model = None

    # -----------------------------------------
    # Generate Embedding for Single Text
    # -----------------------------------------

    def generate_embedding(self, text):

        embedding = self.model.encode(text)

        return embedding

    # -----------------------------------------
    # Generate Embeddings for DataFrame
    # -----------------------------------------

    def generate_dataframe_embeddings(self, df):

        if "processed_feedback" not in df.columns:

            raise ValueError(
                "processed_feedback column not found."
            )

        embeddings = []

        for text in df["processed_feedback"]:

            vector = self.generate_embedding(text)

            embeddings.append(vector)

        df["embedding"] = embeddings

        return df

    # -----------------------------------------
    # Get Embedding Dimension
    # -----------------------------------------

    def embedding_dimension(self):

        sample = self.generate_embedding("sample text")

        return len(sample)