const GROUPS = [
  { title: "Antes de reciclar", tips: [
    "Vacía y enjuaga envases: la grasa y los restos contaminan el resto del material.",
    "Separa tapas, etiquetas y partes de distinto material cuando sea fácil hacerlo.",
    "Mantén el papel y el cartón secos y limpios; el papel con grasa suele no ser reciclable.",
    "Revisa el símbolo de reciclaje de los plásticos, pero confirma qué acepta tu localidad.",
  ]},
  { title: "Reduce tus residuos", tips: [
    "Lleva tu bolsa, botella y contenedor reutilizables.",
    "Compra a granel o en envases retornables cuando puedas.",
    "Planea tus comidas para evitar desperdicio de alimentos.",
    "Repara antes de reemplazar: ropa, calzado, electrónicos y muebles.",
  ]},
  { title: "Residuos especiales", tips: [
    "Pilas, baterías, aparatos electrónicos y focos van a puntos de acopio especiales, no a la basura común.",
    "Medicamentos caducos, aerosoles y químicos requieren manejo aparte; consulta a tu autoridad local.",
    "Los residuos orgánicos pueden convertirse en composta si tienes espacio o programa municipal.",
  ]},
];

export default function Tips() {
  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">EcoTips</h1>
      <p className="mt-1 text-neutral-500">Hábitos sencillos para reciclar mejor y generar menos residuos.</p>
      <div className="mt-6 space-y-5">
        {GROUPS.map((g) => (
          <div key={g.title} className="card p-6">
            <h2 className="text-lg font-semibold">{g.title}</h2>
            <ul className="mt-3 space-y-3 text-neutral-700">
              {g.tips.map((t) => (
                <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-eco-500" />{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
