import { Heart, Brain, FileText, Shield, ArrowRight, AlertTriangle, MessageCircle, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";

const features = [
  {
    icon: Brain,
    title: "Avaliação Científica",
    desc: "Questionários baseados nas escalas PHQ-9 e GAD-7, reconhecidas internacionalmente.",
  },
  {
    icon: FileText,
    title: "Relatório em PDF",
    desc: "Receba um relatório completo com os seus resultados e recomendações personalizadas.",
  },
  {
    icon: Shield,
    title: "Privacidade Total",
    desc: "Os seus dados são processados de forma segura. Nada é partilhado sem o seu consentimento.",
  },
];

const depressionSigns = [
  "Tristeza persistente ou vazio emocional",
  "Perda de interesse em atividades que antes davam prazer",
  "Alterações no sono (insónia ou dormir demais)",
  "Fadiga e falta de energia constante",
  "Dificuldade de concentração",
  "Pensamentos negativos recorrentes",
];

const anxietySigns = [
  "Preocupação excessiva e difícil de controlar",
  "Inquietação ou nervosismo constante",
  "Tensão muscular e dores de cabeça",
  "Dificuldade para dormir ou relaxar",
  "Irritabilidade frequente",
  "Sensação de que algo terrível vai acontecer",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary [background:var(--gradient-hero)]" />
        <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground">
              <Heart className="h-4 w-4" fill="currentColor" />
              Cuidar da mente é cuidar da vida
            </div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              A sua saúde mental importa
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/85 md:text-xl">
              Faça uma avaliação preliminar e gratuita dos seus níveis de ansiedade e depressão.
              Desenvolvido especialmente para o contexto angolano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/avaliacao"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-8 py-4 text-lg font-bold text-primary shadow-lg transition-transform hover:scale-105"
              >
                Iniciar Avaliação
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/registar"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-foreground/30 px-8 py-4 text-lg font-bold text-primary-foreground transition-transform hover:scale-105 hover:bg-primary-foreground/10"
              >
                <UserPlus className="h-5 w-5" />
                Criar Conta
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-b border-border bg-accent/30">
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            ⚠️ <strong>Aviso:</strong> Esta ferramenta NÃO substitui um diagnóstico médico profissional.
            Serve apenas como orientação preliminar.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-foreground">Como funciona</h2>
          <p className="text-muted-foreground">Três passos simples para conhecer melhor a sua saúde emocional</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-card-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Depression & Anxiety Info */}
      <section className="bg-accent/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold text-foreground">Conheça os sinais</h2>
            <p className="text-muted-foreground">Informação é o primeiro passo para o bem-estar</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Depression */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground">Depressão</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                A depressão é mais do que sentir-se triste. É uma condição médica que afeta o modo como pensa, sente e age. Em Angola, muitas pessoas sofrem em silêncio sem saber que têm esta condição.
              </p>
              <h4 className="text-sm font-bold text-foreground mb-2">Sinais de alerta:</h4>
              <ul className="space-y-2">
                {depressionSigns.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Anxiety */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground">Ansiedade</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                A ansiedade é uma resposta natural ao stress, mas quando se torna persistente e interfere na vida diária, pode ser um transtorno. É uma das condições de saúde mental mais comuns em Angola.
              </p>
              <h4 className="text-sm font-bold text-foreground mb-2">Sinais de alerta:</h4>
              <ul className="space-y-2">
                {anxietySigns.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Highlight */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3 text-center">
          {[
            { stat: "264M+", label: "Pessoas com depressão no mundo" },
            { stat: "284M+", label: "Pessoas com transtornos de ansiedade" },
            { stat: "76%", label: "Não recebem tratamento adequado" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-primary/20 bg-primary/5 p-6"
            >
              <div className="text-3xl font-extrabold text-primary mb-1">{item.stat}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA - Register */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary [background:var(--gradient-hero)]" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MessageCircle className="h-12 w-12 text-primary-foreground/80 mx-auto mb-4" />
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
              Não enfrente isto sozinho(a)
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/85 max-w-xl mx-auto">
              Crie a sua conta gratuita, faça a avaliação e converse com profissionais de saúde mental. 
              O primeiro passo para se sentir melhor começa aqui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/registar"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-8 py-4 text-lg font-bold text-primary shadow-lg transition-transform hover:scale-105"
              >
                <UserPlus className="h-5 w-5" />
                Registar-se Gratuitamente
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-foreground/30 px-8 py-4 text-lg font-bold text-primary-foreground transition-transform hover:scale-105 hover:bg-primary-foreground/10"
              >
                Já tenho conta — Entrar
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
            <Heart className="h-4 w-4 text-primary" fill="currentColor" />
            MenteSã Angola
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 MenteSã Angola. Todos os direitos reservados. Esta ferramenta não substitui consulta médica.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
