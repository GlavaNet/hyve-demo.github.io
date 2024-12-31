import { Mail, Phone } from 'lucide-react';

export const ContactInfo = () => {
  const email = import.meta.env.VITE_CONTACT_EMAIL || 'contact@example.com';
  const phone = import.meta.env.VITE_CONTACT_PHONE || '(555) 123-4567';
  const bio = import.meta.env.VITE_BIO || 'Welcome to our website.';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-gray-600 mb-8">{bio}</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail size={20} className="text-gray-400" />
          <a href={`mailto:${email}`} className="text-gray-600 hover:text-gray-900">
            {email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={20} className="text-gray-400" />
          <a href={`tel:${phone}`} className="text-gray-600 hover:text-gray-900">
            {phone}
          </a>
        </div>
      </div>
    </div>
  );
};