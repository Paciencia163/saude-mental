import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, FileText, MessageCircle, LogOut, User, ClipboardList } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import EmotionalCheckin from "@/components/EmotionalCheckin";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Assessment {
  id: string;
  phq9_score: number;
  gad7_score: number;
  phq9_severity: string;
  gad7_severity: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile, role, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [showCheckin, setShowCheckin] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)
        .then(({ data }) => {
          if (data) setAssessments(data as Assessment[]);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-lg">A carregar...</div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.full_name || user.email || "Utilizador";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-lg font-bold text-foreground">
              MenteSã <span className="text-primary">Angola</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Olá, <strong className="text-foreground">{displayName}</strong>
            </span>
            {role === "patient" && (
              <Link to="/avaliacao" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                Nova Avaliação
              </Link>
            )}
            <button
              onClick={() => { signOut(); navigate("/"); }}
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Emotional Check-in */}
        {role === "patient" && showCheckin && (
          <div className="mb-8 max-w-xl mx-auto">
            <EmotionalCheckin onClose={() => setShowCheckin(false)} />
          </div>
        )}

        {/* Patient Dashboard */}
        {role === "patient" && (
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-6">O Meu Painel</h1>
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <Link to="/avaliacao" className="group rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
                <ClipboardList className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-card-foreground">Nova Avaliação</h3>
                <p className="text-sm text-muted-foreground">Iniciar questionário PHQ-9 e GAD-7</p>
              </Link>
              <Link to="/chat" className="group rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
                <MessageCircle className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-card-foreground">Chat</h3>
                <p className="text-sm text-muted-foreground">Falar com um profissional</p>
              </Link>
              <div className="rounded-2xl border border-border bg-card p-6">
                <User className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-card-foreground">Perfil</h3>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
            </div>

            {/* Recent Assessments */}
            <h2 className="text-xl font-bold text-foreground mb-4">Últimas Avaliações</h2>
            {assessments.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Ainda não fez nenhuma avaliação.</p>
                <Link to="/avaliacao" className="mt-3 inline-block text-primary font-bold hover:underline">
                  Fazer agora →
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-accent/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Data</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Depressão (PHQ-9)</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Ansiedade (GAD-7)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((a) => (
                      <tr key={a.id} className="border-t border-border">
                        <td className="px-4 py-3 text-sm text-foreground">
                          {new Date(a.created_at).toLocaleDateString("pt-AO")}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="font-bold text-foreground">{a.phq9_score}/27</span>{" "}
                          <span className="text-muted-foreground">({a.phq9_severity})</span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="font-bold text-foreground">{a.gad7_score}/21</span>{" "}
                          <span className="text-muted-foreground">({a.gad7_severity})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Professional/Admin Dashboard */}
        {(role === "professional" || role === "admin") && <ProfessionalDashboard role={role} />}
      </div>
    </div>
  );
};

const ProfessionalDashboard = ({ role }: { role: string }) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [patientAssessments, setPatientAssessments] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("*, user_roles(role)").then(({ data }) => {
      if (data) {
        const pts = data.filter((p: any) => p.user_roles?.some((r: any) => r.role === "patient"));
        setPatients(pts);
      }
    });
  }, []);

  const viewPatient = async (userId: string) => {
    setSelectedPatient(userId);
    const { data } = await supabase
      .from("assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setPatientAssessments(data);
  };

  const downloadReport = (assessment: any) => {
    // Simple report download
    import("@/lib/generatePDF").then(({ generateReport }) => {
      generateReport({
        userName: patients.find((p) => p.user_id === assessment.user_id)?.full_name || "Paciente",
        date: new Date(assessment.created_at).toLocaleDateString("pt-AO"),
        phq9Answers: assessment.phq9_answers,
        gad7Answers: assessment.gad7_answers,
      });
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Painel {role === "admin" ? "do Administrador" : "do Profissional"}
      </h1>
      <p className="text-muted-foreground mb-6">Gerir pacientes e relatórios</p>

      {/* Admin: manage roles */}
      {role === "admin" && (
        <Link
          to="/admin"
          className="mb-8 flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-5 hover:bg-primary/15 transition-colors"
        >
          <div>
            <p className="font-bold text-foreground">👑 Painel do Administrador</p>
            <p className="text-sm text-muted-foreground">Gerir médicos, avaliações, utilizadores e papéis</p>
          </div>
          <span className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Abrir →</span>
        </Link>
      )}

      {/* Patients Table */}
      <h2 className="text-xl font-bold text-foreground mb-4">Pacientes</h2>
      <div className="rounded-2xl border border-border overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-accent/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-foreground">E-mail</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Telefone</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nenhum paciente encontrado</td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-accent/30">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{p.full_name || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => viewPatient(p.user_id)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:scale-105 transition-transform"
                    >
                      👁 Ver Relatórios
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Patient Assessments */}
      {selectedPatient && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Relatórios do Paciente: {patients.find((p) => p.user_id === selectedPatient)?.full_name}
          </h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Data</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-foreground">PHQ-9</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-foreground">GAD-7</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {patientAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Sem avaliações</td>
                  </tr>
                ) : (
                  patientAssessments.map((a) => (
                    <tr key={a.id} className="border-t border-border">
                      <td className="px-4 py-3 text-sm text-foreground">
                        {new Date(a.created_at).toLocaleDateString("pt-AO")}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-bold">{a.phq9_score}/27</span> ({a.phq9_severity})
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-bold">{a.gad7_score}/21</span> ({a.gad7_severity})
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => viewPatient(a.user_id)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                        >
                          👁 Ver
                        </button>
                        <button
                          onClick={() => downloadReport(a)}
                          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                        >
                          ⬇ Baixar PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
