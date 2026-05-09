import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
  addProduct: (product: Omit<Product, "id">) => void;
  editProduct: (id: string, product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  importProducts: (products: Omit<Product, "id">[]) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "هودي بريميوم أسود",
    price: 349,
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80",
    category: "هوديات",
    description: "هودي فاخر بقماش ناعم ودافئ",
  },
  {
    id: "2",
    name: "جاكيت جلد أصيل",
    price: 899,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
    category: "جاكيتات",
    description: "جاكيت من الجلد الطبيعي عالي الجودة",
  },
  {
    id: "3",
    name: "قميص كتاني كلاسيكي",
    price: 249,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80",
    category: "قمصان",
    description: "قميص كتاني أنيق للمناسبات",
  },
  {
    id: "4",
    name: "جينز سكيني أزرق",
    price: 399,
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&q=80",
    category: "بناطيل",
    description: "جينز ضيق عصري بقصة مثالية",
  },
  {
    id: "5",
    name: "تيشرت أوفرسايز ذهبي",
    price: 199,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    category: "تيشرتات",
    description: "تيشرت واسع بتصميم عصري",
  },
  {
    id: "6",
    name: "جاكيت بومبر عسكري",
    price: 649,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    category: "جاكيتات",
    description: "جاكيت بومبر بتفاصيل عسكرية أنيقة",
  },
  {
    id: "7",
    name: "سويتشيرت رمادي فاخر",
    price: 299,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80",
    category: "هوديات",
    description: "سويتشيرت بقماش فليس ناعم",
  },
  {
    id: "8",
    name: "بنطال كارغو بيج",
    price: 449,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
    category: "بناطيل",
    description: "بنطال كارغو عصري بجيوب واسعة",
  },
  {
    id: "9",
    name: "قميص مطبوع أسود",
    price: 229,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&q=80",
    category: "قمصان",
    description: "قميص بطبعة فنية حصرية",
  },
  {
    id: "10",
    name: "كوفي ووتر ريزيستنت",
    price: 549,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&q=80",
    category: "جاكيتات",
    description: "معطف خفيف مقاوم للماء والريح",
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("codpro_products");
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("codpro_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("codpro_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("codpro_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = { ...product, id: Date.now().toString() };
    setProducts((prev) => [...prev, newProduct]);
  };

  const editProduct = (id: string, product: Omit<Product, "id">) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...product, id } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const importProducts = (newProducts: Omit<Product, "id">[]) => {
    const withIds = newProducts.map((p) => ({ ...p, id: Date.now().toString() + Math.random() }));
    setProducts((prev) => [...prev, ...withIds]);
  };

  return (
    <StoreContext.Provider value={{
      products, cart, cartOpen, addToCart, removeFromCart, updateQuantity,
      clearCart, setCartOpen, totalItems, totalPrice,
      addProduct, editProduct, deleteProduct, importProducts,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
