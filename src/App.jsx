import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-dark-800">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
