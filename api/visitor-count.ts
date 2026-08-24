type AnalyticsRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is AnalyticsRecord =>
  typeof value === 'object' && value !== null;

const getNumber = (value: unknown, key: string): number | null => {
  if (!isRecord(value) || typeof value[key] !== 'number') return null;
  return value[key] as number;
};

const getVisitorCount = (payload: unknown): number | null => {
  if (!isRecord(payload)) return null;

  const data = payload.data;
  const records = Array.isArray(data) ? data : [data];

  for (const record of records) {
    const visitors = getNumber(record, 'visitors');
    if (visitors !== null) return visitors;
  }

  return null;
};

async function getVisitorCountResponse(): Promise<Response> {
  const token = process.env.VERCEL_API_TOKEN;

  if (!token) {
    return Response.json({ count: null }, { status: 503 });
  }

  const params = new URLSearchParams({ projectId: 'javier-portfolio' });
  const response = await fetch(
    `https://api.vercel.com/v1/query/web-analytics/visits/count?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return Response.json({ count: null }, { status: 502 });
  }

  const count = getVisitorCount(await response.json());
  return Response.json({ count }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}

export default {
  fetch: getVisitorCountResponse,
};
