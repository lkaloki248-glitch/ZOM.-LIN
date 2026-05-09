import { useRef, useState } from "react";
import { useStore } from "../context/StoreContext";
import { Product } from "../context/StoreContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartSidebar from "../components/CartSidebar";
import WhatsAppButton from "../components/WhatsAppButton";

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
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p style={{ color: "rgba(240,234,214,0.5)" }}>لا توجد منتجات تطابق بحثك</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="gold-line mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🚚", title: "توصيل مجاني", desc: "لجميع أنحاء المغرب" },
            { icon: "💳", title: "دفع آمن", desc: "الدفع عند الاستلام" },
            { icon: "↩️", title: "إرجاع سهل", desc: "خلال 7 أيام" },
            { icon: "💎", title: "جودة مضمونة", desc: "منتجات فاخرة 100%" },
          ].map((feat) => (
            <div key={feat.title} className="text-center p-5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,146,26,0.1)" }}>
              <div className="text-3xl mb-2">{feat.icon}</div>
              <div className="font-bold text-sm mb-1" style={{ color: "#c9921a" }}>{feat.title}</div>
              <div className="text-xs" style={{ color: "rgba(240,234,214,0.5)" }}>{feat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 mt-8" style={{ borderTop: "1px solid rgba(201,146,26,0.15)" }}>
        <div className="text-2xl font-black mb-2" style={{ color: "#c9921a", letterSpacing: "0.15em" }}>COD PRO</div>
        <p className="text-xs mb-1" style={{ color: "rgba(240,234,214,0.4)" }}>متجر الأزياء الفاخرة في المغرب</p>
        <a href="https://wa.me/212614221016" className="text-xs" style={{ color: "rgba(201,146,26,0.6)" }}>
          📱 +212 614 221 016
        </a>
        <p className="text-xs mt-4" style={{ color: "rgba(240,234,214,0.2)" }}>
          © 2025 COD PRO. جميع الحقوق محفوظة.
        </p>
      </footer>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartSidebar />
      <WhatsAppButton />
    </div>
  );
}
