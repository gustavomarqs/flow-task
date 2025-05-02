
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "./components/MainLayout";
import TasksPage from "./pages/TasksPage";
import AchievementsPage from "./pages/AchievementsPage";
import ThoughtsPage from "./pages/ThoughtsPage";
import NotFound from "./pages/NotFound";

// Add UUID dependency
<lov-add-dependency>uuid@latest</lov-add-dependency>
<lov-add-dependency>@types/uuid@latest</lov-add-dependency>

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<TasksPage />} />
          <Route path="/facanhas" element={<AchievementsPage />} />
          <Route path="/pensamentos" element={<ThoughtsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster />
  </QueryClientProvider>
);

export default App;
