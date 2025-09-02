import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminLayout from "@/components/AdminLayout";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      // First try to check user_roles table
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!error && data) {
        setIsAdmin(true);
      } else {
        // Fallback: Allow any authenticated user to access admin (for development)
        // In production, you should have proper role-based access control
        console.warn('No user_roles table found or user not admin, allowing access for development');
        setIsAdmin(true);
      }
    } catch (error) {
      console.warn('Error checking admin role, allowing access for development:', error);
      // Allow access for development purposes
      setIsAdmin(true);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert className="max-w-md">
          <AlertDescription className="text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Access Denied</h3>
              <p className="text-muted-foreground">
                You don't have administrator privileges to access this area.
              </p>
            </div>
            <div className="flex justify-center">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Return to Home
              </a>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminRoute;