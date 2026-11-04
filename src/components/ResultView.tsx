import { AlertTriangle, ArrowLeft, Recycle, ScanLine } from "lucide-react";
import { CAT_COLOR, STATUS_COLOR, type HistoryEntry } from "../types";

export default function ResultView({ entry, onAgain, onBack }: { entry: HistoryEntry; onAgain: () => void; onBack?: () => void }) {
  const { result, image } = entry;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        {onBack ? (
          <button className="btn-ghost !px-4 !py-2" onClick={onBack}><ArrowLeft size={16} /> Volver</button>
        ) : <span />}
        <button className="btn-primary !py-2" onClick={onAgain}><ScanLine size={16} /> Analizar otro</button>
      </div>

      {result.items.map((it, i) => (
        <article key={i} className="card overflow-hidden rise" style={{ animationDelay: `${i * 70}ms` }}>
          <div className="flex flex-col sm:flex-row">
            <img src={image} alt="Imagen analizada" className="h-48 w-full object-cover sm:h-auto sm:w-56" />
            <div className="flex-1 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: CAT_COLOR[it.category] }}>{it.category}</span>
                <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ color: STATUS_COLOR[it.status], background: STATUS_COLOR[it.status] + "1a" }}>{it.status}</span>
                <span className="text-xs text-neutral-500">Confianza {it.confidence}</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{it.name}</h2>
              <p className="text-sm text-neutral-500">Material: {it.material}</p>
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-eco-50 p-4">
                <Recycle className="mt-0.5 shrink-0 text-eco-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-eco-900">Contenedor recomendado</p>
                  <p className="text-sm text-neutral-700">{it.bin}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-6 border-t border-black/5 p-5 sm:grid-cols-2 sm:p-6">
            <List title="Cómo prepararlo" items={it.preparation} empty="Sin pasos especiales." />
            <List title="Reduce su impacto" items={it.tips} empty="Sin recomendaciones adicionales." />
          </div>
        </article>
      ))}

      <p className="flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs text-amber-900">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
        Los colores y reglas de los contenedores varían según tu localidad. Confirma siempre con el servicio de recolección de tu municipio.
      </p>
    </div>
  );
}

function List({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">{empty}</p>
      ) : (
        <ul className="space-y-2 text-sm text-neutral-700">
          {items.map((t, i) => (
            <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-eco-500" />{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
