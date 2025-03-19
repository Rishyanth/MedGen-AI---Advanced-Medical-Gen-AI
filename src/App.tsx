import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./components/home";
import routes from "tempo-routes";
import MainNavbar from "./components/layout/MainNavbar";

// Import new pages
import DrugDiscovery from "./pages/DrugDiscovery";
import Settings from "./pages/Settings";
import Chatbot from "./pages/Chatbot";
import DiagnosisPage from "./pages/DiagnosisPage";
import ImageAnalysisPage from "./pages/ImageAnalysisPage";
import DatasetGenerationPage from "./pages/DatasetGenerationPage";
import ReportsPage from "./pages/ReportsPage";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            Loading...
          </div>
        }
      >
        <>
          {/* Allow Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

          {/* Global Navigation */}
          <MainNavbar />

          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Add routes for other features */}
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="diagnosis" element={<DiagnosisPage />} />
              <Route path="image-analysis" element={<ImageAnalysisPage />} />
              <Route
                path="dataset-generation"
                element={<DatasetGenerationPage />}
              />
              <Route path="drug-discovery" element={<DrugDiscovery />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reports" element={<ReportsPage />} />

              {/* Allow Tempo routes */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
