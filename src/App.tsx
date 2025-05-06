
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "./components/MainLayout";
import TasksPage from "./pages/TasksPage";
import AchievementsPage from "./pages/AchievementsPage";
import ThoughtsPage from "./pages/ThoughtsPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute } from "./auth/ProtectedRoute";

// Create a client with increased staleTime and retry logic for better data handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

const App = () => (
  <HashRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<TasksPage />} />
            <Route path="/facanhas" element={<AchievementsPage />} />
            <Route path="/pensamentos" element={<ThoughtsPage />} />
            <Route path="/configuracoes" element={<ConfiguracoesPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  </HashRouter>
);

export default App;
