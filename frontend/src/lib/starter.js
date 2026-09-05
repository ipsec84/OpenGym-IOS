import { uid } from './format.js'

export const SPEC_3DAYS = [
  ['Cuerpo Completo A', 'barbell', [['0025', 3, 10], ['0043', 3, 10], ['0027', 3, 10], ['0405', 3, 10], ['0294', 3, 12], ['0201', 3, 12]]],
  ['Cuerpo Completo B', 'legs', [['0032', 3, 8], ['1463', 3, 12], ['0150', 3, 10], ['0314', 3, 10], ['0334', 3, 12], ['0274', 3, 15]]],
  ['Cuerpo Completo C', 'dumbbell', [['0043', 3, 8], ['0289', 3, 10], ['0861', 3, 12], ['0585', 3, 12], ['0108', 4, 15], ['0129', 3, 12]]]
]

export const SPEC_4DAYS = [
  ['Torso A (Pecho y Espalda)', 'barbell', [['0025', 4, 8], ['0027', 4, 8], ['0405', 3, 10], ['0150', 3, 10], ['0334', 3, 12], ['0294', 3, 12], ['0201', 3, 12]]],
  ['Pierna A (Cuádriceps y Gemelos)', 'legs', [['0043', 4, 8], ['0085', 3, 10], ['1463', 3, 12], ['0585', 3, 12], ['0108', 4, 15], ['0274', 3, 15]]],
  ['Torso B (Hombros y Brazos)', 'dumbbell', [['0314', 3, 10], ['0861', 3, 10], ['0091', 3, 8], ['0251', 3, 10], ['0334', 3, 15], ['0031', 3, 10], ['0129', 3, 12]]],
  ['Pierna B (Cadena Posterior)', 'legs', [['0032', 3, 8], ['1463', 4, 10], ['0586', 3, 12], ['0336', 3, 10], ['0108', 4, 15], ['0276', 3, 15]]]
]

export const SPEC_5DAYS = [
  ['Torso (Fuerza)', 'barbell', [['0025', 4, 8], ['0027', 4, 8], ['0091', 3, 8], ['0150', 3, 10], ['0294', 3, 10], ['0201', 3, 10]]],
  ['Pierna (Fuerza)', 'legs', [['0043', 4, 8], ['0085', 3, 8], ['1463', 3, 10], ['0585', 3, 12], ['0108', 4, 12], ['0274', 3, 15]]],
  ['Empuje (Pecho, Hombro, Tríceps)', 'dumbbell', [['0314', 3, 10], ['0289', 3, 10], ['0405', 3, 10], ['0334', 4, 12], ['0201', 3, 12], ['0129', 3, 12]]],
  ['Tirón (Espalda y Bíceps)', 'pullup', [['0150', 4, 10], ['0861', 4, 10], ['0027', 3, 10], ['0031', 3, 10], ['0294', 3, 12], ['0276', 3, 15]]],
  ['Pierna e Hipertrofia', 'legs', [['1463', 4, 12], ['0586', 3, 12], ['0585', 3, 12], ['0336', 3, 10], ['0108', 4, 15], ['0001', 3, 15]]]
]

export const createRoutinesFromSpec = spec =>
  spec.map(([name, emoji, list]) => ({
    id: uid(),
    name,
    emoji,
    ex: list.map(([id, sets, reps]) => ({ id, sets, reps, weight: 0 }))
  }))

export const STARTER_PLANS = {
  '3days': {
    title: 'Principiante 3 Días (Cuerpo Completo / Full Body)',
    desc: 'Lunes, Miércoles y Viernes. La frecuencia óptima para empezar con descansos de 48h.',
    days: 'Lun · Mié · Vie',
    weekDays: [1, 3, 5],
    create: () => createRoutinesFromSpec(SPEC_3DAYS)
  },
  '4days': {
    title: 'Principiante 4 Días (Torso / Pierna)',
    desc: 'Lunes, Martes, Jueves y Viernes. División clásica de alta efectividad.',
    days: 'Lun · Mar · Jue · Vie',
    weekDays: [1, 2, 4, 5],
    create: () => createRoutinesFromSpec(SPEC_4DAYS)
  },
  '5days': {
    title: 'Principiante 5 Días (Híbrida Torso / Pierna / PPL)',
    desc: 'Lunes a Sábado (5 días de entreno, 2 de descanso). Máximo estímulo y progresión.',
    days: 'Lun · Mar · Jue · Vie · Sáb',
    weekDays: [1, 2, 4, 5, 6],
    create: () => createRoutinesFromSpec(SPEC_5DAYS)
  }
}

// Backwards compatibility for existing codebase
export const starterRoutines = () => createRoutinesFromSpec(SPEC_3DAYS)