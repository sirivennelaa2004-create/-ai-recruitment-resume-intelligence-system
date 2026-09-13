import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function InterviewPrep() {
    const { jobId } = useParams();
    const [prepData, setPrepData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPrepData = async () => {
            try {
                const response = await api.get(`/interview-prep/job/${jobId}`);
                setPrepData(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || "Failed to load interview preparation questions.");
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchPrepData();
        }
    }, [jobId]);

    if (loading) {
        return (
            <div className="main-content">
                <p>Generating tailored interview preparation questions...</p>
            </div>
        );
    }

    if (error || !prepData) {
        return (
            <div className="main-content">
                <div className="alert alert-error">{error || "Preparation data unavailable."}</div>
                <Link to="/applications" className="btn btn-secondary">← Back to Applications</Link>
            </div>
        );
    }

    return (
        <div className="main-content animate-fade">
            <div className="page-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1>Interview Preparation: {prepData.job_title}</h1>
                        <p>Practice technical concepts, STAR behavioral scenarios, and address skill gap questions.</p>
                    </div>
                    <Link to="/applications" className="btn btn-secondary btn-sm">← Applications</Link>
                </div>
            </div>

            {/* Preparation Tips Banner */}
            <div className="card alert-success" style={{ marginBottom: "2rem", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                <h3 style={{ color: "#6ee7b7", marginBottom: "0.5rem" }}>💡 Key Focus Tips for this Role</h3>
                <ul style={{ paddingLeft: "1.25rem" }}>
                    {prepData.preparation_tips.map((tip, i) => (
                        <li key={i} style={{ fontSize: "0.9rem", color: "var(--text-main)", marginBottom: "0.3rem" }}>{tip}</li>
                    ))}
                </ul>
            </div>

            {/* Technical Questions */}
            <div className="card" style={{ marginBottom: "2rem" }}>
                <div className="card-header">
                    <h2>Technical & Domain Questions</h2>
                    <span className="badge badge-primary">{prepData.technical_questions.length} Questions</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
                    {prepData.technical_questions.map((q, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: "1.25rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                <span className="badge badge-info">{q.skill}</span>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Technical #{i+1}</span>
                            </div>
                            <h4 style={{ fontSize: "1.05rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>{q.question}</h4>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}><strong>Focus Area:</strong> {q.sample_topic}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Targeted Skill-Gap Questions */}
            {prepData.skill_gap_questions.length > 0 && (
                <div className="card" style={{ marginBottom: "2rem" }}>
                    <div className="card-header">
                        <h2>Targeted Skill-Gap Questions</h2>
                        <span className="badge badge-warning">Addressing Missing Skills</span>
                    </div>
                    <p style={{ marginBottom: "1rem" }}>Prepare confident responses for skills not explicitly detailed on your current resume profile.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {prepData.skill_gap_questions.map((q, i) => (
                            <div key={i} style={{ background: "rgba(245, 158, 11, 0.05)", padding: "1.25rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                    <span className="badge badge-warning">{q.skill}</span>
                                </div>
                                <h4 style={{ fontSize: "1rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>{q.question}</h4>
                                <p style={{ fontSize: "0.85rem", color: "#fcd34d" }}><strong>Recommended Strategy:</strong> {q.tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Behavioral STAR Questions */}
            <div className="card">
                <div className="card-header">
                    <h2>Behavioral & Situational Questions</h2>
                    <span className="badge badge-info">STAR Format</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
                    {prepData.behavioral_questions.map((q, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: "1.25rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                            <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>{q.category}</span>
                            <h4 style={{ fontSize: "1rem", color: "var(--text-main)" }}>{q.question}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default InterviewPrep;
