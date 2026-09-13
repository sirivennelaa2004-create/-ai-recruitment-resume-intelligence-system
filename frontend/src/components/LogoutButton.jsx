import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutButton;