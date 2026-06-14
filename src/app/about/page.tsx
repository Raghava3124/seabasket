import { Award, ShieldCheck, Truck, Clock } from "lucide-react";

export const metadata = {
  title: "About Us | SeaBasket",
  description: "Learn more about SeaBasket, our story, values, and commitment to delivering the freshest seafood straight to your door.",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      {/* Hero Header */}
      <section className="container mx-auto px-4 lg:px-8 mb-16">
        <div className="relative w-full py-16 md:py-24 rounded-3xl overflow-hidden bg-gradient-to-r from-brand-dark via-brand to-brand-light flex items-center justify-center shadow-lg text-center text-white">
          <div className="max-w-3xl px-6">
            <span className="text-xs md:text-sm font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm mb-4 inline-block">
              Our Journey
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Dock to Door Freshness
            </h1>
            <p className="text-base md:text-xl font-medium opacity-90 leading-relaxed">
              At SeaBasket, we are redefining how seafood is sourced, handled, and delivered. We bypass traditional middle-agents to connect local fishermen directly with your kitchen, ensuring unmatched freshness.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter Grid */}
      <section className="container mx-auto px-4 lg:px-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "50,000+", label: "Happy Customers Served" },
            { value: "100%", label: "Chemical & Formalin Free" },
            { value: "25 KM", label: "Delivery Service Radius" },
            { value: "45 Mins", label: "Average Delivery Time" },
          ].map((stat, i) => (
            <div key={i} className="bg-surface rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-3xl lg:text-4xl font-extrabold text-brand mb-2">{stat.value}</h3>
              <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="container mx-auto px-4 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Our Mission & Purpose</h2>
            <p className="text-gray-600 leading-relaxed">
              Seafood is highly perishable and vulnerable to poor handling. Traditional supply chains keep fish in transport for days, often relying on chemical preservatives like formalin to mask decay. 
            </p>
            <p className="text-gray-600 leading-relaxed">
              SeaBasket was founded to break this cycle. By operating our own cold-chain infrastructure and establishing direct ties with local fishing harbors, we deliver seafood that is cleaned, cut, vacuum packed, and brought to you within hours of being caught.
            </p>
          </div>
          <div className="bg-brand/5 border border-brand/10 rounded-3xl p-8 lg:p-12 space-y-6">
            <h3 className="text-xl font-bold text-brand">The SeaBasket Promise</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <span className="text-brand text-xs font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Zero Chemical Preservatives</h4>
                  <p className="text-sm text-gray-600">No formalin, ammonia, or coloring agents. Just natural freshness.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <span className="text-brand text-xs font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Traceable Catch</h4>
                  <p className="text-sm text-gray-600">Know exactly where, when, and how your seafood was sourced.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <span className="text-brand text-xs font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Perfect Cuts</h4>
                  <p className="text-sm text-gray-600">Customized cleaning and cutting styles ready for your recipes.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 lg:px-8 mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 tracking-tight mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Award className="h-8 w-8 text-brand" />,
              title: "Uncompromising Quality",
              description: "Every item undergoes standard quality inspections, checking texture, smell, and temperature before packing.",
            },
            {
              icon: <ShieldCheck className="h-8 w-8 text-brand" />,
              title: "Transparency & Trust",
              description: "We are honest about pricing, weight specifications (gross vs. net weight), and where our fish are sourced.",
            },
            {
              icon: <Truck className="h-8 w-8 text-brand" />,
              title: "Sustainable Sourcing",
              description: "We partner with local fishermen who practice ethical and sustainable hook-and-line or net-fishing methods.",
            },
          ].map((value, i) => (
            <div key={i} className="bg-surface border border-gray-100 rounded-2xl p-8 hover:shadow-md transition-shadow group">
              <div className="p-3 bg-brand/5 rounded-xl inline-block mb-6 group-hover:bg-brand group-hover:text-white transition-colors">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Seafood Journey Timeline */}
      <section className="container mx-auto px-4 lg:px-8 mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 tracking-tight mb-12">The Dock-to-Door Journey</h2>
        <div className="relative border-l-2 border-brand/20 ml-4 md:ml-32 pl-8 md:pl-12 space-y-12 max-w-4xl mx-auto">
          {[
            {
              step: "01",
              title: "Fresh Catch At Dawn",
              description: "Artisanal fishermen harvest premium fish from local coastal waters during the early morning hours.",
              icon: <Clock className="h-5 w-5 text-white" />,
            },
            {
              step: "02",
              title: "Cold Chain Transport",
              description: "The catch is loaded into ice-lined boxes immediately, maintaining temperatures below 4°C during transport to our fulfillment center.",
              icon: <Clock className="h-5 w-5 text-white" />,
            },
            {
              step: "03",
              title: "Quality Sorting & Cleaning",
              description: "Our certified quality experts grade the catch and clean it in highly hygienic, sanitized environments.",
              icon: <Clock className="h-5 w-5 text-white" />,
            },
            {
              step: "04",
              title: "Hygienic Cutting & Packaging",
              description: "Fish are cut according to your preference (boneless, curry cut, steaks), vacuum packed to preserve freshness, and stored in chillers.",
              icon: <Clock className="h-5 w-5 text-white" />,
            },
            {
              step: "05",
              title: "Doorstep Delivery",
              description: "Orders are dispatched in thermal delivery bags to your doorstep within your selected delivery slots.",
              icon: <Clock className="h-5 w-5 text-white" />,
            },
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-0 h-8 md:h-10 w-8 md:w-10 rounded-full bg-brand flex items-center justify-center shadow-md border-4 border-background group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold text-white">{item.step}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
