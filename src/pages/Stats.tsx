import { useMemo } from "react";
import { CATEGORIES, CAT_COLOR, STATUS_COLOR, type HistoryEntry, type Status } from "../types";

const STATUSES = Object.keys(STATUS_COLOR) as Status[];
const USEFUL: Status[] = ["Reciclable", "Reutilizable", "Compostable"];

function Bars({ rows }: { rows: { label: string; n: number; color: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-sm"><span>{r.label}</span><span className="font-medium">{r.n}</span></div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(r.n / max) * 100}%`, background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Stats({ list }: { list: HistoryEntry[] }) {
  const s = useMemo(() => {
    const items = list.flatMap((e) => e.result.items);
    const byCat = CATEGORIES.map((c) => ({ label: c, n: items.filter((i) => i.category === c).length, color: CAT_COLOR[c] }));
    const byStatus = STATUSES.map((c) => ({ label: c, n: items.filter((i) => i.status === c).length, color: STATUS_COLOR[c] }));
    const useful = items.filter((i) => USEFUL.includes(i.status)).length;
    return { total: items.length, byCat, byStatus, useful };
  }, [list]);

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
      {s.total === 0 ? (
        <p className="card mt-6 p-10 text-center text-neutral-500">Analiza un residuo para ver tus estadísticas.</p>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="card p-4"><p className="text-3xl font-bold text-eco-600">{list.length}</p><p className="text-xs text-neutral-500">Fotos analizadas</p></div>
            <div className="card p-4"><p className="text-3xl font-bold text-eco-600">{s.total}</p><p className="text-xs text-neutral-500">Objetos identificados</p></div>
            <div className="card p-4"><p className="text-3xl font-bold text-eco-600">{Math.round((s.useful / s.total) * 100)}%</p><p className="text-xs text-neutral-500">Aprovechables</p></div>
          </div>
          <div className="card p-6"><h2 className="mb-4 font-semibold">Por categoría</h2><Bars rows={s.byCat.filter((r) => r.n > 0)} /></div>
          <div className="card p-6"><h2 className="mb-4 font-semibold">Por estado</h2><Bars rows={s.byStatus.filter((r) => r.n > 0)} /></div>
          <div className="card p-6 text-sm text-neutral-600">
            <h2 className="mb-2 font-semibold text-neutral-900">Impacto ambiental</h2>
            <p>De {s.total} objetos identificados, {s.useful} pueden reciclarse, reutilizarse o compostarse en lugar de terminar como basura común.</p>
            <p className="mt-2 text-xs text-neutral-400">ECO-SCAN no convierte esto en kilos de CO₂, árboles u otras equivalencias, porque sin pesar los objetos esas cifras serían inventadas. Las estadísticas se guardan solo en este dispositivo.</p>
          </div>
        </div>
      )}
    </section>
  );
}
