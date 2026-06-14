"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = [
    { id: "all", name: "All FAQs" },
    { id: "sourcing", name: "Freshness & Sourcing" },
    { id: "delivery", name: "Shipping & Delivery" },
    { id: "payments", name: "Orders & Payments" },
    { id: "refunds", name: "Returns & Refunds" },
  ];

  const faqs = [
    {
      category: "sourcing",
      question: "How do you ensure the seafood is fresh?",
      answer: "We source our seafood directly from local coastal harbors daily. From the moment the fish is caught, it is packed in ice and transported in cold-chain logistics keeping temperatures between 0°C and 4°C. We never freeze our fish, ensuring the cell walls remain intact, preserving natural juices and texture."
    },
    {
      category: "sourcing",
      question: "Do you use chemicals or preservatives like formalin?",
      answer: "Absolutely not. SeaBasket has a strict zero-preservative policy. We do not use Formalin, Ammonia, Chlorine, or other chemical washes. We perform daily laboratory strip tests on every batch prior to packing to ensure complete safety and purity."
    },
    {
      category: "sourcing",
      question: "What is the difference between Gross Weight and Net Weight?",
      answer: "Gross Weight is the weight of the whole fish before cleaning and cutting. Net weight is the weight of the product you receive in the packet after descaling, gutting, cleaning, and cutting. At SeaBasket, we are transparent: you pay for the net weight of the cuts you receive, not the waste."
    },
    {
      category: "delivery",
      question: "What are your delivery slots and timing?",
      answer: "We deliver in three convenient daily slots: Morning (6:00 AM - 8:00 AM), Mid-Morning (8:00 AM - 10:00 AM), and Evening (4:00 PM - 6:00 PM). You can select your preferred slot during checkout. Slots are capacity-managed to ensure timely arrivals."
    },
    {
      category: "delivery",
      question: "What is your delivery coverage area?",
      answer: "We deliver within a 25 KM radius of our main store located on the Coastal Highway. You can check serviceability on our Store Locator page by entering your coordinates or checking your postal pincode (serviceable pincodes include 533101, 533102, 533103, and 533104)."
    },
    {
      category: "payments",
      question: "What payment options are available?",
      answer: "We accept all major credit and debit cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and mobile wallets. We also support Cash on Delivery (COD) for serviceable locations up to a maximum order value limit."
    },
    {
      category: "payments",
      question: "Can I modify or cancel my order after booking?",
      answer: "Because we process fresh seafood to order, cancellation is only possible if the order status is still 'PENDING'. Once cleaning and cutting starts (status changes to 'PREPARING'), we cannot cancel or modify the order."
    },
    {
      category: "refunds",
      question: "What is your return policy?",
      answer: "We offer a 'No-Questions-Asked' freshness guarantee. If you are not satisfied with the quality or freshness of the seafood at the time of delivery, you can return it to the delivery agent. Alternatively, you can report freshness issues with photo proof within 2 hours of delivery to get a full refund or replacement."
    },
    {
      category: "refunds",
      question: "How long does a refund take to process?",
      answer: "Approved refunds are initiated immediately. Card and UPI refunds via Razorpay generally take 3-5 business days to reflect in your bank account. Cash on Delivery returns can be refunded as store credits instantly or via UPI transfer within 24 hours."
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <section className="container mx-auto px-4 lg:px-8 mb-12 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight text-center mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-center text-sm md:text-base mb-8">
          Have questions about our sourcing, delivery slots, or refund process? Find answers below.
        </p>

        {/* Search Bar */}
        <div className="relative w-full group mb-8">
          <input
            type="text"
            placeholder="Search FAQs (e.g. freshness, delivery, refund)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenIndex(null);
            }}
            className="w-full bg-surface border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand shadow-sm transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand" />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeCategory === cat.id
                  ? "bg-brand text-white shadow-sm"
                  : "bg-surface text-gray-500 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-surface border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-gray-900 hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="text-sm md:text-base flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-brand shrink-0" />
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-brand shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-50 text-sm text-gray-600 leading-relaxed bg-gray-50/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface border border-gray-100 rounded-2xl">
            <p className="text-sm text-gray-500">No questions match your search query.</p>
          </div>
        )}
      </section>
    </div>
  );
}
