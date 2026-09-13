import "./ScoreBreakdownCard.css";

function ScoreBreakdownCard({ match }) {
    if (!match) return null;

    const getScoreColorClass = (score) => {
        if (score >= 75) return "score-high";
        if (score >= 50) return "score-medium";
        return "score-low";
    };

    const overallScore = match.match_percentage || 0;

    return (
        <div className="score-card animate-fade">
            <div className="score-header">
                <div className="overall-score-badge">
                    <span className="score-label">Overall Match</span>
                    <span className={`score-value ${getScoreColorClass(overallScore)}`}>
                        {overallScore}%
                    </span>
                </div>

                <div className="score-explanation-summary">
                    <p className="explanation-text">{match.explanation}</p>
                </div>
            </div>

            <div className="factors-grid">
                <div className="factor-item">
                    <div className="factor-header">
                        <span>Skills (40%)</span>
                        <strong>{match.skill_match_percentage}%</strong>
                    </div>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${match.skill_match_percentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="factor-item">
                    <div className="factor-header">
                        <span>Semantic Similarity (30%)</span>
                        <strong>{match.semantic_similarity_percentage}%</strong>
                    </div>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${match.semantic_similarity_percentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="factor-item">
                    <div className="factor-header">
                        <span>Experience (15%)</span>
                        <strong>{match.experience_percentage}%</strong>
                    </div>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${match.experience_percentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="factor-item">
                    <div className="factor-header">
                        <span>Education (5%)</span>
                        <strong>{match.education_percentage}%</strong>
                    </div>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${match.education_percentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="factor-item">
                    <div className="factor-header">
                        <span>Projects (10%)</span>
                        <strong>{match.project_percentage}%</strong>
                    </div>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${match.project_percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="skills-breakdown-section">
                <div className="skill-group">
                    <h4>Matched Skills ({match.matched_skills?.length || 0})</h4>
                    {match.matched_skills?.length > 0 ? (
                        <div className="skill-pills-list">
                            {match.matched_skills.map((skill, i) => (
                                <span key={i} className="skill-pill skill-matched">
                                    ✓ {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="no-skills-text">No matched skills found.</p>
                    )}
                </div>

                <div className="skill-group">
                    <h4>Missing Skills ({match.missing_skills?.length || 0})</h4>
                    {match.missing_skills?.length > 0 ? (
                        <div className="skill-pills-list">
                            {match.missing_skills.map((skill, i) => (
                                <span key={i} className="skill-pill skill-missing">
                                    ! {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="no-skills-text">No missing skills required!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ScoreBreakdownCard;
