import { useState, useRef } from "react";
import { X, ShoppingCart, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { Product, useStore } from "../context/StoreContext";

const WHATSAPP_NUMBER = "212614221016";
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

interface OrderForm {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

const EMPTY_ORDER: OrderForm = { name: "", phone: "", city: "", address: "", notes: "" };
type Step = "details" | "order";

interface Props {
  product: Product | null;
  onClose: () => void;
}

function ImageCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div className="relative w-full select-none" style={{ paddingTop: "100%" }}>
      {/* Images */}
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`صورة ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? "auto" : "none" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";
          }}
        />
      ))}

      {/* Swipe hint overlay (desktop drag) */}
      <div
        className="absolute inset-0"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ zIndex: 1 }}
      />

      {/* Arrows — only if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={next}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: "rgba(10,10,12,0.7)", border: "1px solid rgba(201,146,26,0.3)" }}
          >
            <ChevronLeft size={16} style={{ color: "#c9921a" }} />
          </button>
          <button
            onClick={prev}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: "rgba(10,10,12,0.7)", border: "1px solid rgba(201,146,26,0.3)" }}
          >
            <ChevronRight size={16} style={{ color: "#c9921a" }} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === idx ? "20px" : "6px",
                  height: "6px",
                  background: i === idx ? "#c9921a" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(10,10,12,0.75)", color: "#c9921a", border: "1px solid rgba(201,146,26,0.3)" }}>
            {idx + 1}/{images.length}
          </div>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 right-0 left-0 z-10 pb-10 px-2 hidden md:flex justify-center gap-1.5">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="w-10 h-10 rounded-md overflow-hidden shrink-0 transition-all"
              style={{
                border: i === idx ? "2px solid #c9921a" : "2px solid transparent",
                opacity: i === idx ? 1 : 0.55,
              }}
            >
              <img src={src} alt="" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductModal({ product, onClose }: Props) {
  const { addToCart } = useStore();
  const [step, setStep] = useState<Step>("details");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [orderForm, setOrderForm] = useState<OrderForm>(EMPTY_ORDER);
  const [addedToCart, setAddedToCart] = useState(false);
  const [formError, setFormError] = useState("");

  if (!product) return null;

  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("details");
      setSelectedSize("");
      setOrderForm(EMPTY_ORDER);
      setFormError("");
      setAddedToCart(false);
    }, 300);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const handleConfirmOrder = () => {
    if (!orderForm.name.trim()) { setFormError("يرجى إدخال الاسم الكامل"); return; }
    if (!orderForm.phone.trim()) { setFormError("يرجى إدخال رقم الهاتف"); return; }
    if (!orderForm.city.trim()) { setFormError("يرجى إدخال المدينة"); return; }
    if (!selectedSize) { setFormError("يرجى اختيار المقاس"); return; }
    setFormError("");

    const lines = [
      "🛍 *طلب جديد — COD PRO*",
      "",
      `📦 *المنتج:* ${product.name}`,
      `📐 *المقاس:* ${selectedSize}`,
      `💰 *السعر:* ${product.price.toLocaleString("ar-MA")} درهم`,
      product.description ? `📝 *الوصف:* ${product.description}` : "",
      "",
      "━━━━━━━━━━━━━━━",
      "👤 *معلومات العميل:*",
      `الاسم: ${orderForm.name}`,
      `الهاتف: ${orderForm.phone}`,
      `المدينة: ${orderForm.city}`,
      orderForm.address ? `العنوان: ${orderForm.address}` : "",
      orderForm.notes ? `ملاحظات: ${orderForm.notes}` : "",
      "",
      "🚚 الدفع عند الاستلام",
      "أرجو تأكيد الطلب. شكراً 🙏",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`, "_blank");
    handleClose();
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(201,146,26,0.25)",
    color: "#f0ead6",
    borderRadius: "0.6rem",
    padding: "0.65rem 0.9rem",
    width: "100%",
    outline: "none",
    fontSize: "0.9rem",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 pointer-events-none">
        <div
          className="w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-2xl flex flex-col pointer-events-auto"
          style={{
            background: "hsl(240 6% 7%)",
            border: "1px solid rgba(201,146,26,0.3)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── STEP 1: PRODUCT DETAILS ── */}
          {step === "details" && (
            <>
              <div className="flex items-center justify-between px-4 py-3 shrink-0"
                style={{ borderBottom: "1px solid rgba(201,146,26,0.15)" }}>
                <span className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: "rgba(201,146,26,0.1)", color: "#c9921a", border: "1px solid rgba(201,146,26,0.25)" }}>
                  {product.category}
                </span>
                <button onClick={handleClose} className="p-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  <X size={18} style={{ color: "#f0ead6" }} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row">
                {/* Carousel */}
                <div className="md:w-5/12 shrink-0 overflow-hidden"
                  style={{ borderRadius: "0 0 0 1rem" }}>
                  <ImageCarousel images={allImages} />
                </div>

                {/* Info */}
                <div className="flex-1 p-5 flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black leading-snug mb-2" style={{ color: "#f0ead6" }}>
                      {product.name}
                    </h2>
                    <div className="text-3xl font-black" style={{ color: "#c9921a" }}>
                      {product.price.toLocaleString("ar-MA")}
                      <span className="text-base font-semibold mr-1" style={{ color: "rgba(201,146,26,0.7)" }}>درهم</span>
                    </div>
                  </div>

                  {product.description && (
                    <div className="p-3 rounded-xl text-sm leading-relaxed"
                      style={{ background: "rgba(255,255,255,0.04)", color: "rgba(240,234,214,0.75)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {product.description}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 text-sm">
                    {[
                      { icon: "🚚", text: "توصيل لجميع أنحاء المغرب" },
                      { icon: "💳", text: "الدفع عند الاستلام (COD)" },
                      { icon: "↩️", text: "إرجاع مجاني خلال 7 أيام" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-2" style={{ color: "rgba(240,234,214,0.55)" }}>
                        <span>{item.icon}</span><span>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Size selector */}
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: "#c9921a" }}>
                      اختر المقاس {selectedSize && <span style={{ color: "#f0ead6" }}>— {selectedSize}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)}
                          className="w-11 h-9 rounded-lg text-sm font-bold transition-all"
                          style={
                            selectedSize === size
                              ? { background: "linear-gradient(135deg,#c9921a,#e8b84b)", color: "#0a0a0b" }
                              : { background: "rgba(255,255,255,0.05)", color: "rgba(240,234,214,0.7)", border: "1px solid rgba(201,146,26,0.2)" }
                          }>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formError && (
                    <p className="text-xs" style={{ color: "#ef4444" }}>{formError}</p>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => {
                        if (!selectedSize) { setFormError("يرجى اختيار المقاس أولاً"); return; }
                        setFormError(""); setStep("order");
                      }}
                      className="flex-1 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "#fff" }}
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      اطلب الآن
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="px-4 py-3 rounded-xl font-bold flex items-center gap-1.5 text-sm"
                      style={
                        addedToCart
                          ? { background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.4)" }
                          : { background: "rgba(201,146,26,0.12)", color: "#c9921a", border: "1px solid rgba(201,146,26,0.3)" }
                      }
                    >
                      {addedToCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                      <span className="hidden sm:inline">{addedToCart ? "تمت!" : "سلة"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: ORDER FORM ── */}
          {step === "order" && (
            <>
              <div className="flex items-center justify-between px-4 py-3 shrink-0"
                style={{ borderBottom: "1px solid rgba(201,146,26,0.15)" }}>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setStep("details"); setFormError(""); }}
                    className="p-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <ChevronRight size={18} style={{ color: "#f0ead6" }} />
                  </button>
                  <span className="font-bold text-base" style={{ color: "#f0ead6" }}>تفاصيل الطلب</span>
                </div>
                <button onClick={handleClose} className="p-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  <X size={18} style={{ color: "#f0ead6" }} />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Order summary */}
                <div className="flex gap-4 p-3 rounded-xl"
                  style={{ background: "rgba(201,146,26,0.06)", border: "1px solid rgba(201,146,26,0.2)" }}>
                  <img src={allImages[0]} alt={product.name} className="w-14 h-14 object-cover rounded-lg shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"; }} />
                  <div className="flex flex-col justify-center gap-1">
                    <span className="font-bold text-sm" style={{ color: "#f0ead6" }}>{product.name}</span>
                    <span className="text-xs" style={{ color: "rgba(240,234,214,0.5)" }}>المقاس: {selectedSize}</span>
                    <span className="font-black text-base" style={{ color: "#c9921a" }}>
                      {product.price.toLocaleString("ar-MA")} درهم
                    </span>
                  </div>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(240,234,214,0.4)" }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(201,146,26,0.2)", color: "#c9921a" }}>1</span>
                  <span>اختيار المنتج</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(201,146,26,0.2)" }} />
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "linear-gradient(135deg,#c9921a,#e8b84b)", color: "#0a0a0b" }}>2</span>
                  <span style={{ color: "#c9921a" }}>بياناتك</span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold" style={{ color: "#c9921a" }}>الاسم الكامل *</label>
                    <input type="text" placeholder="مثال: محمد أمين" value={orderForm.name}
                      onChange={(e) => setOrderForm((f) => ({ ...f, name: e.target.value }))}
                      style={inputStyle} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold" style={{ color: "#c9921a" }}>رقم الهاتف *</label>
                    <input type="tel" placeholder="0612345678" value={orderForm.phone}
                      onChange={(e) => setOrderForm((f) => ({ ...f, phone: e.target.value }))}
                      style={{ ...inputStyle, direction: "ltr", textAlign: "right" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold" style={{ color: "#c9921a" }}>المدينة *</label>
                      <input type="text" placeholder="الدار البيضاء" value={orderForm.city}
                        onChange={(e) => setOrderForm((f) => ({ ...f, city: e.target.value }))}
                        style={inputStyle} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold" style={{ color: "rgba(201,146,26,0.6)" }}>الحي / الشارع</label>
                      <input type="text" placeholder="اختياري" value={orderForm.address}
                        onChange={(e) => setOrderForm((f) => ({ ...f, address: e.target.value }))}
                        style={inputStyle} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold" style={{ color: "rgba(201,146,26,0.6)" }}>ملاحظات (اختياري)</label>
                    <input type="text" placeholder="أي تفاصيل إضافية..." value={orderForm.notes}
                      onChange={(e) => setOrderForm((f) => ({ ...f, notes: e.target.value }))}
                      style={inputStyle} />
                  </div>
                </div>

                {formError && (
                  <p className="text-xs text-center py-2 rounded-lg"
                    style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    ⚠️ {formError}
                  </p>
                )}

                <button onClick={handleConfirmOrder}
                  className="w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "#fff", boxShadow: "0 4px 20px rgba(37,211,102,0.25)" }}>
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  تأكيد الطلب عبر واتساب
                </button>
                <p className="text-xs text-center" style={{ color: "rgba(240,234,214,0.3)" }}>
                  سيتم فتح واتساب تلقائياً مع تفاصيل طلبك
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
