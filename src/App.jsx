import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FirebaseTest from './components/FirebaseTest'
import AuthStatus from './components/AuthStatus'

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
        </Routes>
      </div>
    </Router>
  )
}

export default App
