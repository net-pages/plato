// Plan de alimentación — Nutricionista Ana María Isaza (Universidad CES)
// Las porciones vienen EXACTAS del plan. Las recetas solo explican cómo prepararlo.

export type MealId = "desayuno" | "mm" | "almuerzo" | "mt" | "cena";

export interface Recipe {
  title: string;
  items: string[];
  steps: string[];
  minutes: number;
  free?: boolean;
  /** Estimado: kcal y macros (g). Ver NUTRI más abajo. */
  kcal?: number;
  p?: number;
  c?: number;
  g?: number;
}

export const MEALS: { id: MealId; name: string; time: string }[] = [
  { id: "desayuno", name: "Desayuno", time: "06:30" },
  { id: "mm", name: "Media mañana", time: "09:30" },
  { id: "almuerzo", name: "Almuerzo", time: "12:30" },
  { id: "mt", name: "Media tarde", time: "16:00" },
  { id: "cena", name: "Cena", time: "19:30" },
];

export const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
export const DAYS_SHORT = ["D", "L", "M", "M", "J", "V", "S"];

// Clave = día de la semana de JavaScript (0 = domingo … 6 = sábado)
export const PLAN: Record<number, Record<MealId, Recipe>> = {
  1: {
    desayuno: {
      title: "Sándwich abierto de huevo y mozzarella",
      items: ["3 huevos", "2 tajadas de queso mozzarella", "1 tajada de pan integral", "Tomate", "Cacao en agua"],
      steps: [
        "Bate los huevos con sal y pimienta. Revuélvelos en sartén antiadherente a fuego medio (con aceite en spray).",
        "Tuesta el pan, ponle tomate en rodajas, la mozzarella y los huevos encima.",
        "Cacao: 1 cda de cacao puro en una taza de agua caliente. Endulza con stevia si quieres.",
      ],
      minutes: 10,
    },
    mm: {
      title: "Batido de banano y avena",
      items: ["1 banano", "1 scoop de proteína", "4 cdas de avena"],
      steps: ["Licúa todo con 250 ml de agua fría y hielo.", "Si lo quieres más espeso, usa el banano congelado."],
      minutes: 3,
    },
    almuerzo: {
      title: "Pollo a la plancha con arroz y papa",
      items: ["150 g de pollo", "6 cdas de arroz", "1 papa cocinada", "½ plato de ensalada", "⅛ de aguacate común", "Soda con limón"],
      steps: [
        "Adoba el pollo con ajo, limón, comino, sal y pimienta (ideal: desde la noche anterior).",
        "Cocínalo en plancha bien caliente, 5–6 min por lado, hasta que esté dorado y sin rosado por dentro.",
        "Papa: cocínala en agua con sal unos 20 min, o usa la del prep.",
        "Ensalada: lechuga, tomate y pepino con limón y sal. Pon el aguacate encima.",
      ],
      minutes: 25,
    },
    mt: {
      title: "Galletas de arroz con yogur y fresas",
      items: ["2 galletas de arroz", "1 vaso de yogur", "9 fresas"],
      steps: ["Corta las fresas en láminas y ponlas sobre las galletas.", "Acompaña con el yogur."],
      minutes: 3,
    },
    cena: {
      title: "Carne asada con arepa",
      items: ["150 g de carne de res", "1 arepa pequeña", "Aromática"],
      steps: [
        "Adoba la carne con ajo, sal y pimienta.",
        "Sartén o plancha muy caliente, 3–4 min por lado. Déjala reposar 2 min antes de cortarla.",
        "Asa la arepa en la misma plancha.",
      ],
      minutes: 15,
    },
  },
  2: {
    desayuno: {
      title: "Pollo desmechado con tomate y tostada",
      items: ["150 g de pollo desmechado", "Tomate", "1 tostada integral", "Café"],
      steps: [
        "Usa el pollo desmechado del meal prep (pestaña «Prep»).",
        "Saltea tomate y cebolla picados 3 min, agrega el pollo y calienta 2 min más.",
        "Sírvelo sobre la tostada o al lado.",
      ],
      minutes: 8,
    },
    mm: {
      title: "Proteína con cereal y ciruela",
      items: ["1 ciruela", "1 scoop de proteína", "4 cdas de cereal sin azúcar"],
      steps: ["Bate la proteína en el shaker con 250 ml de agua.", "Come aparte el cereal con la ciruela picada."],
      minutes: 2,
    },
    almuerzo: {
      title: "Cerdo con moneditas de plátano y sopa",
      items: ["150 g de carne de cerdo", "1 pocillo pequeño de moneditas de plátano verde", "1 porción de sopa", "½ plato de ensalada", "¼ de aguacate hass", "Clight"],
      steps: [
        "Lomo de cerdo: adóbalo con ajo, orégano y sal. Plancha 5 min por lado.",
        "Moneditas SIN freír: plátano verde en rodajas finas, aceite en spray y sal. Air fryer a 180 °C por 12–15 min.",
        "Sopa: una de verduras (ahuyama, zanahoria, habichuela) es la opción más liviana.",
        "Ensalada con el aguacate encima.",
      ],
      minutes: 30,
    },
    mt: {
      title: "Tostada de cottage, canela y piña",
      items: ["1 tajada de pan integral", "2 cdas de queso cottage", "1 tajada de piña", "Canela"],
      steps: ["Tuesta el pan y úntale el cottage.", "Pon la piña en cubos encima y espolvorea canela."],
      minutes: 4,
    },
    cena: {
      title: "Taco de pollo con hogao",
      items: ["150 g de pollo desmechado", "Hogao", "1 tortilla de maíz pequeña (talla M)", "Hatsu sin azúcar"],
      steps: [
        "Hogao: tomate y cebolla larga picados, a fuego bajo 10 min con sal y comino.",
        "Mezcla el pollo con el hogao.",
        "Calienta la tortilla en sartén seco y rellénala.",
      ],
      minutes: 12,
    },
  },
  3: {
    desayuno: {
      title: "Wrap de huevo con espinaca",
      items: ["3 huevos", "Espinaca", "1 tajada de queso", "1 tortilla integral (talla M)", "Cacao en agua"],
      steps: [
        "Saltea un puñado de espinaca 1 min, agrega los huevos batidos y revuelve.",
        "Calienta la tortilla, pon el queso y luego el huevo encima para que se derrita.",
        "Enróllala y córtala en dos.",
      ],
      minutes: 10,
    },
    mm: {
      title: "Proteína con papaya y galletas de arroz",
      items: ["1 tajada de papaya", "1 scoop de proteína", "2 galletas de arroz"],
      steps: ["Shaker con la proteína y 250 ml de agua.", "Papaya en cubos con limón y las galletas al lado."],
      minutes: 3,
    },
    almuerzo: {
      title: "Res con lentejas y maduro",
      items: ["150 g de carne de res", "1 porción de lentejas", "¼ de plátano maduro", "½ plato de ensalada", "1 cdita de balsámico", "Aromática"],
      steps: [
        "Lentejas (del prep o al momento): cocínalas 25 min con hogao, comino y sal. Porción = 1 cucharón colmado.",
        "Maduro: en rodajas al air fryer a 180 °C por 10 min, o al horno.",
        "Carne a la plancha 3–4 min por lado.",
        "Ensalada aliñada con el balsámico.",
      ],
      minutes: 30,
    },
    mt: {
      title: "Parfait de yogur griego y manzana",
      items: ["4 cdas de cereal sin azúcar", "1 vaso de yogur griego", "1 manzana verde"],
      steps: ["En un vaso alterna capas de yogur, manzana picada y cereal.", "Ponle canela por encima."],
      minutes: 4,
    },
    cena: {
      title: "Sándwich de atún y huevo",
      items: ["1 lata de atún", "1 huevo", "Vegetales", "2 tajadas de pan integral", "¼ de aguacate hass", "Agua saborizada"],
      steps: [
        "Saltea cebolla, tomate y pimentón picados 2 min. Agrega el atún escurrido y el huevo, y revuelve.",
        "Arma el sándwich con el pan tostado y el aguacate en láminas.",
      ],
      minutes: 10,
    },
  },
  4: {
    desayuno: {
      title: "Revuelto de atún y huevo",
      items: ["1 lata de atún", "Vegetales", "2 huevos", "2 galletas de arroz", "Cacao en agua"],
      steps: [
        "Saltea cebolla, tomate y pimentón 2 min.",
        "Agrega el atún escurrido y los huevos, y revuelve hasta que cuajen.",
        "Sírvelo sobre las galletas de arroz.",
      ],
      minutes: 10,
    },
    mm: {
      title: "Proteína con granadilla y galletas",
      items: ["1 granadilla", "1 scoop de proteína", "3 galletas integrales"],
      steps: ["Shaker con la proteína y agua.", "La granadilla y las galletas al lado (fácil de llevar)."],
      minutes: 2,
    },
    almuerzo: {
      title: "Pescado al limón con yuca y arroz",
      items: ["150 g de pescado", "1 trozo de yuca", "6 cdas de arroz", "½ plato de ensalada", "1 cda de aceite de oliva crudo", "Agua saborizada"],
      steps: [
        "Adoba el pescado (tilapia, basa o merluza) con limón, ajo, perejil y sal.",
        "Plancha 3–4 min por lado, o envuelto en papel aluminio al horno a 200 °C por 15 min.",
        "Yuca: cocínala en agua con sal 25 min hasta que esté blanda.",
        "El aceite de oliva va crudo sobre la ensalada.",
      ],
      minutes: 30,
    },
    mt: {
      title: "Avena con kéfir y sandía",
      items: ["4 cdas de avena", "1 vaso de kéfir", "1 tajada de sandía"],
      steps: ["Mezcla la avena con el kéfir. Si la dejas en la nevera desde la mañana, queda tipo «overnight oats».", "Sirve la sandía en cubos al lado o encima."],
      minutes: 3,
    },
    cena: {
      title: "Wrap de carne desmechada",
      items: ["150 g de carne desmechada", "1 tortilla integral (talla M)", "Vegetales", "Hatsu sin azúcar"],
      steps: [
        "Usa la carne desmechada del prep y caliéntala con hogao.",
        "Saltea pimentón y cebolla en tiras 3 min.",
        "Arma el wrap con la tortilla caliente.",
      ],
      minutes: 10,
    },
  },
  5: {
    desayuno: {
      title: "Pancake de avena y huevos con zanahoria",
      items: ["1 pancake de avena", "3 huevos", "Zanahoria rallada", "Café"],
      steps: [
        "Pancake: licúa 4 cdas de avena, 1 de los 3 huevos, un chorrito de agua, canela y una pizca de polvo de hornear. Cocínalo en sartén con spray, 2 min por lado.",
        "Revuelve los otros 2 huevos con un puñado de zanahoria rallada.",
      ],
      minutes: 12,
    },
    mm: {
      title: "Proteína con durazno y rosquitas",
      items: ["1 durazno", "1 scoop de proteína", "1 paquete de rosquitas"],
      steps: ["Shaker con la proteína y agua.", "El durazno y las rosquitas al lado."],
      minutes: 2,
    },
    almuerzo: {
      title: "Salmón con pasta al pesto",
      items: ["150 g de salmón", "2 pocillos pequeños de pasta", "Vegetales salteados", "1 cdita de pesto", "Soda sin azúcar"],
      steps: [
        "Salmón con sal y limón: con la piel hacia abajo en sartén caliente 4 min, voltéalo y cocínalo 2–3 min más.",
        "Cocina la pasta al dente.",
        "Saltea brócoli, calabacín y pimentón 4 min, y mézclalos con la pasta y el pesto.",
      ],
      minutes: 20,
    },
    mt: {
      title: "Galletas con cottage y kiwi",
      items: ["3 galletas integrales", "2 cdas de queso cottage", "1 kiwi"],
      steps: ["Unta el cottage en las galletas y pon el kiwi en rodajas encima."],
      minutes: 3,
    },
    cena: {
      title: "Lomo de atún sellado",
      items: ["150 g de lomo de atún", "Vegetales", "1 tortilla de maíz pequeña (talla M)", "Soda saborizada"],
      steps: [
        "Sal, pimienta y ajonjolí (opcional). Sartén muy caliente, 1–2 min por lado.",
        "Saltea los vegetales y sírvelos con la tortilla caliente.",
      ],
      minutes: 12,
    },
  },
  6: {
    desayuno: {
      title: "Huevos con arepa y hogao",
      items: ["4 huevos", "1 arepa pequeña", "Hogao", "Cacao en agua"],
      steps: ["Haz los huevos revueltos o en tortilla.", "Asa la arepa y ponle el hogao encima."],
      minutes: 10,
    },
    mm: {
      title: "Batido de arándanos y avena",
      items: ["1 pocillo pequeño de arándanos", "1 scoop de proteína", "4 cdas de avena"],
      steps: ["Licúa todo con 250 ml de agua fría y hielo."],
      minutes: 3,
    },
    almuerzo: {
      title: "Camarones al ajillo con pasta y papas",
      items: ["150 g de camarones", "1 pocillo pequeño de papas en air fryer", "1 pocillo pequeño de pasta", "Vegetales salteados", "1 cdita de pasta de tomate natural", "Aromática"],
      steps: [
        "Papas en cascos con spray, sal y paprika: air fryer a 190 °C por 18 min.",
        "Saltea ajo picado 30 s y agrega los camarones 2 min por lado. Cuando se pongan rosados, ya están.",
        "Agrega los vegetales, la pasta cocida y la pasta de tomate, y mezcla 1 min.",
      ],
      minutes: 25,
    },
    mt: {
      title: "Bowl de yogur griego, granola y mango",
      items: ["4 cdas de granola sin azúcar", "1 vaso de yogur griego", "1 mango pequeño"],
      steps: ["Yogur en un bowl, el mango en cubos y la granola encima."],
      minutes: 3,
    },
    cena: {
      title: "Comida libre",
      free: true,
      items: ["Lo que quieras, en porción normal"],
      steps: ["Disfrútala sin culpa: es parte del plan.", "Si incluye proteína (hamburguesa, sushi, pollo), mejor para tu recuperación."],
      minutes: 0,
    },
  },
  0: {
    desayuno: {
      title: "Huevos pericos con arepa y queso",
      items: ["3 huevos", "Tomate", "1 tajada de queso", "1 arepa pequeña", "Cacao en agua"],
      steps: ["Saltea tomate y cebolla larga 2 min, agrega los huevos y revuelve.", "Asa la arepa con el queso encima."],
      minutes: 10,
    },
    mm: {
      title: "Batido de fresa con granola",
      items: ["9 fresas", "1 scoop de proteína", "4 cdas de granola sin azúcar"],
      steps: ["Licúa las fresas y la proteína con agua y hielo.", "Deja la granola aparte para que quede crocante."],
      minutes: 3,
    },
    almuerzo: {
      title: "Bowl de carne molida, frijoles y arroz",
      items: ["150 g de carne de res molida", "1 cucharón de frijoles", "6 cdas de arroz", "⅛ de aguacate común", "Pico de gallo", "Clight"],
      steps: [
        "Carne molida: sofríela con hogao, comino y sal 8–10 min.",
        "Pico de gallo: tomate, cebolla roja y cilantro picados, con limón y sal.",
        "Arma el bowl con arroz, frijoles, carne, pico de gallo y aguacate.",
      ],
      minutes: 20,
    },
    mt: {
      title: "Postre libre",
      free: true,
      items: ["Un postre que te guste"],
      steps: ["Es tu dulce grande de la semana. Disfrútalo."],
      minutes: 0,
    },
    cena: {
      title: "Bowl de pollo y quinoa",
      items: ["150 g de pollo desmechado", "10 cdas de quinoa", "Bowl de vegetales", "Aromática"],
      steps: [
        "Quinoa: lávala y cocínala con el doble de agua 15 min.",
        "Vegetales asados o salteados: brócoli, zanahoria, pimentón, champiñones.",
        "Arma el bowl con el pollo encima. Agrega limón y pimienta al gusto.",
      ],
      minutes: 20,
    },
  },
};

