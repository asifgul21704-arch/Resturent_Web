import { FoodItem, CategoryInfo, ChefInfo, PromoCode, UserProfile, Order } from '../types';

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  // Signature Featured Salads (From screenshot carousel)
  {
    id: 'salad-1',
    name: 'Berries Salad',
    tagline: 'Fresh Seasonal Berries & Greens',
    description: 'Crisp organic mixed greens tossed with fresh strawberries, blueberries, blackberries, feta cheese, and a honey-balsamic glaze vinaigrette.',
    price: 5.00,
    category: 'Salads',
    rating: 5.0,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    calories: 280,
    prepTimeMinutes: 12,
    tags: ['Fresh', 'Vegetarian', 'Gluten-Free', 'Antioxidant'],
    isVegan: true,
    isGlutenFree: true,
    isPopular: true,
    inStock: true,
    cardTheme: 'coral',
    availableAddons: [
      { id: 'add-chia', name: 'Chia Seeds', price: 0.50 },
      { id: 'add-walnuts', name: 'Candied Walnuts', price: 1.00 },
      { id: 'add-goat-cheese', name: 'Organic Goat Cheese', price: 1.50 }
    ]
  },
  {
    id: 'salad-2',
    name: 'Healthy Salad',
    tagline: 'Quinoa, Avocado & Citrus Bowl',
    description: 'Wholesome power salad with tri-color quinoa, ripe Haas avocado, edamame, shaved radishes, and citrus lemon-tahini dressing.',
    price: 3.00,
    category: 'Salads',
    rating: 5.0,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    calories: 320,
    prepTimeMinutes: 15,
    tags: ['Superfood', 'Vegan', 'High Fiber'],
    isVegan: true,
    isGlutenFree: true,
    isBestSeller: true,
    isPopular: true,
    inStock: true,
    cardTheme: 'orange',
    availableAddons: [
      { id: 'add-tofu', name: 'Grilled Herb Tofu', price: 1.50 },
      { id: 'add-avocado', name: 'Extra Half Avocado', price: 1.25 },
      { id: 'add-seeds', name: 'Pumpkin Seeds Mix', price: 0.75 }
    ]
  },
  {
    id: 'salad-3',
    name: 'Berries Salad Deluxe',
    tagline: 'Wild Forest Berries & Quail Eggs',
    description: 'Farm-fresh baby spinach, arugula, fresh raspberries, poached quail eggs, toasted almonds, and citrus mint reduction.',
    price: 4.00,
    category: 'Salads',
    rating: 5.0,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1505253758473-96b3015f240a?auto=format&fit=crop&w=600&q=80',
    calories: 310,
    prepTimeMinutes: 14,
    tags: ['Gourmet', 'Keto-Friendly'],
    isGlutenFree: true,
    isPopular: true,
    inStock: true,
    cardTheme: 'green',
    availableAddons: [
      { id: 'add-egg', name: 'Extra Boiled Egg', price: 0.80 },
      { id: 'add-feta', name: 'Danish Feta Cheese', price: 1.20 }
    ]
  },
  {
    id: 'salad-4',
    name: 'Healthy Salad Supreme',
    tagline: 'Mediterranean Chickpea Crunch',
    description: 'Crisp romaine lettuce, heirloom cherry tomatoes, Persian cucumbers, seasoned chickpeas, kalamata olives, and oregano vinaigrette.',
    price: 5.00,
    category: 'Salads',
    rating: 5.0,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    calories: 290,
    prepTimeMinutes: 10,
    tags: ['Mediterranean', 'Low-Calorie', 'Vegan'],
    isVegan: true,
    isGlutenFree: true,
    isPopular: true,
    inStock: true,
    cardTheme: 'purple',
    availableAddons: [
      { id: 'add-olives', name: 'Extra Kalamata Olives', price: 0.90 },
      { id: 'add-pita', name: 'Warm Pita Chips', price: 1.00 }
    ]
  },

  // Tasty Burgers
  {
    id: 'burger-1',
    name: 'Classic Truffle Burger',
    tagline: 'Signature Angus Beef & Brioche',
    description: '100% Prime Angus beef patty seared to perfection, melted aged cheddar, caramelized shallots, arugula, and black truffle aioli on a toasted butter brioche bun.',
    price: 9.50,
    discountPrice: 8.00,
    category: 'Burgers',
    rating: 4.9,
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    calories: 680,
    prepTimeMinutes: 18,
    tags: ['Best Seller', 'Gourmet Beef', 'Chef Pick'],
    isBestSeller: true,
    isPopular: true,
    inStock: true,
    availableAddons: [
      { id: 'add-bacon', name: 'Crispy Applewood Bacon', price: 1.80 },
      { id: 'add-cheese', name: 'Extra Cheddar Slice', price: 1.20 },
      { id: 'add-jalapeno', name: 'Pickled Jalapeños', price: 0.80 }
    ]
  },
  {
    id: 'burger-2',
    name: 'Double BBQ Smoke Burger',
    tagline: 'Double Beef, Crispy Onion Rings & Smoky Sauce',
    description: 'Two smash beef patties, double smoked gouda, crispy beer-battered onion rings, house bourbon BBQ sauce, and dill pickles.',
    price: 11.50,
    category: 'Burgers',
    rating: 4.8,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    calories: 890,
    prepTimeMinutes: 20,
    tags: ['Double Beef', 'Smoky BBQ'],
    isPopular: true,
    inStock: true,
    availableAddons: [
      { id: 'add-patty', name: 'Triple Patty Upgrade', price: 3.00 },
      { id: 'add-egg-burger', name: 'Sunny Side Egg', price: 1.50 }
    ]
  },
  {
    id: 'burger-3',
    name: 'Crispy Chicken Zinger Burger',
    tagline: 'Spicy Buttermilk Chicken & Honey Mustard',
    description: 'Crispy golden fried buttermilk chicken breast, spicy secret rub, tangy coleslaw, honey Dijon mustard, and pickles on sesame potato bun.',
    price: 8.50,
    category: 'Burgers',
    rating: 4.9,
    reviewCount: 195,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
    calories: 640,
    prepTimeMinutes: 16,
    tags: ['Spicy', 'Crispy Chicken'],
    isSpicy: true,
    isPopular: true,
    inStock: true
  },
  {
    id: 'burger-4',
    name: 'Beyond Vegan Garden Burger',
    tagline: 'Plant-Based Patty & Avocado Lime Mash',
    description: 'Plant-based protein patty grilled with smoky paprika, crushed avocado, heirloom tomato, vegan garlic mayo, and baby romaine on a toasted oat bun.',
    price: 9.00,
    category: 'Burgers',
    rating: 4.7,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=600&q=80',
    calories: 490,
    prepTimeMinutes: 15,
    tags: ['100% Plant Based', 'Vegan'],
    isVegan: true,
    inStock: true
  },

  // Pizzas
  {
    id: 'pizza-1',
    name: 'Artisan Pepperoni Sourdough Pizza',
    tagline: 'Slow Fermented Crust & Spiced Pepperoni',
    description: 'Stone-baked 72-hour sourdough crust topped with San Marzano tomato sauce, fresh buffalo mozzarella, artisanal pepperoni slices, and chili honey drizzle.',
    price: 13.00,
    discountPrice: 11.00,
    category: 'Pizza',
    rating: 4.95,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
    calories: 820,
    prepTimeMinutes: 22,
    tags: ['Best Seller', 'Stone Baked', 'Pepperoni'],
    isBestSeller: true,
    isPopular: true,
    inStock: true,
    availableAddons: [
      { id: 'add-cheese-crust', name: 'Stuffed Cheese Crust', price: 2.50 },
      { id: 'add-garlic-dip', name: 'Garlic Herb Dip', price: 1.00 },
      { id: 'add-extra-pep', name: 'Double Pepperoni', price: 2.00 }
    ]
  },
  {
    id: 'pizza-2',
    name: 'Truffle Burrata Margherita',
    tagline: 'Fresh Burrata, Basil & White Truffle Oil',
    description: 'Creamy melted whole burrata ball in center, roasted cherry tomatoes, sweet Italian basil, San Marzano marinara, and a drizzle of fragrant white truffle oil.',
    price: 14.50,
    category: 'Pizza',
    rating: 4.9,
    reviewCount: 230,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    calories: 780,
    prepTimeMinutes: 20,
    tags: ['Gourmet', 'Vegetarian', 'Chef Special'],
    isPopular: true,
    inStock: true
  },
  {
    id: 'pizza-3',
    name: 'Fire Diablo Meat Lover Pizza',
    tagline: 'Spicy Salami, Italian Sausage & Chili Oil',
    description: 'Smoked ham, spicy nduja sausage, crisp pancetta, fresh red chilies, mozzarella, and spicy arrabbiata sauce.',
    price: 15.00,
    category: 'Pizza',
    rating: 4.85,
    reviewCount: 168,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    calories: 910,
    prepTimeMinutes: 24,
    tags: ['Spicy', 'Meat Lovers'],
    isSpicy: true,
    inStock: true
  },

  // Pastas
  {
    id: 'pasta-1',
    name: 'Creamy Fettuccine Alfredo & Meatballs',
    tagline: 'Handmade Pasta, Rich Parmesan Cream',
    description: 'Fresh egg fettuccine ribbons tossed in a rich butter-parmesan cream sauce, accompanied by seasoned tender beef meatballs and Italian parsley.',
    price: 10.50,
    category: 'Pasta',
    rating: 4.9,
    reviewCount: 280,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=600&q=80',
    calories: 750,
    prepTimeMinutes: 18,
    tags: ['Italian Classic', 'Creamy', 'Comfort Food'],
    isPopular: true,
    inStock: true
  },
  {
    id: 'pasta-2',
    name: 'Slow-Braised Bolognese Tagliatelle',
    tagline: '8-Hour Simmered Ragù & Aged Pecorino',
    description: 'Traditional slow-simmered minced veal and beef ragù with rosemary, red wine reduction, over freshly made golden tagliatelle.',
    price: 11.50,
    category: 'Pasta',
    rating: 4.92,
    reviewCount: 195,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    calories: 720,
    prepTimeMinutes: 16,
    tags: ['Slow Cooked', 'Traditional'],
    isBestSeller: true,
    inStock: true
  },
  {
    id: 'pasta-3',
    name: 'Pesto Genovese Penne Rigate',
    tagline: 'Fresh Basil Pesto, Pine Nuts & Sun-Dried Tomatoes',
    description: 'Al dente penne folded in freshly crushed Ligurian basil pesto, toasted pine nuts, shaved Grana Padano, and sun-ripened tomatoes.',
    price: 9.80,
    category: 'Pasta',
    rating: 4.75,
    reviewCount: 130,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    calories: 580,
    prepTimeMinutes: 14,
    tags: ['Vegetarian', 'Herbaceous'],
    inStock: true
  },

  // Shakes & Desserts
  {
    id: 'dessert-1',
    name: 'Belgian Berry Waffle & Vanilla Gelato',
    tagline: 'Golden Crispy Waffle with Berries',
    description: 'Thick Belgian sugar waffle freshly baked with caramelized pearl sugar, topped with mixed berries, whipped Chantilly cream, and Madagascar vanilla gelato.',
    price: 6.50,
    category: 'Desserts',
    rating: 4.98,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80',
    calories: 520,
    prepTimeMinutes: 12,
    tags: ['Sweet', 'Best Seller', 'Waffle'],
    isBestSeller: true,
    isPopular: true,
    inStock: true
  },
  {
    id: 'dessert-2',
    name: 'Crispy Falafel & Arancini Bites',
    tagline: 'Golden Herbed Croquettes & Dip',
    description: 'Crisp golden brown savory snack bites filled with saffron rice and mozzarella, served with house garlic aioli and spicy marinara.',
    price: 4.50,
    category: 'Healthy',
    rating: 4.8,
    reviewCount: 145,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
    calories: 380,
    prepTimeMinutes: 10,
    tags: ['Crispy', 'Snack', 'Finger Food'],
    inStock: true
  },
  {
    id: 'shake-1',
    name: 'Strawberry Dream Cream Shake',
    tagline: 'Fresh Strawberries, Vanilla Cream & Sprinkles',
    description: 'Thick hand-spun milkshake made with fresh organic strawberry puree, premium vanilla ice cream, whipped cream swirl, and berry drizzle.',
    price: 4.80,
    category: 'Shakes',
    rating: 4.9,
    reviewCount: 220,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    calories: 410,
    prepTimeMinutes: 8,
    tags: ['Refreshing', 'Hand Spun'],
    isPopular: true,
    inStock: true
  },
  {
    id: 'shake-2',
    name: 'Chocolate Fudge Brownie Thickshake',
    tagline: 'Belgian Chocolate & Brownie Chunks',
    description: 'Indulgent rich dark chocolate milkshake loaded with chewy fudge brownie chunks, chocolate syrup, and toasted marshmallows.',
    price: 5.20,
    category: 'Shakes',
    rating: 4.95,
    reviewCount: 280,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    calories: 560,
    prepTimeMinutes: 8,
    tags: ['Chocolate Lovers', 'Dessert Shake'],
    inStock: true
  },
  {
    id: 'drink-1',
    name: 'Sparkling Passionfruit Mint Cooler',
    tagline: 'Tropical Fizz with Fresh Mint',
    description: 'Refreshing sparkling water infused with natural passionfruit nectar, fresh crushed spearmint, lime slices, and crushed ice.',
    price: 3.50,
    category: 'Drinks',
    rating: 4.85,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    calories: 120,
    prepTimeMinutes: 5,
    tags: ['Beverage', 'Low Sugar', 'Cold'],
    inStock: true
  }
];

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'cat-pizza',
    name: 'Pizza',
    slug: 'Pizza',
    itemCount: 20,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    color: 'from-amber-500 to-red-500'
  },
  {
    id: 'cat-pasta',
    name: 'Pasta',
    slug: 'Pasta',
    itemCount: 15,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=400&q=80',
    color: 'from-yellow-400 to-amber-600'
  },
  {
    id: 'cat-shakes',
    name: 'Shakes',
    slug: 'Shakes',
    itemCount: 20,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80',
    color: 'from-pink-400 to-rose-600'
  },
  {
    id: 'cat-burger',
    name: 'Burger',
    slug: 'Burgers',
    itemCount: 25,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    color: 'from-orange-400 to-red-600'
  }
];

