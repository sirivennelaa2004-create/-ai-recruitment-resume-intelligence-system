from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)


def generate_embedding(text: str) -> list[float]:
    if not text or not text.strip():
        return []

    embedding = model.encode(text)

    return embedding.tolist()


def calculate_semantic_similarity(text1: str, text2: str) -> float:
    if not text1 or not text1.strip():
        return 0.0

    if not text2 or not text2.strip():
        return 0.0

    embedding1 = model.encode([text1])
    embedding2 = model.encode([text2])

    similarity = cosine_similarity(embedding1, embedding2)[0][0]

    return round(float(similarity) * 100, 2)