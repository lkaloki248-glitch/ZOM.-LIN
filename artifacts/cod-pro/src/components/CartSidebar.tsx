import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useStore } from "../context/StoreContext";

const WHATSAPP_NUMBER = "212614221016";

export default function CartSidebar() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useStore();

  const buildWhatsAppMessage = () => {
    if (cart.length === 0) return;
    const lines = cart.map(
      (item) => `• ${item.name} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString("ar-MA")} درهم`
    );
    const msg = [
      "🛍 طلب جديد من COD PRO:",
      "",
      ...lines,
      "",
      `━━━━━━━━━━━━━━━`,
      `💰 المجموع: ${totalPrice.toLocaleString("ar-MA")} درهم`,
      "",
      "أرجو تأكيد الطلب. شكراً 🙏",
    ].join("\n");
    return encodeURIComponent(msg);
  };

  const handleCheckout = () => {
    const msg = buildWhatsAppMessage();
    if (!msg) return;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col w-full max-w-sm transition-transform duration-300"
        style={{
          background: "hsl(240 6% 6%)",
          borderLeft: "1px solid rgba(201,146,26,0.3)",
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(201,146,26,0.2)" }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={22} style={{ color: "#c9921a" }} />
            <span className="text-lg font-bold" style={{ color: "#f0ead6" }}>سلة التسوق</span>
            {totalItems > 0 && (
              <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: "#c9921a", color: "#0a0a0b" }}>
                {totalItems}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs px-3 py-1 rounded-full transition"
                style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                إفراغ
              </button>
            )}
            <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <X size={20} style={{ color: "#f0ead6" }} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
              <ShoppingBag size={64} style={{ color: "rgba(201,146,26,0.3)" }} />
              <p className="text-center" style={{ color: "rgba(240,234,214,0.5)" }}>سلتك فارغة</p>
              <button onClick={() => setCartOpen(false)} className="btn-gold px-6 py-2 rounded-full text-sm font-bold">
                تسوق الآن
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,146,26,0.1)" }}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"; }}
                />
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-sm font-semibold leading-snug" style={{ color: "#f0ead6" }}>{item.name}</span>
                  <span className="text-sm font-bold" style={{ color: "#c9921a" }}>
                    {item.price.toLocaleString("ar-MA")} درهم
                  </span>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-auto">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition"
                      style={{ background: "rgba(255,255,255,0.08)", color: "#f0ead6" }}>
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm" style={{ color: "#f0ead6" }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition"
                      style={{ background: "rgba(201,146,26,0.2)", color: "#c9921a" }}>
                      <Plus size={14} />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="mr-auto p-1"
                      style={{ color: "rgba(239,68,68,0.7)" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 flex flex-col gap-3" style={{ borderTop: "1px solid rgba(201,146,26,0.2)" }}>
            <div className="flex justify-between text-base font-semibold" style={{ color: "#f0ead6" }}>
              <span>المجموع</span>
              <span style={{ color: "#c9921a" }}>{totalPrice.toLocaleString("ar-MA")} درهم</span>
            </div>
            <div className="text-xs text-center" style={{ color: "rgba(240,234,214,0.4)" }}>
              🚚 التوصيل مجاني لجميع أنحاء المغرب • الدفع عند الاستلام
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "#fff" }}
            >
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              اطلب عبر واتساب
            </button>
          </div>
        )}
      </div>
    </>
  );
}
