'use client';
import dynamic from 'next/dynamic';

const NavBarUser = dynamic(() => import("@/components/navigation/nav-user"), { 
  ssr: false,
  loading: () => <div className="h-16 bg-white" /> // Placeholder saat loading agar layout tidak lompat
});

import Hero from "@/components/sections/hero";
import Partner from "@/components/sections/partner";
import Promo from "@/components/sections/promo";
import Destinations from "@/components/sections/destinations";
import Testimonials from "@/components/sections/testimonials";
import Newsletter from "@/components/sections/newsletter";
import Footer from "@/components/sections/footer";

export default function DashboardHome() {
  return (
    <>
      <NavBarUser />
      <Hero />
      <Partner  />
      <Promo />
      <Destinations  />
      <Testimonials />
      <Newsletter />
      <Footer/>
    </>
  );
}
