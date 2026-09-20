from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_semantic_similarity(text1: str | None, text2: str | None) -> float:
    """
    Calculate semantic similarity percentage between two texts using
    TF-IDF vectorization and cosine similarity.

    Returns a percentage between 0.0 and 100.0.
    Handles empty/None strings gracefully without crashing.
    """
    if not text1 or not text1.strip():
        return 0.0

    if not text2 or not text2.strip():
        return 0.0

    t1 = text1.strip()
    t2 = text2.strip()

    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([t1, t2])
    except ValueError:
        # Occurs if vocabulary is empty (e.g. only stop words or non-alphanumeric characters)
        try:
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform([t1, t2])
        except ValueError:
            return 0.0

    similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    raw_sim = float(similarity_matrix[0][0])

    # Clamp value to range [0.0, 1.0] to guard against floating-point precision artifacts
    clamped_sim = max(0.0, min(1.0, raw_sim))

    return round(clamped_sim * 100, 2)
