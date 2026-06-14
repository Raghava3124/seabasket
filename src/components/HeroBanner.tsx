export default function HeroBanner() {
  return (
    <div className="container mx-auto px-4 lg:px-8 mt-6">
      <div className="relative w-full h-[200px] md:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-r from-brand-dark via-brand to-brand-light flex items-center justify-center shadow-lg">
        {/* Placeholder Content */}
        <div className="text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Fresh Catch of the Day!</h1>
          <p className="text-lg md:text-xl font-medium mb-8 opacity-90">Get 20% off on all Premium Seafood.</p>
          <button className="bg-white text-brand px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors shadow-md">
            Order Now
          </button>
        </div>

        {/* Carousel indicators (mock) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
        </div>
      </div>
    </div>
  );
}
