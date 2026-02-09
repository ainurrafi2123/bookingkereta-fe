// components/sections/footer/FooterLink.tsx

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <a
      href={href}
      className="
        block text-sm text-black no-underline hover:underline 
        underline-offset-2 decoration-black hover:text-black 
        visited:text-black focus:text-black active:text-black 
        transition-all"
    >
      {children}
    </a>
  );
}