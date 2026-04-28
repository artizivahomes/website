import { notFound } from "next/navigation";
import ProductDetailContent from "./ProductDetailContent";
import { createServiceClient } from "@/lib/supabase/server";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServiceClient();

  // Fetch product from Supabase
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !product) {
    notFound();
  }

  // Fetch related products (same category, excluding current)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(3);

  return (
    <ProductDetailContent 
      product={product} 
      relatedProducts={relatedProducts || []} 
    />
  );
}
