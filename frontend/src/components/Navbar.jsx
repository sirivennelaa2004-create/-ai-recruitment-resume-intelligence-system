import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const { user, logout, isCandidate, isRecruiter, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-logo">AI</div>
                    <span className="brand-title">Recruitment<span className="brand-accent">Intel</span></span>
                </Link>

                {isAuthenticated && (
                    <div className="navbar-links">
                        <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
                            Dashboard
                        </Link>

                        {isCandidate && (
                            <>
                                <Link to="/resume" className={`nav-link ${isActive("/resume") ? "active" : ""}`}>
                                    My Resume
                                </Link>
                                <Link to="/jobs" className={`nav-link ${isActive("/jobs") ? "active" : ""}`}>
                                    Find Jobs
                                </Link>
                                <Link to="/applications" className={`nav-link ${isActive("/applications") ? "active" : ""}`}>
                                    My Applications
                                </Link>
                            </>
                        )}

                        {isRecruiter && (
                            <>
                                <Link to="/manage-jobs" className={`nav-link ${isActive("/manage-jobs") ? "active" : ""}`}>
                                    Manage Jobs
                                </Link>
                                <Link to="/rankings" className={`nav-link ${isActive("/rankings") ? "active" : ""}`}>
                                    AI Candidate Ranking
                                </Link>
                                <Link to="/analytics" className={`nav-link ${isActive("/analytics") ? "active" : ""}`}>
                                    Analytics
                                </Link>
                            </>
                        )}

                        <Link to="/profile" className={`nav-link ${isActive("/profile") ? "active" : ""}`}>
                            Profile
                        </Link>
                    </div>
                )}

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <div className="user-profile-widget">
                            <div className="user-info">
                                <span className="user-name">{user?.full_name}</span>
                                <span className={`badge ${isRecruiter ? "badge-primary" : "badge-success"}`}>
                                    {user?.role}
                                </span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary btn-sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
