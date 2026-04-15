import { Heart, Shield, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";

const Sobre = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-6 text-3xl font-bold text-foreground">Sobre o MenteSã Angola</h1>

        <div className="prose prose-sm max-w-none">
          <div className="mb-8 rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Heart className="h-5 w-5" fill="currentColor" />
              <h2 className="text-lg font-bold text-card-foreground">A Nossa Missão</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O MenteSã Angola tem como objectivo promover a consciencialização sobre saúde mental
              em Angola, oferecendo ferramentas de avaliação preliminar acessíveis e gratuitas.
              Acreditamos que o primeiro passo para cuidar da mente é compreender como nos sentimos.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Shield, title: "Privacidade", desc: "Os dados são processados localmente no seu dispositivo. Respeitamos a sua privacidade." },
              { icon: Users, title: "Acessibilidade", desc: "Interface simples, optimizada para dispositivos móveis e conexões limitadas." },
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

          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="mb-2 text-lg font-bold text-foreground">Escalas Utilizadas</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong>PHQ-9</strong> — Patient Health Questionnaire: avalia sintomas de depressão com 9 perguntas.</li>
              <li><strong>GAD-7</strong> — Generalized Anxiety Disorder: avalia sintomas de ansiedade com 7 perguntas.</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Ambas as escalas são amplamente utilizadas e validadas pela comunidade científica internacional.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export default Sobre;
