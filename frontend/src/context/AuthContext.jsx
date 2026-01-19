import {createContext,useContext,useEffect,useState } from "react";
import { API_BASE_URL } from "../config/env";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        if (token){
            setUser({})
        }
        setLoading(false)
    }, [token])
    
    const login = async (email, password) => {
        const url = `${API_BASE_URL}/auth/login`
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        }
        const response = await fetch(url, options)
        if (!response.ok){
            throw new Error("Login Failed")
        }

        const data = await response.json()
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token)
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
    }
    return (
        <AuthContext.Provider value={{user, token, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)