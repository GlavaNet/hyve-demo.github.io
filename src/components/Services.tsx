import { useMemo } from 'react';

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export const Services = () => {
  const services = useMemo<Service[]>(() => [
    {
      id: 'service1',
      title: 'Fiber Optic Splicing & Testing',
      description: 'We provide comprehensive fiber optic testing services using advanced IOLM and OTDR technology across multiple wavelengths. Our specialized testing verifies signal strength and quality, ensuring your network meets stringent industry standards while protecting your infrastructure investment. We expertly build and test various fiber taps for both single-mode and multi-mode networks.',
      imageUrl: '/images/service1.jpg'
    },
    {
      id: 'service2',
      title: 'Fiber Distribution Hub Services',
      description: 'Our FDH services deliver end-to-end solutions for installation, maintenance, and distribution of fiber networks with a focus on reliability and accessibility. We implement industry-leading standards for bend radius protection and cable routing, ensuring your fiber cabinet network remains robust and manageable for years to come.',
      imageUrl: '/images/service2.jpg'
    },
    {
      id: 'service3',
      title: 'SCADA Network Installation',
      description: 'We specialize in the precise installation of SCADA networks within power substations, ensuring reliable data transmission between remote and master terminal units. Our team brings extensive expertise in substation regulations and safety protocols, delivering secure and compliant network solutions for critical infrastructure.',
      imageUrl: '/images/service3.jpg'
    },
    {
      id: 'service4',
      title: 'Communications Transfer Services',
      description: 'Our team expertly handles the intricate process of telecommunications line transfers to new poles, ensuring minimal service disruption. We specialize in resolving pole violations across telecommunication networks, maintaining compliance and network integrity while upgrading infrastructure.',
      imageUrl: '/images/service4.jpg'
    }
  ], []);

  return (
    <div className="max-w-5xl mx-auto pt-8 px-4">
      <h2 className="text-3xl font-semibold mb-8 text-center dark:text-white">
        Our Services
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {services.map((service) => (
          <div 
            key={service.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
          >
            <div className="aspect-video relative">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover"
                loading="lazy"
		onError={(e) => {
			console.error(`Failed to load image for ${service.title}:`, e);
			const placeholderSvg = `data:image/svg+xml,%3Csvg smlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6' /%3E%3Cpath d='M0 0h400v300H0z' fill='%23e5e7eb' fill-opacity='.5' /%3E%3Cpath d='M50 50h300v200H50z' fill='%23d1d5db' stroke='%239ca3af' stroke-width='2' /%3E%3C/svg%3E`;
			e.currentTarget.src = placeholderSvg;
		}}
              />
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
