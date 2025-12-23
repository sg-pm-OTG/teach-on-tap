import { useState, useEffect, useCallback } from "react";
import { User, Session, type PostgrestSingleResponse } from "@supabase/supabase-js";
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
    const withTimeout = async <T,>(
      promiseLike: PromiseLike<T>,
      ms: number
    ): Promise<T> => {
      return await Promise.race([
        Promise.resolve(promiseLike),
        new Promise<T>((_, reject) => {
          window.setTimeout(() => reject(new Error("Request timed out")), ms);
        }),
      ]);
    };

    try {
      const { data, error } = await withTimeout<PostgrestSingleResponse<boolean>>(
        supabase.rpc("is_admin", { _user_id: userId }),
        7000
      );

      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      return data === true;
    } catch (error) {
      console.error("Error in checkAdminStatus:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const loadingTimeoutId = window.setTimeout(() => {
      if (isMounted) {
        setState((prev) => {
          if (!prev.loading) return prev;
          console.warn("Admin auth loading timed out; forcing loading=false");
          return { ...prev, loading: false };
        });
      }
    }, 8000);

    const safeSetState = (next: AdminAuthState) => {
      if (isMounted) {
        window.clearTimeout(loadingTimeoutId);
        setState(next);
      }
    };

    // Helper function to handle admin check - called via setTimeout to avoid deadlock
    const handleAdminCheck = (session: Session) => {
      checkAdminStatus(session.user.id)
        .then((isAdmin) => {
          safeSetState({
            user: session.user,
            session,
            isAdmin,
            loading: false,
          });
        })
        .catch((error) => {
          console.error("Error checking admin status:", error);
          safeSetState({
            user: session.user,
            session,
            isAdmin: false,
            loading: false,
          });
        });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // CRITICAL: Do NOT use async callback here - causes deadlocks
      // Synchronous state update first, then defer Supabase calls
      if (session?.user) {
        // Set intermediate state immediately (keeps loading true until admin check completes)
        setState((prev) => ({
          ...prev,
          user: session.user,
          session,
        }));
        
        // Defer admin check with setTimeout(0) to avoid Supabase deadlock
        setTimeout(() => handleAdminCheck(session), 0);
      } else {
        safeSetState({
          user: null,
          session: null,
          isAdmin: false,
          loading: false,
        });
      }
    });

    // Check existing session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          // Set intermediate state
          setState((prev) => ({
            ...prev,
            user: session.user,
            session,
          }));
          
          // Defer admin check
          setTimeout(() => handleAdminCheck(session), 0);
        } else {
          safeSetState({
            user: null,
            session: null,
            isAdmin: false,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.error("Error getting session:", error);
        safeSetState({
          user: null,
          session: null,
          isAdmin: false,
          loading: false,
        });
      });

    return () => {
      isMounted = false;
      window.clearTimeout(loadingTimeoutId);
      subscription.unsubscribe();
    };
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
