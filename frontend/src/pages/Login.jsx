import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });
            await login(response.data.access_token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.detail || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page main-content animate-fade">
            <div className="card auth-card">
                <h1>Sign In</h1>
                <p className="auth-subtitle">Access your candidate or recruiter portal</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleLogin}>
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
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p className="auth-footer" style={{ marginTop: "1.5rem", textAlign: "center" }}>
                    Don't have an account? <Link to="/register">Create Account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;