import { getInstagramComments, postInstagramComment } from "@/lib/instagram";

export async function GET(request, { params }) {
  const { postId } = await params;
  const data = await getInstagramComments(postId);
  return Response.json(data);
}

export async function POST(request, { params }) {
  const { postId } = await params;
  const { message } = await request.json();
  if (!message?.trim()) {
    return Response.json({ success: false, error: "Message is required" }, { status: 400 });
  }
  const result = await postInstagramComment(postId, message);
  return Response.json(result, { status: result.success ? 200 : 400 });
}
