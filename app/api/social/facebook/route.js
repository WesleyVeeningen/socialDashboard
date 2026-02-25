import { getFacebookData } from "@/lib/facebook";

export async function GET() {
  const data = await getFacebookData();
  return Response.json(data);
}
