import { Instagram } from 'lucide-react';
import { useMemo } from 'react';

interface FooterProps {
  className?: string;
}

const getInstagramUrl = (handle: string): string => {
  try {
    if (!handle || typeof handle !== 'string') return 'https://instagram.com';
    const sanitizedHandle = encodeURIComponent(handle.trim().replace(/[^a-zA-Z0-9._]/g, ''));
    return `https://instagram.com/${sanitizedHandle}`;
  } catch (error) {
    console.error('Error creating Instagram URL:', error);
    return 'https://instagram.com';
  }
};

export const Footer = ({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const businessName = useMemo(() => 
    import.meta.env.VITE_BUSINESS_NAME?.trim() || 'Business Name',
    []
  );
  const instagramHandle = useMemo(() => 
    import.meta.env.VITE_INSTAGRAM_HANDLE?.trim() || 'your_instagram',
    []
  );
  const portfolioUrl = useMemo(() => 
    import.meta.env.VITE_PORTFOLIO_URL?.trim() || 'https://github.com',
    []
  );
  const designerName = useMemo(() => 
    import.meta.env.VITE_DESIGNER_NAME?.trim() || 'Your Name',
    []
  );

  // Memoize the Instagram URL to prevent unnecessary recalculations
  const instagramUrl = useMemo(() => 
    getInstagramUrl(instagramHandle),
    [instagramHandle]
  );

  return (
    <footer 
      className={`w-full bg-white dark:bg-gray-900 shadow-sm mt-12 ${className}`.trim()}
      role="contentinfo"
      itemScope 
      itemType="http://schema.org/WPFooter"
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div 
            className="text-sm text-gray-600 dark:text-gray-400"
            itemProp="copyrightNotice"
          >
            © {currentYear} {businessName}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={instagramUrl}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`Visit ${businessName} on Instagram`}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              itemProp="sameAs"
              onClick={(e) => {
                if (!instagramHandle) {
                  e.preventDefault();
                  console.error('Instagram handle not configured');
                }
              }}
            >
              <Instagram 
                size={20} 
                aria-hidden="true"
                className="transform hover:scale-110 transition-transform"
              />
              <span className="sr-only">Instagram</span>
            </a>
            <a 
              href={portfolioUrl}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`Visit ${designerName}'s portfolio`}
              className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              itemProp="author"
              onClick={(e) => {
                if (!portfolioUrl) {
                  e.preventDefault();
                  console.error('Portfolio URL not configured');
                }
              }}
            >
              Designed by {designerName}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;