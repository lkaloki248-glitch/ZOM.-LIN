export default function Hero({ onShop }: { onShop: () => void }) {
  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight: "85vh" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=80')`,
        }}
      />
      {/* Overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,12,0.92) 0%, rgba(10,10,12,0.6) 50%, rgba(10,10,12,0.85) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,12,1) 0%, transparent 60%)" }} />

      {/* Decorative gold lines */}
      <div className="absolute top-8 right-8 left-8 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,146,26,0.5), transparent)" }} />
      <div className="absolute bottom-8 right-8 left-8 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,146,26,0.5), transparent)" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full text-sm font-semibold"
          style={{ background: "rgba(201,146,26,0.15)", border: "1px solid rgba(201,146,26,0.4)", color: "#e8b84b" }}>
          ✦ كوليكشن صيف 2025 ✦
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight" style={{ fontFamily: "'Cairo', sans-serif" }}>
          <span className="block text-white mb-2">الأناقة</span>
          <span className="block shimmer" style={{ background: "linear-gradient(135deg, #c9921a, #e8b84b, #c9921a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% 100%" }}>
            الحقيقية
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl mb-3 font-medium" style={{ color: "rgba(240,234,214,0.8)" }}>
          ملابس فاخرة بأسعار مغربية حقيقية
        </p>
        <p className="text-sm mb-8" style={{ color: "rgba(240,234,214,0.5)" }}>
          توصيل لجميع أنحاء المغرب • الدفع عند الاستلام
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onShop}
            className="btn-gold px-10 py-4 rounded-full text-lg font-bold shadow-lg"
          >
            تسوق الآن ◀
          </button>
          <a
            href="https://wa.me/212614221016"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 rounded-full text-lg font-bold transition-all"
            style={{ border: "1px solid rgba(201,146,26,0.5)", color: "#e8b84b", background: "transparent" }}
          >
            تواصل معنا
          </a>
        </div>

        {/* Stats */}
        <div className="mt-14 flex flex-wrap justify-center gap-8">
          {[
            { label: "منتج فاخر", value: "+100" },
            { label: "عميل راضٍ", value: "+2K" },
            { label: "توصيل سريع", value: "24h" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black mb-1" style={{ color: "#c9921a" }}>{stat.value}</div>
              <div className="text-sm" style={{ color: "rgba(240,234,214,0.6)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
