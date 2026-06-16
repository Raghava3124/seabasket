"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      setError("Please fill in all required fields.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Real API call
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="bg-background min-h-screen py-12">
      {/* Header */}
      <section className="container mx-auto px-4 lg:px-8 mb-16 text-center max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Have an order inquiry, quality issue, or partner request? Get in touch with us using the form below or our direct customer channels.
        </p>
      </section>

      {/* Main Grid */}
      <section className="container mx-auto px-4 lg:px-8 max-w-6xl mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Get In Touch Directly</h2>

            {[
              {
                icon: <MapPin className="h-6 w-6 text-brand" />,
                title: "Primary Store Location",
                details: "SeaBasket Main Store, Coastal Highway, AP 533101",
                linkText: "View on Store Locator",
                linkHref: "/stores"
              },
              {
                icon: <Phone className="h-6 w-6 text-brand" />,
                title: "Toll-Free Customer Support",
                details: "1800-123-4567",
                linkText: "Call Now",
                linkHref: "tel:18001234567"
              },
              {
                icon: <Mail className="h-6 w-6 text-brand" />,
                title: "Email Support Desk",
                details: "support@seabasket.com",
                linkText: "Email Us",
                linkHref: "mailto:support@seabasket.com"
              },
              {
                icon: <Clock className="h-6 w-6 text-brand" />,
                title: "Support Operations Hours",
                details: "Monday to Sunday: 6:00 AM - 10:00 PM (IST)",
                linkText: "Response time: < 30 mins",
                linkHref: "#"
              }
            ].map((channel, i) => (
              <div key={i} className="bg-surface border border-gray-100 rounded-2xl p-6 flex gap-4 shadow-sm">
                <div className="h-10 w-10 bg-brand/5 rounded-xl flex items-center justify-center shrink-0">
                  {channel.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">{channel.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{channel.details}</p>
                  <a href={channel.linkHref} className="text-[11px] font-bold text-brand hover:underline block pt-1">
                    {channel.linkText}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Send Us a Message</h3>

              {isSubmitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900">Message Sent Successfully!</h4>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Thank you, <span className="font-semibold">{formData.name}</span>. We have received your query regarding <span className="font-semibold text-brand">&quot;{formData.subject}&quot;</span>. A customer service specialist will follow up within 30 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
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
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData(prev => ({ ...prev, phone: val }));
                        }}
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand"
                        required
                      />
                    </div>
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
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="e.g. Order Delivery Query"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Message *</label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please enter your detailed query here. Include order ID if applicable..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand resize-none"
                      required
                    ></textarea>
                  </div>

                  {error && (
                    <p className="text-xs font-semibold text-brand">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-bold p-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="h-4 w-4" /> Send Message
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
