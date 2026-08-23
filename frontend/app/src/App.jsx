import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useApp } from "./context/AppContext";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import AllDocuments from "./pages/AllDocs";
import SearchDocuments from "./pages/Search";
import SavedItems from "./pages/SavedDocs";
import DocumentWorkspace from "./pages/DocWorkSpace";
import MultiDocumentAnalysis from "./pages/MultiDocumentAnalysis";
import LandingPage from "./pages/Landing";
import ProfilePage from "./pages/Profile";
function App() {
  const { toast } = useApp();

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
              <LandingPage />
          } 
        />

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

        <Route 
          path="/document/:id" 
          element={
            <Layout>
              <DocumentWorkspace/>
            </Layout>
          }/>

        <Route
          path="/multi-document-analysis"
          element={
            <Layout>
              <MultiDocumentAnalysis/>
            </Layout>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>   
      
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50 ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.message}
        </div>
      )}
    </>
  );
}

export default App;