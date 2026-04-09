import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Mini Blog</h1>
        <Routes>
          <Route path="/" element={<div>Home Page - Em construção</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
