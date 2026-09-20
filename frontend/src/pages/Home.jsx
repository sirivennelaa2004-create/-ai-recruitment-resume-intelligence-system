import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
    const { isAuthenticated, isCandidate, isRecruiter } = useAuth();

    return (
        <div className="main-content animate-fade">
            <div className="hero-section">
                <span className="badge badge-primary hero-badge">✨ Next-Generation Hiring Intelligence</span>
                <h1 className="hero-title">
                    AI-Powered Recruitment & <span className="brand-accent">Resume Intelligence System</span>
                </h1>
                <p className="hero-description">
                    Empowering job candidates with explainable AI job matching & interview prep, while giving recruiters instant candidate ranking powered by TF-IDF vector similarity.
                </p>

                <div className="hero-ctas">
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="btn btn-primary" style={{ padding: "0.85rem 1.75rem", fontSize: "1.05rem" }}>
                            Go to {isRecruiter ? "Recruiter Hub" : "Candidate Portal"} →
                        </Link>
                    ) : (
                        <>
                            <Link to="/register" className="btn btn-primary" style={{ padding: "0.85rem 1.75rem", fontSize: "1.05rem" }}>
                                Get Started Free
                            </Link>
                            <Link to="/login" className="btn btn-secondary" style={{ padding: "0.85rem 1.75rem", fontSize: "1.05rem" }}>
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid-3" style={{ marginTop: "3.5rem" }}>
                <div className="card feature-card">
                    <div className="feature-icon">📄</div>
                    <h3>PDF Resume Intelligence</h3>
                    <p>PyMuPDF extraction parses skills, education, experience, and project entries from candidate resumes seamlessly.</p>
                </div>

                <div className="card feature-card">
                    <div className="feature-icon">🤖</div>
                    <h3>5-Factor AI Matching</h3>
                    <p>Explainable weighted scoring formula: Skills (40%), Semantic Similarity (30%), Experience (15%), Education (5%), Projects (10%).</p>
                </div>

                <div className="card feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Applicant Ranking & Analytics</h3>
                    <p>Recruiters receive automatically ranked candidate leaderboards sorted by AI match percentage with status tracking.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;