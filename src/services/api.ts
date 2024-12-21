const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchWorkers(page: number, filters = {}) {
  const cacheKey = `workers-${page}-${JSON.stringify(filters)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const response = await fetch(`/api/workers?page=${page}&${new URLSearchParams(filters)}`);
  const data = await response.json();
  
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
} 