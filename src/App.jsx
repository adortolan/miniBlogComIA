import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FirebaseTest from './components/FirebaseTest'
import AuthStatus from './components/AuthStatus'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Mini Blog</h1>
        <div className="space-y-4 p-4">
          <AuthStatus />
          <FirebaseTest />
        </div>
        <Routes>
          <Route path="/" element={<div>Home Page - Em construção</div>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
