import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) {
      console.log('Email submitted:', email);
      // TODO: Implement newsletter subscription logic
      setEmail('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Small Title */}
        <p className="text-sm text-gray-500 uppercase tracking-wide mb-3">
          DUNIA OMIO
        </p>

        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
          Ingin menerima diskon eksklusif dan update
          <br className="hidden md:block" />
          langsung ke kotak masuk Anda?
        </h2>

        {/* Decorative Line */}
        <div className="w-16 h-1 bg-blue-600 mx-auto mb-8"></div>

        {/* Email Input */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 h-12 bg-white border-gray-300 text-base"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="h-12 px-8 bg-red-500 hover:bg-red-600 text-white font-semibold text-base"
          >
            Daftarkan saya
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;