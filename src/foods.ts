// Alimentos comunes en Colombia, por porción casera. Valores aproximados
// (tablas de composición de alimentos; preparaciones típicas).
// [nombre, porción, kcal, proteína g, carbohidratos g, grasa g, palabras extra para buscar]
type Row = [string, string, number, number, number, number, string?];

const ROWS: Row[] = [
  // Desayunos y panadería
  ["Arepa de maíz blanca", "1 mediana (80 g)", 170, 4, 34, 2, "arepa"],
  ["Arepa con queso", "1 mediana", 280, 10, 34, 12, "arepa queso"],
  ["Arepa de huevo", "1 unidad", 380, 11, 32, 23, "frita costeña"],
  ["Arepa boyacense", "1 unidad", 290, 7, 42, 10, "dulce"],
  ["Pan blanco", "1 tajada", 75, 2.5, 14, 1],
  ["Pan integral", "1 tajada", 80, 3.5, 14, 1.2],
  ["Pan francés / baguette", "1 pieza (60 g)", 165, 5.5, 33, 1],
  ["Pandebono", "1 mediano", 180, 6, 20, 8.5],
  ["Almojábana", "1 mediana", 190, 7, 22, 8],
  ["Buñuelo", "1 mediano", 200, 6, 17, 12],
  ["Croissant", "1 unidad", 230, 5, 26, 12],
  ["Huevo", "1 unidad", 70, 6, 0.5, 5, "huevos"],
  ["Huevo frito", "1 unidad", 95, 6, 0.5, 7.5],
  ["Huevos pericos", "2 huevos con tomate y cebolla", 190, 12, 4, 14, "perico"],
  ["Calentado", "1 plato (arroz y fríjol)", 420, 14, 60, 13, "calentao"],
  ["Changua", "1 plato", 230, 15, 15, 12],
  ["Avena en hojuelas", "4 cucharadas (24 g)", 90, 3, 16, 2],
  ["Granola", "4 cucharadas (25 g)", 115, 3, 16, 4.5],
  ["Cereal azucarado", "1 taza (30 g)", 115, 2, 26, 1],

  // Lácteos
  ["Leche entera", "1 vaso (200 ml)", 125, 6.5, 9.5, 7],
  ["Leche deslactosada descremada", "1 vaso (200 ml)", 70, 6.5, 10, 0.2],
  ["Yogur griego natural", "1 vaso (150 g)", 130, 14, 9, 3.5],
  ["Yogur con dulce", "1 vaso (200 g)", 180, 6, 30, 3.5],
  ["Kumis", "1 vaso (200 ml)", 170, 6, 26, 4.5],
  ["Queso campesino", "1 tajada (30 g)", 80, 5.5, 1, 6, "queso"],
  ["Queso mozzarella", "1 tajada (20 g)", 60, 4.5, 0.5, 4.5, "queso"],
  ["Queso cottage", "2 cucharadas (30 g)", 30, 4, 1, 1],
  ["Kéfir", "1 vaso (200 ml)", 110, 7, 10, 4, "kefir"],

  // Proteínas
  ["Pechuga de pollo a la plancha", "150 g cocida", 250, 46, 0, 6, "pollo"],
  ["Pollo asado con piel", "1 presa (pierna-pernil)", 330, 30, 0, 23, "pollo"],
  ["Pollo apanado", "1 filete", 380, 28, 20, 21, "pollo"],
  ["Carne de res a la plancha", "150 g cocida", 300, 45, 0, 12, "carne"],
  ["Carne molida", "150 g cocida", 330, 38, 0, 19, "carne"],
  ["Lomo de cerdo", "150 g cocido", 280, 42, 0, 11, "cerdo"],
  ["Chicharrón", "1 porción (60 g)", 320, 18, 0, 27],
  ["Chorizo", "1 unidad", 270, 13, 2, 23],
  ["Salchicha", "1 unidad", 150, 6, 2, 13],
  ["Pescado blanco a la plancha", "150 g cocido", 180, 38, 0, 2, "tilapia basa mojarra"],
  ["Mojarra frita", "1 mediana", 420, 45, 5, 24, "pescado"],
  ["Salmón", "150 g cocido", 310, 35, 0, 18],
  ["Atún en agua", "1 lata escurrida", 110, 25, 0, 1, "atun"],
  ["Camarones", "150 g cocidos", 150, 32, 1, 2],
  ["Proteína en polvo (whey)", "1 scoop", 120, 24, 3, 1.5, "scoop batido"],

  // Harinas, granos y acompañantes
  ["Arroz blanco", "1 taza cocido", 205, 4, 45, 0.5, "arroz"],
  ["Arroz blanco", "6 cucharadas cocido", 105, 2, 23, 0.2, "arroz"],
  ["Arroz con pollo", "1 plato", 520, 28, 65, 15],
  ["Pasta cocida", "1 taza", 200, 7, 40, 1, "espagueti"],
  ["Fríjoles", "1 cucharón", 130, 8, 23, 0.5, "frijoles"],
  ["Lentejas", "1 cucharón", 125, 9, 22, 0.5],
  ["Garbanzos", "1 cucharón", 150, 8, 25, 2.5],
  ["Papa cocida", "1 mediana", 90, 2.5, 20, 0.1],
  ["Papa criolla", "3 medianas", 100, 2.5, 22, 0.2],
  ["Papas a la francesa", "1 porción mediana", 365, 4, 48, 17, "papitas fritas"],
  ["Yuca cocida", "1 trozo mediano", 120, 1, 29, 0.3],
  ["Yuca frita", "1 trozo", 230, 1, 32, 11],
  ["Patacón", "2 unidades", 240, 1.5, 32, 12, "plátano verde frito"],
  ["Plátano maduro asado", "½ unidad", 130, 1, 33, 0.3, "maduro"],
  ["Tajadas de maduro fritas", "4 tajadas", 220, 1, 32, 10, "maduro"],
  ["Mazorca", "1 unidad", 125, 4, 27, 1.5, "choclo"],
  ["Quinoa cocida", "½ taza", 110, 4, 20, 1.8],

  // Platos típicos
  ["Bandeja paisa", "1 plato completo", 1250, 55, 120, 60],
  ["Sancocho de gallina", "1 plato", 450, 30, 45, 15, "sopa"],
  ["Ajiaco", "1 plato", 480, 30, 50, 17, "sopa"],
  ["Sopa de verduras", "1 plato", 110, 3, 18, 3],
  ["Mondongo", "1 plato", 420, 28, 35, 18, "sopa"],
  ["Tamal", "1 unidad", 550, 22, 45, 30],
  ["Empanada de carne", "1 mediana", 230, 6, 24, 12],
  ["Arepa rellena", "1 unidad", 450, 20, 40, 22],
  ["Hamburguesa", "1 unidad", 650, 32, 45, 36],
  ["Perro caliente", "1 unidad", 450, 15, 40, 25],
  ["Pizza", "1 porción", 285, 12, 33, 11],
  ["Salchipapa", "1 porción", 700, 18, 60, 42],
  ["Sushi", "8 piezas", 350, 14, 60, 6],
  ["Ensalada verde", "½ plato", 25, 1.5, 5, 0.2, "lechuga tomate pepino"],
  ["Aguacate", "¼ unidad hass", 65, 1, 3, 6],

  // Frutas
  ["Banano", "1 mediano", 105, 1.3, 27, 0.4],
  ["Manzana", "1 mediana", 80, 0.4, 21, 0.3],
  ["Mango", "1 pequeño", 100, 1.4, 25, 0.6],
  ["Papaya", "1 taza", 60, 0.7, 15, 0.4],
  ["Piña", "1 tajada", 50, 0.5, 13, 0.1],
  ["Fresas", "1 taza", 50, 1, 12, 0.5],
  ["Granadilla", "1 unidad", 45, 1, 10, 0.3],
  ["Mandarina", "1 unidad", 45, 0.7, 12, 0.3],
  ["Naranja", "1 unidad", 65, 1.3, 16, 0.2],
  ["Sandía", "1 tajada", 45, 0.9, 11, 0.2],

  // Bebidas y dulces
  ["Agua de panela", "1 vaso", 140, 0, 36, 0, "aguapanela"],
  ["Jugo natural en agua con azúcar", "1 vaso", 110, 0.5, 27, 0, "jugo"],
  ["Jugo en leche", "1 vaso", 210, 6, 35, 5, "jugo"],
  ["Gaseosa", "1 lata (350 ml)", 150, 0, 39, 0, "coca cola"],
  ["Cerveza", "1 lata (330 ml)", 145, 1.5, 12, 0, "pola"],
  ["Café con leche", "1 pocillo", 70, 3.5, 6, 3.5, "tinto"],
  ["Tinto", "1 pocillo", 15, 0, 3, 0, "café"],
  ["Chocolate amargo 70%", "2 cuadritos (20 g)", 120, 1.5, 9, 8.5],
  ["Bocadillo", "1 pequeño", 70, 0, 18, 0],
  ["Galletas de chocolate", "4 unidades", 200, 2.5, 28, 9],
  ["Helado", "1 bola", 140, 2.5, 17, 7],
  ["Postre (torta)", "1 porción", 350, 4, 45, 17, "pastel ponqué"],
  ["Maní", "1 puñado (30 g)", 170, 7.5, 5, 14, "mani"],
  ["Almendras", "1 puñado (25 g)", 145, 5, 5, 12.5],
];

export interface Food {
  name: string;
  portion: string;
  kcal: number;
  p: number;
  c: number;
  g: number;
  key: string;
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const FOODS: Food[] = ROWS.map(([name, portion, kcal, p, c, g, extra]) => ({
  name,
  portion,
  kcal,
  p,
  c,
  g,
  key: norm(`${name} ${extra ?? ""}`),
}));

export function searchFoods(q: string, limit = 12): Food[] {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return FOODS.filter((f) => words.every((w) => f.key.includes(w))).slice(0, limit);
}
