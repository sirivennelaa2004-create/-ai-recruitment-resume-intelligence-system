import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import ScoreBreakdownCard from "../components/ScoreBreakdownCard";
import "./JobSearch.css";

function JobSearch() {
    const [jobs, setJobs] = useState([]);
    const [resume, setResume] = useState(null);
    const [applications, setApplications] = useState([]);
    const [matchResults, setMatchResults] = useState({});
    
    // Filters & States
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [skillFilter, setSkillFilter] = useState("");
    
    const [loading, setLoading] = useState(true);
    const [matchingJobId, setMatchingJobId] = useState(null);
    const [applyingJobId, setApplyingJobId] = useState(null);
    const [activeMatchModalJobId, setActiveMatchModalJobId] = useState(null);
    
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [jobsRes, resumeRes, appsRes] = await Promise.allSettled([
                    api.get("/jobs/"),
                    api.get("/resumes/my"),
                    api.get("/applications/my")
                ]);

                if (jobsRes.status === "fulfilled") setJobs(jobsRes.value.data);
                if (resumeRes.status === "fulfilled") setResume(resumeRes.value.data);
                if (appsRes.status === "fulfilled") setApplications(appsRes.value.data);
            } catch (err) {
                setError("Failed to load job listings.");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Set of applied job IDs
    const appliedJobIds = useMemo(() => {
        return new Set(applications.map((app) => app.job_id));
    }, [applications]);

    // Filtered jobs
    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesLocation = !locationFilter ||
                (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()));

            const matchesSkill = !skillFilter ||
                (job.required_skills && job.required_skills.toLowerCase().includes(skillFilter.toLowerCase()));

            return matchesSearch && matchesLocation && matchesSkill;
        });
    }, [jobs, searchTerm, locationFilter, skillFilter]);

    const handleMatch = async (jobId) => {
        if (!resume) {
            setError("Please upload your PDF resume before checking AI job matches.");
            return;
        }

        try {
            setMatchingJobId(jobId);
            setError("");

            const response = await api.get(`/matching/jobs/${jobId}/resumes/${resume.id}`);
            
            setMatchResults((prev) => ({
                ...prev,
                [jobId]: response.data
            }));
            setActiveMatchModalJobId(jobId);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to calculate AI match.");
        } finally {
            setMatchingJobId(null);
        }
    };

    const handleApply = async (jobId) => {
        try {
            setApplyingJobId(jobId);
            setError("");
            setSuccessMessage("");

            const response = await api.post("/applications/", { job_id: jobId });

            setApplications((prev) => [...prev, response.data]);
            setSuccessMessage("Application submitted successfully!");
        } catch (err) {
            setError(err.response?.data?.detail || "Application failed.");
        } finally {
            setApplyingJobId(null);
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setLocationFilter("");
        setSkillFilter("");
    };

    if (loading) {
        return (
            <div className="main-content">
                <p>Loading open job opportunities...</p>
            </div>
        );
    }

    return (
        <div className="main-content animate-fade">
            <div className="page-header">
                <h1>Find Jobs & AI Matching</h1>
                <p>Browse active career opportunities and analyze how your resume intelligence matches job requirements.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {!resume && (
                <div className="alert alert-warning" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span><strong>Resume Notice:</strong> Upload your PDF resume to unlock personalized AI match scores and missing skill gap insights.</span>
                    <a href="/resume" className="btn btn-secondary btn-sm">Upload Resume</a>
                </div>
            )}

            {/* Filter Search Header */}
            <div className="card filter-card" style={{ marginBottom: "2rem" }}>
                <div className="grid-3">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Search Job Title / Key Terms</label>
                        <input
                            type="text"
                            placeholder="e.g. Full Stack Engineer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Filter by Location</label>
                        <input
                            type="text"
                            placeholder="e.g. Remote, San Francisco..."
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Filter by Required Skill</label>
                        <input
                            type="text"
                            placeholder="e.g. Python, React, AWS..."
                            value={skillFilter}
                            onChange={(e) => setSkillFilter(e.target.value)}
                            className="form-control"
                        />
                    </div>
                </div>

                {(searchTerm || locationFilter || skillFilter) && (
                    <div style={{ marginTop: "1rem", textAlign: "right" }}>
                        <button onClick={clearFilters} className="btn btn-secondary btn-sm">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Jobs List Grid */}
            {filteredJobs.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                    <p style={{ color: "var(--text-muted)" }}>No open job postings match your current filter parameters.</p>
                </div>
            ) : (
                <div className="jobs-list-container">
                    {filteredJobs.map((job) => {
                        const isApplied = appliedJobIds.has(job.id);
                        const match = matchResults[job.id];

                        return (
                            <div className="card job-card" key={job.id}>
                                <div className="card-header">
                                    <div>
                                        <h2>{job.title}</h2>
                                        <div className="job-meta-pills" style={{ marginTop: "0.4rem" }}>
                                            {job.location && <span className="badge badge-info">📍 {job.location}</span>}
                                            {job.salary && <span className="badge badge-success">💰 {job.salary}</span>}
                                            <span className="badge badge-primary">Status: Open</span>
                                        </div>
                                    </div>
                                    {isApplied && <span className="badge badge-success">✓ Applied</span>}
                                </div>

                                <p className="job-description">{job.description}</p>

                                <div className="job-requirements-grid" style={{ margin: "1.25rem 0" }}>
                                    <p><strong>Required Skills:</strong> {job.required_skills || "Not specified"}</p>
                                    <p><strong>Experience:</strong> {job.experience_required || "Not specified"}</p>
                                    <p><strong>Education:</strong> {job.education_required || "Not specified"}</p>
                                </div>

                                <div className="job-actions">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleMatch(job.id)}
                                        disabled={!resume || matchingJobId === job.id}
                                    >
                                        {matchingJobId === job.id ? "Calculating Match..." : "⚡ Check AI Match"}
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleApply(job.id)}
                                        disabled={isApplied || applyingJobId === job.id}
                                    >
                                        {isApplied ? "Applied" : applyingJobId === job.id ? "Applying..." : "Submit Application"}
                                    </button>
                                </div>

                                {match && (
                                    <ScoreBreakdownCard match={match} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default JobSearch;