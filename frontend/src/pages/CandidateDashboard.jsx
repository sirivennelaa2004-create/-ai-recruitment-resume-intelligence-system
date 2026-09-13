import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function CandidateDashboard() {
    const { user } = useAuth();
    const [resume, setResume] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [resumeRes, jobsRes, appsRes] = await Promise.allSettled([
                    api.get("/resumes/my"),
                    api.get("/jobs/"),
                    api.get("/applications/my")
                ]);

                if (resumeRes.status === "fulfilled") setResume(resumeRes.value.data);
                if (jobsRes.status === "fulfilled") setJobs(jobsRes.value.data);
                if (appsRes.status === "fulfilled") setApplications(appsRes.value.data);
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="main-content">
                <p>Loading candidate portal...</p>
            </div>
        );
    }

    return (
        <div className="main-content animate-fade">
            <div className="dashboard-welcome">
                <div>
                    <h1>Welcome back, {user?.full_name}!</h1>
                    <p>Track your resume intelligence, match score recommendations, and application statuses.</p>
                </div>
                <div className="welcome-actions">
                    <Link to="/jobs" className="btn btn-primary">
                        Explore Open Jobs
                    </Link>
                </div>
            </div>

            <div className="grid-3" style={{ marginTop: "2rem" }}>
                {/* Resume Card */}
                <div className="card">
                    <div className="card-header">
                        <h3>Resume Status</h3>
                        <span className={`badge ${resume ? "badge-success" : "badge-warning"}`}>
                            {resume ? "Active" : "Action Needed"}
                        </span>
                    </div>
                    {resume ? (
                        <div>
                            <p style={{ color: "var(--text-main)", fontWeight: 600 }}>{resume.filename}</p>
                            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                                <strong>Extracted Skills:</strong> {resume.skills || "None listed"}
                            </p>
                            <div style={{ marginTop: "1.25rem" }}>
                                <Link to="/resume" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                                    View Parsed Details
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p>No resume uploaded yet. Upload your PDF resume to start checking AI job matches.</p>
                            <div style={{ marginTop: "1.25rem" }}>
                                <Link to="/resume" className="btn btn-primary btn-sm" style={{ width: "100%" }}>
                                    Upload PDF Resume
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Job Matches Card */}
                <div className="card">
                    <div className="card-header">
                        <h3>Available Jobs</h3>
                        <span className="badge badge-info">{jobs.length} Open</span>
                    </div>
                    <p>Discover tech and engineering roles tailored to your skill profile.</p>
                    <div style={{ marginTop: "1.5rem" }}>
                        <Link to="/jobs" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                            Browse {jobs.length} Job Opportunities
                        </Link>
                    </div>
                </div>

                {/* Applications Card */}
                <div className="card">
                    <div className="card-header">
                        <h3>My Applications</h3>
                        <span className="badge badge-primary">{applications.length} Total</span>
                    </div>
                    <p>Monitor status updates from recruiters (Applied, Shortlisted, Interview, Hired).</p>
                    <div style={{ marginTop: "1.5rem" }}>
                        <Link to="/applications" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                            View Application Tracker
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Applications Overview */}
            {applications.length > 0 && (
                <div className="card" style={{ marginTop: "2rem" }}>
                    <div className="card-header">
                        <h3>Recent Job Applications</h3>
                        <Link to="/applications" style={{ fontSize: "0.875rem" }}>View All →</Link>
                    </div>
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Application ID</th>
                                    <th>Job ID</th>
                                    <th>Status</th>
                                    <th>Interview Prep</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.slice(0, 5).map((app) => (
                                    <tr key={app.id}>
                                        <td>#{app.id}</td>
                                        <td>Job #{app.job_id}</td>
                                        <td>
                                            <span className={`badge ${
                                                app.status === 'hired' ? 'badge-success' :
                                                app.status === 'interview' ? 'badge-info' :
                                                app.status === 'shortlisted' ? 'badge-primary' :
                                                app.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/interview-prep/${app.job_id}`} className="btn btn-secondary btn-sm">
                                                Prep Questions
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CandidateDashboard;