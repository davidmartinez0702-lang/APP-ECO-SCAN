# ECO-SCAN · Escanea, identifica y recicla

React + TypeScript + Tailwind + Netlify Functions + Gemini API.
La clave de Gemini solo existe en el servidor (`netlify/functions/analyze.ts`); el navegador nunca la ve.

## Estructura
```
eco-scan/
├─ netlify/functions/analyze.ts   ← llama a Gemini (usa GEMINI_API_KEY)
├─ src/
│  ├─ pages/        Home, Scan, History, Tips, Stats
│  ├─ components/   ResultView (tarjetas de resultado)
│  ├─ lib/          api.ts, image.ts, storage.ts (LocalStorage)
│  ├─ App.tsx · main.tsx · types.ts · index.css
├─ netlify.toml · tailwind.config.js · vite.config.ts · package.json
└─ .env.example
```

## 1. Obtener la clave de Gemini (gratis)
1. Entra a https://aistudio.google.com/apikey con tu cuenta de Google.
2. Pulsa **Create API key** y copia la clave.

## 2. Instalar y ejecutar en local
Requiere Node.js 18 o superior.
```bash
npm install
cp .env.example .env        # y pega tu clave en GEMINI_API_KEY
npm run dev:netlify         # abre http://localhost:8888
```
Usa `dev:netlify` (no `npm run dev`): es el que ejecuta también la función que habla con Gemini.

## 3. Publicar en Netlify
1. Sube la carpeta a un repositorio de GitHub (el `.gitignore` ya excluye `.env`).
2. En https://app.netlify.com → **Add new site → Import an existing project** → elige el repositorio.
   Netlify detecta `netlify.toml` (build: `npm run build`, publish: `dist`).
3. Antes de desplegar: **Site configuration → Environment variables → Add variable**
   `GEMINI_API_KEY` = tu clave (puedes añadir `GEMINI_MODEL` si quieres otro modelo).
4. **Deploy**. Si añadiste la variable después, haz **Deploys → Trigger deploy**.
5. Comparte el enlace `https://tu-sitio.netlify.app`.

Nota: arrastrar la carpeta `dist` a Netlify Drop NO publica las funciones; usa Git o `npx netlify deploy --prod`.
