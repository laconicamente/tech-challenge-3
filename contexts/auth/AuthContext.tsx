import { createContext, ReactNode, useContext, useState } from "react"

interface User {
    email: string
    password: string
}

interface IAuthContext {
    user: User | null
    users: User[]
    login: (email: string, password: string) => boolean
    signUp: (email: string, password: string) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const login = (email: string, password: string) => {
        const foundUser = users.find(u => u.email === email && u.password === password)
        if (foundUser) {
            setUser(user)
            setIsAuthenticated(true)
            console.log('AuthProvider :: login - usuário logado com sucesso')
            return true
        } 
        console.log('AuthProvider :: login - usuário não encontrado')
        return false
    }

    const signUp = (email: string, password: string) => {
        setUsers([...users, { email, password }])
        console.log('AuthProvider :: signUp - usuário cadastrado com sucesso')
    }

    const logout = () => {
        console.log('AuthProvider :: logout - usuário deslogado com sucesso')
        setUser(null)
        setIsAuthenticated(false)
    }

    return <AuthContext.Provider value={{
        user,
        users,
        login,
        signUp,
        logout,
        isAuthenticated
    }}> 
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('contexto não encontado, useAuth deve estar dentro de AuthProvider')
    }
    return context
}