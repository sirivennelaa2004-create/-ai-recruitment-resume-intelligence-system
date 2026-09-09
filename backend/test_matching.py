from backend.app.services.matching_service import (
    calculate_skill_match,
    calculate_final_match_score
)


def test_full_skill_match():
    result = calculate_skill_match(
        "Python, FastAPI, PostgreSQL",
        "Python, FastAPI, PostgreSQL"
    )

    assert result["match_percentage"] == 100.0
    assert result["matched_skills"] == [
        "fastapi",
        "postgresql",
        "python"
    ]
    assert result["missing_skills"] == []


def test_partial_skill_match():
    result = calculate_skill_match(
        "Python, FastAPI",
        "Python, FastAPI, PostgreSQL"
    )

    assert result["match_percentage"] > 0
    assert result["match_percentage"] < 100
    assert "postgresql" in result["missing_skills"]


def test_no_skill_match():
    result = calculate_skill_match(
        "Java, Spring",
        "Python, FastAPI, PostgreSQL"
    )

    assert result["match_percentage"] == 0.0
    assert result["matched_skills"] == []
    assert len(result["missing_skills"]) == 3


def test_empty_skills():
    result = calculate_skill_match(
        None,
        "Python, FastAPI"
    )

    assert result["match_percentage"] == 0.0
    assert result["matched_skills"] == []


def test_final_match_score():
    result = calculate_final_match_score(
        skill_match_percentage=80.0,
        semantic_similarity_percentage=70.0,
        experience_percentage=60.0,
        education_percentage=50.0,
        project_percentage=90.0
    )

    expected = (
        (80.0 * 0.40)
        + (70.0 * 0.30)
        + (60.0 * 0.15)
        + (50.0 * 0.05)
        + (90.0 * 0.10)
    )

    assert result == round(expected, 2)

    print("Final match score:", result)