import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  FoodItem,
  CartItem,
  Order,
  UserProfile,
  OrderStatus,
  SelectedAddon,
  PromoCode,
  UserAddress
} from '../types';
import {
  INITIAL_FOOD_ITEMS,
  SAMPLE_INITIAL_ORDER,
  PROMO_CODES
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type AdminTab = 'menu_crud' | 'orders_dispatch' | 'promos' | 'analytics' | 'customers' | 'settings';

interface AppContextType {
  // Navigation / Views
  currentView: string;
  setCurrentView: (view: string) => void;
  adminActiveTab: AdminTab;
  setAdminActiveTab: (tab: AdminTab) => void;
  openAdminTab: (tab?: AdminTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Food Catalog
  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  bulkDeleteFoodItems: (ids: string[]) => void;
  bulkToggleStock: (ids: string[], inStock: boolean) => void;
  resetMenuToDefault: () => void;
  toggleStockStatus: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (foodItem: FoodItem, quantity?: number, addons?: SelectedAddon[], instructions?: string) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedPromo: PromoCode | null;
  promoCodes: PromoCode[];
  addPromoCode: (promo: PromoCode) => void;
  deletePromoCode: (code: string) => void;
  togglePromoCodeStatus: (code: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartDiscount: number;
  deliveryFee: number;
  tipAmount: number;
  setTipAmount: (tip: number) => void;
  cartTax: number;
  cartTotal: number;

  // Authentication & Users
  currentUser: UserProfile | null;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; user?: UserProfile; message?: string }>;
  registerUser: (params: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; user?: UserProfile; message?: string }>;
  logoutUser: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  deleteAddress: (addressId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  advanceOrderStatus: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  assignCourier: (orderId: string, courierName: string, phone?: string, vehicle?: string) => void;

  // Live GPS Simulation
  activeLiveOrder: Order | null;
  setActiveLiveOrder: (order: Order | null) => void;
  advanceLiveOrderProgress: (orderId: string) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Modals & UI States
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  selectedFoodDetail: FoodItem | null;
  setSelectedFoodDetail: (food: FoodItem | null) => void;
  trackingModalOrder: Order | null;
  setTrackingModalOrder: (order: Order | null) => void;
  invoiceModalOrder: Order | null;
  setInvoiceModalOrder: (order: Order | null) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentViewState] = useState<string>('home');
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTab>('menu_crud');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const setCurrentView = (view: string) => {
    let normalized = view;
    if (view === 'admin-dashboard') normalized = 'admin_dashboard';
    if ((normalized === 'admin_dashboard') && currentUser?.role !== 'admin') {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast('Please sign in with your administrator account.', 'warning');
      return;
    }
    if (view === 'user-dashboard') normalized = 'user_dashboard';
    setCurrentViewState(normalized);
  };

  const openAdminTab = (tab: AdminTab = 'menu_crud') => {
    if (currentUser?.role !== 'admin') {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast('Administrator sign-in is required.', 'warning');
      return;
    }
    setAdminActiveTab(tab);
    setCurrentViewState('admin_dashboard');
  };

  // Food Items state
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('foody_items');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('foody_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('foody_promos');
    return saved ? JSON.parse(saved) : PROMO_CODES.map(p => ({ ...p, isActive: true }));
  });
  const [tipAmount, setTipAmount] = useState<number>(3.00);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('foody_orders');
    return saved ? JSON.parse(saved) : [SAMPLE_INITIAL_ORDER];
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('foody_favorites');
    return saved ? JSON.parse(saved) : ['salad-1', 'burger-1'];
  });

  // Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [selectedFoodDetail, setSelectedFoodDetail] = useState<FoodItem | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeLiveOrder, setActiveLiveOrder] = useState<Order | null>(SAMPLE_INITIAL_ORDER);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist items
  useEffect(() => {
    localStorage.setItem('foody_items', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('foody_promos', JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async response => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.user as UserProfile;
      })
      .then(user => { if (active && user) setCurrentUser(user); })
      .catch(() => { if (active) setCurrentUser(null); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem('foody_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('foody_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('foody_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Live GPS simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders =>
        prevOrders.map(order => {
          if (order.status === 'on_the_way') {
            const currentProg = order.liveLocationProgress || 50;
            const newProg = Math.min(100, currentProg + 2);
            const remainingMins = Math.max(1, Math.ceil((100 - newProg) / 5));

            if (newProg >= 100) {
              return {
                ...order,
                status: 'delivered' as OrderStatus,
                liveLocationProgress: 100,
                courier: order.courier ? { ...order.courier, etaMinutes: 0 } : undefined,
                trackingSteps: order.trackingSteps.map(step =>
                  step.status === 'delivered'
                    ? { ...step, completed: true, active: true, time: 'Just Now' }
                    : { ...step, active: false }
                )
              };
            }

            return {
              ...order,
              liveLocationProgress: newProg,
              courier: order.courier ? { ...order.courier, etaMinutes: remainingMins } : undefined
            };
          }
          return order;
        })
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Food Items CRUD
  const addFoodItem = (newItemData: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...newItemData,
      id: `food-${Date.now()}`
    };
    setFoodItems(prev => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to menu!`, 'success');
  };

  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => {
    setFoodItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    showToast(`Updated "${updates.name || 'dish'}" successfully`, 'success');
  };

  const deleteFoodItem = (id: string) => {
    const item = foodItems.find(i => i.id === id);
    setFoodItems(prev => prev.filter(i => i.id !== id));
    showToast(`Removed "${item?.name || 'item'}" from menu`, 'info');
  };

  const bulkDeleteFoodItems = (ids: string[]) => {
    setFoodItems(prev => prev.filter(item => !ids.includes(item.id)));
    showToast(`Removed ${ids.length} dish(es) from menu`, 'info');
  };

  const bulkToggleStock = (ids: string[], inStock: boolean) => {
    setFoodItems(prev => prev.map(item => ids.includes(item.id) ? { ...item, inStock } : item));
    showToast(`Updated stock status for ${ids.length} dish(es)`, 'success');
  };

  const resetMenuToDefault = () => {
    setFoodItems(INITIAL_FOOD_ITEMS);
    localStorage.setItem('foody_items', JSON.stringify(INITIAL_FOOD_ITEMS));
    showToast('Reset menu catalog to culinary defaults', 'info');
  };

  const toggleStockStatus = (id: string) => {
    setFoodItems(prev => prev.map(item => {
      if (item.id === id) {
        const next = !item.inStock;
        showToast(`Marked ${item.name} as ${next ? 'In Stock' : 'Out of Stock'}`, 'info');
        return { ...item, inStock: next };
      }
      return item;
    }));
  };

  // Cart operations
  const addToCart = (
    foodItem: FoodItem,
    quantity = 1,
    selectedAddons: SelectedAddon[] = [],
    specialInstructions = ''
  ) => {
    if (!foodItem.inStock) {
      showToast(`Sorry, ${foodItem.name} is currently out of stock!`, 'warning');
      return;
    }

    setCart(prev => {
      // check if identical item and addons exists
      const existingIndex = prev.findIndex(item =>
        item.foodItem.id === foodItem.id &&
        JSON.stringify(item.selectedAddons) === JSON.stringify(selectedAddons) &&
        item.specialInstructions === specialInstructions
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { foodItem, quantity, selectedAddons, specialInstructions }];
      }
    });

    showToast(`Added ${quantity}x ${foodItem.name} to cart!`, 'success');
  };

  const removeFromCart = (index: number) => {
    const item = cart[index];
    setCart(prev => prev.filter((_, i) => i !== index));
    if (item) {
      showToast(`Removed ${item.foodItem.name} from cart`, 'info');
    }
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity };
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => {
    const basePrice = item.foodItem.discountPrice || item.foodItem.price;
    const addonsPrice = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
    return acc + (basePrice + addonsPrice) * item.quantity;
  }, 0);

  const applyPromoCode = (codeStr: string) => {
    const trimmed = codeStr.trim().toUpperCase();
    const promo = promoCodes.find(p => p.code === trimmed && p.isActive !== false);

    if (!promo) {
      return { success: false, message: 'Invalid or inactive promo code.' };
    }

    if (cartSubtotal < promo.minOrder) {
      return {
        success: false,
        message: `Order must be at least $${promo.minOrder.toFixed(2)} to use ${promo.code}`
      };
    }

    setAppliedPromo(promo);
    showToast(`Coupon "${promo.code}" applied! ${promo.description}`, 'success');
    return { success: true, message: 'Promo applied successfully!' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  const addPromoCode = (promo: PromoCode) => {
    const uppercaseCode = promo.code.trim().toUpperCase();
    const newPromo = { ...promo, code: uppercaseCode, isActive: true };
    setPromoCodes(prev => [newPromo, ...prev.filter(p => p.code !== uppercaseCode)]);
    showToast(`Created promo code "${uppercaseCode}"!`, 'success');
  };

  const deletePromoCode = (code: string) => {
    setPromoCodes(prev => prev.filter(p => p.code !== code));
    if (appliedPromo?.code === code) {
      setAppliedPromo(null);
    }
    showToast(`Deleted promo voucher "${code}"`, 'info');
  };

  const togglePromoCodeStatus = (code: string) => {
    setPromoCodes(prev => prev.map(p => {
      if (p.code === code) {
        const next = !(p.isActive !== false);
        showToast(`Promo ${code} is now ${next ? 'Active' : 'Paused'}`, 'info');
        return { ...p, isActive: next };
      }
      return p;
    }));
  };

  let cartDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercentage) {
      cartDiscount = (cartSubtotal * appliedPromo.discountPercentage) / 100;
    } else if (appliedPromo.discountFixed) {
      cartDiscount = Math.min(cartSubtotal, appliedPromo.discountFixed);
    }
  }

  const baseDeliveryFee = cartSubtotal > 0 ? 2.50 : 0;
  const deliveryFee = (appliedPromo?.freeShipping && cartSubtotal >= appliedPromo.minOrder)
    ? 0
    : baseDeliveryFee;

  const cartTax = (cartSubtotal - cartDiscount) > 0 ? (cartSubtotal - cartDiscount) * 0.08 : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee + cartTax + (cartSubtotal > 0 ? tipAmount : 0));

  // Authentication uses the server session; browser storage is never trusted for identity.
  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Login failed.' };
      setCurrentUser(data.user as UserProfile);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true, user: data.user as UserProfile };
    } catch {
      return { success: false, message: 'Unable to connect to the server. Please try again.' };
    }
  };

  const registerUser = async (params: { name: string; email: string; phone: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Registration failed.' };
      setCurrentUser(data.user as UserProfile);
      showToast(`Welcome to Foody, ${data.user.name}!`, 'success');
      return { success: true, user: data.user as UserProfile };
    } catch {
      return { success: false, message: 'Unable to connect to the server. Please try again.' };
    }
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Foody logout request failed:', error);
    } finally {
      setCurrentUser(null);
      setCurrentViewState('home');
      showToast('Logged out successfully', 'info');
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    showToast('Profile updated successfully!', 'success');
  };

  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddr: UserAddress = {
      ...address,
      id: `addr-${Date.now()}`
    };
    const updatedAddresses = [...currentUser.addresses, newAddr];
    updateProfile({ addresses: updatedAddresses });
  };

  const deleteAddress = (addressId: string) => {
    if (!currentUser) return;
    const updatedAddresses = currentUser.addresses.filter(a => a.id !== addressId);
    updateProfile({ addresses: updatedAddresses });
    showToast('Address removed', 'info');
  };

  // Orders
  const createOrder = (orderData: Partial<Order>): Order => {
    const orderNum = `FD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser?.id || 'guest',
      customerName: orderData.customerName || currentUser?.name || 'Valued Foody Customer',
      customerEmail: orderData.customerEmail || currentUser?.email || 'customer@example.com',
      customerPhone: orderData.customerPhone || currentUser?.phone || '+1 (555) 123-4567',
      deliveryAddress: orderData.deliveryAddress || currentUser?.addresses[0] || {
        id: 'addr-default',
        label: 'Home',
        street: '742 Evergreen Terrace',
        city: 'Rome',
        zipCode: '00100'
      },
      deliveryNotes: orderData.deliveryNotes || '',
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      deliveryFee,
      tip: tipAmount,
      discount: cartDiscount,
      promoCodeApplied: appliedPromo?.code,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod || 'card',
      paymentStatus: 'paid',
      status: 'placed',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '20-30 Mins',
      courier: {
        name: 'Marco Rossi',
        phone: '+1 (555) 890-1234',
        vehicle: 'Electric Vespa Scooter (Red)',
        plateNumber: 'FDY-8921',
        rating: 4.98,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        currentLat: 41.9028,
        currentLng: 12.4964,
        etaMinutes: 25
      },
      trackingSteps: [
        {
          status: 'placed',
          title: 'Order Confirmed',
          description: 'Your payment was verified and sent to the kitchen.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          active: true
        },
        {
          status: 'preparing',
          title: 'Preparing in Kitchen',
          description: 'Our chefs are crafting your fresh dishes.',
          time: 'Upcoming',
          completed: false,
          active: false
        },
        {
          status: 'on_the_way',
          title: 'Courier on the Way',
          description: 'Driver picked up your meal with thermal insulation.',
          time: 'Upcoming',
          completed: false,
          active: false
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Order arrived safely at your door.',
          time: 'Estimated in 25 mins',
          completed: false,
          active: false
        }
      ],
      liveLocationProgress: 10
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveLiveOrder(newOrder);
    clearCart();
    showToast(`Order #${newOrder.orderNumber} placed successfully! 🎉`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const stepIndex = ['placed', 'preparing', 'on_the_way', 'delivered'].indexOf(newStatus);
        const updatedSteps = o.trackingSteps.map((s, i) => {
          const sIdx = ['placed', 'preparing', 'on_the_way', 'delivered'].indexOf(s.status);
          return {
            ...s,
            completed: sIdx <= stepIndex,
            active: sIdx === stepIndex,
            time: sIdx <= stepIndex && s.time.includes('Upcoming')
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : s.time
          };
        });

        let progress = 10;
        if (newStatus === 'preparing') progress = 35;
        if (newStatus === 'on_the_way') progress = 65;
        if (newStatus === 'delivered') progress = 100;

        return {
          ...o,
          status: newStatus,
          liveLocationProgress: progress,
          trackingSteps: updatedSteps
        };
      }
      return o;
    }));

    showToast(`Order status updated to "${newStatus.replace('_', ' ')}"`, 'info');
  };

  const advanceLiveOrderProgress = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.status === 'placed') {
      updateOrderStatus(orderId, 'preparing');
    } else if (order.status === 'preparing') {
      updateOrderStatus(orderId, 'on_the_way');
    } else if (order.status === 'on_the_way') {
      updateOrderStatus(orderId, 'delivered');
    }
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    showToast(`Order #${orderId} was cancelled`, 'warning');
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (activeLiveOrder?.id === orderId) {
      setActiveLiveOrder(null);
    }
    showToast(`Deleted order #${orderId}`, 'info');
  };

  const assignCourier = (orderId: string, courierName: string, phone?: string, vehicle?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const currentCourier = o.courier || {
          name: courierName,
          phone: phone || '+1 (555) 890-1234',
          vehicle: vehicle || 'Electric Vespa Scooter (Red)',
          plateNumber: 'FDY-8921',
          rating: 4.98,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          currentLat: 41.9028,
          currentLng: 12.4964,
          etaMinutes: 20
        };
        return {
          ...o,
          courierName,
          courier: {
            ...currentCourier,
            name: courierName,
            phone: phone || currentCourier.phone,
            vehicle: vehicle || currentCourier.vehicle
          }
        };
      }
      return o;
    }));
    showToast(`Assigned courier "${courierName}" to order`, 'success');
  };

  // Favorites
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter(f => f !== id);
      } else {
        showToast('Added to your favorites ❤️', 'success');
        return [...prev, id];
      }
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        adminActiveTab,
        setAdminActiveTab,
        openAdminTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        foodItems,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        bulkDeleteFoodItems,
        bulkToggleStock,
        resetMenuToDefault,
        toggleStockStatus,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedPromo,
        promoCodes,
        addPromoCode,
        deletePromoCode,
        togglePromoCodeStatus,
        applyPromoCode,
        removePromoCode,
        cartDiscount,
        deliveryFee,
        tipAmount,
        setTipAmount,
        cartTax,
        cartTotal,
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
        updateUserProfile: updateProfile,
        addAddress,
        deleteAddress,
        orders,
        createOrder,
        updateOrderStatus,
        advanceOrderStatus: advanceLiveOrderProgress,
        cancelOrder,
        deleteOrder,
        assignCourier,
        activeLiveOrder,
        setActiveLiveOrder,
        advanceLiveOrderProgress,
        favorites,
        toggleFavorite,
        isFavorite,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        selectedFoodDetail,
        setSelectedFoodDetail,
        trackingModalOrder,
        setTrackingModalOrder,
        invoiceModalOrder,
        setInvoiceModalOrder,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        toasts,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
