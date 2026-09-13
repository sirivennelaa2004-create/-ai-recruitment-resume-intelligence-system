import { useState, useEffect } from "react";
import api from "../services/api";
import "./ResumeUpload.css";

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [resume, setResume] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchMyResume();
    }, []);

    const fetchMyResume = async () => {
        try {
            setFetching(true);
            const response = await api.get("/resumes/my");
            setResume(response.data);
        } catch (err) {
            console.log("No existing resume found.");
        } finally {
            setFetching(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endswith(".pdf")) {
                setError("Only PDF files are allowed.");
                setFile(null);
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("File size exceeds 5MB limit.");
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError("");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a PDF resume file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");

            const response = await api.post("/resumes/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setSuccessMessage("Resume uploaded and parsed successfully!");
            setFile(null);
            fetchMyResume();
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to upload and extract resume.");
        } finally {
            setLoading(false);
        }
    };

    const parseList = (text) => {
        if (!text) return [];
        return text.split("\n").filter((item) => item.trim().length > 0);
    };

    const parseSkills = (skillsText) => {
        if (!skillsText) return [];
        return skillsText.split(",").map((s) => s.trim()).filter(Boolean);
    };

    return (
        <div className="main-content animate-fade">
            <div className="page-header">
                <h1>Resume Intelligence & Analysis</h1>
                <p>Upload your PDF resume to extract skills, experience, education, and projects for AI matching.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <div className="card upload-card">
                <div className="card-header">
                    <h3>{resume ? "Replace / Update Resume" : "Upload Resume (PDF)"}</h3>
                    <span className="badge badge-info">PDF Max 5MB</span>
                </div>

                <form onSubmit={handleUpload} className="upload-form">
                    <div className="file-dropzone">
                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            id="resume-file-input"
                            className="file-input-hidden"
                        />
                        <label htmlFor="resume-file-input" className="file-label">
                            <div className="upload-icon">📄</div>
                            <p className="file-select-text">
                                {file ? file.name : "Click or drag your PDF resume here"}
                            </p>
                            <span className="file-hint">Only .pdf format accepted</span>
                        </label>
                    </div>

                    <div style={{ marginTop: "1rem", textAlign: "right" }}>
                        <button type="submit" className="btn btn-primary" disabled={loading || !file}>
                            {loading ? "Analyzing PDF..." : "Upload & Parse Resume"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Extracted Resume Details View */}
            {fetching ? (
                <p style={{ marginTop: "2rem" }}>Loading parsed resume...</p>
            ) : resume ? (
                <div className="resume-details-container" style={{ marginTop: "2rem" }}>
                    <div className="card-header">
                        <h2>Parsed Resume Profile</h2>
                        <span className="badge badge-success">Latest Upload: #{resume.id}</span>
                    </div>

                    <div className="grid-2" style={{ marginTop: "1.5rem" }}>
                        {/* Skills Card */}
                        <div className="card">
                            <h3 style={{ marginBottom: "1rem" }}>Extracted Skills</h3>
                            <div className="skill-pills-list">
                                {parseSkills(resume.skills).map((skill, index) => (
                                    <span key={index} className="skill-pill skill-matched">
                                        {skill}
                                    </span>
                                ))}
                                {parseSkills(resume.skills).length === 0 && (
                                    <p className="no-data">No skills extracted.</p>
                                )}
                            </div>
                        </div>

                        {/* Education Card */}
                        <div className="card">
                            <h3 style={{ marginBottom: "1rem" }}>Education Background</h3>
                            <ul className="extracted-list">
                                {parseList(resume.education).map((edu, index) => (
                                    <li key={index}>{edu}</li>
                                ))}
                                {parseList(resume.education).length === 0 && (
                                    <p className="no-data">No education details extracted.</p>
                                )}
                            </ul>
                        </div>

                        {/* Experience Card */}
                        <div className="card">
                            <h3 style={{ marginBottom: "1rem" }}>Work Experience</h3>
                            <ul className="extracted-list">
                                {parseList(resume.experience).map((exp, index) => (
                                    <li key={index}>{exp}</li>
                                ))}
                                {parseList(resume.experience).length === 0 && (
                                    <p className="no-data">No work experience extracted.</p>
                                )}
                            </ul>
                        </div>

                        {/* Projects Card */}
                        <div className="card">
                            <h3 style={{ marginBottom: "1rem" }}>Projects</h3>
                            <ul className="extracted-list">
                                {parseList(resume.projects).map((proj, index) => (
                                    <li key={index}>{proj}</li>
                                ))}
                                {parseList(resume.projects).length === 0 && (
                                    <p className="no-data">No projects extracted.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card" style={{ marginTop: "2rem", textAlign: "center", padding: "3rem" }}>
                    <p style={{ color: "var(--text-muted)" }}>No resume stored yet. Upload a PDF resume above to unlock AI job matching.</p>
                </div>
            )}
        </div>
    );
}

export default ResumeUpload;