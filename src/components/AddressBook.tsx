"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Home, Briefcase, Navigation, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const AddressMapPicker = dynamic(() => import("./AddressMapPicker"), { ssr: false });

export default function AddressBook() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [type, setType] = useState("Home");
  const [flat, setFlat] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState(16.9834);
  const [longitude, setLongitude] = useState(81.7836);
  
  const [gpsLoading, setGpsLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/address");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationFromPincode = async (pin: string) => {
    if (pin.length !== 6) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setArea(`${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`);
      }
    } catch (e) {
      console.error("Failed to fetch pincode details", e);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (val.length === 6) {
      fetchLocationFromPincode(val);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!street || !area || !pincode) {
      setError("Please fill all required address fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, flat, street, area, pincode, latitude, longitude })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to save address");
      
      setIsAdding(false);
      setFlat(""); setStreet(""); setArea(""); setPincode("");
      fetchAddresses();

      if (data.warning) {
        toast.error(data.warning, { duration: 5000 });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isAdding) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Add New Address</h3>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div className="flex gap-4 mb-6">
            {["Home", "Work", "Other"].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${type === t ? "border-brand bg-brand/5 text-brand" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                {t === "Home" ? <Home className="h-4 w-4" /> : t === "Work" ? <Briefcase className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                {t}
              </button>
            ))}
          </div>

          <div className="mb-6">
             <AddressMapPicker onLocationSelect={(details, lat, lng) => {
               if (details.flat) setFlat(details.flat);
               if (details.street) setStreet(details.street);
               if (details.area) setArea(details.area);
               if (details.pincode) setPincode(details.pincode);
               setLatitude(lat);
               setLongitude(lng);
             }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative">
              <input placeholder="Pincode (e.g. 533001)" value={pincode} onChange={handlePincodeChange} required maxLength={6} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 pr-10 text-sm focus:ring-1 focus:ring-brand focus:outline-none" />
              {pincodeLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400 absolute right-3 top-3.5" />}
            </div>
            <input placeholder="Flat / House No / Floor / Building" value={flat} onChange={e => setFlat(e.target.value)} className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand focus:outline-none" />
            <input placeholder="Street / Locality" value={street} onChange={e => setStreet(e.target.value)} required className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand focus:outline-none" />
            <input placeholder="Area / District / State (Auto-filled by Pincode)" value={area} onChange={e => setArea(e.target.value)} required className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand focus:outline-none" />
          </div>

          <div className="flex gap-4 mt-8">
            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 border border-gray-300 py-3 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-brand text-white py-3 rounded-lg font-bold hover:bg-brand-dark transition-colors disabled:opacity-50">Save Address</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-1 text-sm font-bold text-brand hover:underline">
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading addresses...</p>}
      
      {!loading && addresses.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">No saved addresses found.</p>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="p-4 border border-gray-200 rounded-lg hover:border-brand/50 transition-colors relative group cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 p-2 rounded-full text-gray-600 mt-1">
                {addr.type === "Home" ? <Home className="h-5 w-5" /> : addr.type === "Work" ? <Briefcase className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900">{addr.type}</h4>
                  {addr.isDefault && <span className="bg-brand/10 text-brand text-[10px] font-bold px-2 py-0.5 rounded">DEFAULT</span>}
                  {addr.isDeliverable === false && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">UNDELIVERABLE</span>}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {addr.flat}, {addr.street},<br/>{addr.area}, Pincode: {addr.pincode}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
