import { motion } from "framer-motion";
import { RESPONSE_OPTIONS } from "@/lib/questionnaires";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  selectedValue: number | undefined;
  onSelect: (value: number) => void;
  sectionTitle: string;
}

const QuestionCard = ({
  questionNumber,
  totalQuestions,
  question,
  selectedValue,
  onSelect,
  sectionTitle,
}: QuestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {sectionTitle}
        </span>
        <span className="text-sm text-muted-foreground">
          {questionNumber} de {totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-6 text-lg font-semibold text-card-foreground">
          Nas últimas 2 semanas, com que frequência foi incomodado(a) por:
        </p>
        <p className="mb-8 text-base text-foreground">{question}</p>

        <div className="flex flex-col gap-3">
          {RESPONSE_OPTIONS.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => onSelect(option.value)}
              className={`group relative overflow-hidden rounded-xl border-2 px-5 py-4 text-left text-sm font-bold transition-all duration-200 ${
                selectedValue === option.value
                  ? "border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                  : "border-border bg-card text-card-foreground hover:border-primary hover:bg-accent hover:shadow-md hover:scale-[1.01]"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-colors ${
                    selectedValue === option.value
                      ? "border-primary-foreground bg-primary-foreground/20 text-primary-foreground"
                      : "border-primary/40 bg-primary/10 text-primary group-hover:border-primary group-hover:bg-primary/20"
                  }`}
                >
                  {index}
                </span>
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
