import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("candidate");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            await api.post("/auth/register", {
                full_name: fullName,
                email,
                password,
                role,
            });

            setMessage("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            setError(err.response?.data?.detail || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page main-content animate-fade">
            <div className="card auth-card">
                <h1>Create Account</h1>
                <p className="auth-subtitle">Join as Candidate or Recruiter</p>

                {error && <div className="alert alert-error">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password (Min 8 characters)</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength="8"
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Account Role</label>
                        <select
                            className="form-control"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="candidate">Candidate (Job Seeker)</option>
                            <option value="recruiter">Recruiter (Hiring Manager)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
                        {loading ? "Registering..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-footer" style={{ marginTop: "1.5rem", textAlign: "center" }}>
                    Already registered? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;