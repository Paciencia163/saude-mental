import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import loginHero from "@/assets/login-hero.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email ou palavra-passe incorretos" : error.message);
    } else {
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={loginHero} alt="Saúde mental e bem-estar" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/40 flex items-end p-10">
          <div className="text-primary-foreground">
            <h2 className="text-3xl font-extrabold mb-2">Cuide da sua mente</h2>
            <p className="text-lg opacity-90">A sua saúde mental é tão importante quanto a física. Faça a sua avaliação hoje.</p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-foreground">
              MenteSã <span className="text-primary">Angola</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Bem-vindo(a) de volta</h1>
          <p className="text-muted-foreground mb-8">Entre na sua conta para continuar</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Palavra-passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "A entrar..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/registar" className="font-bold text-primary hover:underline">
              Registe-se aqui
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
            <p className="font-bold text-foreground mb-2">🔑 Contas de demonstração</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">Paciente:</span>{" "}
                <code className="font-mono">paciente@mentesa.ao</code> / <code className="font-mono">paciente123</code>
              </li>
              <li>
                <span className="font-semibold text-foreground">Profissional:</span>{" "}
                <code className="font-mono">profissional@mentesa.ao</code> / <code className="font-mono">profissional123</code>
              </li>
              <li>
                <span className="font-semibold text-foreground">Administrador:</span>{" "}
                <code className="font-mono">admin@mentesa.ao</code> / <code className="font-mono">admin123</code>
              </li>
            </ul>
            <p className="mt-3 text-[11px]">
              🔒 Acesso de admin também disponível em{" "}
              <Link to="/area-restrita" className="font-bold text-primary hover:underline">
                /area-restrita
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
