import re
try:
    import spacy
except Exception:
    spacy = None


class TextPreprocessing:

    def __init__(self):
        if spacy:
            try:
                self.nlp = spacy.load("en_core_web_sm")
            except Exception:
                self.nlp = None
        else:
            self.nlp = None

    # -----------------------------------------
    # Regex Cleaning
    # -----------------------------------------
    def clean_text(self, text):

        text = str(text)
        text = text.lower()
        text = text.strip()

        # Remove URLs
        text = re.sub(r"http\S+|www\S+", "", text)

        # Remove Email IDs
        text = re.sub(r"\S+@\S+", "", text)

        # Remove HTML Tags
        text = re.sub(r"<.*?>", "", text)

        # Remove Special Characters
        text = re.sub(r"[^a-zA-Z0-9\s]", "", text)

        # Remove Extra Spaces
        text = re.sub(r"\s+", " ", text)

        return text

    # -----------------------------------------
    # spaCy Processing
    # -----------------------------------------
    def spacy_preprocess(self, text):

        doc = self.nlp(text)

        tokens = []

        for token in doc:

            if token.is_stop:
                continue

            if token.is_punct:
                continue

            if token.is_space:
                continue

            tokens.append(token.lemma_)

        return " ".join(tokens)

    # -----------------------------------------
    # Process Single Text
    # -----------------------------------------
    def preprocess_text(self, text):

        text = self.clean_text(text)
        text = self.spacy_preprocess(text)

        return text

    # -----------------------------------------
    # Process Entire DataFrame
    # -----------------------------------------
    def preprocess_dataframe(self, df):

        if "feedback_text" not in df.columns:
            raise ValueError("feedback_text column not found.")

        df["processed_feedback"] = df["feedback_text"].apply(
            self.preprocess_text
        )

        return df