export const CHEFS_DATA: ChefInfo[] = [
  {
    id: 'chef-1',
    name: 'Alizeh Anderson',
    role: 'Senior Chef',
    specialty: 'Salad Dressing & Gourmet Greens',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
    experienceYears: 12,
    bio: 'Pioneered organic farm-to-table culinary methods with an emphasis on superfood density and vivid color aesthetics.'
  },
  {
    id: 'chef-2',
    name: 'Angelina John',
    role: 'Master Chef',
    specialty: 'Artisan Sourdough & Wood-Fired Crusts',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
    experienceYears: 16,
    bio: 'Trained in Naples and Lyon, crafting slow-fermented 72-hour pizza dough with unmatched crispiness.'
  },
  {
    id: 'chef-3',
    name: 'Andre Smith',
    role: 'Professor',
    specialty: 'Pastry & Dessert Architecture',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=400&q=80',
    experienceYears: 18,
    bio: 'Culinary arts professor specializing in balanced dessert sugars, handcrafted Belgian waffles, and milkshakes.'
  },
  {
    id: 'chef-4',
    name: 'Christina Chi',
    role: 'Psychologist',
    specialty: 'Nutrition & Holistic Flavor Pairing',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=400&q=80',
    experienceYears: 10,
    bio: 'Certified nutrition psychologist mapping sensory delight to clean macronutrients and gut-friendly probiotics.'
  }
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'FOODY20',
    discountPercentage: 20,
    minOrder: 10,
    description: '20% Flat Discount on your entire order!'
  },
  {
    code: 'FREESHIP',
    freeShipping: true,
    minOrder: 15,
    description: 'Free door-to-door delivery on orders over $15'
  },
  {
    code: 'SAVE10',
    discountFixed: 10,
    minOrder: 30,
    description: '$10 OFF when you spend $30 or more'
  }
];

