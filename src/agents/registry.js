// src/agents/registry.js

const modules = import.meta.glob('./definitions/*.js', { eager: true });
const agents = Object.values(modules).map((mod) => mod.default).filter(Boolean);

// Default export: Array
export default agents;

let cachedAgentsPromise = null;

// Named export: returns a Promise that resolves to the full, deduplicated agent list.
// Works whether `modules` contains eager module objects or lazy loader functions.
export function loadAllAgents() {
  if (cachedAgentsPromise) return cachedAgentsPromise;

  const loaders = Object.values(modules).map((m) => {
    if (typeof m === 'function') return m();
    return Promise.resolve(m);
  });

  cachedAgentsPromise = Promise.all(loaders).then((entries) => {
    const list = entries.map((mod) => mod.default).filter(Boolean);

    const seenIds = new Set();
    const uniqueAgents = list.filter((agent) => {
      if (!agent?.id) {
        console.warn('Skipping agent without an id:', agent);
        return false;
      }

      if (seenIds.has(agent.id)) {
        console.warn(`Skipping duplicate agent id "${agent.id}".`);
        return false;
      }

      seenIds.add(agent.id);
      return true;
    });

    return uniqueAgents;
  });

  return cachedAgentsPromise;
}
