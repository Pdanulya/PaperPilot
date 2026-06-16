import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/documents" element={<Documents />} />
      </Routes>
    </>
  );
}

export default App;