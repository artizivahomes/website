import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/constants";
import type { Metadata } from "next";
import ProductDetailContent from "./ProductDetailContent";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: {
      title: `${product.title} | Artiziva Homes`,
      description: product.shortDescription,
      images: [{ url: product.images[0], width: 1200, height: 630 }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  return <ProductDetailContent product={product} relatedProducts={related} />;
}
