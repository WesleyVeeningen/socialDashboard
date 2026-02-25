import { getTwitterData } from "@/lib/twitter";

export async function GET() {
  const data = await getTwitterData();
  return Response.json(data);
}
