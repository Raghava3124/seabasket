"use client";

import { useState, useEffect } from "react";
import { Search, User, ShoppingCart, MapPin, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import AuthModal from "./AuthModal";
import { useCart } from "@/context/CartContext";
import { haversineDistance } from "@/lib/geo";

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { totalItems, setIsCartOpen } = useCart();

  // Location State
  const [locationText, setLocationText] = useState("Select Location");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isDeliverable, setIsDeliverable] = useState<boolean | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [navCategories, setNavCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.error(err));

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setNavCategories(data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  // Debounced Search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.products || []);
          setShowDropdown(true);
        })
        .finally(() => setIsSearching(false));
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleGetLocation = async () => {
    setIsLocationLoading(true);
    try {
      // 1. Get Store Config
      const storeRes = await fetch("/api/store");
      const storeData = await storeRes.json();
      if (!storeData.store) {
        toast.error("Store location not configured yet.");
        setIsLocationLoading(false);
        return;
      }
      const store = storeData.store;

      // 2. Get User Location
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser");
        setIsLocationLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // 3. Reverse Geocode for City Name
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const geoData = await geoRes.json();
          const areaName = geoData.address.city || geoData.address.town || geoData.address.suburb || "Current Location";

          // 4. Calculate Distance
          const distance = haversineDistance(store.latitude, store.longitude, latitude, longitude);
          const deliverable = distance <= (store.radiusKm || 25);
          
          setIsDeliverable(deliverable);
          setLocationText(areaName);
          setIsLocationLoading(false);
        },
        () => {
          toast.error("Unable to retrieve your location");
          setIsLocationLoading(false);
        }
      );
    } catch (err) {
      console.error(err);
      setIsLocationLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-[100] w-full bg-surface shadow-sm">
        {/* Top Header */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            
            {/* Logo & Location */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-black text-brand tracking-tight">SeaBasket</span>
              </Link>
              
              <div 
                onClick={handleGetLocation}
                className="hidden md:flex items-center gap-1 text-sm cursor-pointer group"
              >
                {isLocationLoading ? (
                  <Loader2 className="h-5 w-5 text-brand animate-spin" />
                ) : (
                  <MapPin className={`h-5 w-5 transition-colors ${isDeliverable === false ? "text-red-500" : "text-brand group-hover:text-brand-dark"}`} />
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium leading-tight">Location</span>
                    {isDeliverable !== null && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDeliverable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {isDeliverable ? "Deliverable" : "Unreachable"}
                      </span>
                    )}
                  </div>
                  <span className={`font-semibold truncate max-w-[150px] ${isDeliverable === false ? "text-red-600" : "text-foreground"}`}>
                    {locationText}
                  </span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden flex-1 md:flex max-w-2xl relative">
              <div className="relative w-full group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                  placeholder="Search for fresh fish, prawns, crabs..." 
                  className="w-full bg-gray-100 border-none rounded-md py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                />
                {isSearching ? (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
                ) : (
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand" />
                )}
              </div>

              {/* Search Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-[200]">
                    {searchResults.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/product/${product.id}`}
                        onClick={() => { setShowDropdown(false); setSearchQuery(""); }}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{product.name}</h4>
                          <span className="text-sm font-black text-brand">₹{product.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
              {/* Profile */}
              {user ? (
                <>
                  {user.role === "ADMIN" && (
                    <Link href="/admin" className="flex items-center gap-2 cursor-pointer group bg-brand/10 px-3 py-1.5 rounded-lg border border-brand/20 hover:bg-brand hover:text-white transition-all">
                      <ShieldCheck className="h-5 w-5 text-brand group-hover:text-white" />
                      <span className="text-sm font-bold text-brand group-hover:text-white hidden lg:block">Admin Console</span>
                    </Link>
                  )}
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer group">
                    <User className="h-6 w-6 text-brand" />
                    <span className="text-sm font-semibold hidden lg:block text-gray-900">Profile</span>
                  </Link>
                </>
              ) : (
                <button 
                  className="flex items-center gap-2 cursor-pointer group bg-transparent border-none p-0 m-0"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <User className="h-6 w-6 text-gray-700 group-hover:text-brand transition-colors" />
                  <span className="text-sm font-semibold hidden lg:block">Login</span>
                </button>
              )}

              {/* Cart */}
              <button 
                className="flex items-center gap-2 cursor-pointer group bg-transparent border-none p-0 m-0"
                onClick={() => setIsCartOpen(true)}
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-brand transition-colors" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold hidden lg:block">Cart</span>
              </button>
            </div>

          </div>
        </div>

        {/* Secondary Nav / Categories */}
        <div className="border-t border-gray-100 hidden md:block">
          <div className="container mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-8 h-12 text-sm font-medium text-gray-600 overflow-x-auto">
              {navCategories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="hover:text-brand transition-colors whitespace-nowrap">{cat.name}</Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
