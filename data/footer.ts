// components/sections/footer/data.ts

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

export interface PaymentMethod {
  src: string;
  alt: string;
}

export const socialLinks: SocialLink[] = [
  {
    platform: "Facebook",
    href: "https://facebook.com/trainlineid",
    icon: "/src/icon/facebook.svg",
  },
  {
    platform: "Twitter",
    href: "https://twitter.com/trainlineid",
    icon: "/src/icon/twitter.svg",     // atau "/icon/x.svg"
  },
  // {
  //   platform: "Instagram",
  //   href: "https://instagram.com/trainlineid",
  //   icon: "/icon/instagram.svg",
  //   bgColor: "bg-pink-600",
  //   hoverColor: "hover:bg-pink-700",
  // },
  // {
  //   platform: "YouTube",
  //   href: "https://youtube.com/@trainlineid",
  //   icon: "/icon/youtube.svg",
  //   bgColor: "bg-red-600",
  //   hoverColor: "hover:bg-red-700",
  // },
];

export const paymentMethods: PaymentMethod[] = [
  { src: "/src/icon/paypal.svg", alt: "PayPal" },
  { src: "/src/icon/apple-pay.svg", alt: "Apple Pay" },
  { src: "/src/icon/google-pay.svg", alt: "Google Pay" },
  { src: "/src/icon/national-rail.svg", alt: "National Rail" },
];

export const companyLinks = [
  { href: "/about", label: "About Trainline" },
  { href: "/news", label: "News" },
  { href: "/investors", label: "Investors" },
  { href: "/careers", label: "Careers" },
  { href: "/partners", label: "Trainline Partner Solutions" },
  { href: "/affiliates", label: "Affiliates and Partnerships" },
  { href: "/terms", label: "Terms and conditions / Security" },
  { href: "/privacy", label: "Privacy / Cookies" },
  { href: "/modern-slavery", label: "Modern Slavery Act (UK)" },
];

export const footerSections = [
  {
    title: "Help and useful information",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/refund", label: "Refund Policy" },
      { href: "/contact", label: "Contact Us" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Train and bus companies",
    links: [
      { href: "/companies/kai", label: "PT Kereta Api Indonesia" },
      { href: "/companies/whoosh", label: "Whoosh" },
      { href: "/companies/kcj", label: "KCJ Commuter Line" },
      { href: "/companies/lrt", label: "LRT Jakarta" },
    ],
  },
  {
    title: "Train journeys in Indonesia",
    links: [
      { href: "/routes/jakarta-bandung", label: "Jakarta to Bandung" },
      { href: "/routes/jakarta-surabaya", label: "Jakarta to Surabaya" },
      { href: "/routes/jakarta-yogyakarta", label: "Jakarta to Yogyakarta" },
      { href: "/routes/surabaya-malang", label: "Surabaya to Malang" },
    ],
  },
  {
    title: "Top destinations",
    links: [
      { href: "/destinations/jakarta", label: "Jakarta" },
      { href: "/destinations/bandung", label: "Bandung" },
      { href: "/destinations/surabaya", label: "Surabaya" },
      { href: "/destinations/yogyakarta", label: "Yogyakarta" },
    ],
  },
  {
    title: "Stations",
    defaultOpen: true,
    links: [
      { href: "/stations/gambir", label: "Gambir" },
      { href: "/stations/pasar-senen", label: "Pasar Senen" },
      { href: "/stations/bandung", label: "Bandung" },
      { href: "/stations/yogyakarta", label: "Yogyakarta" },
      { href: "/stations/surabaya-gubeng", label: "Surabaya Gubeng" },
      { href: "/stations/malang", label: "Malang" },
      { href: "/stations/solo-balapan", label: "Solo Balapan" },
      { href: "/stations/semarang-tawang", label: "Semarang Tawang" },
    ],
  },
];

export const copyrightText = {
  year: 2026,
  company: "Trainline.com Limited and its affiliated companies",
  registration: "Registered in Indonesia. Company No. 12345678.",
  address: "Registered address: Jakarta, Indonesia. VAT number: 123 4567 89.",
};