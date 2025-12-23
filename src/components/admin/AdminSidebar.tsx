import { NavLink } from "react-router-dom";
import { Users, Shield, LogOut } from "lucide-react";
import { useAdminAuthContext } from "./AdminAuthProvider";
import { Button } from "@/components/ui/button";
import alcLogo from "@/assets/alc-logo.png";

const navItems = [
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/staff", icon: Shield, label: "Staff" },
];

export const AdminSidebar = () => {
  const { signOut, user } = useAdminAuthContext();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <img src={alcLogo} alt="Adult Learning Collaboratory" className="h-10" />
        <h1 className="text-xl font-bold text-foreground mt-2">FOP Companion</h1>
        <p className="text-sm text-muted-foreground">Admin Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-sm text-muted-foreground mb-3 truncate">
          {user?.email}
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};
