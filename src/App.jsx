import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import FirebaseTest from './components/FirebaseTest'
import AuthStatus from './components/AuthStatus'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="space-y-4 p-4 max-w-7xl mx-auto">
          <AuthStatus />
          <FirebaseTest />
        </div>

        <Routes>
          <Route path="/" element={<div className="max-w-7xl mx-auto p-4">Home Page - Em construção</div>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
