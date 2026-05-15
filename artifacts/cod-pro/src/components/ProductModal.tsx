import { useState, useRef, useEffect } from "react";
import { X, ShoppingCart, Check, ChevronRight, ChevronLeft, ZoomIn } from "lucide-react";
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

const WA_ICON = (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

function ImageCarousel({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "300px" }}>
      {/* Images */}
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`صورة ${i + 1}`}
          className="absolute inset-0 w-full h-full transition-opacity duration-300"
          style={{
            objectFit: zoomed ? "contain" : "cover",
            opacity: i === idx ? 1 : 0,
            pointerEvents: i === idx ? "auto" : "none",
            background: "#111113",
            cursor: "pointer",
          }}
          onClick={() => setZoomed((z) => !z)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";
          }}
        />
      ))}

      {/* Gradient fade at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, #111113, transparent)" }}
      />

      {/* Close button — top right */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: "rgba(10,10,12,0.75)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <X size={16} style={{ color: "#f0ead6" }} />
      </button>

      {/* Zoom hint — top left */}
      <button
        onClick={() => setZoomed((z) => !z)}
        className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold"
        style={{ background: "rgba(10,10,12,0.75)", backdropFilter: "blur(6px)", color: "#c9921a", border: "1px solid rgba(201,146,26,0.3)" }}
      >
        <ZoomIn size={12} />
        {zoomed ? "تصغير" : "تكبير"}
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: "rgba(10,10,12,0.7)", color: "rgba(240,234,214,0.7)", backdropFilter: "blur(6px)" }}
        >
          {idx + 1} / {images.length}
        </div>
      )}

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button onClick={next} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(10,10,12,0.7)", border: "1px solid rgba(201,146,26,0.3)", backdropFilter: "blur(4px)" }}>
            <ChevronLeft size={16} style={{ color: "#c9921a" }} />
          </button>
          <button onClick={prev} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(10,10,12,0.7)", border: "1px solid rgba(201,146,26,0.3)", backdropFilter: "blur(4px)" }}>
            <ChevronRight size={16} style={{ color: "#c9921a" }} />
          </button>
        </>
      )}

      {/* Thumbnail dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10" style={{ bottom: "10px" }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all overflow-hidden"
              style={{
                width: i === idx ? "28px" : "7px",
                height: "7px",
                background: i === idx ? "#c9921a" : "rgba(255,255,255,0.35)",
              }}
            />
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (product) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [product]);

  if (!product) return null;

  const allImages =
    product.images && product.images.length > 0 ? product.images : [product.image];

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      setStep("details");
      setSelectedSize("");
      setOrderForm(EMPTY_ORDER);
      setFormError("");
      setAddedToCart(false);
    }, 280);
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
      "🛍 *طلب جديد — Outfit Pro*", "",
      `📦 *المنتج:* ${product.name}`,
      `📐 *المقاس:* ${selectedSize}`,
      `💰 *السعر:* ${product.price.toLocaleString("ar-MA")} درهم`,
      product.description ? `📝 *الوصف:* ${product.description}` : "",
      "", "━━━━━━━━━━━━━━━",
      "👤 *معلومات العميل:*",
      `الاسم: ${orderForm.name}`, `الهاتف: ${orderForm.phone}`, `المدينة: ${orderForm.city}`,
      orderForm.address ? `العنوان: ${orderForm.address}` : "",
      orderForm.notes ? `ملاحظات: ${orderForm.notes}` : "",
      "", "🚚 الدفع عند الاستلام", "أرجو تأكيد الطلب. شكراً 🙏",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`, "_blank");
    handleClose();
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f0ead6",
    borderRadius: "10px",
    padding: "0.7rem 0.9rem",
    width: "100%",
    outline: "none",
    fontSize: "0.875rem",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Sheet — slides up from bottom */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none" style={{ top: 0, alignItems: "flex-end" }}>
        <div
          className="w-full pointer-events-auto flex flex-col"
          style={{
            maxWidth: "520px",
            maxHeight: "92vh",
            borderRadius: "20px 20px 0 0",
            background: "#111113",
            boxShadow: "0 -4px 40px rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderBottom: "none",
            transition: "transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s ease",
            transform: visible ? "translateY(0)" : "translateY(60px)",
            opacity: visible ? 1 : 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── STEP 1: PRODUCT DETAILS ── */}
          {step === "details" && (
            <>
              {/* Image — fixed height, no header bar above it */}
              <div className="shrink-0 overflow-hidden" style={{ borderRadius: "20px 20px 0 0" }}>
                <ImageCarousel images={allImages} onClose={handleClose} />
              </div>

              {/* Scrollable info */}
              <div className="overflow-y-auto flex-1 px-5 pt-4 pb-2 flex flex-col gap-4">

                {/* Category + name */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: "rgba(201,146,26,0.7)" }}>
                    {product.category}
                  </span>
                  <h2 className="text-lg font-black leading-snug" style={{ color: "#f0ead6" }}>
                    {product.name}
                  </h2>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black" style={{ color: "#c9921a" }}>
                    {product.price.toLocaleString("ar-MA")}
                  </span>
                  <span className="text-sm" style={{ color: "rgba(201,146,26,0.55)" }}>درهم</span>
                  <div className="flex items-center gap-2 mr-auto">
                    <span className="text-xs" style={{ color: "rgba(240,234,214,0.35)" }}>🚚 الدفع عند الاستلام</span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(240,234,214,0.55)", lineHeight: "1.7" }}>
                    {product.description}
                  </p>
                )}

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

                {/* Size picker */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: "#f0ead6" }}>اختر المقاس</span>
                    {selectedSize && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: "rgba(201,146,26,0.15)", color: "#c9921a" }}>
                        {selectedSize} ✓
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => { setSelectedSize(size); setFormError(""); }}
                        className="font-bold text-sm transition-all"
                        style={{
                          width: "44px",
                          height: "38px",
                          borderRadius: "9px",
                          ...(selectedSize === size
                            ? { background: "linear-gradient(135deg,#c9921a,#e8b84b)", color: "#0a0a0b", boxShadow: "0 3px 12px rgba(201,146,26,0.3)" }
                            : { background: "rgba(255,255,255,0.05)", color: "rgba(240,234,214,0.5)", border: "1px solid rgba(255,255,255,0.08)" }
                          ),
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error message */}
                {formError && (
                  <p className="text-xs text-center py-2 rounded-xl"
                    style={{ color: "#f87171", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
                    ⚠️ {formError}
                  </p>
                )}
              </div>

              {/* Sticky CTA bar */}
              <div
                className="shrink-0 px-5 py-4 flex gap-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#111113" }}
              >
                <button
                  onClick={() => {
                    if (!selectedSize) { setFormError("يرجى اختيار المقاس أولاً"); return; }
                    setFormError("");
                    setStep("order");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 font-black text-sm py-3.5 rounded-2xl transition-all active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", color: "#fff", boxShadow: "0 4px 18px rgba(37,211,102,0.2)" }}
                >
                  {WA_ICON}
                  اطلب الآن
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                  style={
                    addedToCart
                      ? { background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1.5px solid rgba(34,197,94,0.3)" }
                      : { background: "rgba(201,146,26,0.08)", color: "#c9921a", border: "1.5px solid rgba(201,146,26,0.25)" }
                  }
                >
                  {addedToCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                  <span>{addedToCart ? "أُضيف" : "السلة"}</span>
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: ORDER FORM ── */}
          {step === "order" && (
            <>
              {/* Header bar */}
              <div
                className="flex items-center justify-between px-5 py-4 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setStep("details"); setFormError(""); }}
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
                  >
                    <ChevronRight size={17} style={{ color: "rgba(240,234,214,0.6)" }} />
                  </button>
                  <span className="font-black text-base" style={{ color: "#f0ead6" }}>تفاصيل الطلب</span>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
                >
                  <X size={16} style={{ color: "rgba(240,234,214,0.6)" }} />
                </button>
              </div>

              {/* Scrollable form */}
              <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

                {/* Mini product card */}
                <div className="flex gap-3 p-3 rounded-xl items-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <img
                    src={allImages[0]}
                    alt={product.name}
                    className="w-14 h-14 rounded-lg shrink-0 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"; }}
                  />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="font-bold text-sm truncate" style={{ color: "#f0ead6" }}>{product.name}</span>
                    <span className="text-xs" style={{ color: "rgba(240,234,214,0.4)" }}>المقاس: {selectedSize}</span>
                    <span className="font-black text-base" style={{ color: "#c9921a" }}>
                      {product.price.toLocaleString("ar-MA")} درهم
                    </span>
                  </div>
                </div>

                {/* Form fields */}
                <div className="flex flex-col gap-3">
                  {[
                    { label: "الاسم الكامل", key: "name", placeholder: "مثال: محمد أمين", required: true, type: "text" },
                    { label: "رقم الهاتف", key: "phone", placeholder: "0612345678", required: true, type: "tel" },
                  ].map(({ label, key, placeholder, required, type }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold" style={{ color: "rgba(240,234,214,0.6)" }}>
                        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={orderForm[key as keyof OrderForm]}
                        onChange={(e) => setOrderForm((f) => ({ ...f, [key]: e.target.value }))}
                        style={{ ...inputStyle, direction: key === "phone" ? "ltr" : "rtl", textAlign: "right" }}
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "المدينة", key: "city", placeholder: "الدار البيضاء", required: true },
                      { label: "الحي / الشارع", key: "address", placeholder: "اختياري", required: false },
                    ].map(({ label, key, placeholder, required }) => (
                      <div key={key} className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold" style={{ color: "rgba(240,234,214,0.6)" }}>
                          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
                        </label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={orderForm[key as keyof OrderForm]}
                          onChange={(e) => setOrderForm((f) => ({ ...f, [key]: e.target.value }))}
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold" style={{ color: "rgba(240,234,214,0.4)" }}>ملاحظات (اختياري)</label>
                    <input
                      type="text"
                      placeholder="أي تفاصيل إضافية..."
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm((f) => ({ ...f, notes: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Error */}
                {formError && (
                  <p className="text-xs text-center py-2 rounded-xl"
                    style={{ color: "#f87171", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
                    ⚠️ {formError}
                  </p>
                )}
              </div>

              {/* Sticky confirm CTA */}
              <div
                className="shrink-0 px-5 py-4 flex flex-col gap-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#111113" }}
              >
                <button
                  onClick={handleConfirmOrder}
                  className="w-full flex items-center justify-center gap-2 font-black text-sm py-3.5 rounded-2xl transition-all active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", color: "#fff", boxShadow: "0 4px 18px rgba(37,211,102,0.2)" }}
                >
                  {WA_ICON}
                  تأكيد الطلب عبر واتساب
                </button>
                <p className="text-xs text-center" style={{ color: "rgba(240,234,214,0.2)" }}>
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
