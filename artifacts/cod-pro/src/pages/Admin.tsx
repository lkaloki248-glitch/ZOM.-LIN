import { useState } from "react";
import { useLocation } from "wouter";
import { useStore, Product } from "../context/StoreContext";
import { Plus, Edit2, Trash2, Save, X, ArrowRight, Upload, Download } from "lucide-react";

const IMGBB_KEY = "fb99db1296d15c3b43676b06d8e66c51";
const CATEGORIES = ["هوديات", "جاكيتات", "قمصان", "تيشرتات", "بناطيل"];

const EMPTY_FORM = {
  name: "",
  price: "",
  image: "",
  category: "هوديات",
  description: "",
};

export default function Admin() {
  const { products, addProduct, editProduct, deleteProduct, importProducts } = useStore();
  const [, navigate] = useLocation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [importJson, setImportJson] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        setForm((f) => ({ ...f, image: json.data.url }));
        notify("✅ تم رفع الصورة بنجاح!");
      } else {
        notify("❌ فشل رفع الصورة");
      }
    } catch {
      notify("❌ خطأ في الاتصال");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.image) {
      notify("❌ يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    const product = {
      name: form.name,
      price: Number(form.price),
      image: form.image,
      category: form.category,
      description: form.description,
    };
    if (editingId) {
      editProduct(editingId, product);
      notify("✅ تم تعديل المنتج");
      setEditingId(null);
    } else {
      addProduct(product);
      notify("✅ تم إضافة المنتج");
    }
    setForm(EMPTY_FORM);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), image: p.image, category: p.category, description: p.description || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteProduct(id);
      setDeleteConfirm(null);
      notify("🗑 تم حذف المنتج");
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importJson);
      const arr = Array.isArray(data) ? data : [data];
      importProducts(arr);
      notify(`✅ تم استيراد ${arr.length} منتج`);
      setImportJson("");
      setShowImport(false);
    } catch {
      notify("❌ صيغة JSON غير صحيحة");
    }
  };

  const handleExport = () => {
    const json = JSON.stringify(products, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codpro-products.json";
    a.click();
    notify("✅ تم تصدير المنتجات");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(201,146,26,0.3)",
    color: "#f0ead6",
    borderRadius: "0.5rem",
    padding: "0.6rem 0.8rem",
    width: "100%",
    outline: "none",
    fontSize: "0.9rem",
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(240 6% 4%)" }}>
      {/* Notification */}
      {notification && (
        <div className="notification fixed top-4 right-4 z-50 px-5 py-3 rounded-xl font-semibold text-sm shadow-xl"
          style={{ background: "hsl(240 6% 12%)", border: "1px solid rgba(201,146,26,0.4)", color: "#f0ead6" }}>
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-4 flex items-center justify-between"
        style={{ background: "rgba(10,10,12,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,146,26,0.3)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-full" style={{ background: "rgba(201,146,26,0.15)" }}>
            <ArrowRight size={20} style={{ color: "#c9921a" }} />
          </button>
          <div>
            <span className="text-xl font-black" style={{ color: "#c9921a", letterSpacing: "0.1em" }}>COD PRO</span>
            <span className="text-sm mr-2" style={{ color: "rgba(240,234,214,0.5)" }}>لوحة الإدارة</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.05)", color: "#f0ead6", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Download size={14} /> تصدير
          </button>
          <button onClick={() => setShowImport(!showImport)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "rgba(201,146,26,0.15)", color: "#c9921a", border: "1px solid rgba(201,146,26,0.3)" }}>
            <Upload size={14} /> استيراد
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Import JSON Panel */}
        {showImport && (
          <div className="rounded-2xl p-6" style={{ background: "hsl(240 6% 8%)", border: "1px solid rgba(201,146,26,0.2)" }}>
            <h3 className="font-bold mb-3" style={{ color: "#c9921a" }}>استيراد منتجات (JSON)</h3>
            <p className="text-xs mb-3" style={{ color: "rgba(240,234,214,0.4)" }}>
              الصيغة: {`[{"name":"اسم","price":299,"image":"url","category":"هوديات","description":"وصف"}]`}
            </p>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              rows={5}
              placeholder="الصق كود JSON هنا..."
              className="w-full rounded-xl p-3 text-xs font-mono resize-y"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(201,146,26,0.2)", color: "#f0ead6", outline: "none" }}
            />
            <div className="flex gap-2 mt-3">
              <button onClick={handleImport} className="btn-gold px-5 py-2 rounded-lg text-sm font-bold">استيراد</button>
              <button onClick={() => setShowImport(false)} className="px-5 py-2 rounded-lg text-sm"
                style={{ background: "rgba(255,255,255,0.05)", color: "#f0ead6" }}>إلغاء</button>
            </div>
          </div>
        )}

        {/* Add / Edit Form */}
        <div className="rounded-2xl p-6" style={{ background: "hsl(240 6% 8%)", border: "1px solid rgba(201,146,26,0.25)" }}>
          <h2 className="text-xl font-black mb-5 flex items-center gap-2" style={{ color: "#f0ead6" }}>
            {editingId ? <><Edit2 size={20} style={{ color: "#c9921a" }} /> تعديل المنتج</> : <><Plus size={20} style={{ color: "#c9921a" }} /> إضافة منتج جديد</>}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "#c9921a" }}>اسم المنتج *</label>
              <input type="text" placeholder="مثل: هودي بريميوم أسود" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                style={inputStyle} />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "#c9921a" }}>السعر (درهم) *</label>
              <input type="number" placeholder="مثل: 299" value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                style={inputStyle} />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "#c9921a" }}>الفئة *</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                style={{ ...inputStyle, cursor: "pointer" }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "#c9921a" }}>رابط الصورة *</label>
              <input type="url" placeholder="https://..." value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                style={inputStyle} />
            </div>

            {/* Image upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "#c9921a" }}>أو ارفع صورة (imgbb)</label>
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(201,146,26,0.4)", color: "#a0906a" }}>
                <Upload size={16} />
                {uploading ? "جاري الرفع..." : "اختر صورة"}
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }}
                  disabled={uploading} />
              </label>
              {form.image && (
                <img src={form.image} alt="preview" className="w-20 h-20 object-cover rounded-lg mt-1"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "#c9921a" }}>وصف المنتج</label>
              <input type="text" placeholder="وصف مختصر للمنتج" value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                style={inputStyle} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button onClick={handleSubmit} className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl font-bold">
              <Save size={18} />
              {editingId ? "حفظ التعديلات" : "إضافة المنتج"}
            </button>
            {editingId && (
              <button onClick={cancelEdit} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
                style={{ background: "rgba(255,255,255,0.05)", color: "#f0ead6", border: "1px solid rgba(255,255,255,0.1)" }}>
                <X size={18} /> إلغاء
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(240 6% 8%)", border: "1px solid rgba(201,146,26,0.2)" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(201,146,26,0.15)" }}>
            <h2 className="font-black text-lg" style={{ color: "#f0ead6" }}>المنتجات ({products.length})</h2>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {products.map((p) => (
              <div key={p.id} className="flex gap-3 items-center p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,146,26,0.1)" }}>
                <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-lg shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"; }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "#f0ead6" }}>{p.name}</p>
                  <p className="text-xs" style={{ color: "#c9921a" }}>{p.price} درهم</p>
                  <p className="text-xs" style={{ color: "rgba(240,234,214,0.4)" }}>{p.category}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg"
                    style={{ background: "rgba(201,146,26,0.15)", color: "#c9921a" }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg"
                    style={{ background: deleteConfirm === p.id ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(201,146,26,0.1)" }}>
                  {["الصورة", "الاسم", "السعر", "الفئة", "الوصف", "إجراءات"].map((h) => (
                    <th key={h} className="px-4 py-3 text-right text-xs font-semibold" style={{ color: "rgba(201,146,26,0.8)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"; }} />
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold max-w-[160px] truncate" style={{ color: "#f0ead6" }}>{p.name}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: "#c9921a" }}>{p.price} درهم</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(201,146,26,0.1)", color: "#c9921a", border: "1px solid rgba(201,146,26,0.2)" }}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[180px] truncate" style={{ color: "rgba(240,234,214,0.5)" }}>{p.description || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(p)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ background: "rgba(201,146,26,0.15)", color: "#c9921a", border: "1px solid rgba(201,146,26,0.2)" }}>
                          <Edit2 size={12} /> تعديل
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ background: deleteConfirm === p.id ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                          <Trash2 size={12} /> {deleteConfirm === p.id ? "تأكيد؟" : "حذف"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
