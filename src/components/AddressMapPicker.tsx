"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin, Target, Search } from "lucide-react";

const blueDotIcon = new L.divIcon({
  className: "bg-transparent",
  html: `<div class="relative flex h-5 w-5 items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white shadow-sm"></span>
        </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

type LocationDetails = {
  flat: string;
  street: string;
  area: string;
  pincode: string;
};

type Props = {
  onLocationSelect: (details: LocationDetails, lat: number, lng: number) => void;
};

function MapEventsController({ onMoveEnd }: { onMoveEnd: (center: L.LatLng) => void }) {
  useMapEvents({
    moveend: (e) => {
      onMoveEnd(e.target.getCenter());
    }
  });
  return null;
}

export default function AddressMapPicker({ onLocationSelect }: Props) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [deviceLocation, setDeviceLocation] = useState<L.LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string>("Waiting for location access...");
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  const [map, setMap] = useState<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced Search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=in`);
        const data = await res.json();
        setSearchResults(data);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      
      if (data && data.address) {
        const { road, neighbourhood, suburb, city, state, postcode, postal_code, house_number } = data.address;
        
        onLocationSelect({
          flat: house_number || "",
          street: road || neighbourhood || "",
          area: suburb || city || state || "",
          pincode: postcode || postal_code || ""
        }, lat, lng);
      }
    } catch (e) {
      console.error("Geocoding failed", e);
    } finally {
      setLoading(false);
    }
  }, [onLocationSelect]);

  const fetchCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      setGpsStatus("Failed to get GPS");
      return;
    }

    setGpsStatus("Detecting location...");
    setErrorMsg("");
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = new L.LatLng(latitude, longitude);
        setDeviceLocation(newPos);
        setPosition(newPos);
        if (map) map.flyTo(newPos, 16);
        reverseGeocode(latitude, longitude);
        setGpsStatus(`Location Found (Accuracy: ${Math.round(pos.coords.accuracy)}m)`);
      },
      (error) => {
        console.warn("Geolocation Error", error);
        
        let errorMessage = "Failed to get GPS.";
        if (error.code === 1) errorMessage = "Permission Denied. Please enable location access in your browser.";
        if (error.code === 2) errorMessage = "Position Unavailable (Make sure your device GPS is on).";
        if (error.code === 3) errorMessage = "Request Timed Out (Poor signal).";
        
        setErrorMsg(errorMessage);
        setGpsStatus("Default Location Loaded");
        
        setPosition((prev) => {
          const fallback = prev || new L.LatLng(20.5937, 78.9629);
          if (map) map.flyTo(fallback, 16);
          return fallback;
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  }, [map, reverseGeocode]);

  useEffect(() => {
    fetchCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!position) {
    return (
      <div className="w-full h-[300px] md:h-[400px] bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-4 text-gray-500">
        <Target className="h-8 w-8 animate-pulse text-brand" />
        <p className="font-semibold px-4 text-center">{gpsStatus}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-semibold">
          {errorMsg}
        </div>
      )}
      
      <div className="w-full relative rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0">
        
        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-4 z-[500] flex flex-col gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for area, street name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 backdrop-blur-md text-gray-900 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand shadow-lg font-medium"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />}
          </div>
          
          {searchResults.length > 0 && (
            <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl overflow-hidden shadow-xl max-h-60 overflow-y-auto">
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-start gap-3 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);
                    const newPos = new L.LatLng(lat, lon);
                    setPosition(newPos);
                    if (map) map.flyTo(newPos, 16);
                    reverseGeocode(lat, lon);
                    setSearchResults([]);
                    setSearchQuery("");
                  }}
                >
                  <MapPin className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{result.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Use Current Location Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            fetchCurrentLocation();
          }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[400] bg-gray-900/90 hover:bg-gray-800 backdrop-blur-sm text-green-400 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg border border-gray-700 transition-all active:scale-95"
        >
          <Target className="h-4 w-4 shrink-0" />
          <span>Use current location</span>
        </button>

        {/* Status Pill */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[300px] z-[400] bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-1 text-sm font-bold transition-all">
          <div className="flex items-center justify-center gap-2 text-gray-900 border-b border-gray-100 pb-2 mb-1">
            <span className="truncate">Move map to exact location</span>
          </div>
          <div className="flex items-start justify-center gap-2 text-xs text-gray-500 font-medium text-center">
            {loading ? <Loader2 className="h-3 w-3 animate-spin text-brand shrink-0 mt-0.5" /> : <div className="h-2 w-2 rounded-full bg-green-500 shrink-0 mt-1" />}
            <span className="leading-tight">{loading ? "Fetching address details..." : gpsStatus}</span>
          </div>
        </div>

        {/* Fixed Center Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[400] pointer-events-none flex flex-col items-center justify-end">
          <img 
            src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png" 
            alt="Center Pin" 
            className="w-[25px] h-[41px] drop-shadow-md"
          />
        </div>

      <MapContainer 
        center={position} 
        zoom={16} 
        style={{ height: "450px", width: "100%", zIndex: 0 }}
        ref={setMap}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
        />
        
        <MapEventsController onMoveEnd={(center) => {
          setPosition(center);
          reverseGeocode(center.lat, center.lng);
        }} />

        {deviceLocation && (
          <Marker position={deviceLocation} icon={blueDotIcon} />
        )}
      </MapContainer>
    </div>
    </div>
  );
}
