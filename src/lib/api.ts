import type { AnalysisResult } from "../types";

export async function analyzeImage(dataUrl: string): Promise<AnalysisResult> {
  const image = dataUrl.split(",")[1];
  let res: Response;
  try {
    res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, mimeType: "image/jpeg" }),
    });
  } catch {
    throw new Error("No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.");
  }
  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("El servidor de análisis no está disponible. En local usa «npm run dev:netlify».");
  }
  if (!res.ok) throw new Error(data?.error || "No se pudo analizar la imagen.");
  return data as AnalysisResult;
}