export const PROMO_CODES_DATA = [
  {
    code: 'FOODY20',
    discountPercent: 20,
    discountFlat: 0,
    minSubtotal: 10,
    description: '20% Flat Discount on your first order'
  },
  {
    code: 'FREESHIP',
    discountPercent: 0,
    discountFlat: 3.50,
    minSubtotal: 15,
    description: 'Free door-to-door courier delivery'
  },
  {
    code: 'SAVE10',
    discountPercent: 0,
    discountFlat: 10,
    minSubtotal: 30,
    description: '$10 instant voucher on orders above $30'
  }
];

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-sarah',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@example.com',
    phone: '+1 (555) 234-8971',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    role: 'customer',
    addresses: [
      {
        id: 'addr-1',
        label: 'Home',
        street: '742 Evergreen Terrace',
        apartment: 'Apt 4B',
        city: 'Springfield',
        zipCode: '97477',
        isDefault: true
      },
      {
        id: 'addr-2',
        label: 'Office',
        street: '100 Silicon Way, Tech Park',
        apartment: 'Suite 300',
        city: 'Springfield',
        zipCode: '97478',
        isDefault: false
      }
    ],
    dietaryPreferences: ['Organic Greens', 'Low Calorie'],
    createdAt: '2024-01-15'
  },
  {
    id: 'user-admin',
    name: 'Chef Alessandro (Admin)',
    email: 'admin@thefoody.com',
    phone: '+1 (555) 888-9999',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'admin',
    addresses: [
      {
        id: 'addr-hq',
        label: 'Foody HQ Restaurant',
        street: '12 Gourmet Avenue',
        city: 'Rome / Downtown',
        zipCode: '00100',
        isDefault: true
      }
    ],
    dietaryPreferences: ['All Foods'],
    createdAt: '2023-11-01'
  }
];

export const SAMPLE_INITIAL_ORDER: Order = {
  id: 'order-sample-101',
  orderNumber: 'FD-84920',
  userId: 'user-sarah',
  customerName: 'Sarah Mitchell',
  customerEmail: 'sarah.mitchell@example.com',
  customerPhone: '+1 (555) 234-8971',
  deliveryAddress: {
    id: 'addr-1',
    label: 'Home',
    street: '742 Evergreen Terrace, Apt 4B',
    city: 'Springfield',
    zipCode: '97477'
  },
  deliveryNotes: 'Please ring bell and leave with door guard or front doorstep.',
  items: [
    {
      foodItem: INITIAL_FOOD_ITEMS[0], // Berries Salad
      quantity: 1,
      selectedAddons: [
        { id: 'add-walnuts', name: 'Candied Walnuts', price: 1.00 }
      ]
    },
    {
      foodItem: INITIAL_FOOD_ITEMS[4], // Classic Truffle Burger
      quantity: 1,
      selectedAddons: [
        { id: 'add-cheese', name: 'Extra Cheddar Slice', price: 1.20 }
      ]
    },
    {
      foodItem: INITIAL_FOOD_ITEMS[11], // Strawberry Dream Cream Shake
      quantity: 1,
      selectedAddons: []
    }
  ],
  subtotal: 20.50,
  tax: 1.64,
  deliveryFee: 2.50,
  tip: 3.00,
  discount: 4.10,
  promoCodeApplied: 'FOODY20',
  total: 23.54,
  paymentMethod: 'card',
  paymentStatus: 'paid',
  status: 'on_the_way',
  createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  estimatedDeliveryTime: '12-18 Mins',
  courier: {
    name: 'Marco Rossi',
    phone: '+1 (555) 432-1098',
    vehicle: 'Electric Vespa Scooter (Red)',
    plateNumber: 'FDY-7729',
    rating: 4.95,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    currentLat: 41.9028,
    currentLng: 12.4964,
    etaMinutes: 11
  },
  trackingSteps: [
    {
      status: 'placed',
      title: 'Order Confirmed',
      description: 'Your payment was verified and sent to Foody Kitchen.',
      time: '11:05 AM',
      completed: true,
      active: false
    },
    {
      status: 'preparing',
      title: 'Cooking in Kitchen',
      description: 'Chef Angelina is preparing your fresh order with love.',
      time: '11:12 AM',
      completed: true,
      active: false
    },
    {
      status: 'on_the_way',
      title: 'Courier On The Way',
      description: 'Marco is riding to your doorstep with insulated thermal box.',
      time: '11:20 AM',
      completed: true,
      active: true
    },
    {
      status: 'delivered',
      title: 'Delivered',
      description: 'Enjoy your delicious and fresh Foody meal!',
      time: 'Estimated 11:32 AM',
      completed: false,
      active: false
    }
  ],
  liveLocationProgress: 65
};
