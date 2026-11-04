function load(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("No se pudo leer la imagen. Prueba con otro archivo JPG, PNG o WEBP."));
    img.src = src;
  });
}

/** Reduce la imagen (lado mayor = max) y la devuelve como JPEG en data URL. */
export async function resize(src: string, max: number, quality = 0.85) {
  const img = await load(src);
  const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(img.naturalWidth * s));
  c.height = Math.max(1, Math.round(img.naturalHeight * s));
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", quality);
}

export async function fileToDataUrl(file: File, max = 1280) {
  const url = URL.createObjectURL(file);
  try {
    return await resize(url, max);
  } finally {
    URL.revokeObjectURL(url);
  }
}
