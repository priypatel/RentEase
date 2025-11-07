import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes,Route, BrowserRouter } from 'react-router-dom'
import Register from './Pages/Register'
import "./index.css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
      {/* //  <Route path="/" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
