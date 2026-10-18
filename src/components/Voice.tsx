import { Mic, Volume2 } from "lucide-react";
import { useState } from "react";
import { SPEECH_LOCALE } from "@/lib/i18n";
import { useStore } from "@/lib/store";

/** Browser speech input with a visible, editable transcript before anything is accepted. */
export function VoiceInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const { s, t } = useStore();
  const [status, setStatus] = useState("");
  const start = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return setStatus("Voice is not available in this browser. Please type instead.");
    const rec = new SR();
    rec.lang = SPEECH_LOCALE[s.lang];
    rec.onresult = (e: any) => {
      onChange(e.results[0][0].transcript);
      setStatus("Check the transcript below and correct it if needed.");
    };
    rec.onerror = () => setStatus("Could not hear clearly. Please try again or type.");
    setStatus("Listening…");
    rec.start();
  };
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input className="field flex-1" value={value} placeholder={t("typeHere")} onChange={(e) => onChange(e.target.value)} />
        <button type="button" className="btn-ghost" onClick={start} aria-label={t("speak")}>
          <Mic className="size-4" /> {t("speak")}
        </button>
      </div>
      {status && <p className="text-sm text-muted-foreground" role="status">{status}</p>}
    </div>
  );
}

export function Speak({ text }: { text: string }) {
  const { s, t } = useStore();
  return (
    <button
      type="button"
      className="btn-ghost"
      onClick={() => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = SPEECH_LOCALE[s.lang];
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      }}
    >
      <Volume2 className="size-4" /> {t("listen")}
    </button>
  );
}