export const PREP = [
  { what: "Pollo desmechado", qty: "≈ 600 g crudo", why: "Mar desayuno · Mar cena · Dom cena", how: "Cocina pechugas en agua con cebolla, ajo, laurel y sal 25 min. Desméchalas y guárdalas en porciones de 150 g." },
  { what: "Carne desmechada", qty: "≈ 200 g", why: "Jue cena", how: "Cocina la falda en olla a presión 35 min con cebolla y ajo. Desméchala y congélala." },
  { what: "Hogao", qty: "1 frasco", why: "Mar · Mié · Jue · Sáb · Dom", how: "3 tomates y 4 tallos de cebolla larga picados, a fuego bajo 15 min con sal y comino. Dura 5 días en la nevera." },
  { what: "Arroz", qty: "2 porciones", why: "Lun · Jue almuerzo", how: "Cocínalo y guárdalo en porciones de 6 cdas." },
  { what: "Lentejas", qty: "1 porción", why: "Mié almuerzo", how: "Cocínalas con hogao y congela la porción (1 cucharón colmado)." },
  { what: "Papa y yuca cocidas", qty: "1 de cada una", why: "Lun · Jue almuerzo", how: "Cocínalas en agua con sal. Duran hasta 3 días en la nevera." },
  { what: "Ensalada base", qty: "para 5 días", why: "Todos los almuerzos", how: "Lechuga, pepino y tomate lavados y secos, en un recipiente con papel de cocina." },
];

