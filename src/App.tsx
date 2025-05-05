
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "./components/MainLayout";
import TasksPage from "./pages/TasksPage";
import AchievementsPage from "./pages/AchievementsPage";
import ThoughtsPage from "./pages/ThoughtsPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<TasksPage />} />
          <Route path="/facanhas" element={<AchievementsPage />} />
          <Route path="/pensamentos" element={<ThoughtsPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
