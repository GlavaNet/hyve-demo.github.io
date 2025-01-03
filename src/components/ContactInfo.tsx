import { useMemo } from 'react';
import { Mail, Phone, Instagram } from 'lucide-react';
import type { ContactInfoProps } from '../lib/types';

export const ContactInfo = ({ className = '' }: ContactInfoProps) => {
  const contactInfo = useMemo(() => ({
    email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'contact@example.com',
    phone: import.meta.env.VITE_CONTACT_PHONE?.trim() || '(555) 123-4567',
    bio: import.meta.env.VITE_BIO?.trim() || 'Welcome to our website.',
    instagramHandle: import.meta.env.VITE_INSTAGRAM_HANDLE?.trim() || 'your_instagram',
    headshot: import.meta.env.VITE_HEADSHOT_URL || '/images/headshot.jpg'
  }), []);

  return (
    <div className={`max-w-2xl mx-auto pt-8 ${className}`.trim()}>
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-48 h-48 mb-6 relative">
          <img 
            // src={contactInfo.headshot}
            src="/images/headshot.png"
            alt="Profile headshot"
            className="w-full h-full object-cover rounded-full shadow-lg"
            loading="eager"
          />
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {contactInfo.bio}
        </p>
      </div>
      
      <div className="space-y-4 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Mail size={20} className="text-gray-400 dark:text-gray-500" />
          <a 
            href={`mailto:${contactInfo.email}`}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {contactInfo.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={20} className="text-gray-400 dark:text-gray-500" />
          <a 
            href={`tel:${contactInfo.phone}`}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {contactInfo.phone}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Instagram size={20} className="text-gray-400 dark:text-gray-500" />
          <a 
            href={`https://instagram.com/${contactInfo.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            @{contactInfo.instagramHandle}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;