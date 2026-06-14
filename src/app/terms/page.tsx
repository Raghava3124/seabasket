import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service | SeaBasket",
  description: "Read SeaBasket's Terms of Service, user agreements, order policies, and delivery serviceability rules.",
};

export default function TermsPage() {
  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "eligibility", title: "2. Geolocation & Serviceability" },
    { id: "ordering", title: "3. Ordering & Weight Policies" },
    { id: "slots", title: "4. Delivery Slot Allocation" },
    { id: "pricing", title: "5. Pricing & Payments" },
    { id: "refunds", title: "6. Quality Returns & Refunds" },
    { id: "liability", title: "7. Limitation of Liability" },
    { id: "governing", title: "8. Governing Law" },
  ];

  return (
    <div className="bg-background min-h-screen py-12">
      <section className="container mx-auto px-4 lg:px-8 mb-12 text-center max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-650 text-sm md:text-base">
          Effective Date: January 1, 2026. Please read these terms carefully before placing orders.
        </p>
      </section>

      <section className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sticky Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28 bg-surface border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Document Sections</h4>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block text-xs font-semibold text-gray-500 hover:text-brand hover:translate-x-1 transition-all py-2 border-b border-gray-50 last:border-none"
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Document Content */}
          <div className="lg:col-span-8 bg-surface border border-gray-100 rounded-3xl p-8 shadow-sm space-y-8 text-sm text-gray-650 leading-relaxed max-w-none">
            
            <div id="acceptance" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">1. Acceptance of Terms</h3>
              <p>
                By accessing, browsing, or using the SeaBasket website or mobile application, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please refrain from using our services.
              </p>
            </div>

            <div id="eligibility" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">2. Geolocation & Serviceability</h3>
              <p>
                SeaBasket operates from a single primary fulfillment store location configured by coordinates (Latitude: 16.9834, Longitude: 81.7836). Deliveries are strictly limited to locations within a <strong>25 KM radius</strong> calculated via the Haversine formula, or selected serviceable pincodes (533101, 533102, 533103, 533104). 
              </p>
              <p>
                We reserve the right to reject and cancel any order if the delivery address is determined to be outside our service area, even if checkout was temporarily permitted due to network or GPS errors.
              </p>
            </div>

            <div id="ordering" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">3. Ordering & Weight Policies</h3>
              <p>
                Seafood products listed are subject to availability. When ordering, you will see specifications for <strong>Gross Weight</strong> and <strong>Net Weight</strong>. We clean, descale, gut, and prepare products to order. Billing is based on the final net weight packed and delivered to you, aligned with the pricing shown at checkout.
              </p>
              <p>
                Once an order has transitioned to the &quot;PREPARING&quot; state inside our center, cancellation, modifications, or redirects are no longer permitted.
              </p>
            </div>

            <div id="slots" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">4. Delivery Slot Allocation</h3>
              <p>
                Customers select delivery slots (e.g. 6-8 AM, 8-10 AM, 4-6 PM) during checkout. These slots are subject to capacity limitations. When slot capacity is reached, the system closes booking for that time block. We aim to deliver within your chosen window but are not liable for minor delays due to traffic, weather, or unexpected logistics barriers.
              </p>
            </div>

            <div id="pricing" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">5. Pricing & Payments</h3>
              <p>
                Prices listed on our platform include applicable food taxes. Payments are processed securely via third-party gateways (including Razorpay). Customers can also opt for Cash on Delivery (COD) for eligible order value tiers. Any coupon codes (such as WELCOME50) must be applied prior to placing the order; discounts cannot be retroactively applied.
              </p>
            </div>

            <div id="refunds" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">6. Quality Returns & Refunds</h3>
              <p>
                We offer a freshness warranty. If you are unsatisfied with the quality of the seafood at the time of delivery, you may return the item directly to the delivery agent. Post-delivery returns must be requested with photographic evidence within <strong>2 hours</strong> of receipt by emailing <span className="font-semibold text-brand">support@seabasket.com</span>. Refund timelines vary: Razorpay refunds reflect in 3-5 business days; COD refunds are processed as instant store credits or UPI transfer in 24 hours.
              </p>
            </div>

            <div id="liability" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">7. Limitation of Liability</h3>
              <p>
                SeaBasket, its directors, and employees shall not be liable for any indirect, incidental, or consequential damages resulting from the consumption of our seafood products, unless such damages arise directly from gross negligence in cold-chain logistics or storage.
              </p>
            </div>

            <div id="governing" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">8. Governing Law</h3>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts located in Andhra Pradesh, India.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="h-5 w-5 text-green-500" /> Secure and certified agreements by SeaBasket Food Ventures.
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
