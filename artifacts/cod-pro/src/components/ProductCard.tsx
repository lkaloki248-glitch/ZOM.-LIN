import { useState } from "react";
import { ShoppingCart, Check, Eye } from "lucide-react";
import { Product, useStore } from "../context/StoreContext";

interface Props {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export default function ProductCard({ product, onOpenModal }: Props) {
  const { addToCart, setCartOpen } = useStore();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setCartOpen(true);
  };

  return (
    <div
      className="product-card rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      style={{ background: "hsl(240 6% 8%)", border: "1px solid rgba(201,146,26,0.15)" }}
      onClick={() => onOpenModal(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden group" style={{ paddingTop: "110%" }}>
        <img
          src={imgError ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" : product.image}
          alt={product.name}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: "rgba(10,10,12,0.85)", color: "#c9921a", border: "1px solid rgba(201,146,26,0.4)" }}>
            {product.category}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
          style={{ background: "rgba(10,10,12,0.55)" }}>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #c9921a, #e8b84b)", color: "#0a0a0b" }}>
            <Eye size={15} />
            عرض التفاصيل
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-base leading-snug" style={{ color: "#f0ead6" }}>
          {product.name.split(" ").slice(0, 4).join(" ")}{product.name.split(" ").length > 4 ? "…" : ""}
        </h3>
        {product.description && (
          <p className="text-xs line-clamp-1" style={{ color: "rgba(240,234,214,0.45)" }}>
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid rgba(201,146,26,0.1)" }}>
          <span className="text-xl font-black" style={{ color: "#c9921a" }}>
            {product.price.toLocaleString("ar-MA")} درهم
          </span>
          <button
            onClick={handleAdd}
            className="p-2.5 rounded-xl transition-all flex items-center gap-1.5 text-sm font-bold"
            style={
              added
                ? { background: "rgba(34, 197, 94, 0.2)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.4)" }
                : { background: "linear-gradient(135deg, #c9921a, #e8b84b)", color: "#0a0a0b" }
            }
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
            <span className="hidden sm:inline">{added ? "تمت!" : "أضف"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
