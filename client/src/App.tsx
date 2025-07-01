
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Hero from "./page/Hero"
import { Dashboard } from "./page/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
