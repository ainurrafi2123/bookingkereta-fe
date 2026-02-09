// components/sections/footer/Footer.tsx
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

import AccordionItem from '@/components/ui/accordion-items';
import FooterLink from '@/components/layout/footer-link';
import PaymentIcon from '@/components/ui/payment-icon';

import {
  socialLinks,
  paymentMethods,
  companyLinks,
  footerSections,
  copyrightText,
} from '@/data/footer';

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Company Links */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Tentang Kami</h3>
              <div className="space-y-2">
                {companyLinks.map((link) => (
                  <FooterLink key={link.href} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* Right: Accordion Sections */}
            <div className="space-y-1">
              {footerSections.map((section) => (
                <AccordionItem
                  key={section.title}
                  title={section.title}
                  defaultOpen={section.defaultOpen}
                >
                  {section.title === "Stations" ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {section.links.map((link) => (
                        <FooterLink key={link.href} href={link.href}>
                          {link.label}
                        </FooterLink>
                      ))}
                    </div>
                  ) : (
                    section.links.map((link) => (
                      <FooterLink key={link.href} href={link.href}>
                        {link.label}
                      </FooterLink>
                    ))
                  )}
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>

        {/* Social & Payment */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10  rounded-full flex items-center justify-center transition-colors`}
                  >
                    <img 
                      src={social.icon}
                      alt={`${social.platform} icon`}
                      className="w-8 h-8"           // ukuran icon
                    />
                  </a>
                );
              })}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {paymentMethods.map((method) => (
                <PaymentIcon key={method.alt} src={method.src} alt={method.alt} />
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 py-6">
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>
              Copyright © {copyrightText.year} {copyrightText.company}. All rights reserved.
            </p>
            <p>
              {copyrightText.registration} Registered address: {copyrightText.address}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}