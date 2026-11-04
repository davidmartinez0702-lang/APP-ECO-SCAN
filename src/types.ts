export const CATEGORIES = ["Papel", "Cartón", "Plástico", "Vidrio", "Metales", "Residuos orgánicos", "Residuos electrónicos", "Residuos peligrosos", "Residuos no reciclables"] as const;
export type Category = (typeof CATEGORIES)[number];
export type Status = "Reciclable" | "Reutilizable" | "Compostable" | "No reciclable" | "Depende de la localidad";

export interface WasteItem {
  name: string;
  material: string;
  category: Category;
  status: Status;
  bin: string;
  preparation: string[];
  tips: string[];
  confidence: "alta" | "media" | "baja";
}
export interface AnalysisResult { identified: boolean; message: string; items: WasteItem[] }
export interface HistoryEntry { id: string; date: string; image: string; result: AnalysisResult }

export const CAT_COLOR: Record<Category, string> = {
  Papel: "#3b82f6",
  Cartón: "#b7791f",
  Plástico: "#eab308",
  Vidrio: "#14b8a6",
  Metales: "#64748b",
  "Residuos orgánicos": "#16a34a",
  "Residuos electrónicos": "#8b5cf6",
  "Residuos peligrosos": "#ef4444",
  "Residuos no reciclables": "#52525b",
};
export const STATUS_COLOR: Record<Status, string> = {
  Reciclable: "#16a34a",
  Reutilizable: "#0284c7",
  Compostable: "#65a30d",
  "No reciclable": "#dc2626",
  "Depende de la localidad": "#d97706",
};
