import { getTwitterReplies, postTwitterReply } from "@/lib/twitter";

export async function GET(request, { params }) {
  const { postId } = await params;
  const data = await getTwitterReplies(postId);
  return Response.json(data);
}

export async function POST(request, { params }) {
  const { postId } = await params;
  const { message } = await request.json();
  if (!message?.trim()) {
    return Response.json({ success: false, error: "Message is required" }, { status: 400 });
  }
  const result = await postTwitterReply(postId, message);
  return Response.json(result, { status: result.success ? 200 : 400 });
}
