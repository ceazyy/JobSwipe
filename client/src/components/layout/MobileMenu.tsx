import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { user, logoutMutation } = useAuth();
  const isAuthenticated = !!user;

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white w-full absolute z-50 border-b border-neutral-200 shadow-lg">
      <div className="flex flex-col p-4 space-y-3">
        <Link href="/">
          <a className="text-neutral-900 hover:text-primary px-3 py-2" onClick={onClose}>
            Home
          </a>
        </Link>

        {isAuthenticated ? (
          <>
            <Link href="/swipe">
              <a className="text-neutral-900 hover:text-primary px-3 py-2" onClick={onClose}>
                Swipe
              </a>
            </Link>
            <Link href="/matches">
              <a className="text-neutral-900 hover:text-primary px-3 py-2" onClick={onClose}>
                Matches
              </a>
            </Link>
            <Link href="/resume">
              <a className="text-neutral-900 hover:text-primary px-3 py-2" onClick={onClose}>
                Resume
              </a>
            </Link>
            <Link href="/profile">
              <a className="text-neutral-900 hover:text-primary px-3 py-2" onClick={onClose}>
                Profile
              </a>
            </Link>
            
            {/* User info */}
            <div className="flex items-center gap-2 px-3 py-2 border-t border-neutral-200 mt-2 pt-4">
              <UserCircle className="w-6 h-6 text-primary" />
              <span className="font-medium">
                {user.firstName || user.username}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                logoutMutation.mutate();
                onClose();
              }}
              disabled={logoutMutation.isPending}
              className="mt-2"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth">
              <a onClick={onClose}>
                <Button variant="outline" className="w-full mt-2">
                  Sign Up
                </Button>
              </a>
            </Link>
            <Link href="/auth">
              <a onClick={onClose}>
                <Button className="w-full">
                  Sign In
                </Button>
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
