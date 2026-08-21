import os
import pickle
import faiss

from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter


class RAGService:

    def __init__(self):

        # ==========================================
        # VECTOR STORE
        # ==========================================

        self.vectorstore_dir = "vectorstore"

        os.makedirs(
            self.vectorstore_dir,
            exist_ok=True
        )

        self.index_path = os.path.join(
            self.vectorstore_dir,
            "feedback.index"
        )

        self.metadata_path = os.path.join(
            self.vectorstore_dir,
            "feedback_metadata.pkl"
        )

        # ==========================================
        # EMBEDDING MODEL
        # ==========================================

        self.embedding_model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        # ==========================================
        # CHUNKING
        # ==========================================

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=300,
            chunk_overlap=50
        )

        self.index = None
        self.metadata = []

        # Load existing FAISS index
        self.load_vectorstore()


    # =================================================
    # 1. CHUNK FEEDBACK
    # =================================================

    def chunk_feedback(self, feedback_list):

        chunks = []

        for item in feedback_list:

            feedback = str(
                item.get("feedback", "")
            ).strip()

            if not feedback:
                continue

            split_texts = self.text_splitter.split_text(
                feedback
            )

            for chunk in split_texts:

                chunks.append({
                    "feedback": chunk,
                    "category": item.get("category"),
                    "theme": item.get("theme"),
                    "sentiment": item.get("sentiment"),
                    "pain_point": item.get("pain_point"),
                    "feature_request": item.get("feature_request")
                })

        return chunks


    # =================================================
    # 2. CREATE VECTOR STORE
    # =================================================

    def create_vectorstore(self, feedback_list):

        chunks = self.chunk_feedback(
            feedback_list
        )

        if not chunks:

            return {
                "status": "failed",
                "message": "No feedback available."
            }

        texts = [
            item["feedback"]
            for item in chunks
        ]

        # ==========================================
        # CREATE EMBEDDINGS
        # ==========================================

        embeddings = self.embedding_model.encode(
            texts,
            convert_to_numpy=True
        )

        embeddings = embeddings.astype(
            "float32"
        )

        # ==========================================
        # NORMALIZE
        # ==========================================

        faiss.normalize_L2(
            embeddings
        )

        # ==========================================
        # CREATE FAISS INDEX
        # ==========================================

        dimension = embeddings.shape[1]

        index = faiss.IndexFlatIP(
            dimension
        )

        index.add(
            embeddings
        )

        self.index = index
        self.metadata = chunks

        # ==========================================
        # SAVE INDEX
        # ==========================================

        faiss.write_index(
            self.index,
            self.index_path
        )

        # ==========================================
        # SAVE METADATA
        # ==========================================

        with open(
            self.metadata_path,
            "wb"
        ) as file:

            pickle.dump(
                self.metadata,
                file
            )

        return {
            "status": "success",
            "chunks": len(chunks),
            "vector_dimension": dimension
        }


    # =================================================
    # 3. REBUILD VECTOR STORE
    # =================================================

    def rebuild_vectorstore(self, feedback_list):

        self.index = None
        self.metadata = []

        if os.path.exists(self.index_path):
            os.remove(self.index_path)

        if os.path.exists(self.metadata_path):
            os.remove(self.metadata_path)

        return self.create_vectorstore(
            feedback_list
        )


    # =================================================
    # 4. LOAD VECTOR STORE
    # =================================================

    def load_vectorstore(self):

        if not os.path.exists(self.index_path):
            return

        if not os.path.exists(self.metadata_path):
            return

        try:

            self.index = faiss.read_index(
                self.index_path
            )

            with open(
                self.metadata_path,
                "rb"
            ) as file:

                self.metadata = pickle.load(
                    file
                )

        except Exception:

            self.index = None
            self.metadata = []


    # =================================================
    # 5. RETRIEVE RELEVANT FEEDBACK
    # =================================================

    def retrieve_relevant_feedback(
        self,
        query,
        top_k=10
    ):

        if self.index is None:
            return []

        # ==========================================
        # QUERY → EMBEDDING
        # ==========================================

        query_embedding = self.embedding_model.encode(
            [query],
            convert_to_numpy=True
        )

        query_embedding = query_embedding.astype(
            "float32"
        )

        # ==========================================
        # NORMALIZE QUERY
        # ==========================================

        faiss.normalize_L2(
            query_embedding
        )

        # ==========================================
        # SEARCH
        # ==========================================

        search_k = min(
            top_k,
            self.index.ntotal
        )

        scores, indices = self.index.search(
            query_embedding,
            search_k
        )

        # ==========================================
        # BUILD RESULTS
        # ==========================================

        results = []

        for score, index in zip(
            scores[0],
            indices[0]
        ):

            if index == -1:
                continue

            item = self.metadata[index].copy()

            item["similarity_score"] = float(
                score
            )

            results.append(
                item
            )

        return results