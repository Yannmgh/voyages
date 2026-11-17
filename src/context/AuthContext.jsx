/* eslint-disable react-refresh/only-export-components -- fichier de contexte : Provider + hook useAuth */
import { createContext, useCallback, useContext, useEffect, useState } from "react"

// Deux systèmes d'authentification coexistent ici, volontairement :
// - register() crée un compte "démo" stocké en local (localStorage, mot de passe hashé
//   via Web Crypto). Ce compte est purement pédagogique : il NE PERMET PAS de se
//   connecter, car login() ci-dessous appelle la vraie API DummyJSON, qui ne reconnaît
//   que ses propres comptes de test (https://dummyjson.com/docs/auth).
// - login() appelle POST https://dummyjson.com/auth/login. Utilisez un compte de test
//   DummyJSON, par exemple username "emilys" / password "emilyspass".

const AuthContext = createContext(null)

const USERS_KEY = "voyages_users"
const SESSION_KEY = "voyages_session"

async function hashPassword(password) {
    const data = new TextEncoder().encode(password)
    const digest = await crypto.subtle.digest("SHA-256", data)

    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
}

function readUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) ?? []
    } catch {
        return []
    }
}

function writeUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY))
    } catch {
        return null
    }
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(() => readSession())

    useEffect(() => {
        if (session) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        } else {
            localStorage.removeItem(SESSION_KEY)
        }
    }, [session])

    const register = useCallback(async ({ username, password, email, firstname, lastname, gender, avatar }) => {
        const users = readUsers()
        const normalizedEmail = email.trim().toLowerCase()
        const normalizedUsername = username.trim()

        if (users.some((existing) => existing.email === normalizedEmail)) {
            throw new Error("Un compte existe déjà avec cet email")
        }

        if (users.some((existing) => existing.username.toLowerCase() === normalizedUsername.toLowerCase())) {
            throw new Error("Ce nom d'utilisateur est déjà utilisé")
        }

        const passwordHash = await hashPassword(password)
        const newUser = {
            id: Date.now(),
            username: normalizedUsername,
            email: normalizedEmail,
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            gender: gender?.trim() || "",
            avatar: avatar?.trim() || "",
            passwordHash,
        }

        writeUsers([...users, newUser])

        return { username: newUser.username }
    }, [])

    const login = useCallback(async ({ username, password }) => {
        const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, expiresInMins: 30 }),
        })

        if (!response.ok) {
            throw new Error("Nom d'utilisateur ou mot de passe incorrect")
        }

        const data = await response.json()
        const publicUser = {
            id: data.id,
            username: data.username,
            email: data.email,
            firstname: data.firstName,
            lastname: data.lastName,
            gender: data.gender,
            avatar: data.image,
        }

        setSession({ user: publicUser, accessToken: data.accessToken })

        return publicUser
    }, [])

    const logout = useCallback(() => {
        setSession(null)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user: session?.user ?? null,
                accessToken: session?.accessToken ?? null,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
    }

    return context
}
