import { useRef, useState } from "react";
import { AlertCircle, ImagePlus, Loader2, RefreshCw } from "lucide-react";
import { analyzeImage } from "../lib/api";
import { fileToDataUrl, resize } from "../lib/image";
import type { HistoryEntry } from "../types";

const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 20;

export default function Scan({ onDone }: { onDone: (e: HistoryEntry) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retake, setRetake] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (!file) return;
    setError(null);
    setRetake(false);
    if (!TYPES.includes(file.type)) return setError("Formato no compatible. Usa JPG, JPEG, PNG o WEBP.");
    if (file.size > MAX_MB * 1024 * 1024) return setError(`La imagen supera ${MAX_MB} MB. Elige una más ligera.`);
    try {
      setPreview(await fileToDataUrl(file));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function analyze() {
    if (!preview) return;
    setLoading(true);
    setError(null);
    setRetake(false);
    try {
      const result = await analyzeImage(preview);
      if (!result.identified) {
        setRetake(true);
        setError(result.message || "No pude identificar el objeto. Elige otra fotografía.");
        return;
      }
      const thumb = await resize(preview, 320, 0.7);
      onDone({ id: crypto.randomUUID?.() ?? String(Date.now()), date: new Date().toISOString(), image: thumb, result });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <h1 className="text-3xl font-bold tracking-tight">Analizar residuo</h1>
      <p className="mt-1 text-neutral-500">Elige una foto de tu galería. Funciona con JPG, PNG y WEBP.</p>

      <input ref={input} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={onPick} />

      <div className="card mt-6 overflow-hidden">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Vista previa" className="max-h-[420px] w-full object-contain bg-neutral-50" />
            {loading && (
              <div className="absolute inset-0 bg-eco-900/20">
                <div className="scan-line absolute left-0 right-0 h-1 bg-eco-500 shadow-[0_0_24px_6px_rgba(52,163,104,.7)]" />
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => input.current?.click()} className="flex h-72 w-full flex-col items-center justify-center gap-3 text-neutral-500 transition hover:bg-eco-50 hover:text-eco-700">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-eco-100 text-eco-600"><ImagePlus size={30} /></span>
            <span className="font-medium">Seleccionar de la galería</span>
          </button>
        )}
      </div>

      {error && (
        <div role="alert" className={`mt-4 flex gap-3 rounded-2xl p-4 text-sm ${retake ? "bg-amber-50 text-amber-900" : "bg-red-50 text-red-800"}`}>
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary flex-1" disabled={!preview || loading} onClick={analyze}>
          {loading ? <><Loader2 className="animate-spin" size={18} /> Analizando…</> : error && !retake && preview ? <><RefreshCw size={18} /> Reintentar análisis</> : "Analizar residuo"}
        </button>
        {preview && (
          <button className="btn-ghost" disabled={loading} onClick={() => input.current?.click()}>
            {retake ? "Elegir otra foto" : "Cambiar foto"}
          </button>
        )}
      </div>
    </section>
  );
}
