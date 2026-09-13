import { useEffect, useState } from "react";
import api from "../services/api";

function ManageJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    // Form inputs
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requiredSkills, setRequiredSkills] = useState("");
    const [experienceRequired, setExperienceRequired] = useState("");
    const [educationRequired, setEducationRequired] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");
    const [status, setStatus] = useState("open");

    const fetchMyJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get("/jobs/my");
            setJobs(response.data);
        } catch (err) {
            setError("Failed to load your jobs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const openCreateModal = () => {
        setEditingJob(null);
        setTitle("");
        setDescription("");
        setRequiredSkills("");
        setExperienceRequired("");
        setEducationRequired("");
        setLocation("");
        setSalary("");
        setStatus("open");
        setShowModal(true);
    };

    const openEditModal = (job) => {
        setEditingJob(job);
        setTitle(job.title);
        setDescription(job.description);
        setRequiredSkills(job.required_skills || "");
        setExperienceRequired(job.experience_required || "");
        setEducationRequired(job.education_required || "");
        setLocation(job.location || "");
        setSalary(job.salary || "");
        setStatus(job.status || "open");
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        const payload = {
            title,
            description,
            required_skills: requiredSkills,
            experience_required: experienceRequired,
            education_required: educationRequired,
            location,
            salary,
            status
        };

        try {
            if (editingJob) {
                await api.put(`/jobs/${editingJob.id}`, payload);
                setSuccessMessage("Job requisition updated successfully!");
            } else {
                await api.post("/jobs/", payload);
                setSuccessMessage("New job requisition created successfully!");
            }
            setShowModal(false);
            fetchMyJobs();
        } catch (err) {
            setError(err.response?.data?.detail || "Operation failed.");
        }
    };

    const handleCloseJob = async (jobId) => {
        try {
            setError("");
            await api.patch(`/jobs/${jobId}/close`);
            setSuccessMessage("Job requisition closed successfully!");
            fetchMyJobs();
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to close job.");
        }
    };

    return (
        <div className="main-content animate-fade">
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1>Manage Job Postings</h1>
                    <p>Create new job requisitions, modify requirements, and control job status.</p>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    + Create New Job
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {loading ? (
                <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>No job requisitions found.</p>
                    <button className="btn btn-primary" onClick={openCreateModal}>Create Job Requisition</button>
                </div>
            ) : (
                <div className="card">
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Location</th>
                                    <th>Required Skills</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr key={job.id}>
                                        <td style={{ fontWeight: 600 }}>{job.title}</td>
                                        <td>{job.location || "Unspecified"}</td>
                                        <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {job.required_skills || "None"}
                                        </td>
                                        <td>{job.salary || "N/A"}</td>
                                        <td>
                                            <span className={`badge ${job.status === 'open' ? 'badge-success' : 'badge-danger'}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td style={{ display: "flex", gap: "0.5rem" }}>
                                            <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(job)}>
                                                Edit
                                            </button>
                                            {job.status === "open" && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleCloseJob(job.id)}>
                                                    Close
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create / Edit Job Modal */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content animate-fade">
                        <div className="card-header">
                            <h2>{editingJob ? "Edit Job Requisition" : "Create New Job Requisition"}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}>
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
                            <div className="form-group">
                                <label>Job Title *</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Senior Backend Engineer"
                                />
                            </div>

                            <div className="form-group">
                                <label>Job Description *</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe key responsibilities and expectations..."
                                />
                            </div>

                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Required Skills (Comma-separated)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={requiredSkills}
                                        onChange={(e) => setRequiredSkills(e.target.value)}
                                        placeholder="Python, FastAPI, PostgreSQL, Docker"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Experience Requirement</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={experienceRequired}
                                        onChange={(e) => setExperienceRequired(e.target.value)}
                                        placeholder="3+ years backend development"
                                    />
                                </div>
                            </div>

                            <div className="grid-3">
                                <div className="form-group">
                                    <label>Education Requirement</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={educationRequired}
                                        onChange={(e) => setEducationRequired(e.target.value)}
                                        placeholder="BS in Computer Science"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Remote / New York, NY"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Salary Range</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={salary}
                                        onChange={(e) => setSalary(e.target.value)}
                                        placeholder="$120,000 - $150,000"
                                    />
                                </div>
                            </div>

                            {editingJob && (
                                <div className="form-group">
                                    <label>Job Status</label>
                                    <select
                                        className="form-control"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="open">Open</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingJob ? "Update Job" : "Publish Job"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageJobs;
