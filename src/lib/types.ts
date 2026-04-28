export type OrderStatus = 'pending' | 'confirmed' | 'in_production' | 'ready_to_ship' | 'delivered';
export type EnquiryStatus = 'new' | 'in_progress' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type Product = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  category: string;
  price: number | null;
  price_on_request: boolean;
  materials: string[];
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  images: string[];
  featured: boolean;
  is_sold: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_pin: string;
  items: Array<{
    product: {
      id: string;
      title: string;
      price: number | null;
      images: string[];
    };
    quantity: number;
  }>;
  subtotal: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city_state: string | null;
  categories: string[] | null;
  dimensions: string | null;
  materials: string[] | null;
  table_base: string | null;
  style_description: string | null;
  inspiration_images: string[] | null;
  timeline: string | null;
  discovery_source: string | null;
  status: EnquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: 'superadmin';
  created_at: string;
};
