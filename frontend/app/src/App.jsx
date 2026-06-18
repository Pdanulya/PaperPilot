import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import AllDocuments from "./pages/AllDocs";
import SearchDocuments from "./pages/Search";
import SavedItems from "./pages/SavedDocs";

function App() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      <Route
        path="/documents"
        element={
          <Layout>
            <Documents />
          </Layout>
        }
      />

      <Route 
        path="/upload" 
        element={
          <Layout>
            <Upload/>
          </Layout>
        }/>

      <Route 
        path="/alldocs" 
        element={
          <Layout>
            <AllDocuments/>
          </Layout>
        }/>

      <Route 
        path="/search" 
        element={
          <Layout>
            <SearchDocuments/>
          </Layout>
        }/>

      <Route 
        path="/saved" 
        element={
          <Layout>
            <SavedItems/>
          </Layout>
        }/>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;