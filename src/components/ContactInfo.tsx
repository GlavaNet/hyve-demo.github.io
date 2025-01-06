import { useState, FormEvent, useCallback } from 'react';
import { SendIcon } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  services: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  services?: string;
}

export const ContactInfo = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    services: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const services = [
    {
      id: 'splicing',
      label: 'Fiber Optic Splicing & Testing',
      description: 'Comprehensive fiber optic testing services using advanced IOLM and OTDR technology'
    },
    {
      id: 'fdh',
      label: 'Fiber Distribution Hub Services',
      description: 'End-to-end solutions for installation, maintenance, and distribution of fiber networks'
    },
    {
      id: 'scada',
      label: 'SCADA Network Installation',
      description: 'Specialized installation of SCADA networks within power substations'
    },
    {
      id: 'transfers',
      label: 'Communications Transfer Services',
      description: 'Telecommunications line transfers and pole violation resolution'
    }
  ];

  const validateForm = useCallback((data: FormData): FormErrors => {
    const errors: FormErrors = {};
    
    if (!data.name.trim()) {
      errors.name = 'Name is required';
    } else if (data.name.length > 100) {
      errors.name = 'Name is too long';
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.name)) {
      errors.name = 'Name contains invalid characters';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (data.services.length === 0) {
      errors.services = 'Please select at least one service';
    }

    return errors;
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          services: formData.services.map(id => 
            services.find(s => s.id === id)?.label
          )
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', services: [] });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  return (
    <div className="max-w-xl mx-auto pt-8">
      <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">
        Request Our Services
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 
              dark:bg-gray-800 dark:border-gray-700 dark:text-white
              ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 
              dark:bg-gray-800 dark:border-gray-700 dark:text-white
              ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Services Interested In
          </label>
          <div className="space-y-3">
            {services.map((service) => (
              <label 
                key={service.id}
                className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750
                  ${formData.services.includes(service.id) ? 'border-blue-500 bg-blue-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700'}"
              >
                <input
                  type="checkbox"
                  checked={formData.services.includes(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                />
                <div className="ml-3">
                  <div className="font-medium dark:text-white">{service.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{service.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.services && (
            <p className="mt-1 text-sm text-red-500">{errors.services}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 text-white rounded-md transition-colors
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <SendIcon size={20} className="mr-2" />
              Submit Request
            </span>
          )}
        </button>

        {submitStatus === 'success' && (
          <div className="p-4 bg-green-100 text-green-700 rounded-md">
            Thank you for your interest! We'll get back to you soon about the selected services.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            Sorry, there was an error sending your request. Please try again later.
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactInfo;