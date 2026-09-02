export type UserRole = 'customer' | 'admin' | 'courier';

export interface UserAddress {
  id: string;
  label: string; // e.g. "Home", "Work", "Other"
  street: string;
  apartment?: string;
  city: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  addresses: UserAddress[];
  dietaryPreferences: string[];
  createdAt: string;
}

export interface FoodAddon {
  id: string;
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: 'Salads' | 'Burgers' | 'Pizza' | 'Pasta' | 'Shakes' | 'Desserts' | 'Healthy' | 'Drinks';
  rating: number;
  reviewCount: number;
  image: string;
  calories: number;
  prepTimeMinutes: number;
  tags: string[];
  isSpicy?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isBestSeller?: boolean;
  isPopular?: boolean;
  inStock: boolean;
  availableAddons?: FoodAddon[];
  cardTheme?: 'coral' | 'orange' | 'green' | 'purple' | 'default';
}

export interface SelectedAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  selectedAddons: SelectedAddon[];
  specialInstructions?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface CourierInfo {
  name: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  rating: number;
  avatar: string;
  currentLat: number;
  currentLng: number;
  etaMinutes: number;
}

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  active: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: UserAddress;
  deliveryNotes?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  tipAmount?: number;
  discount: number;
  discountAmount?: number;
  promoCodeApplied?: string;
  total: number;
  totalAmount?: number;
  paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'cash';
  paymentStatus: 'paid' | 'pending' | 'failed';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  estimatedDeliveryMinutes?: number;
  courier?: CourierInfo;
  courierName?: string;
  driverLocation?: { lat: number; lng: number };
  trackingSteps: TrackingStep[];
  liveLocationProgress?: number; // 0 to 100%
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  image: string;
  color: string;
}

export interface ChefInfo {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  experienceYears: number;
  bio: string;
}

export interface PromoCode {
  code: string;
  discountPercentage?: number;
  discountFixed?: number;
  minOrder: number;
  freeShipping?: boolean;
  description: string;
  isActive?: boolean;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedItems?: FoodItem[];
  actionType?: 'add_to_cart' | 'view_menu' | 'track_order';
  orderId?: string;
}
