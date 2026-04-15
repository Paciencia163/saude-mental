import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Download, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import QuestionCard from "@/components/QuestionCard";
import ResultCard from "@/components/ResultCard";
import {
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  getDepressionSeverity,
  getAnxietySeverity,
} from "@/lib/questionnaires";
import { generateReport } from "@/lib/generatePDF";

const ALL_QUESTIONS = [
  ...PHQ9_QUESTIONS.map((q) => ({ question: q, section: "PHQ-9 — Depressão" })),
  ...GAD7_QUESTIONS.map((q) => ({ question: q, section: "GAD-7 — Ansiedade" })),
];

const Avaliacao = () => {
  const [step, setStep] = useState<"intro" | "quiz" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(
    new Array(ALL_QUESTIONS.length).fill(undefined)
  );
  const [userName, setUserName] = useState("");

  const handleSelect = useCallback(
    (value: number) => {
      const newAnswers = [...answers];
      newAnswers[currentQ] = value;
      setAnswers(newAnswers);
      // Auto-advance after 400ms
      setTimeout(() => {
        if (currentQ < ALL_QUESTIONS.length - 1) {
          setCurrentQ((p) => p + 1);
        }
      }, 400);
    },
    [answers, currentQ]
  );

  const canFinish = answers.every((a) => a !== undefined);
  const phq9Answers = answers.slice(0, 9) as number[];
  const gad7Answers = answers.slice(9) as number[];
  const phq9Score = phq9Answers.reduce((a, b) => a + (b ?? 0), 0);
  const gad7Score = gad7Answers.reduce((a, b) => a + (b ?? 0), 0);

  const handleDownloadPDF = () => {
    generateReport({
      userName: userName || "Utilizador Anónimo",
      date: new Date().toLocaleDateString("pt-AO"),
      phq9Answers,
      gad7Answers,
    });
  };

  const handleRestart = () => {
    setStep("intro");
    setCurrentQ(0);
    setAnswers(new Array(ALL_QUESTIONS.length).fill(undefined));
    setUserName("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-xl text-center"
            >
              <h1 className="mb-4 text-3xl font-bold text-foreground">Avaliação de Saúde Mental</h1>
              <p className="mb-6 text-muted-foreground">
                Responda às perguntas com base em como se sentiu nas <strong>últimas 2 semanas</strong>.
                São {ALL_QUESTIONS.length} perguntas que demoram cerca de 5 minutos.
              </p>

              <div className="mb-6 rounded-2xl border border-border bg-accent/30 p-6 text-left">
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  O seu nome (opcional)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ex: Maria"
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left text-sm text-muted-foreground">
                ⚠️ Esta avaliação é preliminar e <strong>não substitui</strong> uma consulta com um profissional de saúde mental.
              </div>

              <button
                onClick={() => setStep("quiz")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
              >
                Começar
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {step === "quiz" && (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QuestionCard
                questionNumber={currentQ + 1}
                totalQuestions={ALL_QUESTIONS.length}
                question={ALL_QUESTIONS[currentQ].question}
                selectedValue={answers[currentQ]}
                onSelect={handleSelect}
                sectionTitle={ALL_QUESTIONS[currentQ].section}
              />

              <div className="mx-auto mt-6 flex max-w-2xl items-center justify-between">
                <button
                  onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                  disabled={currentQ === 0}
                  className="inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30"
                >
                  <ArrowLeft className="h-4 w-4" /> Anterior
                </button>

                {currentQ < ALL_QUESTIONS.length - 1 ? (
                  <button
                    onClick={() => setCurrentQ((p) => p + 1)}
                    disabled={answers[currentQ] === undefined}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors disabled:opacity-30"
                  >
                    Próxima <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep("results")}
                    disabled={!canFinish}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground transition-colors disabled:opacity-30"
                  >
                    Ver Resultados
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto max-w-2xl"
            >
              <h2 className="mb-2 text-center text-3xl font-bold text-foreground">
                Os Seus Resultados
              </h2>
              <p className="mb-8 text-center text-muted-foreground">
                Veja abaixo a análise das suas respostas
              </p>

              <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center text-sm text-muted-foreground">
                ⚠️ Lembre-se: estes resultados são preliminares e <strong>não constituem diagnóstico médico</strong>.
              </div>

              <div className="grid gap-6">
                <ResultCard
                  title="Depressão (PHQ-9)"
                  score={phq9Score}
                  maxScore={27}
                  result={getDepressionSeverity(phq9Score)}
                />
                <ResultCard
                  title="Ansiedade (GAD-7)"
                  score={gad7Score}
                  maxScore={21}
                  result={getAnxietySeverity(gad7Score)}
                  delay={0.2}
                />
              </div>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
                >
                  <Download className="h-5 w-5" />
                  Baixar Relatório PDF
                </button>
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <RotateCcw className="h-4 w-4" />
                  Nova Avaliação
                </button>
              </div>

              {/* Support contacts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-10 rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="mb-4 text-lg font-bold text-card-foreground">
                  📞 Contactos de Apoio em Angola
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Linha de Apoio Psicológico:</strong> +244 923 000 000</li>
                  <li>• <strong>Hospital Psiquiátrico de Luanda</strong></li>
                  <li>• <strong>Ordem dos Psicólogos de Angola</strong> — Referências para profissionais qualificados</li>
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Avaliacao;
