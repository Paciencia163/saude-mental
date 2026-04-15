import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Send, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface Contact {
  user_id: string;
  full_name: string;
  role: string;
}

const Chat = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  // Load contacts
  useEffect(() => {
    if (!user || !role) return;
    const fetchContacts = async () => {
      if (role === "patient") {
        // Patient sees professionals
        const { data } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "professional");
        if (data) {
          const userIds = data.map((r) => r.user_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, full_name")
            .in("user_id", userIds);
          if (profiles) {
            setContacts(profiles.map((p) => ({ ...p, role: "professional" })));
          }
        }
      } else {
        // Professional sees patients who have sent messages
        const { data } = await supabase
          .from("chat_messages")
          .select("sender_id, receiver_id")
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
        if (data) {
          const ids = new Set<string>();
          data.forEach((m) => {
            if (m.sender_id !== user.id) ids.add(m.sender_id);
            if (m.receiver_id !== user.id) ids.add(m.receiver_id);
          });
          if (ids.size > 0) {
            const { data: profiles } = await supabase
              .from("profiles")
              .select("user_id, full_name")
              .in("user_id", Array.from(ids));
            if (profiles) setContacts(profiles.map((p) => ({ ...p, role: "patient" })));
          }
        }
      }
    };
    fetchContacts();
  }, [user, role]);

  // Load messages for selected contact
  useEffect(() => {
    if (!user || !selectedContact) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact}),and(sender_id.eq.${selectedContact},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });
      if (data) setMessages(data as ChatMessage[]);
    };
    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const msg = payload.new as ChatMessage;
          if (
            (msg.sender_id === user.id && msg.receiver_id === selectedContact) ||
            (msg.sender_id === selectedContact && msg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedContact]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !selectedContact) return;
    setSending(true);
    const { error } = await supabase.from("chat_messages").insert({
      sender_id: user.id,
      receiver_id: selectedContact,
      message: newMessage.trim(),
    });
    setSending(false);
    if (error) {
      toast.error("Erro ao enviar mensagem");
    } else {
      setNewMessage("");
    }
  };

  if (loading || !user) return null;

  const selectedContactName = contacts.find((c) => c.user_id === selectedContact)?.full_name || "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Heart className="h-5 w-5 text-primary" fill="currentColor" />
          <span className="font-bold text-foreground">Chat {selectedContactName && `— ${selectedContactName}`}</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Contacts sidebar */}
        <div className="w-64 border-r border-border bg-card overflow-y-auto hidden md:block">
          <div className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">
              {role === "patient" ? "Profissionais" : "Pacientes"}
            </h3>
            {contacts.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum contacto disponível</p>
            ) : (
              contacts.map((c) => (
                <button
                  key={c.user_id}
                  onClick={() => setSelectedContact(c.user_id)}
                  className={`w-full text-left rounded-xl px-3 py-2.5 mb-1 text-sm transition-colors ${
                    selectedContact === c.user_id
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {c.full_name || "Sem nome"}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {!selectedContact ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Selecione um contacto para iniciar a conversa
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender_id === user.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {msg.message}
                      <div className={`text-[10px] mt-1 ${msg.sender_id === user.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {new Date(msg.created_at).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEnd} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="Escreva a sua mensagem..."
                    className="flex-1 rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                    className="rounded-xl bg-primary px-4 py-3 text-primary-foreground disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
