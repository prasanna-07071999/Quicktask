import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import './App.css'
import Home from "./pages/Home"
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Task from './pages/Task'
import FinishedTasks from "./pages/FinishedTasks"
import ProtectedRoute from "./components/ProtectedRoute"
import Profile from "./pages/Profile"

const App = () => {
  return (
     <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/tasks" element={<ProtectedRoute><Task /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute> }/>
        <Route path="/finished" element={<ProtectedRoute> <FinishedTasks /> </ProtectedRoute> }/>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  )
}

export default App



