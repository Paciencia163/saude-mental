import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Users,
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Shield,
  ArrowLeft,
  Search,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Tab = "doctors" | "assessments" | "users";
type AppRole = "patient" | "professional" | "admin";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  province: string;
  city: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  available: boolean;
}

const emptyDoctor: Omit<Doctor, "id"> = {
  name: "",
  specialty: "",
  province: "Luanda",
  city: "",
  phone: "",
  email: "",
  bio: "",
  available: true,
};

const Admin = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("doctors");

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      toast({ title: "Acesso restrito", description: "Apenas administradores." });
      navigate("/dashboard");
    }
  }, [user, role, loading, navigate]);

  if (loading || !user || role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">A carregar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="rounded-lg p-2 hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">Painel do Administrador</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-border">
          {[
            { id: "doctors" as Tab, label: "Médicos", icon: Stethoscope },
            { id: "assessments" as Tab, label: "Avaliações", icon: ClipboardList },
            { id: "users" as Tab, label: "Utilizadores & Papéis", icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "doctors" && <DoctorsManager />}
        {tab === "assessments" && <AssessmentsManager />}
        {tab === "users" && <UsersManager />}
      </div>
    </div>
  );
};

/* ---------------- DOCTORS ---------------- */
const DoctorsManager = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyDoctor);
  const [search, setSearch] = useState("");

  const load = async () => {
    const { data } = await supabase.from("doctors").select("*").order("created_at", { ascending: false });
    if (data) setDoctors(data as Doctor[]);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyDoctor);
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (d: Doctor) => {
    setForm({ ...d });
    setEditing(d);
    setCreating(true);
  };

  const save = async () => {
    if (!form.name || !form.specialty || !form.province) {
      toast({ title: "Preencha nome, especialidade e província", variant: "destructive" });
      return;
    }
    if (editing) {
      const { error } = await supabase.from("doctors").update(form).eq("id", editing.id);
      if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
      toast({ title: "Médico atualizado" });
    } else {
      const { error } = await supabase.from("doctors").insert(form);
      if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
      toast({ title: "Médico adicionado" });
    }
    setCreating(false);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este médico?")) return;
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Médico removido" });
    load();
  };

  const toggleAvail = async (d: Doctor) => {
    await supabase.from("doctors").update({ available: !d.available }).eq("id", d.id);
    load();
  };

  const filtered = doctors.filter((d) =>
    !search ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase()) ||
    d.province.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar médicos..."
            className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm"
          />
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Novo Médico
        </button>
      </div>

      {creating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-primary/30 bg-card p-5"
        >
          <h3 className="mb-4 font-bold">{editing ? "Editar Médico" : "Novo Médico"}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Nome *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Especialidade *" value={form.specialty} onChange={(v) => setForm({ ...form, specialty: v })} />
            <Field label="Província *" value={form.province} onChange={(v) => setForm({ ...form, province: v })} />
            <Field label="Cidade" value={form.city ?? ""} onChange={(v) => setForm({ ...form, city: v })} />
            <Field label="Telefone" value={form.phone ?? ""} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="E-mail" value={form.email ?? ""} onChange={(v) => setForm({ ...form, email: v })} />
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Biografia</label>
              <textarea
                value={form.bio ?? ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
              />
              Disponível para consultas
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              Guardar
            </button>
            <button
              onClick={() => { setCreating(false); setEditing(null); }}
              className="rounded-lg border border-border px-4 py-2 text-sm"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      )}

      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Especialidade</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Província</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Contacto</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Estado</th>
              <th className="px-4 py-3 text-right text-sm font-bold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Sem médicos.</td></tr>
            ) : filtered.map((d) => (
              <tr key={d.id} className="border-t border-border hover:bg-accent/30">
                <td className="px-4 py-3 text-sm font-medium">{d.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{d.specialty}</td>
                <td className="px-4 py-3 text-sm">{d.city ? `${d.city}, ` : ""}{d.province}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {d.phone || d.email || "—"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => toggleAvail(d)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      d.available ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d.available ? "Disponível" : "Inativo"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button onClick={() => openEdit(d)} className="rounded-lg p-2 hover:bg-accent" title="Editar">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(d.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10" title="Remover">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ---------------- ASSESSMENTS ---------------- */
const AssessmentsManager = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data: a } = await supabase
        .from("assessments")
        .select("*")
        .order("created_at", { ascending: false });
      const { data: p } = await supabase.from("profiles").select("user_id, full_name, email");
      const map: Record<string, any> = {};
      (p ?? []).forEach((x: any) => { map[x.user_id] = x; });
      setProfiles(map);
      setRows(a ?? []);
    })();
  }, []);

  const downloadPDF = (a: any) => {
    import("@/lib/generatePDF").then(({ generateReport }) => {
      generateReport({
        userName: profiles[a.user_id]?.full_name || "Paciente",
        date: new Date(a.created_at).toLocaleDateString("pt-AO"),
        phq9Answers: a.phq9_answers,
        gad7Answers: a.gad7_answers,
      });
    });
  };

  const filtered = rows.filter((a) => {
    if (!search) return true;
    const name = profiles[a.user_id]?.full_name?.toLowerCase() || "";
    const email = profiles[a.user_id]?.email?.toLowerCase() || "";
    const s = search.toLowerCase();
    return name.includes(s) || email.includes(s);
  });

  return (
    <div>
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar paciente..."
          className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm"
        />
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold">Data</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Paciente</th>
              <th className="px-4 py-3 text-left text-sm font-bold">PHQ-9</th>
              <th className="px-4 py-3 text-left text-sm font-bold">GAD-7</th>
              <th className="px-4 py-3 text-right text-sm font-bold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Sem avaliações.</td></tr>
            ) : filtered.map((a) => (
              <tr key={a.id} className="border-t border-border hover:bg-accent/30">
                <td className="px-4 py-3 text-sm">{new Date(a.created_at).toLocaleDateString("pt-AO")}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">{profiles[a.user_id]?.full_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{profiles[a.user_id]?.email || ""}</div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="font-bold">{a.phq9_score}/27</span>{" "}
                  <span className="text-muted-foreground">({a.phq9_severity})</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="font-bold">{a.gad7_score}/21</span>{" "}
                  <span className="text-muted-foreground">({a.gad7_severity})</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => downloadPDF(a)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
                    ⬇ PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ---------------- USERS & ROLES ---------------- */
const UsersManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [rolesMap, setRolesMap] = useState<Record<string, AppRole[]>>({});
  const [search, setSearch] = useState("");

  const load = async () => {
    const { data: p } = await supabase.from("profiles").select("*").order("full_name");
    const { data: r } = await supabase.from("user_roles").select("user_id, role");
    const map: Record<string, AppRole[]> = {};
    (r ?? []).forEach((x: any) => {
      map[x.user_id] = [...(map[x.user_id] ?? []), x.role];
    });
    setRolesMap(map);
    setUsers(p ?? []);
  };

  useEffect(() => { load(); }, []);

  const setRole = async (userId: string, newRole: AppRole) => {
    const current = rolesMap[userId] ?? [];
    if (current.includes(newRole)) {
      toast({ title: "Já tem este papel" });
      return;
    }
    // Replace existing roles with the new single role
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Papel atualizado" });
    load();
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (u.full_name || "").toLowerCase().includes(s) ||
           (u.email || "").toLowerCase().includes(s) ||
           (u.username || "").toLowerCase().includes(s);
  });

  const roleBadge = (r: AppRole) => {
    const cls =
      r === "admin" ? "bg-primary text-primary-foreground" :
      r === "professional" ? "bg-blue-100 text-blue-700" :
      "bg-muted text-foreground";
    return <span key={r} className={`rounded-full px-2 py-0.5 text-xs font-bold ${cls}`}>{r}</span>;
  };

  return (
    <div>
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar utilizador..."
          className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm"
        />
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-bold">E-mail / Telefone</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Papel atual</th>
              <th className="px-4 py-3 text-right text-sm font-bold">Atribuir papel</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Sem utilizadores.</td></tr>
            ) : filtered.map((u) => (
              <tr key={u.id} className="border-t border-border hover:bg-accent/30">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">{u.full_name || "—"}</div>
                  {u.username && <div className="text-xs text-muted-foreground">@{u.username}</div>}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  <div>{u.email || "—"}</div>
                  <div className="text-xs">{u.phone || ""}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {(rolesMap[u.user_id] ?? []).map(roleBadge)}
                    {(rolesMap[u.user_id] ?? []).length === 0 && (
                      <span className="text-xs text-muted-foreground">sem papel</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    {(["patient", "professional", "admin"] as AppRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRole(u.user_id, r)}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        💡 Ao atribuir um papel, o anterior é substituído. Cada utilizador tem um único papel ativo.
      </p>
    </div>
  );
};

const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-xs font-semibold text-muted-foreground">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
    />
  </div>
);

export default Admin;
