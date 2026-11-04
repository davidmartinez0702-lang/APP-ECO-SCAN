import { Trash2 } from "lucide-react";
import { CAT_COLOR, STATUS_COLOR, type HistoryEntry } from "../types";

export default function History({ list, onOpen, onDelete, onClear, onStart }: {
  list: HistoryEntry[]; onOpen: (e: HistoryEntry) => void; onDelete: (id: string) => void; onClear: () => void; onStart: () => void;
}) {
  return (
    <section className="mx-auto max-w-2xl">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Historial</h1>
        {list.length > 0 && (
          <button className="text-sm font-medium text-red-600 hover:underline" onClick={() => confirm("¿Borrar todo el historial?") && onClear()}>Borrar todo</button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="text-neutral-500">Aún no has analizado ningún residuo.</p>
          <button className="btn-primary mt-4" onClick={onStart}>Analizar residuo</button>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.map((e) => (
            <li key={e.id} className="card flex items-center gap-3 p-3">
              <button className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => onOpen(e)}>
                <img src={e.image} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{e.result.items.map((i) => i.name).join(", ")}</p>
                  <p className="text-xs text-neutral-500">{new Date(e.date).toLocaleString("es", { dateStyle: "medium", timeStyle: "short" })}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {e.result.items.map((i, k) => (
                      <span key={k} className="flex items-center gap-1 text-xs text-neutral-600">
                        <span className="h-2 w-2 rounded-full" style={{ background: CAT_COLOR[i.category] }} />{i.category}
                        <span style={{ color: STATUS_COLOR[i.status] }}>· {i.status}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </button>
              <button aria-label="Eliminar registro" className="rounded-full p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(e.id)}>
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
