import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Home, User, Search, MessageSquare, FileText, LogIn } from "lucide-react";

const MobileNav = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <nav className="md:hidden bg-white border-t border-neutral-200 py-2 px-4">
      <div className="flex justify-around">
        <Link href="/">
          <a className="flex flex-col items-center p-2">
            <Home className={`w-5 h-5 ${location === '/' ? 'text-primary' : 'text-neutral-500'}`} />
            <span className={`text-xs mt-1 ${location === '/' ? 'text-primary font-medium' : 'text-neutral-500'}`}>
              Home
            </span>
          </a>
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link href="/swipe">
              <a className="flex flex-col items-center p-2">
                <Search className={`w-5 h-5 ${location === '/swipe' ? 'text-primary' : 'text-neutral-500'}`} />
                <span className={`text-xs mt-1 ${location === '/swipe' ? 'text-primary font-medium' : 'text-neutral-500'}`}>
                  Swipe
                </span>
              </a>
            </Link>
            
            <Link href="/matches">
              <a className="flex flex-col items-center p-2">
                <MessageSquare className={`w-5 h-5 ${location === '/matches' ? 'text-primary' : 'text-neutral-500'}`} />
                <span className={`text-xs mt-1 ${location === '/matches' ? 'text-primary font-medium' : 'text-neutral-500'}`}>
                  Matches
                </span>
              </a>
            </Link>
            
            <Link href="/resume">
              <a className="flex flex-col items-center p-2">
                <FileText className={`w-5 h-5 ${location === '/resume' ? 'text-primary' : 'text-neutral-500'}`} />
                <span className={`text-xs mt-1 ${location === '/resume' ? 'text-primary font-medium' : 'text-neutral-500'}`}>
                  Resume
                </span>
              </a>
            </Link>
            
            <Link href="/profile">
              <a className="flex flex-col items-center p-2">
                <User className={`w-5 h-5 ${location === '/profile' ? 'text-primary' : 'text-neutral-500'}`} />
                <span className={`text-xs mt-1 ${location === '/profile' ? 'text-primary font-medium' : 'text-neutral-500'}`}>
                  Profile
                </span>
              </a>
            </Link>
          </>
        ) : (
          <Link href="/auth">
            <a className="flex flex-col items-center p-2">
              <LogIn className={`w-5 h-5 ${location === '/auth' ? 'text-primary' : 'text-neutral-500'}`} />
              <span className={`text-xs mt-1 ${location === '/auth' ? 'text-primary font-medium' : 'text-neutral-500'}`}>
                Sign In
              </span>
            </a>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default MobileNav;
