import { Heart, Shield, Users, Globe, Target, Sparkles, Phone, Mail, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { ANGOLA_SUPPORT_CONTACTS, SUPPORT_CENTER } from "@/lib/questionnaires";

const Sobre = () => {
  // Agrupar contactos por província
  const byProvince = ANGOLA_SUPPORT_CONTACTS.reduce<Record<string, typeof ANGOLA_SUPPORT_CONTACTS>>(
    (acc, c) => {
      (acc[c.province] ||= []).push(c);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-6 text-3xl font-bold text-foreground">Sobre o MenteSã Angola</h1>

          {/* Missão */}
          <div className="mb-6 rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Heart className="h-5 w-5" fill="currentColor" />
              <h2 className="text-lg font-bold text-card-foreground">A Nossa Missão</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O MenteSã Angola tem como objetivo promover a consciencialização sobre saúde mental
              em Angola, oferecendo ferramentas de avaliação preliminar acessíveis e gratuitas, e
              ligando cada pessoa a profissionais qualificados em todas as províncias.
            </p>
          </div>

          {/* Visão */}
          <div className="mb-6 rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              <h2 className="text-lg font-bold text-card-foreground">A Nossa Visão</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ser a principal plataforma de saúde mental em Angola — onde qualquer pessoa,
              em qualquer província, possa pedir ajuda sem medo, sem estigma, e encontrar
              o(a) profissional certo(a) para si.
            </p>
          </div>

          {/* Valores */}
          <div className="mb-8 rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-lg font-bold text-card-foreground">Os Nossos Valores</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { t: "Empatia", d: "Acolhemos sem julgamento — cada história importa." },
                { t: "Sigilo", d: "Os seus dados são confidenciais e protegidos." },
                { t: "Acessibilidade", d: "Para todos, em todas as províncias, com ou sem internet rápida." },
                { t: "Rigor científico", d: "Escalas validadas internacionalmente (PHQ-9 e GAD-7)." },
                { t: "Cuidado humano", d: "Tecnologia ao serviço das pessoas — nunca o contrário." },
                { t: "Comunidade", d: "Conectamos pacientes, profissionais e famílias angolanas." },
              ].map((v) => (
                <div key={v.t} className="rounded-xl border border-border/60 bg-background/50 p-3">
                  <p className="text-sm font-bold text-foreground">{v.t}</p>
                  <p className="text-xs text-muted-foreground">{v.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pilares */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Shield, title: "Privacidade", desc: "Os seus dados são protegidos. Respeitamos a sua privacidade." },
              { icon: Users, title: "Acessibilidade", desc: "Interface simples, otimizada para dispositivos móveis e conexões limitadas." },
              { icon: Globe, title: "Contexto Local", desc: "Desenvolvido com linguagem culturalmente adequada ao contexto angolano." },
              { icon: Heart, title: "Ética", desc: "Nunca substituímos diagnóstico médico. Incentivamos sempre a consulta profissional." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                <item.icon className="mb-2 h-5 w-5 text-primary" />
                <h3 className="mb-1 text-sm font-bold text-card-foreground">{item.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Escalas */}
          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="mb-2 text-lg font-bold text-foreground">Escalas Utilizadas</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong>PHQ-9</strong> — Patient Health Questionnaire: avalia sintomas de depressão.</li>
              <li><strong>GAD-7</strong> — Generalized Anxiety Disorder: avalia sintomas de ansiedade.</li>
            </ul>
          </div>

          {/* Centro de Suporte */}
          <div className="mt-8 rounded-2xl border-2 border-primary bg-card p-6">
            <h2 className="mb-3 text-lg font-bold text-foreground flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" /> Centro de Suporte MenteSã
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Equipa de apoio dedicada — dúvidas, marcações ou apoio em momentos difíceis.
            </p>
            <div className="grid gap-2 text-sm">
              <a href={`tel:${SUPPORT_CENTER.phone}`} className="flex items-center gap-2 text-foreground hover:text-primary">
                <Phone className="h-4 w-4 text-primary" /> {SUPPORT_CENTER.phone}
              </a>
              <a href={`mailto:${SUPPORT_CENTER.email}`} className="flex items-center gap-2 text-foreground hover:text-primary">
                <Mail className="h-4 w-4 text-primary" /> {SUPPORT_CENTER.email}
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> {SUPPORT_CENTER.hours}
              </div>
            </div>
          </div>

          {/* Contactos por Província */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Contactos de Apoio por Província
            </h2>
            <div className="space-y-4">
              {Object.entries(byProvince).map(([prov, list]) => (
                <div key={prov} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-bold text-card-foreground mb-2">{prov}</h3>
                  <ul className="space-y-2 text-sm">
                    {list.map((c, i) => (
                      <li key={i} className="border-l-2 border-primary/40 pl-3">
                        <p className="font-semibold text-foreground">{c.name}</p>
                        {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
                        <a href={`tel:${c.phone}`} className="text-sm text-primary hover:underline">
                          📞 {c.phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sobre;
