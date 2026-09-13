import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyApplications = async () => {
            try {
                const response = await api.get("/applications/my");
                setApplications(response.data);
            } catch (err) {
                setError("Failed to load your application history.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyApplications();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case "hired":
                return <span className="badge badge-success">🎉 Hired</span>;
            case "interview":
                return <span className="badge badge-info">💬 Interview Scheduled</span>;
            case "shortlisted":
                return <span className="badge badge-primary">⭐ Shortlisted</span>;
            case "rejected":
                return <span className="badge badge-danger">Not Selected</span>;
            default:
                return <span className="badge badge-warning">Application Received</span>;
        }
    };

    if (loading) {
        return (
            <div className="main-content">
                <p>Loading application tracker...</p>
            </div>
        );
    }

    return (
        <div className="main-content animate-fade">
            <div className="page-header">
                <h1>My Job Applications</h1>
                <p>Track recruitment progress, status updates, and prepare for interviews.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {applications.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                    <h3>No Applications Submitted Yet</h3>
                    <p style={{ marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                        Explore active job listings and submit applications with AI match verification.
                    </p>
                    <Link to="/jobs" className="btn btn-primary">
                        Browse Open Jobs
                    </Link>
                </div>
            ) : (
                <div className="card">
                    <div className="card-header">
                        <h2>Application History ({applications.length})</h2>
                    </div>

                    <div className="table-container" style={{ marginTop: "1rem" }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>App Reference</th>
                                    <th>Job ID</th>
                                    <th>Current Status</th>
                                    <th>Interview Preparation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.id}>
                                        <td style={{ fontWeight: 600 }}>APP-#{app.id}</td>
                                        <td>JOB-#{app.job_id}</td>
                                        <td>{getStatusBadge(app.status)}</td>
                                        <td>
                                            <Link to={`/interview-prep/${app.job_id}`} className="btn btn-secondary btn-sm">
                                                🎯 Practice Prep Questions
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

export default MyApplications;
