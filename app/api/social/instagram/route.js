import { getInstagramData } from "@/lib/instagram";

export async function GET() {
  const data = await getInstagramData();
  return Response.json(data);
}
