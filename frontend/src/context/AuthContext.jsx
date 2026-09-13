import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = useCallback(async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await api.get("/auth/me");
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem("access_token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    const login = async (accessToken) => {
        localStorage.setItem("access_token", accessToken);
        setLoading(true);
        await fetchCurrentUser();
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    };

    const updateUserState = (updatedUser) => {
        setUser(updatedUser);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        fetchCurrentUser,
        updateUserState,
        isCandidate: user?.role === "candidate",
        isRecruiter: user?.role === "recruiter",
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
