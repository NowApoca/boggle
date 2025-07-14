// Spanish words cache
let spanishWords: string[] = [];

// Function to load Spanish words
export async function loadSpanishWords(): Promise<string[]> {
  if (spanishWords.length > 0) {
    return spanishWords;
  }

  // For now, use fallback words
  // In a real implementation, you would load from your words.js file
  spanishWords = getFallbackWords();
  return spanishWords;
}

// Fallback words for testing (common Spanish words)
function getFallbackWords(): string[] {
  return [
    'casa', 'perro', 'gato', 'libro', 'agua', 'sol', 'luna', 'estrella',
    'amigo', 'familia', 'trabajo', 'tiempo', 'vida', 'amor', 'feliz',
    'grande', 'pequeño', 'bueno', 'malo', 'nuevo', 'viejo', 'joven',
    'comida', 'bebida', 'café', 'pan', 'leche', 'carne', 'pescado',
    'fruta', 'verdura', 'manzana', 'naranja', 'plátano', 'tomate',
    'coche', 'casa', 'puerta', 'ventana', 'mesa', 'silla', 'cama',
    'ropa', 'zapatos', 'sombrero', 'camisa', 'pantalón', 'vestido',
    'escuela', 'universidad', 'profesor', 'estudiante', 'clase',
    'ciudad', 'pueblo', 'calle', 'avenida', 'plaza', 'parque',
    'árbol', 'flor', 'piedra', 'arena', 'mar', 'río', 'montaña',
    'caminar', 'correr', 'saltar', 'bailar', 'cantar', 'hablar',
    'escuchar', 'ver', 'mirar', 'tocar', 'sentir', 'pensar',
    'saber', 'conocer', 'entender', 'aprender', 'enseñar', 'ayudar',
    'trabajar', 'estudiar', 'leer', 'escribir', 'dibujar', 'pintar',
    'música', 'arte', 'deporte', 'juego', 'fiesta', 'cumpleaños',
    'navidad', 'año', 'mes', 'semana', 'día', 'hora', 'minuto',
    'mañana', 'tarde', 'noche', 'hoy', 'ayer', 'mañana', 'siempre',
    'nunca', 'ahora', 'después', 'antes', 'durante', 'entre',
    'dentro', 'fuera', 'arriba', 'abajo', 'izquierda', 'derecha',
    'delante', 'detrás', 'cerca', 'lejos', 'aquí', 'allí', 'allá'
  ];
}

// Function to get a subset of words for testing
export function getTestWords(): string[] {
  return getFallbackWords().slice(0, 100);
} 