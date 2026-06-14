import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface pt-16 pb-8 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-black text-brand tracking-tight mb-4">SeaBasket</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Premium quality, fresh catch delivered straight to your doorstep. We guarantee freshness, perfectly cut and packed for your convenience.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-brand transition-colors">About Us</Link></li>
              <li><Link href="/certification" className="hover:text-brand transition-colors">Our Certification</Link></li>
              <li><Link href="/careers" className="hover:text-brand transition-colors">Careers</Link></li>
              <li><Link href="/stores" className="hover:text-brand transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Help & Support</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/faq" className="hover:text-brand transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-brand transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-brand transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/contact" className="hover:text-brand transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand shrink-0" />
                <span>SeaBasket Main Store, Coastal Highway, AP 533101</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand shrink-0" />
                <span>1800-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand shrink-0" />
                <span>support@seabasket.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SeaBasket. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-brand transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
