import { Award, ShieldAlert, Thermometer, Wind, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Our Certification & Food Safety | SeaBasket",
  description: "Explore SeaBasket's certifications and safety standards, including our chemical-free guarantee, cold chain compliance, and FSSAI licenses.",
};

export default function CertificationPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      {/* Header section */}
      <section className="container mx-auto px-4 lg:px-8 mb-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm text-center max-w-4xl mx-auto">
          <div className="h-16 w-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6">
            <Award className="h-8 w-8" />
          </div>
          <span className="text-xs font-bold text-brand uppercase tracking-widest bg-brand/5 px-3 py-1 rounded-full mb-3 inline-block">
            100% Certified Safety
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Our Quality Certifications
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            At SeaBasket, consumer safety is our highest priority. We comply with international hygiene protocols, maintaining an unbroken cold chain and testing every catch daily to guarantee it is chemical-free.
          </p>
        </div>
      </section>

      {/* Grid of Certifications */}
      <section className="container mx-auto px-4 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <CheckCircle2 className="h-6 w-6 text-brand" />,
              title: "FSSAI Compliant",
              subtitle: "License #10123999000124",
              description: "Full compliance with the Food Safety and Standards Authority of India for storage, processing, and handling."
            },
            {
              icon: <Thermometer className="h-6 w-6 text-brand" />,
              title: "Strict 0-4°C Cold Chain",
              subtitle: "ISO 22000 standard",
              description: "Unbroken temperature-controlled delivery chain. Seafood is never frozen, only chilled to preserve texture and nutrients."
            },
            {
              icon: <ShieldAlert className="h-6 w-6 text-brand" />,
              title: "Chemical-Free Guarantee",
              subtitle: "Lab Tested Daily",
              description: "Guaranteed free from harmful preservatives such as Formalin, Ammonia, Chlorine, and sodium tripolyphosphate."
            },
            {
              icon: <Wind className="h-6 w-6 text-brand" />,
              title: "Vacuum Sealed Packaging",
              subtitle: "Food-Grade Polymer",
              description: "Packed in medical-grade, food-safe vacuum packaging that prevents bacteria growth and locks in moisture."
            }
          ].map((cert, i) => (
            <div key={i} className="bg-surface border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-brand/5 flex items-center justify-center mb-6">
                {cert.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{cert.title}</h3>
              <span className="text-xs font-semibold text-brand block mb-3">{cert.subtitle}</span>
              <p className="text-gray-600 text-sm leading-relaxed">{cert.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Testing & Quality Check Flow */}
      <section className="container mx-auto px-4 lg:px-8 mb-20 max-w-5xl">
        <div className="bg-brand/5 border border-brand/10 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Our Daily Testing Protocol</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Before any batch is cleared for cutting and packaging, it must pass a rigorous 3-point laboratory check in our processing center.
              </p>
              <div className="p-4 bg-white rounded-xl border border-brand/10 text-xs font-medium text-gray-600">
                <span className="text-brand font-bold">Note:</span> Customers can request batch lab reports by contacting our support team at <span className="text-brand font-semibold">support@seabasket.com</span>.
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {[
                {
                  step: "01",
                  test: "Formaldehyde & Ammonia Strip Test",
                  purpose: "Verifies that no shelf-life prolonging chemicals have been added at the harbor or during transport."
                },
                {
                  step: "02",
                  test: "Organoleptic Freshness Evaluation",
                  purpose: "Checks eye clarity, gill coloration, tissue resilience, and odor profiles to verify optimal freshness."
                },
                {
                  step: "03",
                  test: "Microbial Load Testing",
                  purpose: "Checks for Salmonella, Listeria, and E. Coli bacteria to ensure complete safety for raw consumption or cooking."
                }
              ].map((proto, idx) => (
                <div key={idx} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {proto.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{proto.test}</h4>
                    <p className="text-sm text-gray-600">{proto.purpose}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Certifications Badges / Certifiers */}
      <section className="container mx-auto px-4 lg:px-8 text-center">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Partner Laboratories & Governing Bodies</h3>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="font-black text-xl text-gray-500">FSSAI APPROVED</div>
          <div className="font-black text-xl text-gray-500">ISO 22000 CERTIFIED</div>
          <div className="font-black text-xl text-gray-500">WHO SEAFOOD COMPLIANT</div>
          <div className="font-black text-xl text-gray-500">HACCP COMPLIANT</div>
        </div>
      </section>
    </div>
  );
}
