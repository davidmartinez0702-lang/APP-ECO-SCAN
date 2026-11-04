import { useState } from "react";
import { BarChart3, History as HistoryIcon, Home as HomeIcon, Leaf, Lightbulb, ScanLine, type LucideIcon } from "lucide-react";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import History from "./pages/History";
import Tips from "./pages/Tips";
import Stats from "./pages/Stats";
import ResultView from "./components/ResultView";
import { MAX_HISTORY, loadHistory, saveHistory } from "./lib/storage";
import type { HistoryEntry } from "./types";

type View = "home" | "scan" | "result" | "history" | "tips" | "stats";
const NAV: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Inicio", icon: HomeIcon },
  { id: "scan", label: "Analizar", icon: ScanLine },
  { id: "history", label: "Historial", icon: HistoryIcon },
  { id: "tips", label: "EcoTips", icon: Lightbulb },
  { id: "stats", label: "Estadísticas", icon: BarChart3 },
];

export default function App() {
  const [view, setView] = useState<View>("home");
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [current, setCurrent] = useState<HistoryEntry | null>(null);
  const [from, setFrom] = useState<View>("scan");

  const persist = (next: HistoryEntry[]) => { setHistory(next); saveHistory(next); };
  const go = (v: View) => { setView(v); window.scrollTo({ top: 0 }); };

  const onDone = (e: HistoryEntry) => { persist([e, ...history].slice(0, MAX_HISTORY)); setCurrent(e); setFrom("scan"); go("result"); };
  const open = (e: HistoryEntry) => { setCurrent(e); setFrom("history"); go("result"); };
  const active: View = view === "result" ? from : view;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f5f5f7]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <button className="flex items-center gap-2 font-bold tracking-tight" onClick={() => go("home")}>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-eco-600 text-white"><Leaf size={18} /></span>ECO-SCAN
          </button>
          <nav className="hidden gap-1 md:flex">
            {NAV.map(({ id, label }) => (
              <button key={id} onClick={() => go(id)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${active === id ? "bg-eco-100 text-eco-700" : "text-neutral-600 hover:bg-black/5"}`}>{label}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-28 pt-6 md:pb-12">
        {view === "home" && <Home onStart={() => go("scan")} />}
        {view === "scan" && <Scan onDone={onDone} />}
        {view === "result" && current && (
          <div className="mx-auto max-w-3xl">
            <ResultView entry={current} onAgain={() => go("scan")} onBack={from === "history" ? () => go("history") : undefined} />
          </div>
        )}
        {view === "history" && (
          <History list={history} onOpen={open} onStart={() => go("scan")} onDelete={(id) => persist(history.filter((h) => h.id !== id))} onClear={() => persist([])} />
        )}
        {view === "tips" && <Tips />}
        {view === "stats" && <Stats list={history} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-black/5 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => go(id)} className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${active === id ? "text-eco-600" : "text-neutral-500"}`}>
              <Icon size={22} />{label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
