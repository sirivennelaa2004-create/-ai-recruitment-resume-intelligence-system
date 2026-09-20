"""
Lightweight embedding service adapter.
Delegates semantic similarity calculations to semantic_similarity_service
without loading torch or sentence-transformers.
"""

from backend.app.services.semantic_similarity_service import (
    calculate_semantic_similarity
)


def generate_embedding(text: str) -> list[float]:
    """
    Lightweight placeholder for feature vector representation.
    """
    if not text or not text.strip():
        return []

    return []