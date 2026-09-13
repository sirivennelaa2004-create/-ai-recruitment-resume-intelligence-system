import { useEffect, useState } from "react";
import api from "../services/api";

function RecruiterAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get("/analytics/recruiter");
                setAnalytics(response.data);
            } catch (err) {
                setError("Failed to load recruiter analytics.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="main-content">
                <p>Loading analytics data...</p>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="main-content">
                <div className="alert alert-error">{error || "Analytics unavailable."}</div>
            </div>
        );
    }

    const { total_jobs, open_jobs, closed_jobs, total_applications, status_breakdown, average_match_score } = analytics;

    const calculatePercentage = (count) => {
        if (!total_applications || total_applications === 0) return 0;
        return round((count / total_applications) * 100, 1);
    };

    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    return (
        <div className="main-content animate-fade">
            <div className="page-header">
                <h1>Recruitment Analytics & Insights</h1>
                <p>Monitor pipeline performance metrics, hiring funnel conversion, and candidate score distribution.</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid-4" style={{ marginBottom: "2rem" }}>
                <div className="card">
                    <span className="score-label">Total Jobs Posted</span>
                    <h2 style={{ fontSize: "2.2rem", marginTop: "0.5rem", color: "#a5b4fc" }}>{total_jobs}</h2>
                    <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>{open_jobs} Open / {closed_jobs} Closed</p>
                </div>

                <div className="card">
                    <span className="score-label">Total Applications</span>
                    <h2 style={{ fontSize: "2.2rem", marginTop: "0.5rem", color: "#60a5fa" }}>{total_applications}</h2>
                    <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>Submitted by candidates</p>
                </div>

                <div className="card">
                    <span className="score-label">Hired Candidates</span>
                    <h2 style={{ fontSize: "2.2rem", marginTop: "0.5rem", color: "#34d399" }}>
                        {status_breakdown.hired}
                    </h2>
                    <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>{calculatePercentage(status_breakdown.hired)}% hire conversion</p>
                </div>

                <div className="card">
                    <span className="score-label">Average AI Score</span>
                    <h2 style={{ fontSize: "2.2rem", marginTop: "0.5rem", color: "#fcd34d" }}>{average_match_score}%</h2>
                    <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>Candidate pool match average</p>
                </div>
            </div>

            {/* Funnel Pipeline Breakdown */}
            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <h2>Recruitment Funnel Pipeline</h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
                        <div>
                            <div className="factor-header">
                                <span>Applied ({status_breakdown.applied})</span>
                                <strong>{calculatePercentage(status_breakdown.applied)}%</strong>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${calculatePercentage(status_breakdown.applied)}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="factor-header">
                                <span>Shortlisted ({status_breakdown.shortlisted})</span>
                                <strong>{calculatePercentage(status_breakdown.shortlisted)}%</strong>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${calculatePercentage(status_breakdown.shortlisted)}%`, background: "var(--primary)" }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="factor-header">
                                <span>Interviewing ({status_breakdown.interview})</span>
                                <strong>{calculatePercentage(status_breakdown.interview)}%</strong>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${calculatePercentage(status_breakdown.interview)}%`, background: "var(--info)" }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="factor-header">
                                <span>Hired ({status_breakdown.hired})</span>
                                <strong>{calculatePercentage(status_breakdown.hired)}%</strong>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${calculatePercentage(status_breakdown.hired)}%`, background: "var(--success)" }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="factor-header">
                                <span>Rejected ({status_breakdown.rejected})</span>
                                <strong>{calculatePercentage(status_breakdown.rejected)}%</strong>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${calculatePercentage(status_breakdown.rejected)}%`, background: "var(--danger)" }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2>Requisition Status Breakdown</h2>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <div style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}>
                            <h4 style={{ color: "var(--success)" }}>Open Requisitions: {open_jobs}</h4>
                            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Currently accepting candidate applications and AI matching.</p>
                        </div>

                        <div style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)" }}>
                            <h4 style={{ color: "var(--danger)" }}>Closed Requisitions: {closed_jobs}</h4>
                            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Archived positions where hiring is completed or paused.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecruiterAnalytics;
