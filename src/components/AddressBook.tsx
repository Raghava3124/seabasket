"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Home, Briefcase, Navigation, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const AddressMapPicker = dynamic(() => import("./AddressMapPicker"), { ssr: false });

export default function AddressBook({ hideList = false, selectionMode = false, selectedId, onSelect, onAddressesLoaded, title = "Saved Addresses" }: { hideList?: boolean, selectionMode?: boolean, selectedId?: string | null, onSelect?: (id: string) => void, onAddressesLoaded?: (addresses: any[]) => void, title?: string }) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [type, setType] = useState("Home");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [flat, setFlat] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState(16.9834);
  const [longitude, setLongitude] = useState(81.7836);

  const resetForm = () => {
    setEditingId(null);
    setType("Home");
    setReceiverName("");
    setReceiverPhone("");
    setFlat("");
    setStreet("");
    setArea("");
    setPincode("");
    setLatitude(16.9834);
    setLongitude(81.7836);
    setIsAdding(false);
  };
  
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
        if (onAddressesLoaded) onAddressesLoaded(data.addresses);
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
      const url = editingId ? `/api/user/address/${editingId}` : "/api/user/address";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, receiverName, receiverPhone, flat, street, area, pincode, latitude, longitude })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to save address");
      
      resetForm();
      fetchAddresses();

      if (data.warning) {
        toast.error(data.warning, { duration: 5000 });
      } else {
        toast.success(`Address ${editingId ? 'updated' : 'saved'} successfully`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addr: any) => {
    setEditingId(addr.id);
    setType(addr.type);
    setReceiverName(addr.receiverName || "");
    setReceiverPhone(addr.receiverPhone || "");
    setFlat(addr.flat);
    setStreet(addr.street);
    setArea(addr.area);
    setPincode(addr.pincode);
    if (addr.latitude && addr.longitude) {
      setLatitude(addr.latitude);
      setLongitude(addr.longitude);
    }
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/user/address/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Address deleted");
        fetchAddresses();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch (e) {
      toast.error("Error deleting address");
    }
  };

  if (isAdding) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-gray-900">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
        
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
            <input placeholder="Receiver Name (e.g. John Doe)" value={receiverName} onChange={e => setReceiverName(e.target.value)} required className="col-span-2 md:col-span-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand focus:outline-none" />
            <input placeholder="Receiver Phone Number (10 digits)" value={receiverPhone} onChange={e => setReceiverPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} maxLength={10} required className="col-span-2 md:col-span-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand focus:outline-none" />
            
            <div className="col-span-2 relative">
              <input placeholder="Pincode (e.g. 533001)" value={pincode} onChange={handlePincodeChange} required maxLength={6} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 pr-10 text-sm focus:ring-1 focus:ring-brand focus:outline-none" />
              {pincodeLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400 absolute right-3 top-3.5" />}
            </div>
            <input placeholder="Flat / House No / Floor / Building" value={flat} onChange={e => setFlat(e.target.value)} className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand focus:outline-none" />
            <input placeholder="Street / Locality" value={street} onChange={e => setStreet(e.target.value)} required className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand focus:outline-none" />
            <input placeholder="Area / District / State (Auto-filled by Pincode)" value={area} onChange={e => setArea(e.target.value)} required className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand focus:outline-none" />
          </div>

          <div className="flex gap-4 mt-8">
            <button type="button" onClick={resetForm} className="flex-1 border border-gray-300 py-3 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-brand text-white py-3 rounded-lg font-bold hover:bg-brand-dark transition-colors disabled:opacity-50">Save Address</button>
          </div>
        </form>
      </div>
    );
  }

  if (hideList) {
    return (
      <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-brand/50 text-center hover:bg-brand/5 transition-colors cursor-pointer" onClick={() => { resetForm(); setIsAdding(true); }}>
        <button className="flex items-center justify-center gap-2 font-bold text-brand transition-colors mx-auto">
          <Plus className="h-5 w-5" /> Add New Delivery Address
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <button onClick={() => { resetForm(); setIsAdding(true); }} className="flex items-center gap-1 text-sm font-bold text-brand hover:underline">
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
          <label 
            key={addr.id} 
            className={`block p-4 border rounded-xl transition-all relative group ${selectionMode ? (addr.isDeliverable === false ? 'opacity-60 cursor-not-allowed bg-gray-50' : selectedId === addr.id ? 'border-brand bg-brand/5 ring-1 ring-brand cursor-pointer' : 'border-gray-200 hover:border-gray-300 cursor-pointer') : 'border-gray-200 hover:border-brand/50 cursor-default'}`}
          >
            <div className="flex items-start gap-3">
              {selectionMode && (
                <div className="mt-1">
                  <input 
                    type="radio" 
                    name="address" 
                    value={addr.id} 
                    checked={selectedId === addr.id}
                    disabled={addr.isDeliverable === false}
                    onChange={(e) => onSelect && onSelect(e.target.value)}
                    className="text-brand focus:ring-brand disabled:opacity-50 cursor-pointer"
                  />
                </div>
              )}
              {!selectionMode && (
                <div className="bg-gray-100 p-2 rounded-full text-gray-600 mt-1">
                  {addr.type === "Home" ? <Home className="h-5 w-5" /> : addr.type === "Work" ? <Briefcase className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900">{addr.type}</h4>
                  {addr.isDefault && !selectionMode && <span className="bg-brand/10 text-brand text-[10px] font-bold px-2 py-0.5 rounded">DEFAULT</span>}
                  {addr.isDeliverable === false && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">OUT OF BOUNDS</span>}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {addr.receiverName && <span className="font-semibold text-gray-800 block mb-1">{addr.receiverName} {addr.receiverPhone && `• +91 ${addr.receiverPhone}`}</span>}
                  {addr.flat}, {addr.street},<br/>{addr.area}, Pincode: {addr.pincode}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleEdit(addr); }} className="text-xs font-bold text-brand hover:underline">Edit</button>
                  <button type="button" onClick={(e) => { e.preventDefault(); handleDelete(addr.id); }} className="text-xs font-bold text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
