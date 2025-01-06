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
      title: 'Service One',
      description: 'Description of your first service offering. This can be a couple of sentences long to give a good overview.',
      imageUrl: '/hyve-demo.github.io/images/service1.jpg'
    },
    {
      id: 'service2',
      title: 'Service Two',
      description: 'Description of your second service offering. Make it clear and concise while highlighting the key benefits.',
      imageUrl: '/hyve-demo.github.io/images/service2.jpg'
    },
    {
      id: 'service3',
      title: 'Service Three',
      description: 'Description of your third service. Explain what makes this service unique and valuable to your clients.',
      imageUrl: '/hyve-demo.github.io/images/service3.jpg'
    }
  ], []);

  return (
    <div className="max-w-5xl mx-auto pt-8">
      <h2 className="text-3xl font-semibold mb-8 text-center dark:text-white">
        Our Services
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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