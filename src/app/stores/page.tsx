"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Compass, HelpCircle } from "lucide-react";

export default function StoreLocatorPage() {
  const STORE_LAT = 16.9834;
  const STORE_LON = 81.7836;
  const SERVICEABLE_RADIUS_KM = 25;
  const SERVICEABLE_PINCODES = ["533101", "533102", "533103", "533104"];

  const [checkType, setCheckType] = useState<"gps" | "pincode">("gps");
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");
  const [result, setResult] = useState<{
    status: "success" | "fail" | "error";
    message: string;
    details?: string;
  } | null>(null);

  // Haversine Distance Formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of earth in KM
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handleGPSCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);

    if (isNaN(lat) || isNaN(lon)) {
      setResult({
        status: "error",
        message: "Please enter valid numerical values for Latitude and Longitude.",
      });
      return;
    }

    // Latitude ranges from -90 to 90, Longitude from -180 to 180
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setResult({
        status: "error",
        message: "Coordinates out of bounds. Latitude must be -90 to 90, Longitude -180 to 180.",
      });
      return;
    }

    const dist = calculateDistance(STORE_LAT, STORE_LON, lat, lon);

    if (dist <= SERVICEABLE_RADIUS_KM) {
      setResult({
        status: "success",
        message: "Great news! Your location is serviceable.",
        details: `You are approximately ${dist.toFixed(2)} KM away from our store, which is well within our ${SERVICEABLE_RADIUS_KM} KM delivery radius.`,
      });
    } else {
      setResult({
        status: "fail",
        message: "Out of Serviceable Area",
        details: `Your location is ${dist.toFixed(2)} KM away. Our logistics fleet currently supports deliveries up to a ${SERVICEABLE_RADIUS_KM} KM radius.`,
      });
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const cleanPin = pincodeInput.trim();
    if (!cleanPin) {
      setResult({
        status: "error",
        message: "Please enter a pincode.",
      });
      return;
    }

    if (SERVICEABLE_PINCODES.includes(cleanPin)) {
      setResult({
        status: "success",
        message: "Pincode is serviceable!",
        details: `Pincode ${cleanPin} is registered in our active delivery zone list.`,
      });
    } else {
      setResult({
        status: "fail",
        message: "Pincode Not Serviceable",
        details: `Pincode ${cleanPin} is outside our current home delivery zones. Currently serviceable pincodes: ${SERVICEABLE_PINCODES.join(", ")}.`,
      });
    }
  };

  const handleUseMyLocation = () => {
    setResult(null);
    if (!navigator.geolocation) {
      setResult({
        status: "error",
        message: "Geolocation is not supported by your browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLatInput(lat.toString());
        setLonInput(lon.toString());
        
        const dist = calculateDistance(STORE_LAT, STORE_LON, lat, lon);
        if (dist <= SERVICEABLE_RADIUS_KM) {
          setResult({
            status: "success",
            message: "Location successfully acquired! Serviceable.",
            details: `Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}. Distance: ${dist.toFixed(2)} KM away from store.`,
          });
        } else {
          setResult({
            status: "fail",
            message: "Location acquired but out of range.",
            details: `Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}. Distance: ${dist.toFixed(2)} KM away (Max Radius: ${SERVICEABLE_RADIUS_KM} KM).`,
          });
        }
      },
      () => {
        setResult({
          status: "error",
          message: "Unable to retrieve your location. Please input coordinates manually.",
        });
      }
    );
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <section className="container mx-auto px-4 lg:px-8 mb-16">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight text-center mb-4">
          Store Locator & Serviceability
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto text-sm md:text-base">
          Find our primary store location, check store hours, or test your delivery eligibility by coordinates or pincode.
        </p>
      </section>

      <section className="container mx-auto px-4 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Store Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-brand/5 text-brand rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">SeaBasket Main Store</h3>
                  <span className="text-xs text-brand font-bold uppercase tracking-wider">Primary Store & Warehouse</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-600 mb-8">
                <div className="flex gap-3 items-start">
                  <MapPin className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                  <span>SeaBasket Main Store, Coastal Highway, AP 533101</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Clock className="h-5 w-5 text-gray-400 shrink-0" />
                  <span>Open Daily: 6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                  <span>1800-123-4567</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                  <span>support@seabasket.com</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm">Store Coordinates</h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Latitude</span>
                    {STORE_LAT}
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Longitude</span>
                    {STORE_LON}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Area Card */}
            <div className="bg-brand/5 border border-brand/10 rounded-3xl p-6 space-y-4">
              <h4 className="font-bold text-brand flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Delivery Coverage Summary
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                We employ a dual serviceability protocol. Standard delivery is calculated up to <strong>{SERVICEABLE_RADIUS_KM} KM</strong> away using pinpoint GPS. If GPS is unavailable, we offer fallback delivery checking for registered pincodes: <strong>{SERVICEABLE_PINCODES.join(", ")}</strong>.
              </p>
            </div>
          </div>

          {/* Serviceability Checker */}
          <div className="lg:col-span-7 bg-surface border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-xl text-gray-900 mb-6">Am I Serviceable?</h3>

            <div className="flex gap-4 border-b border-gray-100 pb-4 mb-6">
              <button
                onClick={() => { setCheckType("gps"); setResult(null); }}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  checkType === "gps" ? "border-brand text-brand" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Check by Coordinates (GPS)
              </button>
              <button
                onClick={() => { setCheckType("pincode"); setResult(null); }}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  checkType === "pincode" ? "border-brand text-brand" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Check by Pincode
              </button>
            </div>

            {checkType === "gps" ? (
              <form onSubmit={handleGPSCheck} className="space-y-6">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-brand" /> Get coordinates automatically
                  </div>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="bg-brand text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-brand-dark transition-colors shadow-sm"
                  >
                    Use My Current Location
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Latitude *</label>
                    <input
                      type="text"
                      value={latInput}
                      onChange={(e) => setLatInput(e.target.value)}
                      placeholder="e.g. 16.9912"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Longitude *</label>
                    <input
                      type="text"
                      value={lonInput}
                      onChange={(e) => setLonInput(e.target.value)}
                      placeholder="e.g. 81.7954"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-bold p-3 rounded-lg transition-colors"
                >
                  Verify GPS Serviceability
                </button>
              </form>
            ) : (
              <form onSubmit={handlePincodeCheck} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Postal Pincode *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value)}
                    placeholder="e.g. 533101"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-bold p-3 rounded-lg transition-colors"
                >
                  Verify Pincode Eligibility
                </button>
              </form>
            )}

            {/* Results display */}
            {result && (
              <div
                className={`mt-8 p-5 rounded-2xl border ${
                  result.status === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : result.status === "fail"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-orange-50 border-orange-200 text-orange-800"
                }`}
              >
                <h4 className="font-bold text-sm mb-1">{result.message}</h4>
                {result.details && <p className="text-xs opacity-90 leading-relaxed">{result.details}</p>}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-2 items-start text-xs text-gray-400 leading-relaxed">
              <HelpCircle className="h-4 w-4 shrink-0 text-gray-300 mt-0.5" />
              <span>We calculate distance directly from our main warehouse to your location using the Haversine formula (Earth radius of 6371km). Delivery capacity is restricted to a maximum 25km corridor to ensure cold chain integrity.</span>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
