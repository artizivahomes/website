import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// GET: Fetch all categories
export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST: Create/Update category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const { getAdminSession } = await import("@/lib/auth");
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, slug, description } = await request.json();
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    
    if (id) {
      // Update
      const { data, error } = await supabase
        .from("categories")
        .update({ name, slug, description })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    } else {
      // Create
      const { data, error } = await supabase
        .from("categories")
        .insert({ name, slug, description })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Save category error:", error);
    return NextResponse.json({ error: "Failed to save category" }, { status: 500 });
  }
}

// DELETE: Remove category (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { getAdminSession } = await import("@/lib/auth");
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
