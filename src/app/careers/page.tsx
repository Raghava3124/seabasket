"use client";

import { useState } from "react";
import { Briefcase, Heart, Shield, DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState("Quality Assurance Specialist");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resumeLink: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    {
      title: "Quality Assurance Specialist",
      department: "Operations & Quality Control",
      location: "Main Store, Coastal Highway",
      type: "Full-Time",
      description: "Inspect inbound catch for organoleptic properties, verify temperature logs, perform formalin checks, and oversee hygienic packaging procedures."
    },
    {
      title: "Logistics & Routing Manager",
      department: "Operations",
      location: "Main Store, Coastal Highway",
      type: "Full-Time",
      description: "Manage delivery fleet operations, monitor slot bookings, optimize routes corridor-assignments, and coordinate real-time tracking metrics."
    },
    {
      title: "Senior Backend Engineer",
      department: "Technology",
      location: "Remote / Hybrid",
      type: "Full-Time",
      description: "Own our inventory reservation system, geolocation routing algorithms, and backend API integration with SMS, email, and Razorpay APIs."
    },
    {
      title: "Delivery Executive",
      department: "Logistics",
      location: "Store Area",
      type: "Flexible / Shift",
      description: "Handle the door-to-door delivery of packed seafood within our 25km radius while maintaining strict cold chain delivery protocols."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone || !formData.resumeLink) {
      setError("Please fill in all required fields.");
      return;
    }

    // Mock API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-background min-h-screen py-12">
      {/* Hero Header */}
      <section className="container mx-auto px-4 lg:px-8 mb-16">
        <div className="relative w-full py-16 md:py-20 rounded-3xl overflow-hidden bg-gradient-to-r from-brand-dark via-brand to-brand-light flex items-center justify-center shadow-lg text-center text-white">
          <div className="max-w-3xl px-6">
            <span className="text-xs md:text-sm font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm mb-4 inline-block">
              We Are Hiring
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Join the SeaBasket Crew
            </h1>
            <p className="text-base md:text-lg font-medium opacity-90 leading-relaxed">
              We are a fast-growing, technology-first fresh food startup on a mission to bring fresh, chemical-free seafood to kitchens everywhere. Grow your career with us.
            </p>
          </div>
        </div>
      </section>

      {/* Perks & Benefits */}
      <section className="container mx-auto px-4 lg:px-8 mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 tracking-tight mb-12">Why Work With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <DollarSign className="h-6 w-6 text-brand" />,
              title: "Competitive Pay",
              desc: "Industry standard base salary plus performance-linked bonuses and incentives."
            },
            {
              icon: <Heart className="h-6 w-6 text-brand" />,
              title: "Health & Wellness",
              desc: "Comprehensive health insurance cover for employees and their dependents."
            },
            {
              icon: <Shield className="h-6 w-6 text-brand" />,
              title: "Growth Opportunities",
              desc: "Fast track career paths for top performers as we scale to multiple locations."
            },
            {
              icon: <Briefcase className="h-6 w-6 text-brand" />,
              title: "Work-Life Balance",
              desc: "Flexible schedules, hybrid work options, and generous paid time off policies."
            }
          ].map((benefit, i) => (
            <div key={i} className="bg-surface border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-brand/5 flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Current Openings and Application Form */}
      <section className="container mx-auto px-4 lg:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Jobs List */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Current Open Positions</h2>
            
            <div className="space-y-4">
              {roles.map((role, idx) => (
                <div 
                  key={idx} 
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    selectedRole === role.title 
                      ? "border-brand bg-brand/5 shadow-sm" 
                      : "border-gray-100 bg-surface hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRole(role.title)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-lg text-gray-900">{role.title}</h3>
                    <div className="flex gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-600">{role.type}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-brand/10 rounded text-brand">{role.department}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{role.location}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{role.description}</p>
                  <span className="text-xs font-bold text-brand flex items-center gap-1 group">
                    Apply for this role <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-surface border border-gray-100 rounded-3xl p-6 lg:p-8 sticky top-28 shadow-sm">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Apply Online</h3>
              
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900">Application Submitted!</h4>
                  <p className="text-sm text-gray-600">
                    Thank you for applying for the <span className="font-semibold text-brand">{selectedRole}</span> position. Our recruitment team will review your application and contact you shortly.
                  </p>
                  <button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", resumeLink: "", message: "" });
                    }} 
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Selected Position</label>
                    <select 
                      name="role" 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand"
                    >
                      {roles.map((r, i) => (
                        <option key={i} value={r.title}>{r.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="1800-xxx-xxxx"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Resume / Portfolio Link *</label>
                    <input 
                      type="url" 
                      name="resumeLink" 
                      value={formData.resumeLink}
                      onChange={handleInputChange}
                      placeholder="https://drive.google.com/... or LinkedIn Link"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cover Letter / Message</label>
                    <textarea 
                      name="message" 
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us why you want to join our crew..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand resize-none"
                    ></textarea>
                  </div>

                  {error && (
                    <p className="text-xs font-semibold text-brand">{error}</p>
                  )}

                  <button 
                    type="submit" 
                    className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-bold p-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
