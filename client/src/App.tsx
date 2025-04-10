import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Swipe from "@/pages/Swipe";
import Matches from "@/pages/Matches";
import Resume from "@/pages/Resume";
import Profile from "@/pages/Profile";
import AuthPage from "@/pages/auth-page";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import MobileMenu from "@/components/layout/MobileMenu";
import { useState } from "react";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="h-screen flex flex-col">
          <Header toggleMobileMenu={toggleMobileMenu} />
          <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
          
          <main className="flex-1 overflow-y-auto">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/auth" component={AuthPage} />
              <ProtectedRoute path="/swipe" component={Swipe} />
              <ProtectedRoute path="/matches" component={Matches} />
              <ProtectedRoute path="/resume" component={Resume} />
              <ProtectedRoute path="/profile" component={Profile} />
              <Route component={NotFound} />
            </Switch>
          </main>
          
          <MobileNav />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
