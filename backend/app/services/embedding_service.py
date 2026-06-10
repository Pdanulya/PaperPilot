from sentence_transformers import SentenceTransformer
from functools import lru_cache

# Caching the model loading to avoid reloading it multiple times
@lru_cache(maxsize=1)
def load_model():
    return SentenceTransformer("all-MiniLM-L6-v2")


def get_embedding(text: str):
    model = load_model()
    return model.encode(text).tolist()