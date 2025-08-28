import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if user profile exists, if not create one
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single();

          if (!existingProfile) {
            // Create user profile if it doesn't exist
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  user_id: session.user.id,
                  email: session.user.email,
                  display_name: null,
                  phone: null,
                  login_method: 'email',
                  last_login_at: new Date().toISOString()
                }
              ]);

            if (profileError) {
              console.error('Error creating user profile:', profileError);
            }

            // Assign default user role if not exists
            const { data: existingRole } = await supabase
              .from('user_roles')
              .select('user_id')
              .eq('user_id', session.user.id)
              .single();

            if (!existingRole) {
              const { error: roleError } = await supabase
                .from('user_roles')
                .insert([
                  {
                    user_id: session.user.id,
                    role: 'user'
                  }
                ]);

              if (roleError) {
                console.error('Error assigning user role:', roleError);
              }
            }
          } else {
            // Update last login time
            await supabase
              .from('profiles')
              .update({ last_login_at: new Date().toISOString() })
              .eq('user_id', session.user.id);
          }

          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/auth?tab=signin`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          email: email
        }
      }
    });
    
    if (!error && data.user) {
      // Create user profile in the database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: data.user.id,
            email: email,
            display_name: null,
            phone: null,
            login_method: 'email',
            last_login_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }

      // Assign default user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: data.user.id,
            role: 'user'
          }
        ]);

      if (roleError) {
        console.error('Error assigning user role:', roleError);
      }

      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link to complete your registration. Please check your inbox and spam folder.",
      });
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}