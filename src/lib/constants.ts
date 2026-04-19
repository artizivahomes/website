export const SITE_NAME = "Artiziva Homes";
export const SITE_DESCRIPTION =
  "Handcrafted bespoke epoxy & resin furniture and artworks. Every piece is one-of-one, combining raw timber with flowing resin.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://artizivahomes.com";
export const INSTAGRAM_URL = "https://instagram.com/artiziva.homes";
export const INSTAGRAM_HANDLE = "@artiziva.homes";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Our Team", href: "/team" },
  { label: "Contact", href: "/contact" },
] as const;

export const PRODUCT_CATEGORIES = [
  "Dining Tables",
  "Coffee Tables",
  "Center Pieces",
  "3D Wall Hangings",
  "Clocks",
  "Custom Artworks",
] as const;

export const BUDGET_RANGES = [
  "Under ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹2,00,000",
  "₹2,00,000 - ₹5,00,000",
  "Above ₹5,00,000",
] as const;

export type Product = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  price: number | null;
  priceOnRequest: boolean;
  materials: string[];
  dimensions: { length: string; width: string; height: string };
  images: string[];
  featured: boolean;
  isSold: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "emerald-dining-table",
    title: "Emerald Dining Table",
    shortDescription: "A stunning emerald green resin river flowing through live-edge walnut",
    description:
      "This breathtaking dining table features a deep emerald green resin river flowing through two slabs of sustainably sourced live-edge walnut. The resin captures light beautifully, creating depth and dimension that changes throughout the day. Each knot and grain pattern is unique, making this a true one-of-one masterpiece for your dining space.",
    category: "Dining Tables",
    price: 285000,
    priceOnRequest: false,
    materials: ["Live-Edge Walnut", "Emerald Epoxy Resin", "Steel Base"],
    dimensions: { length: "96 in", width: "42 in", height: "30 in" },
    images: ["/images/products/emerald-dining-table.png"],
    featured: true,
    isSold: false,
  },
  {
    id: "2",
    slug: "8-seater-dining-table",
    title: "8-Seater Grand Dining Table",
    shortDescription: "A grand 8-seater table with ocean-blue resin and reclaimed teak",
    description:
      "Designed for grand gatherings, this expansive 8-seater dining table pairs deep ocean-blue resin with reclaimed teak wood. The flowing resin design evokes the movement of water meeting shoreline, while the teak provides warmth and durability. A statement piece that transforms any dining room into a gallery.",
    category: "Dining Tables",
    price: 425000,
    priceOnRequest: false,
    materials: ["Reclaimed Teak", "Ocean Blue Epoxy Resin", "Iron Hairpin Legs"],
    dimensions: { length: "108 in", width: "48 in", height: "30 in" },
    images: ["/images/products/8-seater-dining-table.png"],
    featured: true,
    isSold: false,
  },
  {
    id: "3",
    slug: "modern-teak-dining-table",
    title: "Modern Teak Dining Table",
    shortDescription: "Clean lines meet organic beauty in this modern teak and clear resin table",
    description:
      "A masterful blend of contemporary design and natural artistry. This dining table features premium teak wood with a crystal-clear resin pour that preserves and highlights the natural beauty of the wood grain. The modern silhouette and sleek base make it perfect for sophisticated interiors.",
    category: "Dining Tables",
    price: 320000,
    priceOnRequest: false,
    materials: ["Premium Teak", "Crystal Clear Resin", "Powder-Coated Steel"],
    dimensions: { length: "84 in", width: "40 in", height: "30 in" },
    images: ["/images/products/modern-teak-dining-table.png"],
    featured: true,
    isSold: false,
  },
  {
    id: "4",
    slug: "floating-dining-table",
    title: "Floating Dining Table",
    shortDescription: "An illusion of weightlessness with suspended resin and timber design",
    description:
      "This architectural marvel creates the illusion of a floating tabletop. A translucent white resin channel runs through the center of rich timber, supported by a minimalist base that seems to defy gravity. The interplay of light through the semi-translucent resin creates an ethereal dining experience.",
    category: "Dining Tables",
    price: null,
    priceOnRequest: true,
    materials: ["Indian Rosewood", "White Translucent Resin", "Hidden Steel Frame"],
    dimensions: { length: "90 in", width: "44 in", height: "30 in" },
    images: ["/images/products/floating-dining-table.png"],
    featured: true,
    isSold: false,
  },
  {
    id: "5",
    slug: "teak-white-dining-table",
    title: "Teak & White Resin Table",
    shortDescription: "Elegant white resin paired with golden teak for a refined aesthetic",
    description:
      "This refined dining table pairs the warm golden hues of premium teak with a pristine white resin river. The contrast creates an elegant, almost sculptural effect that serves as both furniture and art. Perfect for modern luxury homes that value subtle sophistication.",
    category: "Dining Tables",
    price: 265000,
    priceOnRequest: false,
    materials: ["Golden Teak", "Pearl White Resin", "Brass-Tipped Legs"],
    dimensions: { length: "78 in", width: "38 in", height: "30 in" },
    images: ["/images/products/teak-white-dining-table.png"],
    featured: false,
    isSold: false,
  },
  {
    id: "6",
    slug: "childrens-dining-table",
    title: "Children's Dining Table",
    shortDescription: "A playful yet premium resin table designed for young ones",
    description:
      "Crafted with the same premium quality as our full-size pieces, this children's dining table brings the beauty of resin art to younger spaces. Featuring vibrant yet tasteful resin colours and smooth, child-safe edges, it's a piece that grows with your family.",
    category: "Dining Tables",
    price: 85000,
    priceOnRequest: false,
    materials: ["Mango Wood", "Multi-Color Resin", "Rounded Steel Legs"],
    dimensions: { length: "48 in", width: "28 in", height: "22 in" },
    images: ["/images/products/childrens-dining-table.jpg"],
    featured: false,
    isSold: false,
  },
  {
    id: "7",
    slug: "coffee-table",
    title: "Resin River Coffee Table",
    shortDescription: "A mesmerizing blue-green resin river coffee table",
    description:
      "This exquisite coffee table features a mesmerizing blue-green resin river that flows through sustainably sourced hardwood. The low profile and organic shape make it perfect as a centerpiece for your living room. Finished with a glass-smooth surface that invites touch.",
    category: "Coffee Tables",
    price: 145000,
    priceOnRequest: false,
    materials: ["Acacia Wood", "Turquoise Resin", "Tapered Wood Legs"],
    dimensions: { length: "48 in", width: "24 in", height: "18 in" },
    images: ["/images/products/coffee-table.jpg"],
    featured: true,
    isSold: false,
  },
  {
    id: "8",
    slug: "corner-table",
    title: "Artisan Corner Table",
    shortDescription: "A compact corner table with intricate resin detailing",
    description:
      "Small in size but monumental in impact. This artisan corner table features intricate resin detailing that turns a functional piece into a conversation starter. The natural wood edge contrasts beautifully with the polished resin surface, perfect for sophisticated nooks and reading corners.",
    category: "Center Pieces",
    price: 68000,
    priceOnRequest: false,
    materials: ["Sheesham Wood", "Deep Blue Resin", "Brass Legs"],
    dimensions: { length: "24 in", width: "24 in", height: "22 in" },
    images: ["/images/products/corner-table.png"],
    featured: false,
    isSold: false,
  },
  {
    id: "9",
    slug: "artisanal-wall-clock",
    title: "Artisanal Wall Clock",
    shortDescription: "A handcrafted wall clock blending resin art with timekeeping",
    description:
      "Time becomes art with this handcrafted wall clock. Featuring a stunning resin pour over natural wood, each clock is a unique composition of color, texture, and form. The silent quartz movement ensures beauty without distraction. A perfect statement piece for any wall.",
    category: "Clocks",
    price: 32000,
    priceOnRequest: false,
    materials: ["Teak Wood", "Metallic Gold Resin", "Silent Quartz Movement"],
    dimensions: { length: "18 in", width: "18 in", height: "2 in" },
    images: ["/images/products/artisanal-wall-clock.jpg"],
    featured: true,
    isSold: false,
  },
  {
    id: "10",
    slug: "waves-wall-clock",
    title: "Waves Wall Clock",
    shortDescription: "Ocean-inspired waves frozen in resin on a wall clock",
    description:
      "Inspired by the eternal dance of ocean waves, this wall clock captures the movement and energy of the sea in flowing resin. Each wave is carefully poured to create depth and motion, making this piece feel alive. A meditative addition to any space.",
    category: "Clocks",
    price: 38000,
    priceOnRequest: false,
    materials: ["Driftwood", "Ocean Blue & White Resin", "Precision Quartz"],
    dimensions: { length: "20 in", width: "20 in", height: "2.5 in" },
    images: ["/images/products/waves-wall-clock.jpg"],
    featured: false,
    isSold: false,
  },
  {
    id: "11",
    slug: "earth-water-air-fire-wall-frames",
    title: "Elements — Twin Wall Frames",
    shortDescription: "Four elements captured in twin resin wall art frames",
    description:
      "A powerful artistic statement capturing Earth, Water, Air, and Fire in twin resin wall frames. Each panel tells the story of a natural element through colour, texture, and flow. Together, they create a harmonious balance that transforms any wall into a gallery of natural forces.",
    category: "3D Wall Hangings",
    price: 95000,
    priceOnRequest: false,
    materials: ["Canvas-Backed Panel", "Multi-Pigment Resin", "Gold Leaf Accents"],
    dimensions: { length: "36 in", width: "24 in", height: "3 in" },
    images: ["/images/products/earth-water-air-fire-wall-frames.jpg"],
    featured: true,
    isSold: false,
  },
  {
    id: "12",
    slug: "showroom-collection",
    title: "Showroom Collection",
    shortDescription: "A curated selection from our Siliguri showroom",
    description:
      "Experience the full breadth of Artiziva Homes craftsmanship through our curated showroom collection. This image showcases multiple pieces displayed in our Siliguri studio, demonstrating the range and versatility of our epoxy and resin artistry. Visit us to see these masterpieces in person.",
    category: "Custom Artworks",
    price: null,
    priceOnRequest: true,
    materials: ["Various Premium Woods", "Custom Resin Blends"],
    dimensions: { length: "Various", width: "Various", height: "Various" },
    images: ["/images/products/showroom-tables.png"],
    featured: false,
    isSold: false,
  },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);

