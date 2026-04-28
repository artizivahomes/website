import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { PRODUCTS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    /*
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    */

    const supabase = await createServiceClient();
    const migrated = [];

    for (const p of PRODUCTS) {
      const productData = {
        slug: p.slug,
        title: p.title,
        short_description: p.short_description,
        description: p.description,
        category: p.category,
        price: p.price,
        price_on_request: p.price_on_request,
        materials: p.materials,
        dimensions: p.dimensions,
        images: p.images,
        featured: p.featured,
        is_sold: p.is_sold,
        sort_order: p.sort_order || 0,
      };

      const { data, error } = await supabase
        .from("products")
        .upsert(productData, { onConflict: "slug" })
        .select()
        .single();

      if (error) {
        console.error(`Failed to migrate ${p.title}:`, error);
      } else {
        migrated.push(data.title);
      }
    }

    return NextResponse.json({ success: true, migrated });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
