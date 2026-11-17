import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Protège une route : redirige vers /login si personne n'est connecté,
// en mémorisant la page visée pour y revenir après connexion.
function ProtectedRoute({ children }) {
    const { user } = useAuth()
    const location = useLocation()

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute
