// Lista de mercado semanal, sumada a mano desde el plan (lunes a domingo).
// "para" indica qué comidas lo usan, para que puedas ajustar si cambias algo.

export interface ShopItem {
  name: string;
  qty: string;
  para?: string;
}

export const SHOPPING: { cat: string; items: ShopItem[] }[] = [
  {
    cat: "Proteínas",
    items: [
      { name: "Huevos", qty: "19 (≈ 1½ docena + 1)", para: "Desayunos y cena del miércoles" },
      { name: "Pechuga de pollo", qty: "750 g", para: "Lun almuerzo + 600 g para desmechar" },
      { name: "Carne de res magra", qty: "300 g", para: "Lun cena · Mié almuerzo" },
      { name: "Falda de res", qty: "200 g", para: "Carne desmechada del jueves" },
      { name: "Carne de res molida", qty: "150 g", para: "Dom almuerzo" },
      { name: "Lomo de cerdo", qty: "150 g", para: "Mar almuerzo" },
      { name: "Filete de pescado blanco", qty: "150 g", para: "Jue almuerzo" },
      { name: "Salmón", qty: "150 g", para: "Vie almuerzo" },
      { name: "Lomo de atún fresco", qty: "150 g", para: "Vie cena" },
      { name: "Camarones", qty: "150 g", para: "Sáb almuerzo" },
      { name: "Atún en lata (en agua)", qty: "2 latas", para: "Mié cena · Jue desayuno" },
      { name: "Proteína en polvo", qty: "7 scoops", para: "Todas las medias mañanas" },
    ],
  },
  {
    cat: "Lácteos",
    items: [
      { name: "Yogur (bajo en azúcar)", qty: "1 vaso", para: "Lun media tarde" },
      { name: "Yogur griego", qty: "2 vasos", para: "Mié · Sáb media tarde" },
      { name: "Kéfir", qty: "1 vaso", para: "Jue media tarde" },
      { name: "Queso cottage", qty: "4 cdas (1 vasito)", para: "Mar · Vie media tarde" },
      { name: "Queso mozzarella tajado", qty: "4 tajadas", para: "Lun · Mié · Dom desayuno" },
    ],
  },
  {
    cat: "Panes, granos y harinas",
    items: [
      { name: "Pan integral tajado", qty: "4 tajadas + 1 tostada", para: "Lun · Mar · Mié" },
      { name: "Arepas pequeñas", qty: "3", para: "Lun cena · Sáb · Dom desayuno" },
      { name: "Tortillas integrales (talla M)", qty: "2", para: "Mié desayuno · Jue cena" },
      { name: "Tortillas de maíz (talla M)", qty: "2", para: "Mar · Vie cena" },
      { name: "Galletas de arroz", qty: "6", para: "Lun · Mié · Jue" },
      { name: "Galletas integrales", qty: "6", para: "Jue · Vie" },
      { name: "Rosquitas", qty: "1 paquete", para: "Vie media mañana" },
      { name: "Avena en hojuelas", qty: "16 cdas (≈ 400 g)", para: "Lun · Jue · Vie · Sáb" },
      { name: "Cereal sin azúcar", qty: "8 cdas", para: "Mar · Mié" },
      { name: "Granola sin azúcar", qty: "8 cdas", para: "Sáb · Dom" },
      { name: "Arroz", qty: "18 cdas cocido (≈ 1 taza cruda)", para: "Lun · Jue · Dom" },
      { name: "Pasta", qty: "3 pocillos cocida (≈ 150 g cruda)", para: "Vie · Sáb" },
      { name: "Quinoa", qty: "10 cdas cocida (≈ ½ taza cruda)", para: "Dom cena" },
      { name: "Lentejas", qty: "1 porción (≈ ⅓ taza cruda)", para: "Mié almuerzo" },
      { name: "Fríjoles", qty: "1 cucharón", para: "Dom almuerzo" },
    ],
  },
  {
    cat: "Tubérculos y plátanos",
    items: [
      { name: "Papa", qty: "3 medianas", para: "Lun almuerzo · Sáb air fryer" },
      { name: "Yuca", qty: "1 trozo", para: "Jue almuerzo" },
      { name: "Plátano verde", qty: "1", para: "Mar moneditas" },
      { name: "Plátano maduro", qty: "1 (usas ¼)", para: "Mié almuerzo" },
    ],
  },
  {
    cat: "Frutas",
    items: [
      { name: "Fresas", qty: "18", para: "Lun · Dom" },
      { name: "Banano", qty: "1", para: "Lun" },
      { name: "Ciruela", qty: "1", para: "Mar" },
      { name: "Piña", qty: "1 tajada", para: "Mar" },
      { name: "Papaya", qty: "1 tajada", para: "Mié" },
      { name: "Manzana verde", qty: "1", para: "Mié" },
      { name: "Granadilla", qty: "1", para: "Jue" },
      { name: "Sandía", qty: "1 tajada", para: "Jue" },
      { name: "Durazno", qty: "1", para: "Vie" },
      { name: "Kiwi", qty: "1", para: "Vie" },
      { name: "Arándanos", qty: "1 pocillo pequeño", para: "Sáb" },
      { name: "Mango pequeño", qty: "1", para: "Sáb" },
      { name: "Limones", qty: "6", para: "Adobos, soda y ensaladas" },
    ],
  },
  {
    cat: "Verduras",
    items: [
      { name: "Tomate", qty: "8", para: "Hogao, ensaladas y desayunos" },
      { name: "Cebolla larga", qty: "1 atado", para: "Hogao" },
      { name: "Cebolla roja", qty: "1", para: "Pico de gallo" },
      { name: "Lechuga", qty: "1", para: "Ensaladas" },
      { name: "Pepino", qty: "2", para: "Ensaladas" },
      { name: "Espinaca", qty: "1 bolsa pequeña", para: "Mié desayuno" },
      { name: "Zanahoria", qty: "3", para: "Vie desayuno · bowls" },
      { name: "Pimentón", qty: "2", para: "Salteados y wraps" },
      { name: "Brócoli", qty: "1", para: "Vie · Dom" },
      { name: "Calabacín", qty: "1", para: "Vie salteado" },
      { name: "Champiñones", qty: "1 bandeja", para: "Dom bowl" },
      { name: "Cilantro", qty: "1 atado", para: "Pico de gallo" },
      { name: "Ajo", qty: "1 cabeza", para: "Adobos" },
      { name: "Aguacate común", qty: "1 (usas ¼)", para: "Lun · Dom" },
      { name: "Aguacate hass", qty: "1 (usas ½)", para: "Mar · Mié" },
    ],
  },
  {
    cat: "Despensa y bebidas",
    items: [
      { name: "Cacao puro en polvo", qty: "1" },
      { name: "Café", qty: "1" },
      { name: "Aromáticas", qty: "1 caja" },
      { name: "Hatsu sin azúcar", qty: "2" },
      { name: "Clight", qty: "2 sobres" },
      { name: "Soda / agua saborizada", qty: "4" },
      { name: "Aceite de oliva", qty: "1" },
      { name: "Aceite en spray", qty: "1" },
      { name: "Pesto", qty: "1 frasco pequeño" },
      { name: "Pasta de tomate natural", qty: "1" },
      { name: "Vinagre balsámico", qty: "1" },
      { name: "Especias: comino, canela, paprika, laurel, orégano", qty: "—" },
      { name: "Stevia y polvo de hornear", qty: "—" },
    ],
  },
];

// Lo que hay que comprar de más con la carta ajustada a 2.410 kcal (sumado desde ADJUST en data.ts).
export const SHOPPING_EXTRA: { cat: string; items: ShopItem[] } = {
  cat: "Extras de la carta ajustada",
  items: [
    { name: "Almendras", qty: "150 g", para: "Media tarde de lunes a sábado (25 g)" },
    { name: "Mantequilla de maní (sin azúcar)", qty: "1 frasco pequeño", para: "Media mañana: lun · mié · jue · vie · sáb" },
    { name: "Aguacate hass (adicional)", qty: "2", para: "Mar · vie · dom" },
    { name: "Banano pequeño (adicional)", qty: "3", para: "Media mañana: mar · vie · dom" },
    { name: "Huevos (adicionales)", qty: "3", para: "Mar desayuno · mié cena · vie desayuno" },
    { name: "Pan integral (adicional)", qty: "3 tajadas + 1 tostada", para: "Desayunos: lun · mar · mié · vie" },
    { name: "Arepas pequeñas (adicionales)", qty: "2", para: "Lun cena · jue desayuno" },
    { name: "Tortillas de maíz (adicionales)", qty: "2", para: "Mar · vie cena" },
    { name: "Tortilla integral (adicional)", qty: "1", para: "Jue cena" },
    { name: "Arroz (adicional)", qty: "18 cdas cocido (≈ 1 taza cruda)", para: "Almuerzos: lun · mar · jue" },
    { name: "Pasta (adicional)", qty: "1 pocillo cocida (≈ 50 g cruda)", para: "Vie almuerzo" },
    { name: "Quinoa (adicional)", qty: "5 cdas cocida", para: "Dom cena" },
    { name: "Plátano maduro", qty: "usa otro ¼ del que ya compras", para: "Mié almuerzo" },
  ],
};
