/**
 * Default exercise library and starter routine.
 * These are only used on first app launch (when localStorage is empty).
 *
 * To reset the app to defaults: clear localStorage key "gymflow_v2".
 */

export const EXERCISE_DATA = [
  { id: "ex1",  name: "Supino Reto c/ Barra",      groupId: "g_ps",       image: null },
  { id: "ex2",  name: "Supino Inclinado c/ Barra",  groupId: "g_ps",       image: null },
  { id: "ex3",  name: "Supino Reto c/ Halteres",    groupId: "g_ps",       image: null },
  { id: "ex4",  name: "Crucifixo Inclinado",         groupId: "g_ps",       image: null },
  { id: "ex5",  name: "Supino Declinado",            groupId: "g_pi",       image: null },
  { id: "ex6",  name: "Crucifixo Declinado",         groupId: "g_pi",       image: null },
  { id: "ex7",  name: "Crossover Baixo",             groupId: "g_pi",       image: null },
  { id: "ex8",  name: "Peck Deck",                   groupId: "g_pm",       image: null },
  { id: "ex9",  name: "Crossover Alto",              groupId: "g_pm",       image: null },
  { id: "ex10", name: "Puxada Frontal",              groupId: "g_dorsal",   image: null },
  { id: "ex11", name: "Puxada Neutra",               groupId: "g_dorsal",   image: null },
  { id: "ex12", name: "Remada Curvada c/ Barra",     groupId: "g_dorsal",   image: null },
  { id: "ex13", name: "Remada Baixa",                groupId: "g_dorsal",   image: null },
  { id: "ex14", name: "Encolhimento c/ Barra",       groupId: "g_trap",     image: null },
  { id: "ex15", name: "Remada Alta",                 groupId: "g_trap",     image: null },
  { id: "ex16", name: "Desenvolvimento Militar",     groupId: "g_del_ant",  image: null },
  { id: "ex17", name: "Elevação Frontal",            groupId: "g_del_ant",  image: null },
  { id: "ex18", name: "Elevação Lateral",            groupId: "g_del_lat",  image: null },
  { id: "ex19", name: "Elevação Lateral c/ Cabo",    groupId: "g_del_lat",  image: null },
  { id: "ex20", name: "Crucifixo Invertido",         groupId: "g_del_post", image: null },
  { id: "ex21", name: "Face Pull",                   groupId: "g_del_post", image: null },
  { id: "ex22", name: "Rosca Direta c/ Barra",       groupId: "g_biceps",   image: null },
  { id: "ex23", name: "Rosca Alternada",             groupId: "g_biceps",   image: null },
  { id: "ex24", name: "Rosca Martelo",               groupId: "g_biceps",   image: null },
  { id: "ex25", name: "Tríceps Testa",               groupId: "g_triceps",  image: null },
  { id: "ex26", name: "Tríceps na Corda",            groupId: "g_triceps",  image: null },
  { id: "ex27", name: "Tríceps Francês",             groupId: "g_triceps",  image: null },
  { id: "ex28", name: "Agachamento Livre",           groupId: "g_quad",     image: null },
  { id: "ex29", name: "Leg Press 45°",               groupId: "g_quad",     image: null },
  { id: "ex30", name: "Cadeira Extensora",           groupId: "g_quad",     image: null },
  { id: "ex31", name: "Mesa Flexora",                groupId: "g_post",     image: null },
  { id: "ex32", name: "Stiff",                       groupId: "g_post",     image: null },
  { id: "ex33", name: "Panturrilha em Pé",           groupId: "g_pant",     image: null },
  { id: "ex34", name: "Panturrilha Sentado",         groupId: "g_pant",     image: null },
];

export const ROUTINE_SEED = {
  id: "r_main",
  name: "Rotina Principal",
  exercisesPerDay: 5,
  days: [
    {
      id: "d_peito", name: "Peito", emoji: "🫁",
      groups: [
        { id: "g_ps", name: "Peitoral Superior", exerciseIds: ["ex1","ex2","ex3","ex4"] },
        { id: "g_pi", name: "Peitoral Inferior",  exerciseIds: ["ex5","ex6","ex7"] },
        { id: "g_pm", name: "Peitoral Médio",     exerciseIds: ["ex8","ex9"] },
      ],
    },
    {
      id: "d_costas", name: "Costas", emoji: "🦾",
      groups: [
        { id: "g_dorsal", name: "Dorsal",    exerciseIds: ["ex10","ex11","ex12","ex13"] },
        { id: "g_trap",   name: "Trapézio",  exerciseIds: ["ex14","ex15"] },
      ],
    },
    {
      id: "d_ombro", name: "Ombro", emoji: "🎯",
      groups: [
        { id: "g_del_ant",  name: "Deltoide Anterior",  exerciseIds: ["ex16","ex17"] },
        { id: "g_del_lat",  name: "Deltoide Lateral",   exerciseIds: ["ex18","ex19"] },
        { id: "g_del_post", name: "Deltoide Posterior", exerciseIds: ["ex20","ex21"] },
      ],
    },
    {
      id: "d_braco", name: "Braço", emoji: "💪",
      groups: [
        { id: "g_biceps",  name: "Bíceps",  exerciseIds: ["ex22","ex23","ex24"] },
        { id: "g_triceps", name: "Tríceps", exerciseIds: ["ex25","ex26","ex27"] },
      ],
    },
    {
      id: "d_perna", name: "Perna", emoji: "🦵",
      groups: [
        { id: "g_quad", name: "Quadríceps",  exerciseIds: ["ex28","ex29","ex30"] },
        { id: "g_post", name: "Posterior",   exerciseIds: ["ex31","ex32"] },
        { id: "g_pant", name: "Panturrilha", exerciseIds: ["ex33","ex34"] },
      ],
    },
  ],
};

/** Shape of the initial app state written to localStorage on first launch */
export const INITIAL_STATE = {
  routines:        [ROUTINE_SEED],
  exercises:       EXERCISE_DATA,
  activeRoutineId: ROUTINE_SEED.id,
  history:         [],
  completedDayIds: [],
  currentWorkout:  null,
};