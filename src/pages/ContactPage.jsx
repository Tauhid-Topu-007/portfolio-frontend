import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { DataContext } from '../context/DataContext';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaSpinner } from 'react-icons/fa';

// ✅ Backend URL
const BACKEND_URL = 'https://portfolio-backend-2-ly21.onrender.com/api';

const ContactPage = () => {
  const { settings } = useContext(DataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('✅ Message sent successfully!');
        reset();
      } else {
        throw new Error(result.message || 'Failed');
      }
    } catch (error) {
      console.error('Error:', error);
      // ✅ Fallback: Open email client
      toast.error('Form failed. Opening email client...');
      setTimeout(() => {
        window.location.href = `mailto:t.topu021@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent('From: ' + data.name + '\nEmail: ' + data.email + '\n\n' + data.message)}`;
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { 
      icon: FaEnvelope, title: 'Email', 
      value: settings?.contactEmail || 't.topu021@gmail.com', 
      link: `mailto:${settings?.contactEmail || 't.topu021@gmail.com'}` 
    },
    { 
      icon: FaPhone, title: 'Phone', 
      value: settings?.contactPhone || '+880 1XXX-XXXXXX', 
      link: settings?.contactPhone ? `tel:${settings.contactPhone}` : null 
    },
    { 
      icon: FaMapMarkerAlt, title: 'Location', 
      value: settings?.address || 'Dhaka, Bangladesh', link: null 
    },
    { 
      icon: FaClock, title: 'Working Hours', 
      value: 'Mon-Fri: 9AM - 6PM', link: null 
    },
  ];

  return (
    <>
      <Helmet><title>Contact Me | Portfolio</title></Helmet>

      <div className="pt-20 min-h-screen bg-white dark:bg-gray-900">
        <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get In <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Touch</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">Have a project in mind? I'd love to hear from you!</p>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <info.icon className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-gray-600 dark:text-gray-400 hover:text-blue-500 break-all">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Direct Email Button */}
                <a
                  href="mailto:t.topu021@gmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg"
                >
                  <FaEnvelope /> Email Me Directly
                </a>
              </motion.div>

              {/* Contact Form */}
              <motion.form
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-bold mb-4">Send Message</h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">Name *</label>
                  <input {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 rounded-lg border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name" />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input type="email" {...register('email', { required: 'Email is required' })}
                    className="w-full px-4 py-3 rounded-lg border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Subject *</label>
                  <input {...register('subject', { required: 'Subject is required' })}
                    className="w-full px-4 py-3 rounded-lg border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    placeholder="Message subject" />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message *</label>
                  <textarea {...register('message', { required: 'Message is required' })} rows={5}
                    className="w-full px-4 py-3 rounded-lg border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Your message..." />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <><FaSpinner className="animate-spin" /> Sending...</> : <><FaPaperPlane /> Send Message</>}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Or{' '}
                  <a href="mailto:t.topu021@gmail.com" className="text-blue-500 hover:underline font-medium">
                    click here to email directly
                  </a>
                </p>
              </motion.form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;