import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Empêche un utilisateur déjà connecté de retourner sur les pages de connexion/inscription.
function GuestRoute({ children }) {
    const { user } = useAuth()

    if (user) {
        return <Navigate to="/profile" replace />
    }

    return children
}

export default GuestRoute
