import { Truck, Clock, ShieldCheck, Navigation } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | SeaBasket",
  description: "Learn about SeaBasket's delivery slots, shipping charges, coverage radius, and our temperature-controlled cold chain logistics.",
};

export default function ShippingPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      {/* Header */}
      <section className="container mx-auto px-4 lg:px-8 mb-16 text-center max-w-3xl">
        <div className="h-14 w-14 rounded-full bg-brand/5 text-brand flex items-center justify-center mx-auto mb-6">
          <Truck className="h-7 w-7" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Shipping & Delivery
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          We operate a custom cold-chain fleet to ensure your seafood arrives in prime condition. Below are details regarding slot schedules, charges, and coverage zones.
        </p>
      </section>

      {/* Grid of details */}
      <section className="container mx-auto px-4 lg:px-8 mb-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Delivery Slot Card */}
          <div className="bg-surface border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand" /> Available Delivery Slots
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              To guarantee maximum freshness, all deliveries are dispatched during specific capacity-managed slot hours:
            </p>
            <div className="space-y-3">
              {[
                { slot: "06:00 AM - 08:00 AM", label: "Early Morning Catch", desc: "Best for lunch preparation. Placed order must be before 9 PM the previous night." },
                { slot: "08:00 AM - 10:00 AM", label: "Mid-Morning Delivery", desc: "Ideal for daily planning. Placed order must be before 7 AM same-day." },
                { slot: "04:00 PM - 06:00 PM", label: "Evening Fresh Delivery", desc: "Best for dinners. Placed order must be before 1 PM same-day." }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">{item.slot}</span>
                    <span className="text-[10px] font-bold text-brand bg-brand/5 px-2 py-0.5 rounded">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Charges & Coverage */}
          <div className="space-y-8">
            <div className="bg-surface border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-brand" /> Delivery Charges
              </h3>
              <div className="overflow-hidden border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse text-sm text-gray-600">
                  <thead>
                    <tr className="bg-gray-50 font-bold border-b border-gray-100">
                      <th className="p-3">Order Value</th>
                      <th className="p-3">Delivery Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Below ₹499</td>
                      <td className="p-3 text-brand font-semibold">₹49</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">₹499 and Above</td>
                      <td className="p-3 text-green-600 font-bold">FREE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
                * Note: Minimum order value required is ₹199 to check out. Delivery fees are non-refundable unless order is canceled due to store non-serviceability.
              </p>
            </div>

            <div className="bg-surface border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-brand" /> Delivery Corridor Radius
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our logistics dispatch is limited to a strict <strong>25 KM radius</strong> from our primary store location on Coastal Highway to ensure that temperature-sensitive seafood remains at safe temperatures during transport. If you reside outside the 25 KM GPS radius, order checkout will be automatically blocked unless your pincode belongs to our fallback list: <strong>533101, 533102, 533103, 533104</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Cold chain details */}
        <div className="bg-brand/5 border border-brand/10 rounded-3xl p-8 md:p-10">
          <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-brand" /> Unbroken Cold Chain Standards
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Unlike standard grocery deliveries, seafood cannot tolerate temperature fluctuations. We protect quality through several key standards:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="bg-white p-5 rounded-2xl border border-brand/10">
              <h4 className="font-bold text-gray-900 mb-2">Chilled Transport</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Seafood is shipped from harbors in insulated, ice-packed boxes, maintaining optimal temperature below 4°C.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-brand/10">
              <h4 className="font-bold text-gray-900 mb-2">Insulated Carrier Bags</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Delivery agents carry orders inside thermal cooler backpacks equipped with custom gel-chillers.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-brand/10">
              <h4 className="font-bold text-gray-900 mb-2">Hygienic Clean Cuts</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Seafood is descaled, gutted, cut, and vacuum sealed immediately in sanitised processing labs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
