import { useAuth } from "../context/AuthContext";
import CandidateDashboard from "./CandidateDashboard";
import RecruiterDashboard from "./RecruiterDashboard";

function Dashboard() {
    const { user, isCandidate, isRecruiter } = useAuth();

    if (isCandidate) {
        return <CandidateDashboard />;
    }

    if (isRecruiter) {
        return <RecruiterDashboard />;
    }

    return (
        <div className="main-content">
            <div className="alert alert-warning">
                Unknown or unassigned user role: {user?.role}
            </div>
        </div>
    );
}

export default Dashboard;