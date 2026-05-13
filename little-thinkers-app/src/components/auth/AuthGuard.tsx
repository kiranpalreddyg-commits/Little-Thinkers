import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireChildProfile?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireChildProfile = false
}) => {
  const { isAuthenticated, childProfile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (requireChildProfile && !childProfile) {
        router.push('/profile-select');
        return;
      }
    }
  }, [isAuthenticated, childProfile, isLoading, requireChildProfile, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if not authenticated or missing required profile
  if (!isAuthenticated || (requireChildProfile && !childProfile)) {
    return null;
  }

  return <>{children}</>;
};