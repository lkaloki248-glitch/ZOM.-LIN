import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface StoreContextType {
  products: Product[];
  productsLoading: boolean;
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  editProduct: (id: string, product: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  importProducts: (products: Omit<Product, "id">[]) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const API_BASE = "/api";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("codpro_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Could not load products:", err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const addProduct = async (product: Omit<Product, "id">) => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    } catch {
      throw new Error("تعذّر الاتصال بالخادم — تأكد من الاتصال بالإنترنت");
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? `خطأ من الخادم (${res.status})`);
    }
    const newProduct: Product = await res.json();
    setProducts((prev) => [...prev, newProduct]);
  };

  const editProduct = async (id: string, product: Omit<Product, "id">) => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    } catch {
      throw new Error("تعذّر الاتصال بالخادم — تأكد من الاتصال بالإنترنت");
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? `خطأ من الخادم (${res.status})`);
    }
    const updated: Product = await res.json();
    setProducts((prev) => prev.map((p) => p.id === id ? updated : p));
  };

  const deleteProduct = async (id: string) => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
    } catch {
      throw new Error("تعذّر الاتصال بالخادم");
    }
    if (!res.ok) throw new Error(`خطأ من الخادم (${res.status})`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const importProducts = async (newProducts: Omit<Product, "id">[]) => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/products/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProducts),
      });
    } catch {
      throw new Error("تعذّر الاتصال بالخادم");
    }
    if (!res.ok) throw new Error(`خطأ من الخادم (${res.status})`);
    const imported: Product[] = await res.json();
    setProducts((prev) => [...prev, ...imported]);
  };

  return (
    <StoreContext.Provider value={{
      products, productsLoading, cart, cartOpen,
      addToCart, removeFromCart, updateQuantity,
      clearCart, setCartOpen, totalItems, totalPrice,
      addProduct, editProduct, deleteProduct, importProducts,
      refreshProducts: fetchProducts,
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
