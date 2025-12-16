import { createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuthContext must be used within an AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAdminAuth();

  return (
    <AdminAuthContext.Provider value={auth}>
      {children}
    </AdminAuthContext.Provider>
  );
};
