import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("instagram_posts")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(6);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch instagram posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
