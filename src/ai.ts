// Estimación de calorías con Claude (foto o descripción).
// La clave de API la pone el usuario y vive solo en su teléfono (localStorage):
// nunca está en el código ni en el repositorio público.

export interface FoodItem {
  name: string;
  portion: string;
  kcal: number;
  p: number; // proteína g
  c: number; // carbohidratos g
  g: number; // grasa g
}

export interface Estimate {
  items: FoodItem[];
  note: string;
}

export const AI_KEY_STORAGE = "plato.ai.key";

export function getKey(): string {
  try {
    return localStorage.getItem(AI_KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
}

const SYSTEM = `Eres un nutricionista que estima calorías y macronutrientes de comidas reales en Colombia.
Recibes una foto de un plato o una descripción en español de lo que alguien comió.
- Identifica cada alimento por separado y estima la porción en medidas caseras colombianas (cucharadas, pocillo, unidad, tajada, gramos).
- Usa valores de alimentos cocidos y preparaciones típicas colombianas (arepa, bandeja, sancocho, empanada, buñuelo, etc.).
- Si la foto o la descripción no dejan clara la cantidad, asume una porción normal de adulto y dilo en "note".
- Redondea kcal a enteros y macros a 1 decimal.
- "note" es una frase corta (máx. 20 palabras) con el supuesto más importante que hiciste, o vacía.
- Si la imagen no muestra comida, devuelve items vacío y explica en "note".`;

const SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nombre corto del alimento en español" },
          portion: { type: "string", description: "Porción estimada en medida casera" },
          kcal: { type: "number" },
          p: { type: "number", description: "Proteína en gramos" },
          c: { type: "number", description: "Carbohidratos en gramos" },
          g: { type: "number", description: "Grasa en gramos" },
        },
        required: ["name", "portion", "kcal", "p", "c", "g"],
        additionalProperties: false,
      },
    },
    note: { type: "string" },
  },
  required: ["items", "note"],
  additionalProperties: false,
};

export class AIError extends Error {
  constructor(
    message: string,
    public kind: "auth" | "rate" | "network" | "refusal" | "parse" | "other",
  ) {
    super(message);
  }
}

/** Reduce la foto a máx. 1024 px en JPEG para que el envío sea rápido y barato. */
export async function compressImage(file: File, max = 1024, quality = 0.8): Promise<{ base64: string; thumb: string }> {
  const bmp = await createImageBitmap(file);
  const draw = (limit: number, q: number) => {
    const scale = Math.min(1, limit / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", q);
  };
  const full = draw(max, quality);
  const thumb = draw(160, 0.7);
  bmp.close();
  return { base64: full.split(",")[1], thumb };
}

export async function estimate(input: { text?: string; imageBase64?: string }): Promise<Estimate> {
  const apiKey = getKey();
  if (!apiKey) throw new AIError("Falta tu clave de API.", "auth");

  // Se carga solo cuando se usa, para no hacer pesada la app.
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  // Uso directo desde el navegador: aceptable aquí porque la clave es del propio usuario y no sale de su dispositivo.
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const content: Array<
    | { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } }
    | { type: "text"; text: string }
  > = [];
  if (input.imageBase64) content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: input.imageBase64 } });
  content.push({
    type: "text",
    text: input.text?.trim()
      ? `Lo que comí: ${input.text.trim()}`
      : "Estima las calorías y macros de lo que hay en esta foto.",
  });

  let response;
  try {
    response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      system: SYSTEM,
      messages: [{ role: "user", content }],
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError)
      throw new AIError("La clave de API no es válida o no tiene permisos.", "auth");
    if (err instanceof Anthropic.RateLimitError) throw new AIError("Demasiadas solicitudes seguidas. Intenta en un minuto.", "rate");
    if (err instanceof Anthropic.APIConnectionError) throw new AIError("Sin conexión. Revisa tu internet.", "network");
    if (err instanceof Anthropic.APIError) throw new AIError(`Error del servicio (${err.status ?? "?"}). Intenta de nuevo.`, "other");
    throw new AIError("No se pudo hacer la estimación.", "other");
  }

  if (response.stop_reason === "refusal") throw new AIError("No se pudo analizar esa solicitud.", "refusal");

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new AIError("La respuesta llegó vacía.", "parse");
  try {
    const data = JSON.parse(text.text) as Estimate;
    return {
      note: data.note ?? "",
      items: (data.items ?? []).map((i) => ({
        name: String(i.name),
        portion: String(i.portion),
        kcal: Math.round(Number(i.kcal) || 0),
        p: Math.round((Number(i.p) || 0) * 10) / 10,
        c: Math.round((Number(i.c) || 0) * 10) / 10,
        g: Math.round((Number(i.g) || 0) * 10) / 10,
      })),
    };
  } catch {
    throw new AIError("No entendí la respuesta. Intenta de nuevo.", "parse");
  }
}
