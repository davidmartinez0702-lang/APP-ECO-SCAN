// Función serverless: la clave de Gemini vive SOLO aquí (variable de entorno del servidor).
const CATEGORIES = ["Papel", "Cartón", "Plástico", "Vidrio", "Metales", "Residuos orgánicos", "Residuos electrónicos", "Residuos peligrosos", "Residuos no reciclables"];
const STATUSES = ["Reciclable", "Reutilizable", "Compostable", "No reciclable", "Depende de la localidad"];
const CONFIDENCE = ["alta", "media", "baja"];
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const PROMPT = `Eres un experto en gestión de residuos y reciclaje. Analiza la fotografía y responde en español.
Reglas estrictas:
- Identifica cada objeto visible de forma individual (máximo 6).
- Si la imagen está borrosa, muy oscura, no muestra un residuo o no puedes identificar el objeto con seguridad, devuelve identified=false, items=[] y en "message" pide otra fotografía explicando qué mejorar.
- NUNCA inventes. Si no hay suficiente información para saber si algo es reciclable (p. ej. plástico sin símbolo visible, envases multicapa, material dudoso), usa el estado "Depende de la localidad" y confidence "baja" o "media", y explica la duda en "tips".
- "material": material principal observado. "category": una de la lista permitida.
- "status": uno de los valores permitidos.
- "bin": contenedor recomendado en forma descriptiva (p. ej. "Contenedor de plásticos y envases"); los colores varían según la localidad, no afirmes un color como universal.
- "preparation": pasos concretos para preparar el residuo antes de desecharlo (vaciar, enjuagar, aplastar, separar tapas, etc.).
- "tips": recomendaciones para reducir su impacto ambiental (reducir, reutilizar, alternativas).
- Residuos peligrosos (pilas, medicamentos, aerosoles, químicos) y electrónicos: indica llevarlos a puntos de acopio especiales.`;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    identified: { type: "BOOLEAN" },
    message: { type: "STRING" },
    items: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          material: { type: "STRING" },
          category: { type: "STRING", enum: CATEGORIES },
          status: { type: "STRING", enum: STATUSES },
          bin: { type: "STRING" },
          preparation: { type: "ARRAY", items: { type: "STRING" } },
          tips: { type: "ARRAY", items: { type: "STRING" } },
          confidence: { type: "STRING", enum: CONFIDENCE },
        },
        required: ["name", "material", "category", "status", "bin", "preparation", "tips", "confidence"],
      },
    },
  },
  required: ["identified", "message", "items"],
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const strs = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : []);

export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);

  const key = process.env.GEMINI_API_KEY;
  if (!key) return json({ error: "El servidor no tiene configurada la variable GEMINI_API_KEY." }, 500);

  let body: { image?: unknown; mimeType?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Solicitud inválida." }, 400);
  }
  const { image, mimeType } = body;
  if (typeof image !== "string" || typeof mimeType !== "string" || !ALLOWED.includes(mimeType)) {
    return json({ error: "Formato de imagen no permitido. Usa JPG, PNG o WEBP." }, 400);
  }
  if (image.length > 5_000_000) return json({ error: "La imagen es demasiado grande." }, 413);

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  let res: Response;
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: mimeType, data: image } }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          responseSchema: SCHEMA,
        },
      }),
    });
  } catch {
    return json({ error: "No se pudo contactar al servicio de IA. Intenta de nuevo." }, 502);
  }

  if (!res.ok) {
    if (res.status === 429) return json({ error: "Se alcanzó el límite de uso de la IA. Espera un minuto e inténtalo otra vez." }, 429);
    if (res.status === 400 || res.status === 403) return json({ error: "La clave de Gemini no es válida o no tiene permisos." }, 502);
    return json({ error: "El servicio de IA no respondió correctamente." }, 502);
  }

  try {
    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.find((p: { text?: string }) => p.text)?.text;
    if (!text) throw new Error("vacío");
    const parsed = JSON.parse(text);

    const items = (Array.isArray(parsed.items) ? parsed.items : [])
      .filter((i: any) => i && CATEGORIES.includes(i.category) && STATUSES.includes(i.status) && typeof i.name === "string")
      .map((i: any) => ({
        name: i.name,
        material: String(i.material ?? ""),
        category: i.category,
        status: i.status,
        bin: String(i.bin ?? ""),
        preparation: strs(i.preparation),
        tips: strs(i.tips),
        confidence: CONFIDENCE.includes(i.confidence) ? i.confidence : "baja",
      }));

    const identified = Boolean(parsed.identified) && items.length > 0;
    return json({
      identified,
      message: String(parsed.message ?? "") || (identified ? "" : "No pude identificar el objeto. Intenta con otra fotografía más clara."),
      items: identified ? items : [],
    });
  } catch {
    return json({ error: "No pude interpretar la respuesta de la IA. Intenta con otra fotografía." }, 502);
  }
};
