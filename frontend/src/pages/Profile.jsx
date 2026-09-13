import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const { user, updateUserState } = useAuth();
    const [fullName, setFullName] = useState(user?.full_name || "");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!fullName.trim()) {
            setError("Full name cannot be empty.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const response = await api.put("/auth/profile", { full_name: fullName });
            updateUserState(response.data);
            setMessage("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content animate-fade" style={{ maxWidth: "600px" }}>
            <div className="page-header">
                <h1>User Account Profile</h1>
                <p>Manage your account credentials and profile display information.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <div className="card">
                <div className="card-header">
                    <h3>Account Info</h3>
                    <span className={`badge ${user?.role === 'recruiter' ? 'badge-primary' : 'badge-success'}`}>
                        {user?.role}
                    </span>
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Account Email (Read-Only)</label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            readOnly
                            disabled
                            className="form-control"
                            style={{ opacity: 0.7, cursor: "not-allowed" }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Account Role (Read-Only)</label>
                        <input
                            type="text"
                            value={user?.role?.toUpperCase() || ""}
                            readOnly
                            disabled
                            className="form-control"
                            style={{ opacity: 0.7, cursor: "not-allowed" }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>

                    <div style={{ textAlign: "right", marginTop: "1.5rem" }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Saving..." : "Save Profile Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
