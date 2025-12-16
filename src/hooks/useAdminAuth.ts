import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    session: null,
    isAdmin: false,
    loading: true,
  });

  const checkAdminStatus = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('is_admin', { _user_id: userId });
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      return data === true;
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const isAdmin = await checkAdminStatus(session.user.id);
          setState({
            user: session.user,
            session,
            isAdmin,
            loading: false,
          });
        } else {
          setState({
            user: null,
            session: null,
            isAdmin: false,
            loading: false,
          });
        }
      }
    );

    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const isAdmin = await checkAdminStatus(session.user.id);
        setState({
          user: session.user,
          session,
          isAdmin,
          loading: false,
        });
      } else {
        setState({
          user: null,
          session: null,
          isAdmin: false,
          loading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminStatus]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { error };
    }

    if (data.user) {
      const isAdmin = await checkAdminStatus(data.user.id);
      if (!isAdmin) {
        await supabase.auth.signOut();
        return { error: { message: 'Access denied. Admin privileges required.' } };
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    ...state,
    signIn,
    signOut,
  };
};
