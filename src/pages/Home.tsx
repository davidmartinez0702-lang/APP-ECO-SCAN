import { ImagePlus, Leaf, Sparkles, Recycle } from "lucide-react";

const STEPS = [
  { icon: ImagePlus, t: "Elige una foto", d: "Selecciona desde tu galería la imagen de un residuo." },
  { icon: Sparkles, t: "La IA lo analiza", d: "Identifica el objeto, su material y si se puede reciclar." },
  { icon: Recycle, t: "Recicla bien", d: "Recibe el contenedor recomendado y cómo prepararlo." },
];

export default function Home({ onStart }: { onStart: () => void }) {
  return (
    <section className="py-8 text-center sm:py-16">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-eco-500 to-eco-700 shadow-xl shadow-eco-600/30">
        <Leaf className="text-white" size={40} />
      </div>
      <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">ECO-SCAN</h1>
      <p className="mt-3 text-xl text-neutral-500">Escanea, identifica y recicla.</p>
      <button className="btn-primary mt-8 !px-8 !py-4 text-lg" onClick={onStart}>Analizar residuo</button>

      <div className="mx-auto mt-14 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, t, d }) => (
          <div key={t} className="card p-5">
            <Icon className="text-eco-600" size={24} />
            <h3 className="mt-3 font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-neutral-500">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
