# AI Matching Pipeline & Vector Similarity Engine

## Overview
The matching engine evaluates candidates against job postings using a hybrid algorithm combining exact normalized skill matching and deep semantic sentence embeddings.

```
Resume Text  ───► TfidfVectorizer (scikit-learn) ───► TF-IDF Vector
                                                               │
                                                         Cosine Similarity
                                                               │
Job Desc     ───► TfidfVectorizer (scikit-learn) ───► TF-IDF Vector
```

## 5-Factor Weighted Score Formula

$$ \text{Final Match Score} = (S \times 0.40) + (M \times 0.30) + (E \times 0.15) + (D \times 0.05) + (P \times 0.10) $$

Where:
- $S$: Exact weighted skill match percentage ($40\%$)
- $M$: Overall semantic text similarity score ($30\%$)
- $E$: Candidate experience text vs required experience similarity ($15\%$)
- $D$: Candidate education text vs required education similarity ($5\%$)
- $P$: Candidate project text vs job description similarity ($10\%$)

## Skill Matching Normalization
1. Candidate and Job skills are split by commas, trimmed, converted to lowercase, and deduplicated into sorted sets.
2. Individual skill weights are applied (e.g. `python: 1.5`, `fastapi: 1.5`, `postgresql: 1.5`, `react: 1.2`, default: `1.0`).
3. Matched skills and missing skills lists are generated explicitly for recruiter and candidate transparency.

## Semantic Similarity Vector Engine
- Engine: `scikit-learn` `TfidfVectorizer` + `cosine_similarity`
- Generates lightweight TF-IDF feature vectors for resume sections and job descriptions.
- Cosine similarity is computed using `scikit-learn` pairwise metrics:
$$\text{Cosine Similarity}(u, v) = \frac{u \cdot v}{\|u\| \|v\|}$$
- Output is scaled between `0.00%` and `100.00%`.
