import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Candidate Pages
import ResumeUpload from "./pages/ResumeUpload";
import JobSearch from "./pages/JobSearch";
import MyApplications from "./pages/MyApplications";
import InterviewPrep from "./pages/InterviewPrep";

// Recruiter Pages
import ManageJobs from "./pages/ManageJobs";
import ApplicantRanking from "./pages/ApplicantRanking";
import RecruiterAnalytics from "./pages/RecruiterAnalytics";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="app-container">
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Common Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Candidate Only Routes */}
                        <Route
                            path="/resume"
                            element={
                                <ProtectedRoute allowedRoles={["candidate"]}>
                                    <ResumeUpload />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/jobs"
                            element={
                                <ProtectedRoute allowedRoles={["candidate"]}>
                                    <JobSearch />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/applications"
                            element={
                                <ProtectedRoute allowedRoles={["candidate"]}>
                                    <MyApplications />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/interview-prep/:jobId"
                            element={
                                <ProtectedRoute allowedRoles={["candidate"]}>
                                    <InterviewPrep />
                                </ProtectedRoute>
                            }
                        />

                        {/* Recruiter Only Routes */}
                        <Route
                            path="/manage-jobs"
                            element={
                                <ProtectedRoute allowedRoles={["recruiter"]}>
                                    <ManageJobs />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/rankings"
                            element={
                                <ProtectedRoute allowedRoles={["recruiter"]}>
                                    <ApplicantRanking />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute allowedRoles={["recruiter"]}>
                                    <RecruiterAnalytics />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;