export const TIPS = [
  "No te saltes comidas: el plan es fraccionado a propósito.",
  "Toma abundante agua y bebidas sin calorías todo el día.",
  "Duerme temprano (8–10 p. m.): ayuda a las hormonas y a la recuperación.",
  "Prefiere yogur alto en proteína, nueces y frutas en vez de paquetes y dulces.",
  "Grasas buenas: aguacate y aceite de oliva, canola o girasol.",
  "Evita fritos, crema de leche, queso crema y mantequilla.",
  "Después de las pesas, haz 20 min de cardio.",
  "Un dulce pequeño al día está permitido: chocolate amargo, bocadillo, panelita o gelatina sin azúcar.",
  "Una vez a la semana: un dulce grande y una comida salada a tu elección.",
];

export const BRANDS: [string, string][] = [
  ["Lácteos", "Finesse · Taeq · Slight Colanta · Vitta Latti · San Martín · Alpina sabor natural"],
  ["Pan tajado", "Fit Bimbo · Vital Bimbo · Mari Méndez · Fit Cook"],
  ["Pan masa madre", "Amuleto Bakery"],
  ["Galletas", "Tosh de semillas · Saltinas integrales · Club Social integral · Natri · Susanita · Sanissimo"],
  ["Granola o cereal sin azúcar", "Hojuelas de maíz sin azúcar D1 · Finesse sin azúcar · Tosh avena y arándanos · Quinapop Nutrisano"],
];

