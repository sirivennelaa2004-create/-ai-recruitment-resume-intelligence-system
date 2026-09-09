from backend.app.services.embedding_service import (
    generate_embedding,
    calculate_semantic_similarity
)


resume_text = """
Python developer with experience in FastAPI,
PostgreSQL, REST APIs and backend development.
"""

similar_job_text = """
Backend developer required with Python,
FastAPI, PostgreSQL and REST API experience.
"""

different_job_text = """
Graphic designer required with Photoshop,
Illustrator and visual design experience.
"""


embedding = generate_embedding(resume_text)

similarity1 = calculate_semantic_similarity(
    resume_text,
    similar_job_text
)

similarity2 = calculate_semantic_similarity(
    resume_text,
    different_job_text
)


print("----- EMBEDDING TEST -----")
print("Embedding generated:", len(embedding) > 0)
print("Embedding dimensions:", len(embedding))
print("Similar job score:", similarity1)
print("Different job score:", similarity2)

assert len(embedding) == 384
assert similarity1 > similarity2

print("Semantic similarity test: PASSED")
print("----- END -----")