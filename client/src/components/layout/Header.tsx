import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { UserCircle, Menu } from "lucide-react";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const isAuthenticated = !!user;

  return (
    <header className="bg-white border-b border-neutral-200 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <a className="text-primary font-bold text-2xl">JobSwipe</a>
        </Link>
      </div>
      
      <div className="hidden md:flex gap-6">
        <Link href="/">
          <a className={`px-3 py-2 ${location === '/' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-primary'}`}>
            Home
          </a>
        </Link>
        {isAuthenticated && (
          <>
            <Link href="/swipe">
              <a className={`px-3 py-2 ${location === '/swipe' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-primary'}`}>
                Swipe
              </a>
            </Link>
            <Link href="/matches">
              <a className={`px-3 py-2 ${location === '/matches' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-primary'}`}>
                Matches
              </a>
            </Link>
            <Link href="/resume">
              <a className={`px-3 py-2 ${location === '/resume' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-primary'}`}>
                Resume
              </a>
            </Link>
            <Link href="/profile">
              <a className={`px-3 py-2 ${location === '/profile' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-primary'}`}>
                Profile
              </a>
            </Link>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          className="md:hidden focus:outline-none" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-6 h-6 text-neutral-900" />
        </button>

        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-primary" />
              <span className="font-medium">
                {user.firstName || user.username}
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth">
              <Button variant="outline">Sign Up</Button>
            </Link>
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
