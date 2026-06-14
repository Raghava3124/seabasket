import { Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | SeaBasket",
  description: "Read SeaBasket's Privacy Policy to understand how we collect, store, and protect your address, phone, and geolocation data.",
};

export default function PrivacyPage() {
  const sections = [
    { id: "collection", title: "1. Information We Collect" },
    { id: "usage", title: "2. How We Use Information" },
    { id: "sharing", title: "3. Sharing & Disclosures" },
    { id: "security", title: "4. Security & Storage" },
    { id: "cookies", title: "5. Cookies & Tracking" },
    { id: "rights", title: "6. Your Rights & Choice" },
  ];

  return (
    <div className="bg-background min-h-screen py-12">
      <section className="container mx-auto px-4 lg:px-8 mb-12 text-center max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-655 text-sm md:text-base">
          Last Updated: January 1, 2026. Your privacy and trust are paramount to us.
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
          <div className="lg:col-span-8 bg-surface border border-gray-100 rounded-3xl p-8 shadow-sm space-y-8 text-sm text-gray-655 leading-relaxed max-w-none">
            
            <div id="collection" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">1. Information We Collect</h3>
              <p>
                We collect information to provide a seamless seafood purchasing experience. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Identity:</strong> Your phone number (required for passwordless OTP verification), and your name.</li>
                <li><strong>Location Metrics:</strong> Pin location (Latitude, Longitude), door number, apartment, street, city, and pincode to calculate serviceability distance relative to our store.</li>
                <li><strong>Payment details:</strong> Transaction references, method configurations, and payment receipts (payment processing credentials are securely processed directly by Razorpay and never stored on our servers).</li>
                <li><strong>Order History:</strong> History of products, weight selections, and slot options purchased.</li>
              </ul>
            </div>

            <div id="usage" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">2. How We Use Information</h3>
              <p>
                The gathered data is processed specifically for order lifecycle operations, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Validating that your address is within our 25 KM serviceable boundary using GPS coordinates.</li>
                <li>Assigning orders to delivery executives based on routes, capacity, and slot metrics.</li>
                <li>Processing logins via OTP numbers using temporary Redis session cache states.</li>
                <li>Sending transactional updates via SMS, email, or WhatsApp alerts regarding status changes (Preparing, Dispatching, Delivered).</li>
              </ul>
            </div>

            <div id="sharing" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">3. Sharing & Disclosures</h3>
              <p>
                SeaBasket does not sell your personal data. We disclose necessary subsets of data to trustworthy logistics, billing, and infrastructure operators, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Payment Providers:</strong> Razorpay for transaction authorization and refunds.</li>
                <li><strong>Communication Engines:</strong> Twilio or partner aggregators to deliver SMS OTP messages.</li>
                <li><strong>Mapping Tools:</strong> Google Maps Platform to capture address coordinates.</li>
                <li><strong>Logistics:</strong> Delivery agents are provided your phone number, name, and address to fulfill deliveries.</li>
              </ul>
            </div>

            <div id="security" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">4. Security & Storage</h3>
              <p>
                We use industry-standard measures to keep data safe:
              </p>
              <p>
                All network traffic is proxied through Cloudflare to prevent DDoS attacks and bot scraping. User session authentications are handled via JWTs and secure cookies. OTPs are stored temporarily in Redis databases with automatic expiration timers and rate limiters to prevent brute-force attacks.
              </p>
            </div>

            <div id="cookies" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">5. Cookies & Tracking</h3>
              <p>
                We use cookies and local storage tokens to persist your cart contents, auth sessions, and default address preferences. You can disable cookies inside browser settings, but doing so will log you out and clear your shopping cart on page refresh.
              </p>
            </div>

            <div id="rights" className="scroll-mt-28 space-y-3">
              <h3 className="font-bold text-lg text-gray-900">6. Your Rights & Choice</h3>
              <p>
                You can review, modify, or delete your saved address book entries by visiting your Profile Actions. If you wish to delete your SeaBasket account, please submit a deletion request to <span className="font-semibold text-brand">support@seabasket.com</span>. We will delete all records, retaining only necessary transaction summaries for tax auditing compliance.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
              <Lock className="h-5 w-5 text-green-500" /> Data encryption active. Complying with FSSAI security protocols.
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
