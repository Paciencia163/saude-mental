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
  "Sentir-se para baixo ou deprimido(a)",
  "Sentir-se sem esperança ou desmotivado(a)",
  "Dificuldade para dormir ou dormir demais",
  "Sentir-se cansado(a) ou com pouca energia",
  "Falta de apetite ou comer demais",
  "Sentir-se mal consigo mesmo(a) ou sentir que é um fracasso",
  "Dificuldade em concentrar-se (ler, ver televisão, trabalhar)",
  "Mover-se ou falar muito devagar — ou, pelo contrário, estar muito agitado(a)",
  "Pensamentos de que seria melhor estar morto(a) ou de se magoar",
];

export const GAD7_QUESTIONS = [
  "Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)",
  "Não ser capaz de impedir ou de controlar as preocupações",
  "Preocupar-se demais com diversas coisas",
  "Dificuldade para relaxar",
  "Ficar tão agitado(a) que se torna difícil permanecer sentado(a)",
  "Ficar facilmente aborrecido(a) ou irritável",
  "Sentir medo, como se algo terrível pudesse acontecer",
];

// Reflection / open-ended questions — para acolher e ajudar o utilizador a abrir-se
export interface ReflectionQuestion {
  id: string;
  question: string;
  placeholder: string;
  options?: string[]; // múltipla escolha opcional
}

export const REFLECTION_QUESTIONS: ReflectionQuestion[] = [
  {
    id: "anxiety_cause",
    question: "O que tem causado mais ansiedade em ti ultimamente?",
    placeholder: "Ex: trabalho, família, estudos, dinheiro, saúde...",
    options: ["Trabalho", "Estudos", "Família", "Relacionamentos", "Dinheiro", "Saúde", "Futuro", "Outro"],
  },
  {
    id: "coping",
    question: "O que costumas fazer para controlar a ansiedade ou sentir-te melhor?",
    placeholder: "Ex: respirar fundo, caminhar, conversar com alguém, ouvir música...",
    options: ["Respiração / relaxamento", "Exercício físico", "Conversar com alguém", "Música / leitura", "Oração / fé", "Nada — não sei como", "Outro"],
  },
  {
    id: "support",
    question: "Tens alguém de confiança com quem podes falar quando te sentes mal?",
    placeholder: "Conta um pouco sobre essa pessoa, se quiseres",
    options: ["Sim, família", "Sim, amigos", "Sim, um(a) profissional", "Não tenho ninguém", "Prefiro não dizer"],
  },
  {
    id: "hope",
    question: "O que te faz sentir esperança ou bem, mesmo nos dias difíceis?",
    placeholder: "Pequenas coisas também contam: uma música, uma pessoa, um lugar...",
  },
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

export interface SupportContact {
  name: string;
  province: string;
  phone: string;
  description?: string;
}

export const SUPPORT_CENTER = {
  name: "Centro de Suporte MenteSã",
  email: "apoio@mentesa.ao",
  phone: "+244 923 000 111",
  hours: "Segunda a Sábado, 08:00 — 20:00",
};

export const ANGOLA_SUPPORT_CONTACTS: SupportContact[] = [
  { province: "Luanda", name: "Linha de Apoio Psicológico de Luanda", phone: "+244 923 000 000", description: "Apoio psicológico gratuito" },
  { province: "Luanda", name: "Hospital Psiquiátrico de Luanda", phone: "+244 222 000 000", description: "Serviços de saúde mental" },
  { province: "Benguela", name: "Hospital Geral de Benguela — Saúde Mental", phone: "+244 272 232 100", description: "Consultas e urgências" },
  { province: "Huíla", name: "Hospital Central do Lubango", phone: "+244 261 220 350", description: "Saúde mental e psiquiatria" },
  { province: "Huambo", name: "Hospital Central do Huambo", phone: "+244 241 220 400", description: "Apoio psicológico e psiquiátrico" },
  { province: "Cabinda", name: "Hospital Provincial de Cabinda", phone: "+244 231 222 100", description: "Serviços de saúde mental" },
  { province: "Namibe", name: "Hospital Provincial do Namibe", phone: "+244 264 260 200", description: "Consultas de saúde mental" },
  { province: "Malanje", name: "Hospital Provincial de Malanje", phone: "+244 251 220 100", description: "Saúde mental" },
  { province: "Bié", name: "Hospital Provincial do Kuito", phone: "+244 248 222 050", description: "Apoio psicológico" },
  { province: "Uíge", name: "Hospital Provincial do Uíge", phone: "+244 232 220 300", description: "Saúde mental" },
  { province: "Nacional", name: "Ordem dos Psicólogos de Angola", phone: "+244 222 444 555", description: "Referências para profissionais qualificados em todo o país" },
];
