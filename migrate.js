const { createClient } = require('@supabase/supabase-js');
const PRODUCTS = [
  {
    id: "1",
    slug: "emerald-dining-table",
    title: "Emerald Dining Table",
    shortDescription: "A luxurious 6-seater dining table with emerald green epoxy river.",
    description: "Handcrafted from premium teak wood, this dining table features a stunning emerald green epoxy river that mimics the depths of a tropical forest. The wood's natural grain flows seamlessly with the resin, creating a one-of-a-kind functional art piece.",
    category: "Dining Tables",
    price: 285000,
    priceOnRequest: false,
    materials: ["Premium Teak", "Emerald Green Epoxy", "Powder-Coated Steel"],
    dimensions: { length: "72\"", width: "36\"", height: "30\"" },
    images: ["https://images.unsplash.com/photo-1577145000247-a737ad73305e?q=80&w=2000&auto=format&fit=crop"],
    featured: true,
    isSold: false,
  },
  {
    id: "2",
    slug: "midnight-console-table",
    title: "Midnight Console Table",
    shortDescription: "Sleek console table with deep blue resin and live-edge walnut.",
    description: "The Midnight Console Table combines the dark, rich tones of live-edge walnut with a deep midnight blue resin infill. Perfect for entryways or living rooms, its minimal profile highlights the intricate textures of the wood.",
    category: "Console Tables",
    price: 125000,
    priceOnRequest: false,
    materials: ["Live-Edge Walnut", "Midnight Blue Resin", "Brass-Tipped Legs"],
    dimensions: { length: "48\"", width: "16\"", height: "32\"" },
    images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2000&auto=format&fit=crop"],
    featured: true,
    isSold: false,
  },
  {
    id: "3",
    slug: "ocean-breeze-coffee-table",
    title: "Ocean Breeze Coffee Table",
    shortDescription: "Coffee table capturing the essence of ocean waves.",
    description: "Layers of translucent blue and turquoise resin are meticulously poured to create a three-dimensional wave effect across a bed of driftwood and sea-inspired elements.",
    category: "Coffee Tables",
    price: 85000,
    priceOnRequest: false,
    materials: ["Driftwood", "Multi-Tone Resin", "Hairpin Legs"],
    dimensions: { length: "36\"", width: "24\"", height: "18\"" },
    images: ["https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=2000&auto=format&fit=crop"],
    featured: false,
    isSold: true,
  }
  // ... adding a few more for the demo, I'll use the ones I know from constants.ts
];

// Load env from .env.local manually for simplicity
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('=')));

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("Starting migration...");
  for (const p of PRODUCTS) {
    const productData = {
      slug: p.slug,
      title: p.title,
      short_description: p.shortDescription,
      description: p.description,
      category: p.category,
      price: p.price,
      price_on_request: p.priceOnRequest,
      materials: p.materials,
      dimensions: p.dimensions,
      images: p.images,
      featured: p.featured,
      is_sold: p.isSold,
      sort_order: 0,
    };

    const { data, error } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'slug' });

    if (error) {
      console.error(`Error migrating ${p.title}:`, error.message);
    } else {
      console.log(`Successfully migrated: ${p.title}`);
    }
  }
}

migrate();
