import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { Home } from './pages/Home'
import { PostDetail } from './pages/PostDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import { CreatePost } from './pages/CreatePost'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-dark-800">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/posts/new" element={<CreatePost />} />
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
