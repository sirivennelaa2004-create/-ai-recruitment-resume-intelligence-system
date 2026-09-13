import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function RecruiterDashboard() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecruiterData = async () => {
            try {
                const [analyticsRes, jobsRes] = await Promise.allSettled([
                    api.get("/analytics/recruiter"),
                    api.get("/jobs/my")
                ]);

                if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value.data);
                if (jobsRes.status === "fulfilled") setMyJobs(jobsRes.value.data);
            } catch (err) {
                console.error("Recruiter dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecruiterData();
    }, []);

    if (loading) {
        return (
            <div className="main-content">
                <p>Loading recruiter portal...</p>
            </div>
        );
    }

    return (
        <div className="main-content animate-fade">
            <div className="dashboard-welcome">
                <div>
                    <h1>Recruiter Control Hub</h1>
                    <p>Welcome back, {user?.full_name}. Manage job requisitions and review AI candidate rankings.</p>
                </div>
                <div className="welcome-actions">
                    <Link to="/manage-jobs" className="btn btn-primary">
                        + Create Job Requisition
                    </Link>
                </div>
            </div>

            {/* KPI Metrics Cards Grid */}
            <div className="grid-4" style={{ marginTop: "2rem" }}>
                <div className="card">
                    <span className="score-label">Total Posted Jobs</span>
                    <h2 style={{ fontSize: "2rem", marginTop: "0.5rem", color: "#818cf8" }}>
                        {analytics?.total_jobs || 0}
                    </h2>
                    <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>{analytics?.open_jobs || 0} currently open</p>
                </div>

                <div className="card">
                    <span className="score-label">Applications Received</span>
                    <h2 style={{ fontSize: "2rem", marginTop: "0.5rem", color: "#60a5fa" }}>
                        {analytics?.total_applications || 0}
                    </h2>
                    <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>Across all active listings</p>
                </div>

                <div className="card">
                    <span className="score-label">Shortlisted Candidates</span>
                    <h2 style={{ fontSize: "2rem", marginTop: "0.5rem", color: "#34d399" }}>
                        {(analytics?.status_breakdown?.shortlisted || 0) + (analytics?.status_breakdown?.interview || 0)}
                    </h2>
                    <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>Shortlisted & Interviewing</p>
                </div>

                <div className="card">
                    <span className="score-label">Avg AI Match Score</span>
                    <h2 style={{ fontSize: "2rem", marginTop: "0.5rem", color: "#fcd34d" }}>
                        {analytics?.average_match_score || 0}%
                    </h2>
                    <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>Applicant pool average</p>
                </div>
            </div>

            {/* My Posted Jobs Summary */}
            <div className="card" style={{ marginTop: "2rem" }}>
                <div className="card-header">
                    <h2>Active Requisitions & AI Ranking</h2>
                    <Link to="/manage-jobs" className="btn btn-secondary btn-sm">Manage All Jobs →</Link>
                </div>

                {myJobs.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                        <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>You haven't posted any job requisitions yet.</p>
                        <Link to="/manage-jobs" className="btn btn-primary">Create Your First Job</Link>
                    </div>
                ) : (
                    <div className="table-container" style={{ marginTop: "1rem" }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Location</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                    <th>AI Candidate Ranking</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myJobs.map((job) => (
                                    <tr key={job.id}>
                                        <td style={{ fontWeight: 600 }}>{job.title}</td>
                                        <td>{job.location || "Remote / Unspecified"}</td>
                                        <td>{job.salary || "N/A"}</td>
                                        <td>
                                            <span className={`badge ${job.status === 'open' ? 'badge-success' : 'badge-danger'}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/rankings?job_id=${job.id}`} className="btn btn-primary btn-sm">
                                                ⚡ Rank Applicants
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecruiterDashboard;