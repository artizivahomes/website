import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Check for authorization header if it's a cron job (standard Vercel practice)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken) {
      console.warn("INSTAGRAM_ACCESS_TOKEN is not set. Sync skipped.");
      return NextResponse.json({ error: "Access Token missing" }, { status: 400 });
    }

    // 1. Fetch from Instagram Basic Display API
    // https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=...
    const igRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=12&access_token=${accessToken}`
    );
    const igData = await igRes.json();

    if (igData.error) {
      throw new Error(igData.error.message);
    }

    const posts = igData.data || [];
    const supabase = createServiceClient();

    // 2. Map and Insert/Update posts
    const upsertData = posts.map((post: any) => ({
      media_id: post.id,
      image_url: post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url,
      post_url: post.permalink,
      caption: post.caption,
      media_type: post.media_type,
      timestamp: post.timestamp,
    }));

    const { error } = await supabase
      .from("instagram_posts")
      .upsert(upsertData, { onConflict: "media_id" });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      count: posts.length,
      message: `Synced ${posts.length} posts from Instagram`
    });
  } catch (error: any) {
    console.error("Instagram sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
