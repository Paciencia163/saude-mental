import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminAccess = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [gateKey, setGateKey] = useState("");

  useEffect(() => {
    document.title = "Área Restrita | MenteSã";
  }, []);

  const checkGate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple gate to keep the URL undiscoverable to casual visitors.
    if (gateKey.trim().toLowerCase() === "mentesa-admin") {
      setUnlocked(true);
    } else {
      toast.error("Chave de acesso inválida");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Preencha todos os campos");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setLoading(false);
      return toast.error("Credenciais inválidas");
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const isAdmin = roles?.some((r) => r.role === "admin");
    setLoading(false);
    if (!isAdmin) {
      await supabase.auth.signOut();
      return toast.error("Esta conta não tem permissões de administrador");
    }
    toast.success("Acesso concedido");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-primary/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-primary/30 bg-background/95 backdrop-blur p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold">Área Restrita</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Acesso exclusivo a administradores autorizados.
          </p>
        </div>

        {!unlocked ? (
          <form onSubmit={checkGate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1">
                <Lock className="h-4 w-4" /> Chave de acesso
              </label>
              <input
                type="password"
                value={gateKey}
                onChange={(e) => setGateKey(e.target.value)}
                placeholder="Insira a chave fornecida"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground hover:opacity-90">
              Desbloquear
            </button>
            <p className="text-xs text-center text-muted-foreground">
              💡 Chave demo: <code className="font-mono bg-muted px-1.5 py-0.5 rounded">mentesa-admin</code>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mentesa.ao"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Palavra-passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "A validar..." : "Entrar como Admin"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminAccess;
