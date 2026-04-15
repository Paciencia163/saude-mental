import { motion } from "framer-motion";
import type { SeverityResult } from "@/lib/questionnaires";

interface ResultCardProps {
  title: string;
  score: number;
  maxScore: number;
  result: SeverityResult;
  delay?: number;
}

const ResultCard = ({ title, score, maxScore, result, delay = 0 }: ResultCardProps) => {
  const percentage = (score / maxScore) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <h3 className="mb-1 text-lg font-bold text-card-foreground">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">Pontuação: {score}/{maxScore}</p>

      {/* Score bar */}
      <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: result.color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.3, duration: 0.8 }}
        />
      </div>

      <div
        className="mb-3 inline-block rounded-full px-4 py-1 text-sm font-bold"
        style={{ backgroundColor: result.color + "22", color: result.color }}
      >
        {result.label}
      </div>

      <p className="mb-3 text-sm text-foreground">{result.description}</p>

      <div className="rounded-xl bg-accent/50 p-4">
        <p className="text-sm font-medium text-accent-foreground">
          💡 {result.recommendation}
        </p>
      </div>
    </motion.div>
  );
};

export default ResultCard;
