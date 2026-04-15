// PHQ-9 (Patient Health Questionnaire-9) - Depressão
// GAD-7 (Generalized Anxiety Disorder-7) - Ansiedade

export const RESPONSE_OPTIONS = [
  { value: 0, label: "Nenhuma vez" },
  { value: 1, label: "Alguns dias" },
  { value: 2, label: "Mais da metade dos dias" },
  { value: 3, label: "Quase todos os dias" },
];

export const PHQ9_QUESTIONS = [
  "Pouco interesse ou prazer em fazer as coisas",
  "Sentir-se para baixo, deprimido(a) ou sem esperança",
  "Dificuldade para dormir ou dormir demais",
  "Sentir-se cansado(a) ou com pouca energia",
  "Falta de apetite ou comer demais",
  "Sentir-se mal consigo mesmo(a) — ou sentir que é um fracasso ou que decepcionou a sua família",
  "Dificuldade para se concentrar nas coisas, como ler o jornal ou ver televisão",
  "Mover-se ou falar tão devagar que as outras pessoas notaram? Ou o contrário — Loss agitado(a) que se movimentou muito mais do que o normal",
  "Pensamentos de que seria melhor estar morto(a) ou de se machucar de alguma forma",
];

export const GAD7_QUESTIONS = [
  "Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)",
  "Não ser capaz de impedir ou de controlar as preocupações",
  "Preocupar-se muito com diversas coisas",
  "Dificuldade para relaxar",
  "Ficar tão agitado(a) que se torna difícil permanecer sentado(a)",
  "Ficar facilmente aborrecido(a) ou irritável",
  "Sentir medo como se algo terrível pudesse acontecer",
];

export type SeverityLevel = "normal" | "leve" | "moderado" | "moderado_grave" | "grave";

export interface SeverityResult {
  level: SeverityLevel;
  label: string;
  description: string;
  color: string;
  recommendation: string;
}

export function getDepressionSeverity(score: number): SeverityResult {
  if (score <= 4) return {
    level: "normal",
    label: "Mínimo",
    description: "Os seus sintomas são mínimos. Continue a cuidar do seu bem-estar emocional.",
    color: "#4ade80",
    recommendation: "Continue com hábitos saudáveis: exercício regular, boa alimentação e sono adequado."
  };
  if (score <= 9) return {
    level: "leve",
    label: "Leve",
    description: "Apresenta sintomas leves de depressão. É importante estar atento(a).",
    color: "#facc15",
    recommendation: "Procure manter uma rotina saudável e considere conversar com alguém de confiança sobre como se sente."
  };
  if (score <= 14) return {
    level: "moderado",
    label: "Moderado",
    description: "Os sintomas indicam depressão moderada. Recomenda-se procurar apoio.",
    color: "#f97316",
    recommendation: "Recomendamos que procure um profissional de saúde mental para uma avaliação mais detalhada."
  };
  if (score <= 19) return {
    level: "moderado_grave",
    label: "Moderadamente Grave",
    description: "Os sintomas são significativos. É importante procurar ajuda profissional.",
    color: "#ef4444",
    recommendation: "Procure ajuda profissional o mais breve possível. Fale com um psicólogo ou psiquiatra."
  };
  return {
    level: "grave",
    label: "Grave",
    description: "Os sintomas indicam depressão grave. Procure ajuda profissional imediatamente.",
    color: "#dc2626",
    recommendation: "Procure ajuda profissional URGENTEMENTE. Se tiver pensamentos de autolesão, contacte a linha de apoio mais próxima."
  };
}

export function getAnxietySeverity(score: number): SeverityResult {
  if (score <= 4) return {
    level: "normal",
    label: "Mínimo",
    description: "Os seus níveis de ansiedade são normais.",
    color: "#4ade80",
    recommendation: "Continue a praticar técnicas de relaxamento e manter uma vida equilibrada."
  };
  if (score <= 9) return {
    level: "leve",
    label: "Leve",
    description: "Apresenta sintomas leves de ansiedade.",
    color: "#facc15",
    recommendation: "Pratique exercícios de respiração e relaxamento. Considere técnicas de mindfulness."
  };
  if (score <= 14) return {
    level: "moderado",
    label: "Moderado",
    description: "Os sintomas indicam ansiedade moderada.",
    color: "#f97316",
    recommendation: "Recomendamos que procure um profissional de saúde mental para orientação adequada."
  };
  return {
    level: "grave",
    label: "Grave",
    description: "Os sintomas indicam ansiedade grave. Procure ajuda profissional.",
    color: "#dc2626",
    recommendation: "Procure ajuda profissional o mais breve possível. Não enfrente isto sozinho(a)."
  };
}

export const ANGOLA_SUPPORT_CONTACTS = [
  { name: "Linha de Apoio Psicológico", phone: "+244 923 000 000", description: "Apoio psicológico gratuito" },
  { name: "Hospital Psiquiátrico de Luanda", phone: "+244 222 000 000", description: "Serviços de saúde mental" },
  { name: "Ordem dos Psicólogos de Angola", phone: "", description: "Referências para profissionais qualificados" },
];
