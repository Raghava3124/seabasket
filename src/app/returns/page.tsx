import { RefreshCw, ShieldCheck, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Returns & Refunds Policy | SeaBasket",
  description: "Read SeaBasket's freshness guarantee, returns criteria, and refund timelines for card, UPI, and Cash on Delivery payments.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      {/* Header */}
      <section className="container mx-auto px-4 lg:px-8 mb-16 text-center max-w-3xl">
        <div className="h-14 w-14 rounded-full bg-brand/5 text-brand flex items-center justify-center mx-auto mb-6">
          <RefreshCw className="h-7 w-7" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Returns & Refunds
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          We pride ourselves on the freshness of our catch. If something isn&apos;t right, our hassle-free return policy has you covered.
        </p>
      </section>

      {/* Main Policy Section */}
      <section className="container mx-auto px-4 lg:px-8 mb-16 max-w-4xl space-y-12">
        
        {/* Core Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm flex gap-4">
            <div className="h-10 w-10 bg-brand/5 text-brand rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Freshness Guarantee</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                If the seafood delivered does not meet our freshness standards (signs of discoloration, sour odor, or soft texture), you can reject the item right at the doorstep. The delivery partner will take it back immediately.
              </p>
            </div>
          </div>

          <div className="bg-surface border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm flex gap-4">
            <div className="h-10 w-10 bg-brand/5 text-brand rounded-xl flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">2-Hour Inspection Window</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                For issues discovered after delivery (e.g. weight discrepancies or incorrect items), please notify our customer support team via email or call within <strong>2 hours</strong> of receipt, accompanied by clear photos.
              </p>
            </div>
          </div>
        </div>

        {/* Refund Timeline */}
        <div className="bg-surface border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-brand" /> Refund Execution Timelines
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Approved refunds are initiated immediately and processed based on your original payment method:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { type: "UPI / Wallets", time: "24 - 48 Hours", desc: "Refunds for orders paid via GPay, PhonePe, Paytm, or other wallets." },
              { type: "Credit & Debit Cards", time: "3 - 5 Business Days", desc: "Razorpay-settled card refunds depend on standard bank processing times." },
              { type: "Cash on Delivery", time: "Instant Credit or UPI", desc: "Refunded instantly as SeaBasket credits or sent directly via UPI link in 24 hours." }
            ].map((refund, idx) => (
              <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">{refund.type}</span>
                <span className="text-base font-extrabold text-brand block mb-2">{refund.time}</span>
                <p className="text-xs text-gray-500 leading-relaxed">{refund.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to report */}
        <div className="bg-brand/5 border border-brand/10 rounded-3xl p-8 text-center max-w-2xl mx-auto space-y-6">
          <h3 className="font-bold text-xl text-gray-900">How to Lodge a Return Query?</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Send an email containing your <strong>Order ID</strong>, description of the issue, and <strong>photographic proof</strong> (required for quality issues) to:
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-brand/10 shadow-sm font-semibold text-brand">
            <Mail className="h-5 w-5" /> support@seabasket.com
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            * Refunds are subject to quality verification by our warehouse managers. Returns will not be processed for items that have been cooked, improperly stored after delivery, or discarded without photo proof.
          </p>
        </div>

      </section>
    </div>
  );
}
