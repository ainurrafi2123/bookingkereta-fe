// src/components/auth/SocialLoginButtons.tsx
import { socialLinks } from '@/data/footer';

export default function SocialLoginButtons() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-4">
        {socialLinks.map((social) => (
          <a
            key={social.platform}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded border border-gray-200 p-2 flex items-center justify-center h-10 min-w-10 transition-all"
          >
            <img 
              src={social.icon}
              alt={`${social.platform} icon`}
              className="w-6 h-6"
            />
          </a>
        ))}
      </div>
    </div>
  );
}