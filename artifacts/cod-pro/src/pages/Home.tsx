import { useRef, useState } from "react";
import { useStore } from "../context/StoreContext";
import { Product } from "../context/StoreContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartSidebar from "../components/CartSidebar";
import WhatsAppButton from "../components/WhatsAppButton";
import FakeNotifications from "../components/FakeNotifications";

export default function Home() {
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "الكل" || p.category === activeCategory;
    const matchSearch = p.name.includes(searchQuery) || p.category.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(240 6% 4%)" }}>
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Hero onShop={scrollToProducts} />

      {/* Products Section */}
      <section ref={productsRef} className="max-w-7xl mx-auto px-4 py-16">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: "rgba(201,146,26,0.1)", color: "#c9921a", border: "1px solid rgba(201,146,26,0.3)" }}>
            كوليكشن حصري
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "#f0ead6" }}>
            {activeCategory === "الكل" ? "جميع المنتجات" : activeCategory}
          </h2>
          <div className="gold-line max-w-xs mx-auto" />
          <p className="mt-3 text-sm" style={{ color: "rgba(240,234,214,0.5)" }}>
            {filtered.length} منتج متوفر • اضغط على المنتج لعرض التفاصيل والطلب
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            {/* Custom search icon */}
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="24" cy="24" r="14" stroke="rgba(201,146,26,0.4)" strokeWidth="2.5" />
              <circle cx="24" cy="24" r="8" stroke="rgba(201,146,26,0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="34" y1="34" x2="46" y2="46" stroke="#c9921a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="20" y1="24" x2="28" y2="24" stroke="rgba(201,146,26,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="24" y1="20" x2="24" y2="28" stroke="rgba(201,146,26,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p style={{ color: "rgba(240,234,214,0.5)" }}>لا توجد منتجات تطابق بحثك</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="gold-line mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

          {/* Card 1 — Delivery */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl gap-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,146,26,0.12)" }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect x="2" y="14" width="26" height="18" rx="3" stroke="#c9921a" strokeWidth="1.8" />
              <path d="M28 20h6l6 7v5h-12V20Z" stroke="#c9921a" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="10" cy="34" r="3.5" stroke="#c9921a" strokeWidth="1.8" />
              <circle cx="34" cy="34" r="3.5" stroke="#c9921a" strokeWidth="1.8" />
              <line x1="6" y1="22" x2="16" y2="22" stroke="rgba(201,146,26,0.45)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="26" x2="12" y2="26" stroke="rgba(201,146,26,0.3)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div>
              <div className="font-bold text-sm mb-0.5" style={{ color: "#c9921a" }}>توصيل مجاني</div>
              <div className="text-xs" style={{ color: "rgba(240,234,214,0.45)" }}>لجميع أنحاء المغرب</div>
            </div>
          </div>

          {/* Card 2 — Safe Payment */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl gap-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,146,26,0.12)" }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M22 4 L38 10 V24 C38 32 30 38 22 41 C14 38 6 32 6 24 V10 Z"
                stroke="#c9921a" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M22 4 L38 10 V24 C38 32 30 38 22 41 C14 38 6 32 6 24 V10 Z"
                fill="rgba(201,146,26,0.06)" />
              <path d="M15 22 L20 27 L29 17" stroke="#c9921a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div className="font-bold text-sm mb-0.5" style={{ color: "#c9921a" }}>دفع آمن</div>
              <div className="text-xs" style={{ color: "rgba(240,234,214,0.45)" }}>الدفع عند الاستلام</div>
            </div>
          </div>

          {/* Card 3 — Easy Returns */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl gap-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,146,26,0.12)" }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M36 22 A14 14 0 1 1 22 8" stroke="rgba(201,146,26,0.35)" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M22 8 A14 14 0 0 1 36 22" stroke="#c9921a" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M22 2 L22 10 L30 6 Z" fill="#c9921a" />
              <line x1="22" y1="22" x2="22" y2="30" stroke="rgba(201,146,26,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="18" y1="26" x2="22" y2="30" stroke="rgba(201,146,26,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="26" x2="22" y2="30" stroke="rgba(201,146,26,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div>
              <div className="font-bold text-sm mb-0.5" style={{ color: "#c9921a" }}>إرجاع سهل</div>
              <div className="text-xs" style={{ color: "rgba(240,234,214,0.45)" }}>خلال 7 أيام</div>
            </div>
          </div>

          {/* Card 4 — Quality */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl gap-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,146,26,0.12)" }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <polygon points="22,4 28,16 42,18 32,28 35,42 22,35 9,42 12,28 2,18 16,16"
                stroke="#c9921a" strokeWidth="1.8" strokeLinejoin="round" fill="rgba(201,146,26,0.06)" />
              <polygon points="22,10 26,18 35,19 29,25 31,34 22,29 13,34 15,25 9,19 18,18"
                stroke="rgba(201,146,26,0.35)" strokeWidth="1" strokeLinejoin="round" fill="none" />
            </svg>
            <div>
              <div className="font-bold text-sm mb-0.5" style={{ color: "#c9921a" }}>جودة مضمونة</div>
              <div className="text-xs" style={{ color: "rgba(240,234,214,0.45)" }}>منتجات فاخرة 100%</div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 mt-8" style={{ borderTop: "1px solid rgba(201,146,26,0.15)" }}>
        <div className="text-2xl font-black mb-2" style={{ color: "#c9921a", letterSpacing: "0.15em" }}>COD PRO</div>
        <p className="text-xs mb-3" style={{ color: "rgba(240,234,214,0.4)" }}>متجر الأزياء الفاخرة في المغرب</p>
        <a href="https://wa.me/212614221016"
          className="inline-flex items-center gap-2 text-xs"
          style={{ color: "rgba(201,146,26,0.65)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <line x1="9" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1.2" fill="currentColor" />
          </svg>
          +212 614 221 016
        </a>
        <p className="text-xs mt-5" style={{ color: "rgba(240,234,214,0.18)" }}>
          © 2025 COD PRO. جميع الحقوق محفوظة.
        </p>
      </footer>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartSidebar />
      <WhatsAppButton />
      <FakeNotifications />
    </div>
  );
}
