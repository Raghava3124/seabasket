"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { User, Calendar, Mail, Phone, UserCircle2 } from "lucide-react";

export default function ProfileForm({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    dob: user.dob || "",
    anniversary: user.anniversary || "",
    gender: user.gender || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-brand to-[#0B3B60]"></div>
      
      <form onSubmit={handleSubmit} className="relative z-10 pt-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md flex items-center justify-center -mt-16">
            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <UserCircle2 className="w-16 h-16" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Mobile</label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                value={"+91 " + user.phone} 
                readOnly 
                className="w-full pl-10 pr-24 py-3 bg-gray-100/50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 cursor-not-allowed" 
              />
              {/* Optional CHANGE button mimicking the design, but read-only for now */}
              <span className="absolute right-4 text-xs font-bold text-brand cursor-not-allowed opacity-50">CHANGE</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full pl-10 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all" 
              />
              <span className="absolute right-4 text-xs font-bold text-brand cursor-pointer">CHANGE</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="date" 
                  name="dob" 
                  value={formData.dob} 
                  onChange={handleChange} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all text-gray-700" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Anniversary</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="date" 
                  name="anniversary" 
                  value={formData.anniversary} 
                  onChange={handleChange} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all text-gray-700" 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Gender</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all text-gray-700"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-8 bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? "Updating..." : "Update profile"}
        </button>
      </form>
    </div>
  );
}
