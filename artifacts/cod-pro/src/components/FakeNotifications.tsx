import { useEffect, useState, useCallback } from "react";
import { useStore } from "../context/StoreContext";

const CITIES = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة",
  "أكادير", "مكناس", "وجدة", "القنيطرة", "تطوان",
  "الجديدة", "سطات", "بني ملال", "خريبكة", "تازة",
];

interface Toast {
  id: number;
  city: string;
  productName: string;
  price: number;
  image: string;
  visible: boolean;
}

export default function FakeNotifications() {
  const { products } = useStore();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(() => {
    if (products.length === 0) return;
    const product = products[Math.floor(Math.random() * products.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const id = Date.now();

    const toast: Toast = {
      id,
      city,
      productName: product.name,
      price: product.price,
      image: product.image,
      visible: false,
    };

    setToasts((prev) => [...prev.slice(-2), toast]);

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, visible: true } : t));
    }, 50);

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, visible: false } : t));
    }, 4500);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5200);
  }, [products]);

  useEffect(() => {
    if (products.length === 0) return;
    const firstDelay = setTimeout(showToast, 4000);
    const interval = setInterval(showToast, 12000 + Math.random() * 6000);
    return () => { clearTimeout(firstDelay); clearInterval(interval); };
  }, [showToast, products.length]);

  return (
    <div className="fixed bottom-24 left-4 z-40 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl max-w-[260px]"
          style={{
            background: "rgba(10,10,12,0.75)",
            border: "1px solid rgba(201,146,26,0.2)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            transform: toast.visible ? "translateX(0)" : "translateX(-110%)",
            opacity: toast.visible ? 1 : 0,
            transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
          }}
        >
          <img
            src={toast.image}
            alt={toast.productName}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
            style={{ border: "1px solid rgba(201,146,26,0.3)" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#22c55e" }} />
              <span className="text-xs font-semibold truncate" style={{ color: "rgba(240,234,214,0.9)" }}>
                {toast.city}
              </span>
            </div>
            <p className="text-xs leading-tight truncate" style={{ color: "rgba(240,234,214,0.55)" }}>
              اشترى للتو{" "}
              <span style={{ color: "#c9921a" }}>{toast.productName}</span>
            </p>
            <p className="text-xs font-bold" style={{ color: "rgba(201,146,26,0.7)" }}>
              {toast.price} درهم
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
