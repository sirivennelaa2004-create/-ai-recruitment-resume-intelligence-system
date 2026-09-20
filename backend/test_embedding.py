from backend.app.services.semantic_similarity_service import (
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


similarity1 = calculate_semantic_similarity(
    resume_text,
    similar_job_text
)

similarity2 = calculate_semantic_similarity(
    resume_text,
    different_job_text
)

empty_similarity = calculate_semantic_similarity(
    "",
    similar_job_text
)


print("----- SEMANTIC SIMILARITY TEST -----")
print("Similar job score:", similarity1)
print("Different job score:", similarity2)
print("Empty input score:", empty_similarity)

assert similarity1 > similarity2
assert similarity1 > 0
assert empty_similarity == 0.0

print("Semantic similarity test: PASSED")
print("----- END -----")