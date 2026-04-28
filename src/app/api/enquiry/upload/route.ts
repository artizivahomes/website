import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  console.log("Enquiry upload request received");
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const uploadedUrls = [];

    for (const file of files) {
      // Basic image validation
      if (!file.type.startsWith("image/")) {
        console.warn(`Skipping non-image file: ${file.name} (${file.type})`);
        continue;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `enquiry_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `enquiries/${fileName}`;

      console.log(`Uploading ${file.name} to ${filePath}...`);
      const { error } = await supabase.storage
        .from("products") // Reusing products bucket for now
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error(`Storage upload error for ${file.name}:`, error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
      console.log(`Successfully uploaded: ${publicUrl}`);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Upload route fatal error:", error);
    return NextResponse.json({ error: "Failed to upload images" }, { status: 500 });
  }
}
