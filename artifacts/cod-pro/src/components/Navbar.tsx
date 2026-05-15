import { useStore } from "../context/StoreContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const CATEGORIES = ["الكل", "هوديات", "جاكيتات", "قمصان", "تيشرتات", "بناطيل"];

interface NavbarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function Navbar({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }: NavbarProps) {
  const { totalItems, setCartOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: "rgba(10,10,12,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,146,26,0.3)" }}>
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-black tracking-widest" style={{ color: "#c9921a", fontFamily: "'Cairo', sans-serif", letterSpacing: "0.15em" }}>Outfit Pro</span>
        </button>

        {/* Search bar - desktop */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full px-5 py-2 text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,146,26,0.3)", color: "#f0ead6" }}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-600">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Admin button - hidden trigger */}
          <button
            onClick={() => navigate("/admin")}
            className="hidden md:block text-xs px-3 py-1 rounded-full transition"
            style={{ color: "rgba(201,146,26,0.5)", border: "1px solid rgba(201,146,26,0.2)" }}
            title="لوحة الإدارة"
          >
            ⚙
          </button>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full transition-all"
            style={{ background: "rgba(201,146,26,0.15)", border: "1px solid rgba(201,146,26,0.4)" }}
          >
            <ShoppingCart size={22} style={{ color: "#c9921a" }} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: "#c9921a", color: "#0a0a0b" }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* Hamburger - mobile */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} style={{ color: "#c9921a" }} /> : <Menu size={22} style={{ color: "#c9921a" }} />}
          </button>
        </div>
      </div>

      {/* Categories - desktop */}
      <div className="hidden md:flex justify-center gap-2 pb-2 px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={
              activeCategory === cat
                ? { background: "linear-gradient(135deg, #c9921a, #e8b84b)", color: "#0a0a0b" }
                : { background: "rgba(255,255,255,0.05)", color: "#a0906a", border: "1px solid rgba(201,146,26,0.2)" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3" style={{ background: "rgba(10,10,12,0.98)" }}>
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full px-5 py-2 text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,146,26,0.3)", color: "#f0ead6" }}
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setMenuOpen(false); }}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                style={
                  activeCategory === cat
                    ? { background: "linear-gradient(135deg, #c9921a, #e8b84b)", color: "#0a0a0b" }
                    : { background: "rgba(255,255,255,0.05)", color: "#a0906a", border: "1px solid rgba(201,146,26,0.2)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => { navigate("/admin"); setMenuOpen(false); }}
            className="text-sm text-center py-2 rounded-full"
            style={{ color: "#c9921a", border: "1px solid rgba(201,146,26,0.3)" }}
          >
            ⚙ لوحة الإدارة
          </button>
        </div>
      )}
    </header>
  );
}
