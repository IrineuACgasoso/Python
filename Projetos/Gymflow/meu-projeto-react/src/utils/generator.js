/**
 * Generates a smart, balanced workout for a given training day.
 *
 * Algorithm:
 *  1. Counts how many exercises each muscle group had in the LAST session.
 *  2. Assigns priority: groups with fewer exercises last time come first.
 *  3. Phase 1 — guarantees at least one exercise from every group.
 *  4. Phase 2 — fills remaining slots by re-sorting pools on each iteration,
 *     always picking from the most-underrepresented group first.
 *
 * This prevents the randomizer from getting "stuck" on the same groups
 * session after session.
 *
 * @param {Object}      day          - Training day: { groups: [{ id, name, exerciseIds }] }
 * @param {Array}       allExercises - Full exercise library: [{ id, ... }]
 * @param {Object|null} lastLog      - Last log for this day: { exercises: [{ groupId }] } or null
 * @param {number}      count        - Target number of exercises to pick
 * @returns {Array} [{ exerciseId, groupId, groupName }]
 */
export function genWorkout(day, allExercises, lastLog, count) {
  // Build a map of group → count from last session
  const lastCounts = {};
  if (lastLog) {
    lastLog.exercises.forEach((e) => {
      lastCounts[e.groupId] = (lastCounts[e.groupId] || 0) + 1;
    });
  }

  // Build pools: one per group, filtered to exercises that still exist
  let pools = day.groups
    .map((g) => ({
      ...g,
      avail: g.exerciseIds.filter((id) => allExercises.some((e) => e.id === id)),
      lastCount: lastCounts[g.id] || 0,
      picked: [],
    }))
    .filter((g) => g.avail.length > 0);

  if (!pools.length) return [];

  const maxPossible = pools.reduce((s, g) => s + g.avail.length, 0);
  let rem = Math.min(count, maxPossible);
  const result = [];

  // Sort by (already picked this session + count from last session) ascending
  const sortPools = () =>
    pools.sort(
      (a, b) =>
        a.picked.length + a.lastCount - (b.picked.length + b.lastCount)
    );

  sortPools();

  // Phase 1: one exercise from each group, highest-priority first
  for (const gp of [...pools]) {
    if (rem <= 0) break;
    const unused = gp.avail.filter((id) => !gp.picked.includes(id));
    if (!unused.length) continue;
    const pick = unused[Math.floor(Math.random() * unused.length)];
    result.push({ exerciseId: pick, groupId: gp.id, groupName: gp.name });
    gp.picked.push(pick);
    rem--;
  }

  // Phase 2: fill remaining slots, re-sorting each iteration
  let itr = 0;
  while (rem > 0 && itr < 300) {
    itr++;
    sortPools();
    let added = false;
    for (const gp of pools) {
      const unused = gp.avail.filter((id) => !gp.picked.includes(id));
      if (!unused.length) continue;
      const pick = unused[Math.floor(Math.random() * unused.length)];
      result.push({ exerciseId: pick, groupId: gp.id, groupName: gp.name });
      gp.picked.push(pick);
      rem--;
      added = true;
      break;
    }
    if (!added) break;
  }

  return result;
}