export const SWAPS: { group: string; note: string; list: [string, string][] }[] = [
  {
    group: "Harinas",
    note: "1 porción equivale a…",
    list: [
      ["Arroz blanco", "6 cdas rasas"], ["Arroz integral", "8 cdas rasas"], ["Avena en hojuelas", "4 cdas rasas"],
      ["Arepa de maíz delgada", "1 pequeña"], ["Pan integral", "1 tajada delgada"], ["Pasta cocida", "1 pocillo chocolatero"],
      ["Quinoa cocida", "100 g"], ["Galletas de soda", "3"], ["Tortilla de maíz o trigo", "1 pequeña delgada"],
      ["Papa común", "1 mediana"], ["Papa criolla", "3 medianas"], ["Yuca", "1 trozo mediano"],
      ["Plátano verde", "½ mediano"], ["Plátano maduro", "¼ mediano"], ["Fríjol o lenteja", "1 cucharón colmado"],
    ],
  },
  {
    group: "Frutas",
    note: "1 porción equivale a…",
    list: [
      ["Banano", "1 pequeño"], ["Fresas", "9 medianas"], ["Granadilla", "1 mediana"], ["Kiwi", "1 mediano"],
      ["Mango", "1 pequeño"], ["Manzana", "1 pequeña"], ["Papaya", "1 trozo mediano"], ["Piña", "1 tajada delgada"],
      ["Sandía", "1 tajada mediana"], ["Mora", "½ pocillo"], ["Uchuvas", "15"], ["Pera", "½"],
    ],
  },
  {
    group: "Grasas",
    note: "1 porción equivale a…",
    list: [
      ["Aguacate común", "⅛ de unidad"], ["Aguacate hass", "¼ de unidad"], ["Aceite de oliva o canola", "1 cda sopera"],
      ["Aceitunas", "12"], ["Almendras o maní", "1 cda sopera"], ["Mantequilla de maní", "1 cdita colmada"],
    ],
  },
  {
    group: "Lácteos",
    note: "1 porción equivale a…",
    list: [["Yogur griego", "1 vaso pequeño"], ["Yogur descremado", "1 vaso pequeño"], ["Leche descremada", "1 vaso pequeño"], ["Kéfir", "1 vaso pequeño"]],
  },
];

