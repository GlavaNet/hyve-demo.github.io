import { useMemo } from 'react';
import { Mail, Phone, Instagram } from 'lucide-react';
import type { ContactInfoProps } from '../lib/types';

export const ContactInfo = ({ className = '' }: ContactInfoProps) => {
  // Memoize environment variables
  const contactInfo = useMemo(() => ({
    email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'contact@example.com',
    phone: import.meta.env.VITE_CONTACT_PHONE?.trim() || '(555) 123-4567',
    bio: import.meta.env.VITE_BIO?.trim() || 'Welcome to our website.',
    instagramHandle: import.meta.env.VITE_INSTAGRAM_HANDLE?.trim() || 'your_instagram',
    headshot: import.meta.env.VITE_HEADSHOT_URL || '/images/headshot.jpg'
  }), []);

  // Validate email format
  const isValidEmail = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(contactInfo.email);
  }, [contactInfo.email]);

  // Format phone number for display
  const formattedPhone = useMemo(() => {
    try {
      return contactInfo.phone.replace(/[^\d]/g, '')
        .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } catch (error) {
      console.error('Error formatting phone number:', error);
      return contactInfo.phone;
    }
  }, [contactInfo.phone]);

  // Handle image load error
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = '/images/placeholder-headshot.jpg';
  };

  return (
    <div 
      className={`max-w-2xl mx-auto ${className}`.trim()}
      itemScope 
      itemType="http://schema.org/Person"
    >
      <div className="flex flex-col items-center text-center mb-8">
        {/* Headshot */}
        <div className="w-48 h-48 mb-6 relative">
          <img 
            src={contactInfo.headshot}
            alt="Profile headshot"
            className="w-full h-full object-cover rounded-full shadow-lg"
            onError={handleImageError}
            loading="eager"
            itemProp="image"
          />
        </div>

        {/* Bio */}
        <p 
          className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-xl transition-colors"
          itemProp="description"
        >
          {contactInfo.bio}
        </p>
      </div>
      
      {/* Contact Information */}
      <div className="space-y-4 flex flex-col items-center">
        {isValidEmail && (
          <div className="flex items-center gap-2 group">
            <Mail 
              size={20} 
              className="text-gray-400 dark:text-gray-500 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300" 
              aria-hidden="true"
            />
            <a 
              href={`mailto:${contactInfo.email}`}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              itemProp="email"
              aria-label="Send email"
            >
              {contactInfo.email}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2 group">
          <Phone 
            size={20} 
            className="text-gray-400 dark:text-gray-500 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300" 
            aria-hidden="true"
          />
          <a 
            href={`tel:${contactInfo.phone.replace(/[^\d]/g, '')}`}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            itemProp="telephone"
            aria-label="Call phone number"
          >
            {formattedPhone}
          </a>
        </div>

        <div className="flex items-center gap-2 group">
          <Instagram 
            size={20} 
            className="text-gray-400 dark:text-gray-500 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300" 
            aria-hidden="true"
          />
          <a 
            href={`https://instagram.com/${contactInfo.instagramHandle}`}
            target="_blank"
            rel="me noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            itemProp="sameAs"
            aria-label="Visit Instagram profile"
          >
            @{contactInfo.instagramHandle}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;