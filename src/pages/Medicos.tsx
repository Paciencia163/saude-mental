import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Stethoscope, Search } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

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

const Medicos = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [province, setProvince] = useState<string>("Todas");

  useEffect(() => {
    supabase
      .from("doctors")
      .select("*")
      .eq("available", true)
      .order("province")
      .then(({ data }) => {
        if (data) setDoctors(data as Doctor[]);
        setLoading(false);
      });
  }, []);

  const provinces = ["Todas", ...Array.from(new Set(doctors.map((d) => d.province)))];

  const filtered = doctors.filter((d) => {
    const matchesProv = province === "Todas" || d.province === province;
    const q = filter.toLowerCase();
    const matchesQ =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      (d.city ?? "").toLowerCase().includes(q);
    return matchesProv && matchesQ;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Médicos & Psicólogos</h1>
          <p className="mb-8 text-muted-foreground">
            Profissionais de saúde mental qualificados em várias províncias de Angola.
            Falar com um especialista é o passo mais importante para cuidar de si.
          </p>

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Pesquisar por nome, especialidade ou cidade..."
                className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-12">A carregar profissionais...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 rounded-2xl border border-border bg-card">
              Nenhum profissional encontrado com esses critérios.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-card-foreground">{d.name}</h3>
                      <p className="text-sm text-primary font-semibold">{d.specialty}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {d.city ? `${d.city}, ` : ""}{d.province}
                      </p>
                    </div>
                  </div>
                  {d.bio && <p className="text-sm text-muted-foreground mb-3">{d.bio}</p>}
                  <div className="flex flex-col gap-1.5 text-sm">
                    {d.phone && (
                      <a href={`tel:${d.phone}`} className="flex items-center gap-2 text-foreground hover:text-primary">
                        <Phone className="h-4 w-4 text-primary" /> {d.phone}
                      </a>
                    )}
                    {d.email && (
                      <a href={`mailto:${d.email}`} className="flex items-center gap-2 text-foreground hover:text-primary truncate">
                        <Mail className="h-4 w-4 text-primary" /> {d.email}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-sm text-muted-foreground">
            💡 <strong className="text-foreground">Importante:</strong> Falar com um(a) profissional é um ato de coragem
            e cuidado. Os nossos especialistas estão preparados para o(a) acolher em sigilo total.
            Em caso de urgência, ligue para a linha de apoio mais próxima da sua província.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Medicos;
