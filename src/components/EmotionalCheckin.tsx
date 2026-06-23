import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { X } from "lucide-react";

const moods = [
  { value: "very_good", emoji: "😃", label: "Muito bem" },
  { value: "good", emoji: "☺️", label: "Bem" },
  { value: "confused", emoji: "😩", label: "Confuso(a)" },
  { value: "bad", emoji: "🙁", label: "Mal" },
  { value: "very_bad", emoji: "😔", label: "Muito mal" },
];

interface Props {
  onClose: () => void;
}

const EmotionalCheckin = ({ onClose }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelect = async (mood: string) => {
    if (!user) return;
    setSelected(mood);
    setSaving(true);
    const { error } = await supabase.from("emotional_checkins").insert({ user_id: user.id, mood });
    setSaving(false);
    if (error) {
      toast.error("Erro ao guardar");
      return;
    }
    toast.success("Obrigado por partilhar como se sente!");
    setTimeout(() => {
      onClose();
      navigate(`/humor/${mood}`);
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-card-foreground">Como se sente hoje?</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Fechar">
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Toque num emoji — receberá uma mensagem para si.</p>
      <div className="flex gap-3 justify-center flex-wrap">
        {moods.map((m) => (
          <motion.button
            key={m.value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(m.value)}
            disabled={saving}
            className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-3 transition-all ${
              selected === m.value
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-xs font-semibold text-foreground">{m.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default EmotionalCheckin;
