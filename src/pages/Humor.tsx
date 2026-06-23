import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Users } from "lucide-react";
import Header from "@/components/Header";

type MoodKey = "very_good" | "good" | "confused" | "bad" | "very_bad";

const MOOD_CONTENT: Record<MoodKey, {
  emoji: string;
  title: string;
  subtitle: string;
  message: string;
  tips: string[];
  showDoctors: boolean;
}> = {
  very_good: {
    emoji: "😃",
    title: "Que bom que se sente muito bem!",
    subtitle: "Aproveite este momento e cultive-o.",
    message: "Sentir-se bem é também uma conquista. Reconheça o que está a fazer de positivo na sua vida e partilhe essa energia com quem ama.",
    tips: [
      "Anote três coisas pelas quais está grato(a) hoje",
      "Partilhe a sua boa energia com alguém próximo",
      "Continue com hábitos saudáveis: sono, exercício e boa alimentação",
    ],
    showDoctors: false,
  },
  good: {
    emoji: "☺️",
    title: "Está bem — isso é ótimo!",
    subtitle: "O equilíbrio é uma construção diária.",
    message: "Estar bem é estar em paz consigo mesmo(a). Mantenha a rotina que tem cuidado de si e lembre-se de que pedir ajuda nunca é fraqueza.",
    tips: [
      "Reserve 10 minutos para si hoje",
      "Pratique respiração consciente",
      "Mantenha contacto com pessoas que lhe fazem bem",
    ],
    showDoctors: false,
  },
  confused: {
    emoji: "😩",
    title: "Sentir-se confuso(a) é humano",
    subtitle: "Não tem de ter todas as respostas agora.",
    message: "Confusão pode ser sinal de que algo dentro de si precisa de atenção. Respire fundo. Não tem de resolver tudo hoje — basta dar um passo de cada vez.",
    tips: [
      "Escreva o que sente, sem julgamento",
      "Fale com alguém de confiança",
      "Considere fazer a avaliação de saúde mental",
    ],
    showDoctors: true,
  },
  bad: {
    emoji: "🙁",
    title: "Lamento que se sinta mal",
    subtitle: "Está aqui — e isso já é coragem.",
    message: "Dias maus acontecem, e tudo bem. O importante é não enfrentar isto sozinho(a). Existem profissionais preparados para ouvir e ajudar — e a sua sensibilidade não é fraqueza, é humanidade.",
    tips: [
      "Beba água, descanse e coma algo leve",
      "Saia para apanhar ar 10 minutos",
      "Considere falar com um(a) profissional de saúde mental",
    ],
    showDoctors: true,
  },
  very_bad: {
    emoji: "😔",
    title: "Estamos consigo",
    subtitle: "Por favor, procure ajuda — você merece cuidado.",
    message: "Sentir-se muito mal é um sinal importante. Procurar um profissional não significa que algo está errado consigo — significa que se está a tratar com o carinho que merece. Não está sozinho(a). Os nossos médicos estão prontos para o(a) acolher.",
    tips: [
      "Se tiver pensamentos de se magoar, contacte AGORA uma linha de apoio",
      "Fale com alguém de confiança ainda hoje",
      "Marque uma consulta com um(a) psicólogo(a) ou psiquiatra",
    ],
    showDoctors: true,
  },
};

const Humor = () => {
  const { mood } = useParams<{ mood: string }>();
  const key = mood as MoodKey;
  const content = MOOD_CONTENT[key];

  if (!content) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao painel
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-card p-8 shadow-sm text-center"
        >
          <div className="text-6xl mb-4">{content.emoji}</div>
          <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">{content.title}</h1>
          <p className="text-muted-foreground mb-6">{content.subtitle}</p>
          <p className="text-base text-foreground leading-relaxed mb-6 text-left">{content.message}</p>

          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 text-left">
            <h3 className="text-sm font-bold text-foreground mb-3">Sugestões para si:</h3>
            <ul className="space-y-2">
              {content.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {content.showDoctors && (
              <Link
                to="/medicos"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md hover:scale-105 transition-transform"
              >
                <Users className="h-4 w-4" /> Ver Médicos Disponíveis
              </Link>
            )}
            <Link
              to="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/30 px-6 py-3 text-sm font-bold text-foreground hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4" /> Falar no Chat
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Humor;
