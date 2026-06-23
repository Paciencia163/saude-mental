import { Heart, LogIn, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          {/* Angola flag */}
          <span
            className="inline-flex h-5 w-7 overflow-hidden rounded-sm border border-border shadow-sm"
            aria-label="Bandeira de Angola"
            title="Angola"
          >
            <span className="flex-1 bg-[#CE1126]" />
            <span className="flex-1 bg-[#000000]" />
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-lg font-bold text-foreground">
            MenteSã <span className="text-primary">Angola</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {[
            { path: "/", label: "Início" },
            { path: "/avaliacao", label: "Avaliação" },
            { path: "/medicos", label: "Médicos" },
            { path: "/sobre", label: "Sobre" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <Link
              to="/dashboard"
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Painel
            </Link>
          ) : (
            <Link
              to="/login"
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
