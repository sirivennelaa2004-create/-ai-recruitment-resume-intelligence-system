import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="main-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
                    <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>Loading session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;
