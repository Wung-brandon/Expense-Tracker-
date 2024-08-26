import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
// import { useAuth } from "../customerHooks/AuthHook";

interface ProtectedRouteProp{
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProp> = ({ children}) => {
    const {user} = useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute