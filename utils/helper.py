import pandas as pd

def is_valid_dataframe(df):
    return isinstance(df, pd.DataFrame) and not df.empty

def normalize_text(text):
    if text is None:
        return ""
    return str(text).strip()