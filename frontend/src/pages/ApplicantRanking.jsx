import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ScoreBreakdownCard from "../components/ScoreBreakdownCard";

function ApplicantRanking() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialJobId = searchParams.get("job_id") || "";

    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(initialJobId);
    const [rankings, setRankings] = useState([]);
    
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingRankings, setLoadingRankings] = useState(false);
    const [selectedApplicantMatch, setSelectedApplicantMatch] = useState(null);
    
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs/my");
                setJobs(response.data);
                if (!selectedJobId && response.data.length > 0) {
                    setSelectedJobId(response.data[0].id.toString());
                }
            } catch (err) {
                setError("Failed to load your posted jobs.");
            } finally {
                setLoadingJobs(false);
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
        if (!selectedJobId) return;

        const fetchRankings = async () => {
            try {
                setLoadingRankings(true);
                setError("");
                const response = await api.get(`/matching/jobs/${selectedJobId}/applicants`);
                setRankings(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || "Failed to load applicant rankings.");
                setRankings([]);
            } finally {
                setLoadingRankings(false);
            }
        };

        fetchRankings();
    }, [selectedJobId]);

    const handleJobChange = (e) => {
        const id = e.target.value;
        setSelectedJobId(id);
        setSearchParams(id ? { job_id: id } : {});
        setSelectedApplicantMatch(null);
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            setError("");
            setSuccessMessage("");
            await api.patch(`/applications/${applicationId}/status`, { status: newStatus });
            
            // Update local state
            setRankings((prev) =>
                prev.map((item) =>
                    item.application_id === applicationId
                        ? { ...item, application_status: newStatus }
                        : item
                )
            );
            setSuccessMessage(`Application #${applicationId} status updated to '${newStatus}'.`);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update status.");
        }
    };

    const getScoreBadge = (score) => {
        if (score >= 75) return <span className="badge badge-success">{score}%</span>;
        if (score >= 50) return <span className="badge badge-info">{score}%</span>;
        return <span className="badge badge-warning">{score}%</span>;
    };

    return (
        <div className="main-content animate-fade">
            <div className="page-header">
                <h1>AI Candidate Ranking & Evaluation</h1>
                <p>Rank job applicants by explainable AI match scores (Skills 40%, Semantic 30%, Experience 15%, Education 5%, Projects 10%).</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Select Job Dropdown */}
            <div className="card" style={{ marginBottom: "2rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Select Job Requisition for AI Candidate Ranking</label>
                    <select
                        className="form-control"
                        value={selectedJobId}
                        onChange={handleJobChange}
                        disabled={loadingJobs || jobs.length === 0}
                    >
                        {jobs.length === 0 && <option value="">No jobs available</option>}
                        {jobs.map((job) => (
                            <option key={job.id} value={job.id}>
                                {job.title} ({job.location || 'Remote'}) — [{job.status.toUpperCase()}]
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Rankings Table */}
            {loadingRankings ? (
                <p>Analyzing and ranking candidates...</p>
            ) : rankings.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                    <p style={{ color: "var(--text-muted)" }}>No candidate applications received for this job yet.</p>
                </div>
            ) : (
                <div className="card">
                    <div className="card-header">
                        <h2>Ranked Applicants ({rankings.length})</h2>
                        <span className="badge badge-primary">Sorted by Match Score DESC</span>
                    </div>

                    <div className="table-container" style={{ marginTop: "1rem" }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Candidate</th>
                                    <th>Overall Match</th>
                                    <th>Skills (40%)</th>
                                    <th>Semantic (30%)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings.map((applicant, index) => (
                                    <tr key={applicant.application_id}>
                                        <td style={{ fontWeight: 800, color: index === 0 ? "#fcd34d" : "inherit" }}>
                                            #{index + 1}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{applicant.candidate_name}</div>
                                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{applicant.candidate_email}</div>
                                        </td>
                                        <td>{getScoreBadge(applicant.match_percentage)}</td>
                                        <td>{applicant.skill_match_percentage}%</td>
                                        <td>{applicant.semantic_similarity_percentage}%</td>
                                        <td>
                                            <select
                                                className="form-control"
                                                style={{ padding: "0.3rem 0.5rem", fontSize: "0.85rem" }}
                                                value={applicant.application_status}
                                                onChange={(e) => handleStatusUpdate(applicant.application_id, e.target.value)}
                                            >
                                                <option value="applied">applied</option>
                                                <option value="shortlisted">shortlisted</option>
                                                <option value="interview">interview</option>
                                                <option value="hired">hired</option>
                                                <option value="rejected">rejected</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => setSelectedApplicantMatch(applicant)}
                                                disabled={!applicant.resume_id}
                                            >
                                                {applicant.resume_id ? "View AI Breakdown" : "No Resume"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Score Breakdown Modal */}
            {selectedApplicantMatch && (
                <div className="modal-backdrop">
                    <div className="modal-content animate-fade">
                        <div className="card-header">
                            <div>
                                <h2>AI Match Breakdown: {selectedApplicantMatch.candidate_name}</h2>
                                <span className="badge badge-info">{selectedApplicantMatch.candidate_email}</span>
                            </div>
                            <button
                                onClick={() => setSelectedApplicantMatch(null)}
                                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}
                            >
                                &times;
                            </button>
                        </div>

                        <ScoreBreakdownCard match={selectedApplicantMatch} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ApplicantRanking;
