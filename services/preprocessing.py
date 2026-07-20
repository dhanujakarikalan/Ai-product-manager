import re

def clean_text(text: str):
    text = text.lower()
    text = text.strip()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text