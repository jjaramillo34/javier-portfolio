type AnalyticsRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is AnalyticsRecord =>
  typeof value === "object" && value !== null;

const getVisitorCount = (payload: unknown): number | null => {
  if (!isRecord(payload)) return null;
  const records = Array.isArray(payload.data) ? payload.data : [payload.data];
  for (const record of records) {
    if (isRecord(record) && typeof record.visitors === "number") return record.visitors;
  }
  return null;
};

export async function GET() {
  const token = process.env.VERCEL_API_TOKEN;
  // Vercel sets VERCEL_PROJECT_ID on deployments; the analytics API needs the ID, not the name.
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    return Response.json({ count: null }, { status: 503 });
  }

  const params = new URLSearchParams({ projectId });
  const response = await fetch(
    `https://api.vercel.com/v1/query/web-analytics/visits/count?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 300 } },
  );

  if (!response.ok) {
    return Response.json({ count: null }, { status: 502 });
  }

  const count = getVisitorCount(await response.json());
  return Response.json(
    { count },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
