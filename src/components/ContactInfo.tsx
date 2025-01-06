import { useState, FormEvent, useCallback } from 'react';
import { Mail, SendIcon } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactInfo = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Input validation
  const validateForm = useCallback((data: FormData): FormErrors => {
    const errors: FormErrors = {};
    
    // Name validation
    if (!data.name.trim()) {
      errors.name = 'Name is required';
    } else if (data.name.length > 100) {
      errors.name = 'Name is too long';
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.name)) {
      errors.name = 'Name contains invalid characters';
    }

    // Email validation
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }

    // Message validation
    if (!data.message.trim()) {
      errors.message = 'Message is required';
    } else if (data.message.length > 1000) {
      errors.message = 'Message is too long (max 1000 characters)';
    }

    return errors;
  }, []);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate form
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Replace with your FormSpree endpoint
      const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
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

  return (
    <div className="max-w-xl mx-auto pt-8">
      <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">
        Get in Touch
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
          <label 
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 
              dark:bg-gray-800 dark:border-gray-700 dark:text-white
              ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-500">{errors.message}</p>
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
              Send Message
            </span>
          )}
        </button>

        {submitStatus === 'success' && (
          <div className="p-4 bg-green-100 text-green-700 rounded-md">
            Thank you for your message! We'll get back to you soon.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            Sorry, there was an error sending your message. Please try again later.
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactInfo;