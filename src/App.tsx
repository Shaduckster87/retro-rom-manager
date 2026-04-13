import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RetroLayout } from "@/components/RetroLayout";
import { BootScreen } from "@/components/BootScreen";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import LibraryPage from "./pages/LibraryPage";
import RomDetailsPage from "./pages/RomDetailsPage";
import DuplicatesPage from "./pages/DuplicatesPage";
import ReviewPage from "./pages/ReviewPage";
import ConsolesPage from "./pages/ConsolesPage";
import ExplorerPage from "./pages/ExplorerPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AuthenticatedApp() {
  const [booted, setBooted] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-pixel text-[10px] text-primary animate-blink">INITIALIZING...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      {booted && (
        <BrowserRouter>
          <RetroLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/rom/:id" element={<RomDetailsPage />} />
              <Route path="/duplicates" element={<DuplicatesPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/consoles" element={<ConsolesPage />} />
              <Route path="/explorer" element={<ExplorerPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RetroLayout>
        </BrowserRouter>
      )}
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <AuthenticatedApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