export type Testimonial = {
  name: string;
  location: string;
  quote: string;
  product: string;
  rating: number;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ananya Mehta",
    location: "Mumbai",
    quote:
      "The emerald dining table is absolutely breathtaking. Our guests cannot stop complimenting it. Artiziva turned our dining room into a gallery.",
    product: "Emerald Dining Table",
    rating: 5,
  },
  {
    name: "Rajesh & Priya Kapoor",
    location: "Delhi",
    quote:
      "We commissioned a custom 10-seater table for our farmhouse. The craftsmanship and attention to detail is unmatched. Worth every rupee.",
    product: "Custom Dining Table",
    rating: 5,
  },
  {
    name: "Vikram Singhania",
    location: "Kolkata",
    quote:
      "The wall art pieces transformed our living room. The depth and movement in the resin is mesmerizing — you can stare at it for hours.",
    product: "Elements Wall Frames",
    rating: 5,
  },
  {
    name: "Meera Agarwal",
    location: "Bangalore",
    quote:
      "I've collected art from around the world, but Artiziva's resin coffee table is the piece everyone asks about. Truly one-of-a-kind.",
    product: "Resin Coffee Table",
    rating: 5,
  },
  {
    name: "Dr. Sanjay Gupta",
    location: "Siliguri",
    quote:
      "Shubham and Riya have an incredible eye for design. They custom-made three pieces for our new home and each one tells a story.",
    product: "Multiple Custom Pieces",
    rating: 5,
  },
];

export const STATS = [
  { value: "400+", label: "Bespoke Pieces Delivered" },
  { value: "2024", label: "Founded" },
  { value: "100%", label: "Handcrafted in India" },
  { value: "1-of-1", label: "Every Piece Unique" },
];