// Estimado de kcal y macros por plato [kcal, proteína, carbohidratos, grasa],
// calculado ingrediente por ingrediente con porciones cocidas. Es aproximado.
const NUTRI: Record<number, Partial<Record<MealId, [number, number, number, number]>>> = {
  1: { desayuno: [430, 31, 18, 25], mm: [300, 27, 42, 4], almuerzo: [500, 51, 46, 11], mt: [200, 10, 35, 2], cena: [420, 48, 24, 13] },
  2: { desayuno: [335, 48, 14, 7], mm: [225, 26, 28, 2], almuerzo: [575, 45, 48, 18], mt: [160, 7, 28, 2], cena: [340, 48, 17, 8] },
  3: { desayuno: [400, 27, 22, 22], mm: [245, 25, 32, 2], almuerzo: [520, 55, 46, 13], mt: [275, 16, 44, 4], cena: [425, 37, 35, 14] },
  4: { desayuno: [350, 38, 20, 11], mm: [255, 26, 26, 5], almuerzo: [495, 42, 55, 13], mt: [245, 10, 37, 6], cena: [465, 46, 24, 20] },
  5: { desayuno: [320, 22, 22, 17], mm: [275, 26, 31, 6], almuerzo: [590, 44, 47, 23], mt: [165, 6, 25, 4], cena: [290, 46, 18, 3] },
  6: { desayuno: [440, 28, 30, 22], mm: [265, 27, 33, 4], almuerzo: [405, 39, 52, 4], mt: [310, 17, 42, 7] },
  0: { desayuno: [410, 27, 28, 21], mm: [260, 28, 28, 6], almuerzo: [630, 48, 55, 25], cena: [420, 53, 31, 8] },
};
for (const [day, meals] of Object.entries(NUTRI)) {
  for (const [id, v] of Object.entries(meals)) {
    const r = PLAN[Number(day)][id as MealId];
    [r.kcal, r.p, r.c, r.g] = v!;
  }
}

/** Requerimiento diario según el plan de la nutricionista. */
export const KCAL_REQUIREMENT = 2410;
